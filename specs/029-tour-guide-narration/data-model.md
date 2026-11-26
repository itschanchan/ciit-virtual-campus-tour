# Data Model: Tour Guide Narration

**Branch**: `029-tour-guide-narration` | **Spec**: `specs/029-tour-guide-narration/spec.md`

## Entities

### Tour guide recording

An official MP3 voice-over file associated with a narrated floor.

| Field | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | Stable identifier, e.g. `voice-1` |
| number | integer | Yes | Numeric suffix `N` in `voice-N` / `transcript-N`, unique across entries |
| floor | string | Yes | Floor label from `FLOOR_SEQUENCE` (`LG`, `UG`, `4F`, `5F`, `5M`, `6F`, `7F`, `8F`, `9F`) |
| sceneId | string \| null | No | Scene ID that overrides the floor default for this entry (`0-lg---1` for voice-1, `1-lg---2` for voice-2) |
| audioSrc | string | Yes | URL under `public/voice/`, e.g. `/voice/CIIT_Glitch_Virtual_Campus_Recording_1.mp3` |
| transcriptId | string | Yes | Matching transcript identifier, e.g. `transcript-1` |
| transcriptSrc | string | Yes | URL under `public/transcripts/`, e.g. `/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_1.md` |

**Validation rules**:
- `id` must match the pattern `voice-N` where `N` is a positive integer.
- `number` must equal `N` extracted from `id`.
- `transcriptId` must be `transcript-N` where `N` matches `number`.
- `floor` must be a narrated floor with an assigned recording.
- `audioSrc` and `transcriptSrc` must resolve to existing files under `public/voice/` and `public/transcripts/` respectively (validated by `verify-content.mjs`).
- Every narrated floor has exactly one recording entry.

### Transcript

The text alternative paired with a recording by the same numeric suffix.

| Field | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | Stable identifier, e.g. `transcript-1` |
| number | integer | Yes | Numeric suffix `N` in `transcript-N`, matches recording `number` |
| src | string | Yes | URL under `public/transcripts/`, e.g. `/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_1.md` |
| text | string | No | Loaded Markdown content; `null` if missing or empty |

**Validation rules**:
- `id` must match the pattern `transcript-N` where `N` matches a recording's `number`.
- `text` may be null/empty; the UI shows a fallback in that case (FR-014, FR-024).
- Content is plain Markdown paragraphs, split on double newlines for rendering.

### Floor narration assignment

The rule that connects a narrated floor or view to exactly one recording/transcript pair.

| Field | Type | Required | Description |
|---|---|---|---|
| floor | string | Yes | Floor label from `FLOOR_SEQUENCE` |
| recordingId | string | Yes | ID of the assigned recording (`voice-N`) |
| transcriptId | string | Yes | ID of the assigned transcript (`transcript-N`) |
| sceneOverride | string \| null | No | Optional scene ID that resolves to this narration instead of the floor default |

**Validation rules**:
- Each narrated floor maps to exactly one recording/transcript pair (FR-002).
- Locked floors (`1F`, `2F`, `3F`, `10F`, `11F`) have no assignment.
- `sceneOverride` must match a scene whose floor code resolves to `floor` via `getFloorForSceneId`.

### Tour guide catalog

The data file in the frontend `lib` folder that lists recordings, transcripts, and floor assignments by ID. Lives at `apps/frontend/src/lib/narrationCatalog.json`.

| Field | Type | Required | Description |
|---|---|---|---|
| version | string | Yes | Semantic version, e.g. `1.0.0` |
| floorDefaults | object | Yes | Map of floor label → recording ID (`voice-N`) |
| entries | array | Yes | Array of recording entry objects |

**Validation rules**:
- `version` must match semver pattern.
- Every key in `floorDefaults` must have a corresponding entry in `entries`.
- Every entry's `floor` must have exactly one entry assigned (no duplicates per floor).
- Every `transcriptSrc` in `entries` must reference a transcript with matching `N`.

### Playback state

The active floor, whether narration is playing or paused, the mute state, and the restart-from-beginning behavior used on refresh. Persisted in `localStorage` key `ciit_narration_state`.

| Field | Type | Required | Description |
|---|---|---|---|
| floor | string | Yes | Last active floor label |
| isPaused | boolean | Yes | Whether narration was paused when state was written |

**Validation rules**:
- `floor` must be a non-empty string.
- `isPaused` must be a boolean.
- Persistence is best-effort; blocked storage degrades to session-only state without breaking the tour.

### Narrated floor

A floor or view with an assigned recording: Lower Ground initial view, LG-2, Upper Ground, 4F, 5F, 5M, 6F, 7F, 8F, and 9F.

**State transitions**:
- `idle` → `loading`: play initiated (user click or one-second initial autoplay).
- `loading` → `playing`: audio element `onPlay` fires.
- `playing` → `paused`: user pause click or `PAUSE_NARRATION` dispatch.
- `playing` → `ended`: audio element `onEnded` fires.
- `playing`/`paused` → `blocked`: play promise rejects (browser autoplay block).
- `playing`/`paused` → `error`: audio element `onError` fires.
- `ended` → `playing`: user replay click.
- `blocked` → `loading`: user manual play click.
- Floor change while playing → destination floor recording replaces current; `narrationStatus` preserved.
- Floor change while paused → destination floor recording selected; `narrationStatus` remains `paused`.
- Refresh → floor restored from `localStorage`; if playing, recording restarts from beginning; `narrationStatus` restored.

**Relationships**:
- One recording belongs to exactly one floor.
- One transcript pairs with exactly one recording (shared `N`).
- One playback state references one active floor and one active recording.
- Floor narration assignment links floor → recording → transcript.
