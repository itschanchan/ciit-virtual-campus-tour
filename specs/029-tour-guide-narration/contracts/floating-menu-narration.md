# Contract: Floating Menu Narration UI

**Feature**: `029-tour-guide-narration` | **Owner**: `apps/frontend/src/components/FloatingMenu.jsx` and `NarrationTranscript.jsx`

## Purpose

Define the user-visible playback and transcript behavior of the floating menu, including accessible names and fallback states.

## Component inputs

| Prop | Type | Contract |
| :--- | :--- | :--- |
| `narration` | object or `null` | `{ id, audioSrc, transcriptId, transcriptSrc, floor }` from the narration catalog; `null` hides narration controls |
| `status` | enum | `idle`, `loading`, `playing`, `paused`, `blocked`, `ended`, `error` |
| `muted` | boolean | Mirrors the single audio element's `muted` property |
| `onPlay` | function | Requests playback; does not perform storage or navigation work |
| `onPause` | function | Requests pause |
| `onStatusChange` | function | Reports `playing`, `paused`, `blocked`, `ended`, or `error` after media events |
| `onMuteToggle` | function | Toggles mute on the active element |
| `sidebarOpen` | boolean | Hides the visible panel on compact viewports; the audio element stays mounted |

## Audio element contract

- Exactly one `<audio>` element exists while the tour is mounted.
- It has no visible controls and is not focusable.
- `src` is the active entry's `audioSrc`.
- `preload="metadata"` is used so the source is known without downloading the whole file.
- The element stays mounted when the compact sidebar hides the visible menu.
- Source changes pause the element, reset `currentTime` to `0`, and then apply the current status.
- `muted` follows the `muted` prop.
- `onEnded` reports `ended`; `onError` reports `error`.

## Play/pause contract

| Status | Button accessible name | Behavior |
| :--- | :--- | :--- |
| `idle`, `loading` | `Play narration` | Requests play and calls `play()` directly |
| `playing` | `Pause narration` | Requests pause and calls `pause()` directly |
| `paused` | `Resume narration` | Resumes from the paused position |
| `ended` | `Replay narration` | Resets to `0` and plays |
| `blocked` | `Play narration` | Remains enabled so the visitor can retry |
| `error` | `Narration unavailable` | Disabled; the error message points to the transcript |

- Clicking play while the status is `ended` sets `currentTime = 0` before playing.
- A rejected `play()` promise reports `blocked` and never leaves the UI stuck in `playing`.
- The keyboard shortcut `p` on the focused play button performs the same action.
- The mute button exposes `Mute narration` or `Unmute narration` and supports the `m` key.

## Transcript contract

- The transcript control is rendered only when `narration` is not `null`.
- Accessible name: `Show transcript` when closed, `Hide transcript` when open.
- The control has `aria-expanded` matching the open state and `aria-controls="floating-menu-transcript"`.
- The panel is keyboard operable and appears inside the floating menu without hiding playback controls.
- The panel fetches `transcriptSrc` on first open and caches the result for the session.
- The rendered content is the transcript text split into paragraphs on blank lines.
- Loading state: `Loading transcript...` with a polite live region.
- Missing, empty, or failed fetch: `Transcript not available yet.`
- The transcript updates when `narration` changes; opening a new floor shows that floor's transcript.
- The panel never shows another recording's transcript.

## Blocked and error messages

| Status | Message | Role |
| :--- | :--- | :--- |
| `blocked` | `Playback was blocked by your browser. Press play to start the narration, or open the transcript to read it.` | `status` |
| `error` | `The narration could not be played. Open the transcript to read it instead.` | `alert` |

## Responsive behavior

- Desktop and tablet: the existing bottom-centered floating pill remains unchanged.
- Mobile: the existing compact behavior remains; the audio visualization is hidden and controls stay tappable.
- When the compact sidebar is open, the visible panel is hidden but narration keeps playing and the transcript state is preserved.
- Controls keep a minimum 40 px touch target and a visible focus ring.

## Accessibility guarantees

- Every control has an accessible name.
- The transcript control is reachable in the tab order.
- Status changes are announced through the existing polite live region.
- The gallery, map, mute, and transcript controls remain usable while narration plays.
