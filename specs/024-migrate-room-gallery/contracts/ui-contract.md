# UI Contract: Floating Menu (Gallery + Narration)

**Feature**: `024-migrate-room-gallery`
**Date**: 2026-11-15

## Purpose

Document the public, user-facing surface of `FloatingMenu.jsx` after the room gallery is consolidated into it. This contract covers the props the component accepts, the accessible names and labels users encounter, the keyboard shortcuts, and the behaviors that must remain stable. It is a UI contract for a frontend application; no backend API or external interface is involved.

## Component Surface

`FloatingMenu.jsx` is the single on-screen control surface hosting both the room gallery and narration playback controls.

### Props

| Prop | Type | Required | Default | Meaning |
|:---|:---|:---|:---|:---|
| `images` | `{src, alt, caption, order}[]` | No | `[]` | Gallery images for the current location |
| `open` | boolean | No | — | Whether the gallery modal is open |
| `onClose` | function | No | — | Called to close the gallery |
| `sidebarOpen` | boolean | No | `false` | Whether the sidebar is open |
| `floorLabel` | string | No | `""` | Floor name shown in the gallery header |
| `narration` | object | No | `undefined` | Narration metadata (`audioSrc`, `transcript`) |
| `status` | string | No | `idle` | Narration status: `idle`, `loading`, `playing`, `paused`, `ended`, `blocked`, `error` |
| `onPlay` | function | No | — | Narration play callback |
| `onPause` | function | No | — | Narration pause callback |
| `onStatusChange` | function | No | — | Narration status-change callback |
| `muted` | boolean | No | `false` | Whether narration is muted |
| `onMuteToggle` | function | No | — | Narration mute-toggle callback |

## Accessible Names and Labels

| Control | Accessible name / aria-label | Notes |
|:---|:---|:---|
| Play narration button | "Play narration" | Shown when narration is not playing |
| Pause narration button | "Pause narration" | Shown when narration is playing |
| Mute narration button | "Mute narration" | Shown when narration is unmuted |
| Unmute narration button | "Unmute narration" | Shown when narration is muted |
| Show transcript button | "Show transcript" | Shown when transcript is closed |
| Hide transcript button | "Hide transcript" | Shown when transcript is open |
| Open map button | "Open map" | Always present |
| Close gallery button | "Close gallery" | Gallery close control |
| Previous image button | "Previous image" | Hidden when one or zero images |
| Next image button | "Next image" | Hidden when one or zero images |
| Gallery dialog | "Gallery" | `aria-modal="true"`, labelled by the gallery title |

## Keyboard Shortcuts

| Shortcut | Context | Effect |
|:---|:---|:---|
| `p` | Play button focused | Toggles narration play/pause |
| `m` | Mute button focused | Toggles narration mute/unmute |
| `ArrowRight` | Gallery open | Next image (wraps to first) |
| `ArrowLeft` | Gallery open | Previous image (wraps to last) |
| `Escape` | Gallery open | Closes the gallery |
| `Enter` / `Space` | Any button focused | Activates the button |
| `Tab` | Floating menu open | Moves focus between controls in DOM order |

## Behaviors That Must Remain Stable

1. The gallery opens from the existing "View gallery" trigger in `Panorama.jsx` and closes via the close button, backdrop click, or `Escape`.
2. Focus returns to the element that had focus before the gallery opened, or to `#tour-main` if that element is gone.
3. Previous/next controls and arrow-key navigation are hidden when the gallery has one or zero images.
4. Navigation past the last image wraps to the first; navigation before the first wraps to the last.
5. The position counter shows `currentIndex + 1` of `imageCount` and matches the active image.
6. A failed image shows an "Image unavailable" fallback while other images remain navigable.
7. An empty gallery shows "No gallery images are available for this location yet."
8. The entire floating menu (gallery and narration) does not render when the sidebar is open on a compact mobile viewport.
9. Narration play/pause, mute/unmute, transcript, and map controls work identically before and after the consolidation.
10. The audio visualization shows while narration is playing and is hidden on narrow mobile viewports.
11. All controls have visible focus states and accessible names; no visible "p" or "m" hint text is shown.

## What Is Out of Scope for This Contract

- No backend API or HTTP endpoint is exposed or changed.
- No catalog schema, content validation rule, or asset pipeline is changed.
- No new runtime dependency is introduced.
- The underlying narration audio file and per-floor gallery image assets are unchanged.
