# UI Contract: Floating Menu Public Surface

**Feature**: `025-transfer-view-gallery-logic`

## Scope

This contract documents the public, user-facing surface of `FloatingMenu.jsx` relevant to the View Gallery button and gallery open/close behavior. It covers props, accessible names/labels, keyboard shortcuts, and viewport behavior. Narration controls are unchanged and retained alongside the gallery.

## Component: FloatingMenu

### Props (gallery-related)

| Prop | Type | Required | Default | Description |
|:---|:---|:---|:---|:---|
| `open` | `boolean` | Yes | — | Gallery open state from `Layout`. Drives `aria-expanded` on the View Gallery button and gallery modal visibility. |
| `onClose` | `() => void` | Yes | — | Gallery close handler from `Layout`. |
| `onOpen` | `() => void` | Yes | — | Gallery open handler from `Layout`. Wired to the View Gallery button's `onClick`. Added by this feature. |
| `images` | `array` | No | `[]` | Gallery images resolved by `Layout`. |
| `sidebarOpen` | `boolean` | No | `false` | Sidebar open state for the mobile hide rule. |
| `floorLabel` | `string` | No | `""` | Current floor label for the gallery heading. |

### View Gallery Button

| Attribute | Value | Description |
|:---|:---|:---|
| Label text | None (icon-only) | Button uses `PhotoCameraIcon` icon only; no visible text, matching adjacent narration controls. |
| Icon | `PhotoCameraIcon` from `@mui/icons-material` (`fontSize="small"`) | Camera icon representing the gallery. |
| `aria-expanded` | Mirrors `open` prop (`true`/`false`) | Indicates whether the gallery is open. |
| `aria-controls` | `room-gallery` | References the gallery dialog element id. |
| `aria-haspopup` | `dialog` | Indicates the button controls a dialog. |
| `onClick` | `onOpen` prop | Opens the gallery. |
| Position | Inline within the single `flex items-center justify-center` controls row | All buttons (play/pause, mute, transcript, map, View Gallery) display in one horizontal row; no absolute positioning. |

### Gallery Dialog

| Attribute | Value | Description |
|:---|:---|:---|
| Element | `<section id="room-gallery">` | Dialog root. |
| `role` | `dialog` | |
| `aria-modal` | `true` | |
| `aria-labelledby` | `room-gallery-title` | References the gallery heading. |
| Close control | `<button aria-label="Close gallery">` | × close button. |
| Backdrop click | Closes the gallery | Clicking the overlay backdrop invokes `onClose`. |
| Escape key | Closes the gallery | `Escape` invokes `onClose`. |
| Focus on open | `closeButtonRef.current?.focus()` | Focus moves to the close button when the gallery opens. |
| Focus on close | Restores previous element, else `#tour-main` | Focus returns to the element that had focus before opening. |

### Previous / Next Image Controls

| Control | `aria-label` | Activation |
|:---|:---|:---|
| Previous image | `Previous image` | Click or ArrowLeft. |
| Next image | `Next image` | Click or ArrowRight. |

### Position Indicator

`{activeIndex + 1} / {imageCount}` with `aria-live="polite"`.

### Mobile Hide Rule

When `sidebarOpen && isCompactViewport()` is true, `FloatingMenu` returns `null` — the entire floating menu (gallery + narration) hides so the sidebar is the sole focus. This rule is unchanged by this feature.

## Keyboard Shortcuts (unchanged, retained)

| Shortcut | Action | Context |
|:---|:---|:---|
| `p` | Toggle narration play/pause | Narration control focused. |
| `m` | Toggle narration mute | Mute control focused. |
| `Escape` | Close gallery | Gallery open. |
| `ArrowLeft` | Previous image | Gallery open with multiple images. |
| `ArrowRight` | Next image | Gallery open with multiple images. |

## Accessibility Requirements

- Every interactive control has an accessible name (`aria-label` or visible text).
- The View Gallery button has `aria-expanded` reflecting gallery open state.
- The gallery dialog announces via `aria-modal` and `aria-labelledby`.
- Visible focus states are present on all controls (Constitution Principle V).
- Keyboard operability is preserved for gallery and narration controls.

## Changes Introduced by This Feature

- `FloatingMenu` gains a required `onOpen` prop.
- The View Gallery button's `aria-expanded` now mirrors the `open` prop (was undefined `galleryOpen`).
- The View Gallery button's `onClick` now calls `onOpen` (was undefined `toggleGallery`).
- The View Gallery button is icon-only (`PhotoCameraIcon`) and inline in the single controls row (was text label "View gallery" with absolute positioning).
- `Panorama.jsx` no longer references `galleryOpen` or `toggleGallery`.
