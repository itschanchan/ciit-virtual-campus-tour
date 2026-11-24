# Phase 1 Data Model: Tour Guide Narration

**Feature**: `029-tour-guide-narration` | **Date**: 2026-11-24

## Entity Overview

```text
NarrationCatalog 1 ─── * NarrationEntry
       │                      │
       │ floorDefaults        │ transcriptId / transcriptSrc
       ▼                      ▼
    Floor label          TranscriptDocument
       │
       ▼
PersistedNarrationState ──► PlaybackState (runtime)
```

## 1. NarrationCatalog

The single authoritative narration data file: `apps/frontend/src/lib/narrationCatalog.json`.

| Field | Type | Required | Rules |
| :--- | :--- | :--- | :--- |
| `version` | string | Yes | Semantic version, currently `1.0.0` |
| `floorDefaults` | object | Yes | Maps every narrated floor label to exactly one entry ID |
| `entries` | array | Yes | Exactly 10 entries in this feature |

### Floor defaults

| Floor label | Entry ID | Recording |
| :--- | :--- | :--- |
| `LG` | `voice-1` | `CIIT_Glitch_Virtual_Campus_Recording_1.mp3` |
| `UG` | `voice-3` | `CIIT_Glitch_Virtual_Campus_Recording_3.mp3` |
| `4F` | `voice-4` | `CIIT_Glitch_Virtual_Campus_Recording_4.mp3` |
| `5F` | `voice-5` | `CIIT_Glitch_Virtual_Campus_Recording_5.mp3` |
| `5M` | `voice-6` | `CIIT_Glitch_Virtual_Campus_Recording_6.mp3` |
| `6F` | `voice-7` | `CIIT_Glitch_Virtual_Campus_Recording_7.mp3` |
| `7F` | `voice-8` | `CIIT_Glitch_Virtual_Campus_Recording_8.mp3` |
| `8F` | `voice-9` | `CIIT_Glitch_Virtual_Campus_Recording_9.mp3` |
| `9F` | `voice-10` | `CIIT_Glitch_Virtual_Campus_Recording_10.mp3` |

`voice-2` and `voice-1` are both LG entries; `voice-2` is an explicit scene override rather than a floor default.

## 2. NarrationEntry

One recording paired with one transcript.

| Field | Type | Required | Rules |
| :--- | :--- | :--- | :--- |
| `id` | string | Yes | `voice-<number>` pattern |
| `number` | integer | Yes | 1-10, unique; must match the `id` suffix |
| `floor` | string | Yes | One of `FLOOR_SEQUENCE`; must match the floor code of `sceneId` when present |
| `sceneId` | string or null | Yes | `null` for floor defaults with no explicit scene; `0-lg---1` for `voice-1`; `1-lg---2` for `voice-2` |
| `audioSrc` | string | Yes | `/voice/CIIT_Glitch_Virtual_Campus_Recording_<number>.mp3`; file must exist in `public` |
| `transcriptId` | string | Yes | `transcript-<number>`; unique |
| `transcriptSrc` | string | Yes | `/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_<number>.md`; file must exist in `public` |

### Entry assignments

| Entry | Floor | Scene override | Recording | Transcript |
| :--- | :--- | :--- | :--- | :--- |
| `voice-1` | `LG` | `0-lg---1` | Recording_1 | `transcript-1` |
| `voice-2` | `LG` | `1-lg---2` | Recording_2 | `transcript-2` |
| `voice-3` | `UG` | none | Recording_3 | `transcript-3` |
| `voice-4` | `4F` | none | Recording_4 | `transcript-4` |
| `voice-5` | `5F` | none | Recording_5 | `transcript-5` |
| `voice-6` | `5M` | none | Recording_6 | `transcript-6` |
| `voice-7` | `6F` | none | Recording_7 | `transcript-7` |
| `voice-8` | `7F` | none | Recording_8 | `transcript-8` |
| `voice-9` | `8F` | none | Recording_9 | `transcript-9` |
| `voice-10` | `9F` | none | Recording_10 | `transcript-10` |

## 3. TranscriptDocument

A Markdown file loaded from `public/transcripts/` and cached in memory.

