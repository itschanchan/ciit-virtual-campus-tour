# Contract: Floating Menu Narration (Transcript Accordion)

**Branch**: `029-tour-guide-narration` | **File**: `apps/frontend/src/components/FloatingMenu.jsx`

## Purpose

Defines the UI contract for the Floating Menu narration controls and the transcript accordion reveal (FR-012 through FR-025, SC-005, SC-008).

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| images | array | No | `[]` | Gallery images for the room gallery modal |
| open | boolean | No | `false` | Room gallery modal open state |
| onClose | function | No | — | Gallery close handler |
| narration | object | No | `null` | Active recording entry from catalog |
| status | string | No | `"idle"` | Narration status (`idle`, `loading`, `playing`, `paused`, `ended`, `blocked`, `error`) |
| onPlay | function | No | — | Play handler |
| onPause | function | No | — | Pause handler |
| onStatusChange | function | No | — | Status change handler |
| muted | boolean | No | `false` | Mute state |
| onMuteToggle | function | No | — | Mute toggle handler |
| sidebarOpen | boolean | No | `false` | Sidebar open state |
| floorLabel | string | No | `""` | Current floor label |
| onOpen | function | No | — | Gallery open handler |

## Transcript control contract

- Rendered only when `narration` is truthy.
- Button with `aria-label="Show transcript"` / `aria-label="Hide transcript"` toggling on click.
- `aria-expanded` reflects transcript open state (`true`/`false`).
- `aria-controls="floating-menu-transcript"` links the button to the transcript panel.
- Keyboard operable with visible focus state (FR-019, FR-020, SC-008).

## Transcript panel contract

- Element ID `floating-menu-transcript`.
- Always rendered while `narration` exists so the accordion can animate both ways; hidden with `aria-hidden` and a zero-height row while the transcript is collapsed.
- Heading "Transcript", then `NarrationTranscript` loaded from `narration.transcriptSrc`.
- Fallback message "Transcript not available shown when transcript is missing or empty (FR-014, FR-024).
- Panel updates when the active recording changes (FR-013).

## Accordion reveal contract (FR-025)

| Viewport | Behavior |
|---|---|
| Tablet and desktop | Floating menu animates smoothly from pill shape (`rounded-pill`, a finite radius) to rounded rectangle (`rounded-xl`) while growing vertically to fit the transcript content when the transcript is revealed; returns to the pill shape and collapsed height when collapsed. The pill radius is a finite theme token (`--radius-pill`) so the corner change eases with the height; `rounded-full` is avoided because its very large value makes the corner change snap. The transcript panel stays mounted and animates its row height from `grid-rows-[0fr]` to `grid-rows-[1fr]` (with `opacity` fade and `overflow-hidden`) so the reveal and collapse are symmetric. Transitions use `transition-all duration-300 ease-in-out` matching the sidebar's pattern. Respects `prefers-reduced-motion` (animation disabled, instant toggle). Includes a 320ms toggle guard to prevent rapid-toggle conflicts. |
| Compact mobile | Menu keeps existing shape (full-width, bottom-anchored, `narrow:rounded-t-panel` / `narrow:rounded-b-none`). No accordion reveal; transcript panel reveals without changing menu shape. |

## Existing controls (must remain usable, FR-021)

- Play/pause button (accessible name reflects status: "Play narration", "Pause narration", "Resume narration", "Replay narration", "Narration unavailable").
- Mute/unmute button ("Mute narration" / "Unmute narration").
- Map button ("Open map").
- View Gallery button ("View gallery", icon-only with `PhotoCameraIcon`).
- Audio visualization (`audio-viz`) shown only when playing, hidden on narrow mobile (`narrow:hidden`).

## Hidden audio element

- Always mounted (`<audio ref={audioRef} ... className="hidden" aria-hidden="true">`), even when the mobile sidebar hides the visible panel, so playback survives sidebar toggles.
- `src` bound to `narration.audioSrc`.
- Events: `onPlay` → `onStatusChange("playing")`, `onEnded` → `onStatusChange("ended")`, `onError` → `onStatusChange("error")`.

## Related contracts

- `narration-catalog.md` — catalog data contract
- `playback-persistence.md` — localStorage state contract
