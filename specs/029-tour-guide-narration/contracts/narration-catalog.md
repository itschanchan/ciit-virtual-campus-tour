# Contract: Narration Catalog

**Feature**: `029-tour-guide-narration` | **Owner**: `apps/frontend/src/lib/narrationCatalog.json` + `narrationCatalog.js`

## Purpose

Define the data shape and lookup behavior that pairs every official recording with its transcript and assigns it to a floor or scene.

## Data shape

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
  "entries": [
    {
      "id": "voice-1",
      "number": 1,
      "floor": "LG",
      "sceneId": "0-lg---1",
      "audioSrc": "/voice/CIIT_Glitch_Virtual_Campus_Recording_1.mp3",
      "transcriptId": "transcript-1",
      "transcriptSrc": "/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_1.md"
    }
  ]
}
```

The example shows one entry; the real file contains all ten. `voice-2` is the only entry with `sceneId: "1-lg---2"` and is not referenced by `floorDefaults`.

## Required invariants

- `entries` contains exactly the ten recordings `voice-1` through `voice-10`.
- `floorDefaults` covers every narrated floor: `LG`, `UG`, `4F`, `5F`, `5M`, `6F`, `7F`, `8F`, `9F`.
- Locked floors `1F`, `2F`, `3F`, `10F`, and `11F` never appear.
- Each `number` equals the numeric suffix of `id`, `transcriptId`, `audioSrc`, and `transcriptSrc`.
- Each `floor` matches the floor code embedded in `sceneId` when `sceneId` is not `null`.
- `audioSrc` and `transcriptSrc` resolve to files under `apps/frontend/public`.
- No entry references `/panoramas/placeholder/narration.wav`.

## Module interface

| Function | Input | Output | Contract |
| :--- | :--- | :--- | :--- |
| `getNarrationById(id)` | entry ID or `null` | entry or `null` | Returns the exact entry; unknown IDs return `null` |
| `getNarrationForScene(sceneId)` | scene ID or `null` | entry or `null` | Returns the entry whose `sceneId` matches exactly; no floor fallback |
| `getDefaultNarrationForFloor(floor)` | floor label or `null` | entry or `null` | Resolves `floorDefaults[floor]`; unknown floors return `null` |
| `resolveNarration(sceneId, floor, currentEntryId)` | scene ID, floor label, current entry ID | entry or `null` | Exact scene match wins; same-floor continuity next; floor default last |

## Resolution examples

| Current | New scene | New floor | Result |
| :--- | :--- | :--- | :--- |
| `voice-1` | `1-lg---2` | `LG` | `voice-2` |
| `voice-2` | `2-lg---3` | `LG` | `voice-2` (same-floor continuity) |
| `voice-2` | `0-lg---1` | `LG` | `voice-1` (explicit scene) |
| `voice-2` | `6-ug---2` | `UG` | `voice-3` (floor default) |
| `voice-5` | `27-5m---1` | `5M` | `voice-6` (floor default) |
| `voice-10` | `48-9f---1` | `9F` | `voice-10` (same floor) |

## Failure behavior

- A missing entry returns `null`; the UI hides the transcript control and plays nothing.
- A missing file is a content-verification failure and is reported by `npm run verify:content`.
- A malformed catalog is a build/test failure; the resolver does not invent fallbacks.
