import { useState } from 'react'
import { getSortedLocations } from '../../lib/catalog'
import { getDefaultLocationId, getEffectiveLocation } from '../../lib/adminContent'

const INPUT_CLASS =
  'mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-cyan-400'
const BUTTON_CLASS =
  'rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200'

function LocationCard({ location, content, isDefault, onSave, onReset, onSetDefault }) {
  const effective = getEffectiveLocation(location, content)
  const [name, setName] = useState(effective.name)
  const [description, setDescription] = useState(effective.description)
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !description.trim()) {
      setMessage('Name and description are required.')
      return
    }

    onSave(location.id, { name: name.trim(), description: description.trim() })
    setMessage('Location saved.')
  }

  function handleReset() {
    onReset(location.id)
    setName(location.name)
    setDescription(location.description)
    setMessage('Original details restored.')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{location.id}</p>
          <p className="text-xs text-slate-500">Tour order {location.order}</p>
        </div>
        {isDefault ? (
          <span className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            Default start
          </span>
        ) : (
          <button type="button" className={BUTTON_CLASS} onClick={() => onSetDefault(location.id)}>
            Set as default
          </button>
        )}
      </div>

      <label className="mt-3 block text-sm text-slate-200">
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} className={INPUT_CLASS} />
      </label>

      <label className="mt-3 block text-sm text-slate-200">
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className={INPUT_CLASS}
        />
      </label>

      {message ? <p className="mt-2 text-sm text-cyan-200">{message}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Save location
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={handleReset}>
          Restore original
        </button>
      </div>
    </form>
  )
}

export default function LocationsPanel({ catalog, content, commit }) {
  const locations = getSortedLocations(catalog)
  const defaultId = getDefaultLocationId(catalog, content)

  function handleSave(id, fields) {
    const nextLocations = {
      ...content.locations,
      [id]: { ...content.locations[id], ...fields },
    }
    commit({ ...content, locations: nextLocations }, 'Updated location', fields.name)
  }

  function handleReset(id) {
    const nextLocations = { ...content.locations }
    delete nextLocations[id]
    commit({ ...content, locations: nextLocations }, 'Restored location details', id)
  }

  function handleSetDefault(id) {
    const nextSettings = { ...content.settings, defaultLocationId: id }
    commit({ ...content, settings: nextSettings }, 'Changed default location', id)
  }

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Locations
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white">Tour locations</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Update how each location appears in the tour navigation. Changes apply to this
          browser immediately.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            content={content}
            isDefault={location.id === defaultId}
            onSave={handleSave}
            onReset={handleReset}
            onSetDefault={handleSetDefault}
          />
        ))}
      </div>
    </div>
  )
}
