# Validation: Tailwind CSS Integration

**Date**: 2026-10-26
**Branch**: `feature/tailwindcss`
**Environment**: Windows, Node 24.14.1, Chrome 155 headless, Vite 8.3.5

## Command Results

| Command | Result | Notes |
|---------|--------|-------|
| `npm run lint` | PASS | ESLint completed with zero reported errors. |
| `npm run build` | PASS | Vite 8.3.5 built 133 modules. |
| `npm run test` | FAIL | Stops at the backend with `'vitest' is not recognized`. |
| `npm --prefix apps/frontend run test` | FAIL | `'vitest' is not recognized`. Test tooling remains deferred. |
| `npm run verify:content` | FAIL | Pre-existing missing panorama tile template and narration asset. |
| `npm run verify:ignore` | PASS | Ignore policy check passed. |
| `npm audit --prefix apps/frontend` | PASS | `found 0 vulnerabilities` after the lockfile security updates. |

The test failure is the recorded T004 blocker. Vitest, jsdom, and Testing Library
were not installed. The content failure predates this feature: the catalog
references a missing panorama tile asset and
`/panoramas/placeholder/narration.wav`. No content or media files were changed.

## Production CSS

| Asset | Raw bytes | Gzip bytes |
|-------|-----------|------------|
| `dist/assets/index-DfflUgoU.css` | 20,901 | 4,671 |

- Baseline: 9,124 raw / 3,039 gzip.
- Delta: +11,777 raw / +1,632 gzip (+53.7 percent gzip).
- Plan target: 5,000 bytes gzip. Maximum recommended budget: 6,000 bytes gzip.
- Result: **within the recommended target and maximum**.
- Original SC-009 limit: 3,339 bytes gzip. **Not met; approval to revise SC-009
  is still pending.** The specification was not silently changed.

Only one CSS asset is emitted. No component CSS chunks remain.

## Stylesheet Inventory

```text
apps/frontend/src/index.css
apps/frontend/src/main.jsx:3: import './index.css'
```

- No `.css` file remains under `apps/frontend/src/components`.
- `apps/frontend/src/App.css` is deleted.
- No component stylesheet import remains.
- The five deleted stylesheets are `App.css`, `Sidebar.css`, `RoomGallery.css`,
  `PanoramaViewer.css`, and `NarrationPlayer.css`.

## Visual Matrix

Screenshots were captured with Chrome DevTools device metrics rather than the
`--window-size` flag because small headless windows can be clamped and cropped by
the browser. All surfaces were checked for horizontal document overflow.

| Viewport | Result |
|----------|--------|
| 1440x900 | PASS. Open sidebar rail, full header, top-right gallery trigger, bottom-centered narration. No overflow. |
| 1024x768 | PASS. Sidebar remains a 20rem rail; main content starts at x=320. No overflow. |
| 700x800 | PASS. Narrow layout applies at exactly 700px: instructions move to the bottom center and narration becomes a full-width bottom sheet. |
| 560x800 | PASS. Brand name hides, toolbar compacts, gallery fills 560x800. No overflow. |
| 375x667 | PASS. Mobile drawer, full-width narration, bottom-centered instructions, full-screen gallery. No overflow. |
| 320x568 | PASS. Minimum supported width. Header location truncates, instructions fit in the viewport, narration buttons wrap to two rows, drawer width is 275.19px. No overflow. |
| 667x375 landscape | PASS. Header, instructions, toolbar, and narration remain visible and do not collide. No overflow. |
| 640x400 (200 percent zoom proxy) | PASS. No horizontal overflow. |

