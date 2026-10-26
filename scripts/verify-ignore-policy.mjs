import { execFileSync } from 'node:child_process'

const trackedPatterns = [
  '.opencode/package.json',
  '.opencode/package-lock.json',
  '.specify/memory/constitution.md',
  '.specify/scripts',
  '.specify/templates',
  '.specify/init-options.json',
]

const ignoredPatterns = [
  '.env',
  '.env.local',
  'apps/backend/client.rest',
  '.specify/feature.json',
  '.specify/extensions/example/local-config.yml',
  'node_modules/',
]

function isIgnored(pattern) {
  try {
    execFileSync('git', ['check-ignore', '-q', pattern], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

const failures = []

for (const pattern of trackedPatterns) {
  if (isIgnored(pattern)) {
    failures.push(`Expected to be tracked but is ignored: ${pattern}`)
  }
}

for (const pattern of ignoredPatterns) {
  if (!isIgnored(pattern)) {
    failures.push(`Expected to be ignored but is not: ${pattern}`)
  }
}

if (failures.length > 0) {
  console.error('Ignore policy check failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Ignore policy check passed.')
