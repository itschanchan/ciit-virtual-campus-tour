import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(root, 'apps/frontend/src/lib/catalog.json')
const schemaPath = path.join(
  root,
  'specs/001-campus-tour-foundation/contracts/content-schema.json',
)
const publicDir = path.join(root, 'apps/frontend/public')

function resolveRef(schema, ref) {
  if (!ref.startsWith('#/')) {
    throw new Error(`Unsupported schema reference: ${ref}`)
  }

  return ref
    .slice(2)
    .split('/')
    .reduce((value, key) => value?.[key], schema)
}

function validateSchema(value, schema, location, errors) {
  if (!schema || typeof schema !== 'object') {
    return
  }

  if (schema.$ref) {
    validateSchema(value, resolveRef(schema, schema.$ref), location, errors)
    return
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${location} must be one of: ${schema.enum.join(', ')}.`)
  }

  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${location} must be an object.`)
      return
    }

    for (const key of schema.required ?? []) {
      if (!(key in value)) {
        errors.push(`${location}.${key} is required.`)
      }
    }

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in (schema.properties ?? {}))) {
          errors.push(`${location}.${key} is not allowed.`)
        }
      }
    }

    for (const [key, propertySchema] of Object.entries(schema.properties ?? {})) {
      if (key in value) {
        validateSchema(value[key], propertySchema, `${location}.${key}`, errors)
      }
    }
  }

  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${location} must be an array.`)
      return
    }

    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${location} must contain at least ${schema.minItems} item(s).`)
    }

    if (schema.items) {
      value.forEach((item, index) => {
        validateSchema(item, schema.items, `${location}[${index}]`, errors)
      })
    }
  }

  if (schema.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${location} must be a string.`)
      return
    }

    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${location} must be at least ${schema.minLength} character(s).`)
    }

    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${location} must match ${schema.pattern}.`)
    }
  }

  if (schema.type === 'integer') {
    if (!Number.isInteger(value)) {
      errors.push(`${location} must be an integer.`)
    } else if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${location} must be at least ${schema.minimum}.`)
    }
  }

  if (schema.type === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push(`${location} must be a number.`)
    } else if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
      errors.push(`${location} must be greater than ${schema.exclusiveMinimum}.`)
    }
  }
}

function assetPathFromUrl(url) {
  if (!url.startsWith('/')) {
    return null
  }

  const clean = url.split('?')[0].split('#')[0]
  return path.join(publicDir, clean.slice(1))
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath)
    return info.isFile()
  } catch {
    return false
  }
}

async function collectPublicFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relative = `${prefix}/${entry.name}`

    if (entry.isDirectory()) {
      files.push(...(await collectPublicFiles(path.join(directory, entry.name), relative)))
    } else {
      files.push(relative)
    }
  }

  return files
}

function templateToRegex(template) {
  return new RegExp(
    `^${template
      .split(/(\{z\}|\{f\}|\{y\}|\{x\})/)
      .map((part) => {
        if (part === '{z}' || part === '{f}' || part === '{y}' || part === '{x}') {
          return '\\d+'
        }

        return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      })
      .join('')}$`,
  )
}

const [catalog, schema] = await Promise.all([
  readFile(catalogPath, 'utf8').then(JSON.parse),
  readFile(schemaPath, 'utf8').then(JSON.parse),
])

const errors = []
validateSchema(catalog, schema, 'catalog', errors)

const publicFiles = await collectPublicFiles(publicDir)

for (const [index, location] of (catalog.locations ?? []).entries()) {
  const panorama = location.panorama ?? {}

  if (panorama.tileUrlTemplate) {
    const templateRegex = templateToRegex(panorama.tileUrlTemplate)
    const hasTiles = publicFiles.some((file) => templateRegex.test(file))

    if (!hasTiles) {
      errors.push(
        `locations[${index}].panorama.tileUrlTemplate does not match any file in apps/frontend/public.`,
      )
    }
  }

  for (const [field, url] of [
    ['previewUrl', panorama.previewUrl],
    ['gallery.src', location.gallery?.[0]?.src],
    ['narration.audioSrc', location.narration?.audioSrc],
  ]) {
    const assetPath = url ? assetPathFromUrl(url) : null

    if (assetPath && !(await fileExists(assetPath))) {
      errors.push(`locations[${index}].${field} references a missing asset: ${url}`)
    }
  }

  for (const [galleryIndex, image] of (location.gallery ?? []).entries()) {
    const assetPath = assetPathFromUrl(image.src)

    if (assetPath && !(await fileExists(assetPath))) {
      errors.push(
        `locations[${index}].gallery[${galleryIndex}].src references a missing asset: ${image.src}`,
      )
    }
  }
}

if (errors.length > 0) {
  console.error('Content verification failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(
  `Content verification passed for ${catalog.locations.length} location(s) and ${publicFiles.length} public file(s).`,
)