| Field | Type | Rules |
| :--- | :--- | :--- |
| `src` | string | Absolute public path from the catalog |
| `text` | string | Raw file text, trimmed |
| `paragraphs` | string[] | Text split on one or more blank lines; empty paragraphs removed |

**Fallback**: If `src` is empty, the request fails, the response is not OK, or the text is empty, the UI renders "Transcript not available yet." The tour remains usable.

## 4. PersistedNarrationState

Stored in `localStorage` under `ciit_narration_state`.

| Field | Type | Rules |
| :--- | :--- | :--- |
| `floor` | string | A floor label that exists in `FLOOR_SEQUENCE` and has a catalog location; unknown values fall back to the default location |
| `isPaused` | boolean | `true` when the last status was `paused`, `blocked`, or `ended`; `false` when it was `playing`, `loading`, or `idle` |

**Write timing**: Write on every active narration change and every narration status change.

**Read failure**: Invalid JSON, blocked storage, or a missing key is treated as "no saved state"; the tour starts at the default location in `idle`.

**Restore behavior**:
- Find the location whose `order` equals `FLOOR_SEQUENCE.indexOf(floor)`.
- Fall back to `catalog.defaultLocationId` when no match exists.
- Show the restored floor's first scene from `FLOOR_SCENE_MAP`.
- Set `narrationStatus` to `paused` when `isPaused` is true, otherwise `idle`.
- Let the initial autoplay path restart the recording from the beginning.

## 5. PlaybackState (runtime)

Owned by `TourContext`.

| Field | Type | Initial | Rules |
| :--- | :--- | :--- | :--- |
| `currentSceneId` | string or null | `null` | Updated by `Panorama` on every scene change |
| `activeNarrationId` | string or null | Resolved floor default after content load | Must match a catalog entry or be `null` |
| `narrationStatus` | enum | `idle` or `paused` from storage | `idle`, `loading`, `playing`, `paused`, `blocked`, `ended`, `error` |
| `isMuted` | boolean | `false` | Applies to the single audio element |
| `currentLocationId` | string | Default or restored location | Drives the sidebar and gallery |

### Resolution function

`resolveNarration(sceneId, floor, currentEntryId)` returns the active entry:

1. Return the entry whose `sceneId` exactly matches `sceneId`.
2. Else, if the entry with `currentEntryId` has `floor === floor`, return it.
3. Else, return `floorDefaults[floor]`, or `null` when the floor has no narration.

### Status transitions

| From | Event | To |
| :--- | :--- | :--- |
| `idle` | Play requested | `loading` |
| `blocked`, `error` | Play requested | `loading` |
| `paused`, `ended` | Play requested | `playing` |
| `loading`, `playing` | Pause requested | `paused` |
| `loading` | Media `play()` resolved | `playing` |
| `loading`, `playing` | Media `play()` rejected | `blocked` |
| `playing` | Media ended | `ended` |
| Any | Media error | `error` |
| Any | Floor changed, destination has narration | Same status; new source at position 0 |
| Any | Floor changed, destination has no narration | `idle`; no source |

`narrationStatus` is never reset to `idle` merely because the visitor selected a different location.

## 6. Validation Rules

- Every `floorDefaults` value references an existing `entries[].id`.
- Every narrated floor appears in `floorDefaults`; locked floors (`1F`, `2F`, `3F`, `10F`, `11F`) do not.
- `entries` has exactly 10 items; `id`, `number`, `transcriptId`, `audioSrc`, and `transcriptSrc` are unique.
- `number` matches both the `voice-` and `transcript-` suffixes and the file numbering.
- `floor` is in `FLOOR_SEQUENCE` and matches the floor code of `sceneId` when `sceneId` is not null.
- `audioSrc` and `transcriptSrc` files exist under `apps/frontend/public`.
- No entry uses the obsolete `/panoramas/placeholder/narration.wav` asset.
- LG has exactly one scene override (`voice-2` at `1-lg---2`) plus its floor default (`voice-1`).

## 7. Relationships and Constraints

- One `NarrationCatalog` owns all entries and floor defaults.
- One floor has exactly one default entry; zero or more scene overrides.
- One entry has exactly one transcript by shared numeric suffix.
- One runtime session has at most one active entry and one audio element.
- One persisted state references at most one floor.