Captured screenshots are in
`C:\Users\Takumi\AppData\Local\Temp\opencode\tailwind-baseline\`:
`validation-*.png`, `state-*.png`, `cdp-*.png`, `throttle-*.png`, and
`interaction-*.png`.

Baseline screenshots cover the initial load at all six required viewports.
Interactive and transient states were validated after migration with the
production stylesheet and a static state harness; pre-migration baselines were
not captured for those transient states. T002 remains marked partial for that
reason.

## Interactive States

| Check | Result |
|-------|--------|
| Sidebar drawer opens and closes at 375px and 320px | PASS. Drawer is fixed below the header; backdrop covers the remainder; Escape closes it. |
| Gallery opens from the toolbar | PASS. Focus moves to the close button; dialog is 1088x792 at 1440 and full-screen at 560 and below. |
| Gallery Escape handling | PASS. Dialog closes; the existing Layout Escape handler also collapses an open sidebar, matching prior behavior. |
| Transcript expands and collapses | PASS. Narration panel grows from 71px to 189px at 1440 without overflowing. |
| Keyboard focus | PASS. First Tab focuses the skip link; second Tab focuses the menu button. Both show a 3px solid `rgb(251, 191, 36)` outline. |
| Gallery focus return | Focus return depends on the trigger having focus; programmatic `.click()` tests do not reproduce that, so this was reviewed in source rather than asserted from the scripted run. |

## Throttled Network

Three production-preview loads were run through CDP with 500 ms latency, 30 KB/s
download, and 20 KB/s upload. A request-animation-frame sampler recorded body
styles and root mount state on every frame.

| Run | Total frames | First styled root | Unstyled content frames |
|-----|--------------|-------------------|-------------------------|
| 1 | 223 | ~3,766 ms | 0 |
| 2 | 222 | ~3,812 ms | 0 |
| 3 | 221 | ~3,804 ms | 0 |

The render-blocking `<link rel="stylesheet">` from the production build keeps the
app blank until the stylesheet is ready; no frame showed mounted, unstyled
content. The body background gradient and typography were already applied at the
first mounted frame. Reports and screenshots are in `throttle-report-*.json` and
`throttle-*.png`.

## Accessibility

| Check | Result |
|-------|--------|
| Reduced motion | PASS. Under `prefers-reduced-motion: reduce`, the spinner animation duration is `1e-05s` and iteration count is `1`; transitions are suppressed by the global base rule. |
| Forced colors | PASS. The forced-colors screenshot remains readable with visible borders and controls. |
| Contrast | PASS for normal text: ink/canvas 16.36:1, muted/surface 6.96:1, accent/canvas 9.42:1, accent-ink/accent 6.48:1, selected-ink/surface 13.45:1, danger/surface 9.41:1, instruction/canvas 13.59:1, focus-ink/focus 10.63:1. |
| Semantic and ARIA state | Unchanged from the baseline; no attributes were removed or renamed. |
| Backend offline | PASS. The frontend was loaded without the backend running and remained styled and usable. |

## Marzipano

- The viewer section fills the tour body: 1120x835 at 1440x900 and 704x703 at
  1024x768.
- The Marzipano canvas container is absolutely positioned to all edges and a
  single canvas is created.
- `touch-action: none` and the keyboard handler are preserved.
- Arrow, zoom, and drag events produced no runtime errors.
- A screenshot hash comparison could not confirm visible camera movement because
  the placeholder panorama tile asset is missing and the viewer renders black.
  This is the same content gap reported by `verify:content`, not a styling
  regression.

## Loading, Error, and Fatal States

The production stylesheet was applied to the production markup for these states
in a static harness. The React state transitions themselves were not modified.
The loading, tour-error, and fatal-error surfaces rendered correctly at 1440x900
and 320x568, including the spinner, retry button, fatal-error eyebrow, and
responsive heading. See `state-loading-*`, `state-error-*`, and `state-fatal-*`.

The catalog loads synchronously, so the loading state is too brief to capture
reliably in the normal app; the harness exists only to validate the compiled CSS
for that surface.

## Working Diff Review

`git status` shows only frontend styling/dependency files, `docs/`, and this
feature's spec directory. `git diff --name-only -- apps/backend
apps/frontend/src/lib/catalog.json apps/frontend/public/panoramas` is empty.

The lockfile changes add the approved Tailwind toolchain and its transitive
packages plus patch-level security updates within existing ranges:
`vite` 8.3.1 to 8.3.5, `rolldown` 1.2.11 to 1.2.15, `postcss` 8.5.28 to 8.5.31,
`nanoid` 3.3.19 to 3.3.20, `source-map-js` 1.2.1 to 1.2.2, `zod` 4.6.5 to 4.6.7,
and `@oxc-project/types` 0.151.0 to 0.155.0. No backend dependency or unapproved
top-level package was added.

## Remaining Decisions

1. **SC-009**: The original 10 percent cap cannot be met by a utility-first
   migration. The measured 4,671 bytes gzip meets the recommended 5,000-byte
   target and 6,000-byte maximum, but the specification still needs explicit
   approval to replace SC-009.
2. **Test tooling**: No approval was given to install Vitest, jsdom, or Testing
   Library. The pre-existing test-command failure remains, and no deferred
   packages were added.
3. **Content assets**: The placeholder panorama tile template and narration audio
   file are still missing. The tour layout and gallery preview remain usable, but
   the 360-degree view renders black and the narration cannot play until those
   assets are added.
