# UI Contract: Floor Directory Dialog

**Feature**: `030-floor-directory-viewer`
**Date**: 2026-11-25

This contract describes the interface between `FloatingMenu`, the floor directory dialog, and the visitor. It is the reference for implementation and tests.

## Component Props

### `FloorDirectoryDialog`

| Prop | Type | Required | Behavior |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | Yes | Controls visibility, `inert`, `aria-hidden`, focus capture, and reset-on-open |
| `onClose` | `() => void` | Yes | Called by the close control, Escape, and backdrop activation |
| `imageSrc` | `string` | No | Defaults to `/img/glitch_directory.png` |
| `imageAlt` | `string` | No | Defaults to `Floor Directory` |

The dialog reads the reduced-motion preference itself through `usePrefersReducedMotion`; callers do not pass it.

### `FloorDirectoryViewer`

| Prop | Type | Required | Behavior |
| :--- | :--- | :--- | :--- |
| `src` | `string` | Yes | Image source |
| `alt` | `string` | Yes | Alternative text |
| `active` | `boolean` | Yes | When true, re-fit and reset the transform; when false, leave the view fitted for the next open |
| `onImageStatusChange` | `(status) => void` | No | Reports `"loading"`, `"ready"`, or `"failed"` to the dialog |

## DOM and Accessibility Contract

| Element | Requirement |
| :--- | :--- |
| Backdrop | `fixed inset-0`, `aria-hidden={!open}`, `inert` when closed, closes on backdrop `mousedown` only when the target is the backdrop |
| Dialog | `id="floor-directory"`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby="floor-directory-title"` |
| Title | `id="floor-directory-title"`, text `Floor Directory` |
| Close control | `aria-label="Close floor directory"`, always rendered and enabled, receives focus on open |
| Viewer region | `role="group"` with `aria-label="Floor directory viewer"` |
| Image | `alt` from props; rendered inside the transform component |
| Zoom toolbar | Buttons `aria-label="Zoom in"`, `aria-label="Zoom out"`, `aria-label="Reset view"` |
| Percentage | Visible text matching `/^\d{3}%$/`, exposed as `aria-label="Zoom level"` or adjacent text; never a live region |
| Error message | `role="alert"` when the image fails; text explains the directory is unavailable and the dialog remains closable |
| Focus | Focus stays inside the dialog while open; Tab and Shift+Tab wrap; focus returns to the map button on close |

## Keyboard Contract

| Key | Context | Result |
| :--- | :--- | :--- |
| `Tab` / `Shift+Tab` | Dialog open | Move focus within the dialog; wrap at the ends |
| `Escape` | Dialog open | Close the dialog |
| `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight` | Viewer focused | Pan by one step, clamped to the image edges |
| `+` / `-` | Viewer focused | Zoom in or out one step, clamped to 100%–400% |
| `0` | Viewer focused | Reset to the fitted view |
| `Enter` / `Space` | Control focused | Activate that control |

Modifier combinations and keystrokes inside editable elements must be ignored.

## Input Behavior Contract

| Input | Expected behavior |
| :--- | :--- |
| Mouse wheel over the viewer | Zoom in or out around the cursor; page does not scroll |
| Trackpad two-finger scroll over the viewer | Zoom, identical to the wheel |
| Trackpad or mouse drag | Pan when zoomed; clamp at edges |
| Two-finger pinch | Zoom around the pinch midpoint; page does not scroll or bounce |
| One-finger drag | Pan when zoomed; does not dismiss the dialog |
| Double click / double tap | Toggle between 100% and the closer view |
| Zoom buttons | Animated step unless reduced motion |
| Reset / fit control | Return to 100%, centered |

## State Matrix

| State | Viewer | Controls | Percentage | Message |
| :--- | :--- | :--- | :--- | :--- |
| Closed | Not interactive (`inert`) | Not reachable | Hidden | None |
| Open, loading | Visible | Zoom controls disabled until ready | `100%` or hidden until ready | Optional loading indicator |
| Open, ready, fitted | Fitted, centered, letterboxed | Zoom out and reset disabled | `100%` | None |
| Open, ready, zoomed | Pannable, clamped | All enabled until a limit | `101%`–`400%` | None |
| Open, at 400% | Clamped | Zoom in disabled | `400%` | None |
| Open, failed | Not rendered | Zoom controls hidden or disabled | Hidden | Unavailable message, `role="alert"` |

## Overlay Handoff

| Event | Requirement |
| :--- | :--- |
| Gallery opens while directory is open | Directory closes, resets, and returns focus to the map button |
| Sidebar opens while directory is open | Same as gallery |
| Directory opens while another overlay is open | The other overlay closes first; only one dialog is interactive |
| Map button re-activated while open | No duplicate dialog; state stays consistent |

## Responsive Contract

| Viewport | Requirement |
| :--- | :--- |
| Mobile (< 640 px) | Dialog fills the screen (`min-h-dvh`, no rounded panel); viewer height leaves room for the header and toolbar; no page scrolling |
| Tablet (640–1024 px) | Dialog is a centered panel capped at `90dvh`; viewer fits without scrolling |
| Desktop (> 1024 px) | Same panel, maximum width `68rem`; viewer keeps a stable height |
| Orientation change | Viewer re-measures, re-applies bounds, and never strands the image off-screen |

## Motion Contract

| Preference | Behavior |
| :--- | :--- |
| Default | Zoom, pan, reset, and fit animate with the library defaults; inertia follows a fast drag |
| Reduced motion | All animation times are `0`; inertia and velocity are disabled; fit/reset are instant |

## Test Hooks

Tests should use roles, accessible names, and visible text — not CSS classes or inline transforms. The only stable DOM anchors are `#floor-directory`, `#floor-directory-title`, and the control labels above.
