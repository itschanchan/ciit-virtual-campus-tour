# Research: Floor Directory Viewer

**Feature**: `030-floor-directory-viewer`
**Date**: 2026-11-25

## R1. Viewer implementation approach

**Decision**: Use `react-zoom-pan-pinch@4.2.0` (`TransformWrapper` + `TransformComponent`) and delete the custom wheel, touch, and mouse handlers currently in `FloatingMenu.jsx`.

**Rationale**: The installed package already provides every input the spec requires (wheel and trackpad zoom, two-finger pinch, one-finger and mouse drag, double-click/tap toggle, opt-in keyboard navigation, bounds, inertia, and fit-to-view) and it is already declared in `apps/frontend/package.json`. The existing custom code only implements zoom and pan; adding pinch anchoring, edge clamping, inertia, and keyboard support by hand would duplicate the package and add risk to the tour's most visible controls.

**Alternatives considered**:

- Keep the custom transform state and extend it: rejected because momentum, pointer anchoring, pinch math, and bounds are each non-trivial and would need their own tests.
- `react-medium-image-zoom`: zoom only, no pan bounds, keyboard, or inertia.
- `openseadragon`: tile-based deep zoom for very large images; overkill for a single 1200 × 1900 PNG.

**Verification**: The installed `dist/index.d.ts` and `dist/index.esm.js` were inspected; `fitOnInit`, `fitToView`, `zoomToPoint`, `panBy`, `keyboard`, `doubleClick.mode: "toggle"`, and `autoAlignment` all exist in 4.2.0 and match the reference document.

## R2. Expressing 100%–400% when the library scale is absolute

**Decision**: Measure the fitted scale and derive the bounds from it.

```text
fitScale = min(wrapper.clientWidth / content.offsetWidth,
               wrapper.clientHeight / content.offsetHeight)
minScale = fitScale
maxScale = fitScale * 4
zoomPercent = clamp(round(scale / fitScale * 100), 100, 400)
```

The wrapper and content elements are read from the ref instance (`ref.current.instance.wrapperComponent` and `contentComponent`). `fitOnInit="contain"` paints the first fitted frame; `fitToView` re-runs on open, after the image loads, and on resize while the visitor is still at 100%.

**Rationale**: The library's scale is relative to the content's natural size, so "100%" only means "fitted" if the fit is measured. Deriving `maxScale` from the measured fit guarantees exactly four times the fitted view on every viewport, which is what the spec's clarified answer requires.

**Alternatives considered**:

- Fixed `initialScale={1}` with CSS-sized image: the image would overflow on small screens and 100% would mean different things per viewport.
- Using `naturalWidth`/`naturalHeight` only: ignores the dialog area and breaks when the wrapper letterboxes the image.
- Capturing the scale from `onInit`: `onInit` fires before the image has a size, so the captured scale can still be the default `1`.

**Guard**: jsdom and the first paint can report `0` for both sizes. When the measured fit is not a positive finite number, the viewer falls back to `1` so no division by zero or `NaN` transform can reach the DOM.

## R3. Hard edge clamping

**Decision**: `limitToBounds`, `disablePadding`, and `autoAlignment: { sizeX: 0, sizeY: 0 }`.

**Rationale**: The clarified spec rejects rubber-band overscroll. In 4.2.0 the padding value is `0` when the alignment size is `0`, and the alignment animation returns early when both sizes are `0`, so the transform stops exactly at the image edges while still allowing the whole image to letterbox at fit.

**Alternatives considered**:

- Default `autoAlignment` (100 px of springy overscroll): contradicts the accepted clarification.
- Fixed `minPositionX`/`maxPositionX` props: they are scale-independent and would be wrong at every zoom level except one.
- `centerZoomedOut`: only affects scales below 1 and does not clamp.

## R4. Live zoom percentage without re-rendering the floating menu

**Decision**: Keep the percentage in `FloorDirectoryViewer.jsx` and update it from `onTransform`, only when the rounded integer changes. The dialog renders the percentage as text next to the toolbar.

**Rationale**: `onTransform` fires on every animation frame. Isolating the state in the viewer means the gallery, narration, and audio elements in `FloatingMenu` never re-render during a gesture. Rounding before `setState` keeps most frames as no-ops.

**Alternatives considered**:

