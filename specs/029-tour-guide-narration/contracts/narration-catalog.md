# Contract: Tour Guide Catalog

**Branch**: `029-tour-guide-narration` | **File**: `apps/frontend/src/lib/narrationCatalog.json` | **Resolver**: `apps/frontend/src/lib/narrationCatalog.js`

## Purpose

Authoritative data source that pairs each official recording and transcript by a shared numeric ID (`voice-N` / `transcript-N`) and assigns each pair to a narrated floor. Consumed by `TourContext`, `FloatingMenu`, and tests.

## Format

JSON file at `apps/frontend/src/lib/narrationCatalog.json`.

### Top-level shape

```json
{
  "version": "1.0.0",
  "floorDefaults": {
    "LG": "voice-1",
    "UG": "voice-3",
    "4F": "voice-4",
    "5F": "voice-5",
    "5M": "voice-6",
    "6F": "voice-7",
    "7F": "voice-8",
    "8F": "voice-9",
    "9F": "voice-10"
  },
  "entries": [ ... ]
}
```

### Entry shape

Each entry in `entries`:

```json
{
  "id": "voice-1",
  "number": 1,
  "floor": "LG",
  "sceneId": "0-lg---1",
  "audioSrc": "/voice/CIIT_Glitch_Virtual_Campus_Recording_1.mp3",
  "transcriptId": "transcript-1",
  "transcriptSrc": "/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_1.md"
}
```

| Field | Type | Required | Constraint |
|---|---|---|---|
| id | string | Yes | Pattern `voice-N`, N positive integer |
| number | integer | Yes | Must equal N from id |
| floor | string | Yes | One of narrated floor labels |
| sceneId | string \| null | No | Scene override; null means use floor default |
| audioSrc | string | Yes | Path under `public/voice/` |
| transcriptId | string | Yes | Pattern `transcript-N`, N matches number |
| transcriptSrc | string | Yes | Path under `public/transcripts/` |

### Resolver functions (`narrationCatalog.js`)

- `getNarrationById(id: string): entry \| null` — lookup by recording ID.
- `getNarrationForScene(sceneId: string): entry \| null` — lookup by scene override ID.
- `getDefaultNarrationForFloor(floor: string): entry \| null` — lookup by floor default.
- `resolveNarration(sceneId, floor, currentEntryId): entry \| null` — scene override wins, then current entry if same floor, then floor default.

## Validation

Validated by `scripts/verify-content.mjs`: every `audioSrc` and `transcriptSrc` must resolve to an existing file under `apps/frontend/public`; missing files produce a warning, not a hard failure (content dependency, not a blocking schema error).

## Related contracts

- `playback-persistence.md` — localStorage state contract
- `floating-menu-narration.md` — FloatingMenu transcript accordion UI contract
