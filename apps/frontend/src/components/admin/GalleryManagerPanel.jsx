import { useState } from 'react'
import { getSortedLocations } from '../../lib/catalog'
import { getEffectiveGallery } from '../../lib/adminContent'

const EMPTY_FORM = { src: '', alt: '', caption: '' }
const SMALL_BUTTON =
  'rounded-md border border-slate-600 px-2 py-1 text-xs font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40'

function normalizeGallery(gallery) {
  return gallery.map((image, index) => ({ ...image, order: index }))
}

function GalleryImageCard({ image, index, total, onEdit, onDelete, onMove }) {
  function handleImageError(event) {
    event.currentTarget.src = '/panoramas/placeholder/gallery-1.svg'
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-3 sm:flex-row sm:items-center">
      <img
        src={image.src}
        alt={image.alt}
        onError={handleImageError}
        className="h-20 w-full rounded-lg bg-slate-800 object-cover sm:w-28"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-100">{image.caption || image.alt}</p>
        <p className="truncate text-xs text-slate-400">{image.src}</p>
        <p className="mt-1 text-xs text-slate-500">Position {index + 1} of {total}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={SMALL_BUTTON} disabled={index === 0} onClick={() => onMove(index, -1)}>
          Up
        </button>
        <button type="button" className={SMALL_BUTTON} disabled={index === total - 1} onClick={() => onMove(index, 1)}>
          Down
        </button>
        <button type="button" className={SMALL_BUTTON} onClick={() => onEdit(index)}>
          Edit
        </button>
        <button
          type="button"
          className={`${SMALL_BUTTON} hover:border-rose-400 hover:text-rose-200`}
          onClick={() => onDelete(index)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

function GalleryImageForm({ form, editing, onChange, onSubmit, onCancel }) {
  function handleChange(event) {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
      <h4 className="font-semibold text-white">{editing ? 'Edit image' : 'Add image'}</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-slate-200 sm:col-span-2">
          Image URL or path
          <input
            name="src"
            value={form.src}
            onChange={handleChange}
            placeholder="/panoramas/placeholder/gallery-1.svg"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-cyan-400"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Alt text
          <input
            name="alt"
            value={form.alt}
            onChange={handleChange}
            placeholder="Describe the image"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-cyan-400"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Caption
          <input
            name="caption"
            value={form.caption}
            onChange={handleChange}
            placeholder="Optional caption"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-cyan-400"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          {editing ? 'Save changes' : 'Add image'}
        </button>
        {editing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-400"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default function GalleryManagerPanel({ catalog, content, commit }) {
  const locations = getSortedLocations(catalog)
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? '')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingIndex, setEditingIndex] = useState(-1)
  const [feedback, setFeedback] = useState('')

  const location = locations.find((item) => item.id === selectedId) ?? locations[0]

  if (!location) {
    return <p className="text-slate-300">No tour locations are available to manage.</p>
  }

  const gallery = getEffectiveGallery(location, content)

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingIndex(-1)
  }

  function handleSelect(event) {
    setSelectedId(event.target.value)
    resetForm()
    setFeedback('')
  }

  function saveGallery(nextGallery, action, detail) {
    const nextContent = {
      ...content,
      gallery: { ...content.gallery, [location.id]: normalizeGallery(nextGallery) },
    }
    commit(nextContent, action, detail)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const src = form.src.trim()
    const alt = form.alt.trim()

    if (!src || !alt) {
      setFeedback('Image URL and alt text are required.')
      return
    }

    const image = { src, alt, caption: form.caption.trim() || alt }
    const baseGallery = editingIndex >= 0
      ? gallery.map((item, index) => (index === editingIndex ? { ...item, ...image } : item))
      : [...gallery, image]

    const action = editingIndex >= 0 ? 'Updated gallery image' : 'Added gallery image'
    saveGallery(baseGallery, action, `${location.name}: ${image.caption}`)
    resetForm()
    setFeedback(`${action}.`)
  }

  function handleEdit(index) {
    const image = gallery[index]
    setForm({ src: image.src, alt: image.alt, caption: image.caption ?? '' })
    setEditingIndex(index)
    setFeedback('')
  }

  function handleMove(index, direction) {
    const target = index + direction
    if (target < 0 || target >= gallery.length) {
      return
    }

    const nextGallery = [...gallery]
    const moved = nextGallery[index]
    nextGallery[index] = nextGallery[target]
    nextGallery[target] = moved
    saveGallery(nextGallery, 'Reordered gallery images', location.name)

    if (editingIndex >= 0) {
      resetForm()
    }
  }

  function handleDelete(index) {
    if (content.settings.confirmDeletes && !window.confirm('Delete this gallery image?')) {
      return
    }

    const nextGallery = gallery.filter((_image, position) => position !== index)
    saveGallery(nextGallery, 'Deleted gallery image', location.name)
    resetForm()
  }

  function handleRestoreDefaults() {
    if (!window.confirm('Restore the default gallery for this location?')) {
      return
    }

    const nextGallery = { ...content.gallery }
    delete nextGallery[location.id]
    commit({ ...content, gallery: nextGallery }, 'Restored default gallery', location.name)
    resetForm()
    setFeedback('Default gallery restored.')
  }

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Gallery Manager
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white">Location galleries</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Changes are saved for this browser and applied to the public tour immediately.
        </p>
        <label className="mt-4 block text-sm font-medium text-slate-200">
          Location
          <select
            value={location.id}
            onChange={handleSelect}
            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-cyan-400 sm:max-w-md"
          >
            {locations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <GalleryImageForm
        form={form}
        editing={editingIndex >= 0}
        onChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      {feedback ? (
        <p role="status" className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
          {feedback}
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{location.name}</h3>
          <p className="text-sm text-slate-400">{gallery.length} image(s)</p>
        </div>
        {gallery.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            This gallery is empty. Add an image above to get started.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {gallery.map((image, index) => (
              <GalleryImageCard
                key={`${image.src}-${index}`}
                image={image}
                index={index}
                total={gallery.length}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMove={handleMove}
              />
            ))}
          </ul>
        )}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
          >
            Restore default gallery
          </button>
        </div>
      </section>
    </div>
  )
}