- Updating a DOM node through a ref: fewer renders, but less idiomatic and harder to test.
- `useTransformEffect` inside the viewer: equivalent behavior with an extra hook; plain `onTransform` is simpler.
- No live value, only disabled buttons: rejected by the clarified answer.

## R5. Keyboard support

**Decision**: Enable the library's `keyboard` configuration (`disabled: false`) and add a dialog-level Tab trap plus focus restore.

**Rationale**: The package already maps arrow keys to panning, `+`/`-` to zoom, and `0` to reset, which matches FR-008 and SC-004. Enabling it makes the wrapper focusable, so the dialog must also keep Tab inside the modal and return focus to the map button on close.

**Alternatives considered**:

- Custom key handlers calling `panBy`/`zoomIn`/`zoomOut`: duplicates the library's editable-target and modifier-key guards.
- Relying on the browser's natural tab order without a trap: fails FR-017.

## R6. Trackpad behavior

**Decision**: Leave `trackPadPanning` at its default (disabled) and rely on the `wheel` handler for two-finger scrolling, which zooms; trackpad users pan by click-dragging.

**Rationale**: US2 scenario 5 requires trackpad scrolling to zoom like a mouse wheel. Enabling the library's trackpad panning would convert the same gesture into panning and break that scenario.

**Alternatives considered**:

- `trackPadPanning.disabled: false`: would replace wheel zoom with wheel pan, contradicting the spec.

## R7. Reduced motion

**Decision**: Add `usePrefersReducedMotion` in `apps/frontend/src/lib/motion.js` and reuse it in `FloatingMenu` (replacing its local `prefersReducedMotion` helper). When enabled, pass zero animation times, disable `velocityAnimation` and `panning.velocityDisabled`, and use instant fit/reset.

**Rationale**: The library's animations are driven by JavaScript timers, so a CSS `prefers-reduced-motion` rule cannot suppress them. A shared hook keeps one definition and keeps the existing narration panel behavior intact.

**Alternatives considered**:

- CSS-only handling: cannot reach `animationTime` options or inertia.
- Reading `matchMedia` once per render without a listener: misses a preference change while the dialog is open; a small listener is cheap.

## R8. Testing transform behavior in jsdom

**Decision**: Test behavior that is observable without layout: dialog semantics, focus, control names, percentage text, disabled states, overlay handoff, escape/backdrop close, image error, and the reduced-motion branch. For the percentage and bounds math, extract the pure calculation (fit, clamp, percent) into a small exported helper and unit-test it directly. Where a component test needs non-zero sizes, stub `clientWidth`/`clientHeight`/`offsetWidth`/`offsetHeight` on the wrapper and content elements.

**Rationale**: jsdom reports `0` for all layout sizes and does not implement pointer capture or real touch gestures, so asserting inline `transform` strings (as the current tests do) is brittle and no longer meaningful once the library owns the transform. The current tests that assert `translate(0px, 0px) scale(1.1)` must be rewritten.

**Alternatives considered**:

- Playwright end-to-end tests: not installed; adding a browser test runner is a new dependency and out of scope.
- Mocking the whole library: would leave the integration untested; stubbing sizes keeps the real component mounted.

## R9. Dependency and documentation

**Decision**: Do not install anything. Add `react-zoom-pan-pinch` to the Frontend dependency table in `docs/tech_stack.md` with an "Approved" status and a one-line justification.

**Rationale**: The package is already declared in `apps/frontend/package.json` and present in `node_modules`, so the feature does not add a dependency. The constitution still requires runtime dependencies to be recorded in `docs/tech_stack.md`, and the current table omits this package.

**Alternatives considered**:

- Treat the missing row as a gate failure: disproportionate, since the dependency predates this feature and is already used by the repository.

## R10. Overlay handoff and focus ownership

**Decision**: Keep `mapModalOpen` in `FloatingMenu`, and add one effect that closes and resets the directory when `sidebarOpen` or the gallery `open` becomes true. The dialog owns focus capture, the Tab trap, and focus restore.

**Rationale**: The clarified answer requires the directory to close and reset when another overlay takes over. Centralizing the flags in `FloatingMenu` avoids two components disagreeing about which overlay is active, and keeps the existing `hidePanel` mobile behavior intact.

**Alternatives considered**:

- Letting the dialog watch the sidebar itself: splits overlay ownership across components and risks double-close races.
- Parking the view and restoring it: rejected by the clarification.
