# Contract: Playback Persistence

**Branch**: `029-tour-guide-narration` | **File**: `apps/frontend/src/lib/narrationStorage.js` | **Consumer**: `apps/frontend/src/context/TourContext.jsx`

## Purpose

Persists the active floor and paused/playing flag across page refresh so narration state survives reload. Degrades gracefully when `localStorage` is unavailable or blocked.

## Storage shape

Key: `ciit_narration_state`

Value (JSON):

```json
{
  "floor": "5F",
  "isPaused": true
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| floor | string | Yes | Last active floor label |
| isPaused | boolean | Yes | Whether narration was paused when state was written |

## Functions (`narrationStorage.js`)

- `readNarrationState(): { floor, isPaused } \| null` — reads and validates `localStorage`; returns `null` on missing, invalid JSON, or missing `floor` string.
- `writeNarrationState({ floor, isPaused }): void` — best-effort write; silently no-ops if storage is blocked.
- `clearNarrationState(): void` — best-effort removal; silently no-ops if storage is blocked.

## Write trigger (`TourContext.jsx`)

State is written whenever `activeNarrationId` or `narrationStatus` changes:

```js
writeNarrationState({
  floor: entry.floor,
  isPaused: ['paused', 'blocked', 'ended'].includes(state.narrationStatus),
})
```

## Read trigger (`TourContext.jsx`)

State is read during provider initialization via `useState(readNarrationState)` and used to set the initial `narrationStatus` (`paused` if restored `isPaused`, otherwise `idle`) and to restore the floor location on content load.

## Rules

- Only `floor` and `isPaused` are persisted; no secrets, credentials, or transcript text (FR-004, IV).
- If storage is blocked, the tour continues without persistence (session-only state).
- On refresh while playing, the restored floor's recording restarts from the beginning (FR-011).
- On refresh while paused, narration remains paused (FR-008).

## Related contracts

- `narration-catalog.md` — catalog data contract
- `floating-menu-narration.md` — FloatingMenu transcript accordion UI contract
