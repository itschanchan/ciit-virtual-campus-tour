# Data Model: Floor Directory Viewer

**Feature**: `030-floor-directory-viewer`
**Date**: 2026-11-25

This feature has no persisted data and no backend model. The entities below describe the viewer's in-memory state and the rules that constrain it.

## Entity: Viewer State

| Field | Type | Description | Validation |
| :--- | :--- | :--- | :--- |
| `status` | `"loading" \| "ready" \| "failed"` | Whether the directory image can be shown | Must be one of the three values |
| `scale` | `number` | Current transform scale reported by the viewer | Positive finite number |
| `fitScale` | `number` | Scale at which the whole image fits the dialog | Positive finite number; falls back to `1` when layout size is unavailable |
| `zoomPercent` | `number` | Human-facing zoom level | Integer, clamped to `100`–`400` |
| `isOpen` | `boolean` | Whether the dialog is active | Owned by `FloatingMenu` |
| `reducedMotion` | `boolean` | Visitor's motion preference | From `matchMedia`, defaults to `false` |

## Entity: Zoom Bounds

Derived from `fitScale`; never stored independently of it.

| Rule | Expression |
| :--- | :--- |
| Minimum scale | `minScale = fitScale` (the fitted, letterboxed view) |
| Maximum scale | `maxScale = fitScale * 4` |
| Percentage | `zoomPercent = clamp(round(scale / fitScale * 100), 100, 400)` |
| Fit scale | `fitScale = min(wrapperW / contentW, wrapperH / contentH)` |
| Zero-size fallback | If any measurement is `0` or not finite, `fitScale = 1` |

## Entity: Viewer Controls

| Control | Accessible name | Enabled when | Effect |
| :--- | :--- | :--- | :--- |
| Zoom in | `Zoom in` | `scale < maxScale` | Increase scale one step, animate unless reduced motion |
| Zoom out | `Zoom out` | `scale > fitScale` | Decrease scale one step, animate unless reduced motion |
| Reset view | `Reset view` | `scale > fitScale` or the view is off-center | Return to the fitted, centered view |
| Close | `Close floor directory` | Always | Close the dialog, reset the view, restore focus |
| Percentage | `Zoom level` | Always | Read-only text, e.g. `100%` |

## Entity: Directory Image

| Attribute | Value |
| :--- | :--- |
| Source | `apps/frontend/public/img/glitch_directory.png` |
| Alternative text | `Floor Directory` (describes the campus floor directory) |
| States | `loading` while decoding, `ready` after load, `failed` after an error |
| Failure behavior | Show an unavailable message; dialog stays closable; controls hidden or disabled |

## State Transitions

| From | Trigger | To | Notes |
| :--- | :--- | :--- | :--- |
| Closed | Map button activated | Open, fitted | Focus moves to the close button; scale = `fitScale`; percentage = 100% |
| Open, fitted | Zoom in (wheel, pinch, button, key, double-click) | Zoomed | Scale increases toward `maxScale`; anchor stays under the pointer or pinch point |
| Zoomed | Zoom out to `fitScale` | Fitted | Further zoom-out is blocked; panning has no effect |
| Zoomed | Reset, `0` key, fit control | Fitted | Animated unless reduced motion |
| Zoomed | Drag past an edge | Zoomed | Position clamps at the edge; no blank gap |
| Open | Close control, Escape, backdrop | Closed | Transform resets; focus returns to the map button |
| Open | Sidebar or gallery takes over | Closed | Same reset and focus behavior as closing |
| Loading | Image loads | Ready | Re-measure fit and re-apply bounds |
| Loading | Image fails | Failed | Show unavailable message; keep the close control usable |

## Invariants

1. `zoomPercent` is always between `100` and `400` inclusive while the image is ready.
2. `scale` is never below `fitScale` or above `fitScale * 4`.
3. No blank gap appears between the image edge and the dialog when `scale > fitScale`.
4. Blank space exists only as letterboxing when `scale === fitScale`.
5. The dialog always has at least one focusable, usable control (close), including in the failed state.
6. Only one overlay (directory, gallery, sidebar) is interactive at a time.

## Pure Helper Contract

The bounds math is exported as a small module so it can be unit-tested without layout:

```text
measureFitScale({ wrapperWidth, wrapperHeight, contentWidth, contentHeight }) -> number
getZoomPercent(scale, fitScale) -> number
getMaxScale(fitScale) -> number
```

Rules: inputs are numbers; non-positive or non-finite measurements fall back to `1`; `getZoomPercent` clamps to `100`–`400` and rounds to an integer.
