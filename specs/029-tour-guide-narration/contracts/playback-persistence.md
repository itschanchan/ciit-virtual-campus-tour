# Contract: Playback Persistence

**Feature**: `029-tour-guide-narration` | **Owner**: `apps/frontend/src/lib/narrationStorage.js` and `TourContext`

## Storage key

```text
ciit_narration_state
```

## Stored value

```json
{
  "floor": "UG",
  "isPaused": false
}
```

| Field | Type | Allowed values | Meaning |
| :--- | :--- | :--- | :--- |
| `floor` | string | Any label in `FLOOR_SEQUENCE` that has a catalog location | The floor to restore |
| `isPaused` | boolean | `true` or `false` | Whether playback should remain paused after refresh |

Only these two fields are stored. Playback position, mute state, transcript-open state, and gallery state are not persisted.

## Write contract

The provider writes the state when the active narration or narration status changes.

| Current status | Stored `isPaused` |
| :--- | :--- |
| `idle` | `false` |
| `loading` | `false` |
| `playing` | `false` |
| `paused` | `true` |
| `blocked` | `true` |
| `ended` | `true` |
| `error` | `true` |

The stored `floor` is the `floor` of the active narration entry, not the floor of an unrelated location.

## Read contract

| Situation | Result |
| :--- | :--- |
| Key absent | `null`; default location, `idle` |
| Invalid JSON | `null`; default location, `idle` |
| Storage throws | `null`; default location, `idle` |
| `floor` unknown or has no location | Default location, `idle` |
| Valid `floor`, `isPaused: true` | Restored location, `paused` |
| Valid `floor`, `isPaused: false` | Restored location, `idle`, then autoplay path |

## Restore contract

1. Resolve the floor index with `FLOOR_SEQUENCE.indexOf(floor)`.
2. Select the catalog location whose `order` equals that index.
3. Fall back to `catalog.defaultLocationId` when no location matches.
4. Initialize the panorama at `FLOOR_SCENE_MAP[floor]` or the LG first scene when unavailable.
5. Never restore a saved playback time; any active recording restarts at `0`.

## Clear contract

`clearNarrationState()` removes the key. It is used by tests and any future reset control. Clearing must not throw when storage is unavailable.

## Guarantees

- No personal data is stored.
- Storage failure never blocks the tour.
- Refresh while paused keeps the same floor and stays paused.
- Refresh while playing keeps the same floor and restarts the recording from the beginning.
- Refresh after a blocked autoplay attempt restores a paused state and leaves the manual play control available.
