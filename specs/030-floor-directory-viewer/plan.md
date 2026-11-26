# Implementation Plan: Floor Directory Viewer

**Branch**: `030-floor-directory-viewer` | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-floor-directory-viewer/spec.md`

## Summary

Replace the hand-rolled zoom and pan code inside the floor directory dialog with the already-installed `react-zoom-pan-pinch` viewer, then wrap it in a focused, accessible dialog that matches the clarified spec: the whole directory is letterboxed at 100%, zoom is capped at 400%, panning clamps hard at the image edges, and the visitor gets wheel, trackpad, pinch, drag, double-click/tap, buttons, and keyboard input. The viewer is extracted from `FloatingMenu.jsx` into its own component so per-frame transform updates do not re-render the whole floating menu.

## Technical Context

**Language/Version**: JavaScript (ES Modules), React 19.2, Vite 8

**Primary Dependencies**: `react-zoom-pan-pinch@4.2.0` (already declared and installed), `@mui/icons-material`, Tailwind CSS 4, existing `react`/`react-dom`

**Storage**: N/A — the directory is the static asset `apps/frontend/public/img/glitch_directory.png`

**Testing**: Vitest 5 with `@testing-library/react`, `@testing-library/jest-dom`, and jsdom (already configured in `apps/frontend/src/tests`)

**Target Platform**: Modern desktop, tablet, and mobile browsers; touch and pointer input

**Project Type**: Web application (React SPA, frontend-only change)

**Performance Goals**: Input response under 100 ms; programmatic zoom/pan transitions settle within 600 ms; pan and pinch stay smooth at 60 fps

**Constraints**: No page scroll, page zoom, or pull-to-refresh while the viewer is active; dialog fits inside 90 dvh with no scrolling; reduced-motion users get instant changes; no new dependency may be installed

**Scale/Scope**: One dialog, one image, one viewer instance; roughly two new components, one shared motion helper, and updates to the existing FloatingMenu tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Status | Evidence or required action |
| :--- | :--- | :--- |
| I. MERN stack alignment | PASS | React + Vite frontend, ES Modules, Vitest; no stack change |
| II. MVC and app boundaries | PASS | All work stays in `apps/frontend/src`; no backend, API, or database change |
| III. Test-first quality gate | PASS with action | Rewrite the floor-directory block in `FloatingMenu.test.jsx` and add viewer tests before implementation; run `npm --prefix apps/frontend run test` |
| IV. Security and secrets | PASS | Static image only; no credentials, network calls, or new configuration |
| V. Responsive, accessible experience | PASS with action | Keyboard pan/zoom/reset, focus trap and restore, meaningful alt text, reduced-motion handling, and mobile/tablet/desktop checks |
| Dependency discipline | PASS with action | `react-zoom-pan-pinch@4.2.0` is already in `apps/frontend/package.json`; no install is performed. `docs/tech_stack.md` does not list it yet, so the implementation must add the approved row and justification, as the constitution requires |
| KISA code style | PASS with action | Extract the viewer so no block exceeds the nesting and length limits; use shallow destructuring and early returns |

**Gate result**: PASS. No constitution violations require justification; the only follow-up is documenting the already-declared dependency.

## Project Structure

### Documentation (this feature)

```text
specs/030-floor-directory-viewer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── floor-directory-dialog.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/frontend/src/
├── components/
│   ├── FloatingMenu.jsx              # Map button, open state, overlay handoff (edited)
│   ├── FloorDirectoryDialog.jsx      # NEW: overlay, header, close, focus trap, error state
│   └── FloorDirectoryViewer.jsx      # NEW: TransformWrapper, toolbar, percentage, bounds
├── lib/
│   └── motion.js                     # NEW: usePrefersReducedMotion (shared with FloatingMenu)
└── tests/
    ├── FloatingMenu.test.jsx         # Floor-directory block rewritten
    ├── FloorDirectoryDialog.test.jsx # NEW: dialog, keyboard, focus, error, handoff
    └── FloorDirectoryViewer.test.jsx # NEW: zoom limits, percentage, controls
```

**Structure Decision**: The dialog and the interactive viewer are split because the dialog owns focus, escape, and error states while the viewer owns transform state. `FloatingMenu.jsx` keeps the map button and the `mapModalOpen` flag so the existing gallery and narration behavior is untouched.

## Phase 0: Outline & Research

Research is consolidated in [research.md](./research.md). The open technical questions were:

1. How to get a 100%–400% zoom range from a library whose scale is absolute.
2. How to obtain hard edge clamping instead of the library's default rubber-band overscroll.
3. How to keep the zoom percentage live without re-rendering the whole floating menu.
4. Which input configurations satisfy the wheel, trackpad, pinch, drag, double-click, and keyboard requirements at once.
5. How to test transform behavior in jsdom, which reports zero layout sizes.

All five are resolved in `research.md`; no NEEDS CLARIFICATION remains.

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md) — viewer state, zoom bounds, and state transitions.
- [contracts/floor-directory-dialog.md](./contracts/floor-directory-dialog.md) — component props, dialog semantics, control names, keyboard contract, and state matrix.
- [quickstart.md](./quickstart.md) — runnable validation scenarios per viewport, input type, and reduced-motion setting.

### Key design decisions

1. **Fit scale is measured, not assumed.** `fitScale = min(wrapperWidth / contentWidth, wrapperHeight / contentHeight)` is read from the viewer instance after layout, guarded against zero, and used to derive `minScale = fitScale` and `maxScale = fitScale * 4`. `fitOnInit="contain"` paints the first fitted frame; `fitToView` re-fits on open, image load, and resize while the visitor is still at 100%.
2. **Hard clamp.** `limitToBounds`, `disablePadding`, and `autoAlignment: { sizeX: 0, sizeY: 0 }` remove overscroll and rubber-banding, matching the clarified edge behavior.
3. **Isolated transform state.** The percentage and disabled-button state live in `FloorDirectoryViewer.jsx`; `onTransform` updates them only when the rounded percentage changes.
4. **Reduced motion is JS-aware.** A `usePrefersReducedMotion` hook drives zero animation times, disabled velocity/inertia, and instant fit/reset, because CSS media queries cannot change the library's JS timings.
5. **Overlay handoff stays in `FloatingMenu`.** A single effect closes and resets the directory when the gallery or sidebar takes over, so there is one source of truth for which overlay is active.

## Phase 2 Preview (for `/speckit.tasks`)

Expected task groups: shared motion helper, dialog shell, viewer with bounds and toolbar, FloatingMenu wiring and handoff, test rewrite plus new viewer tests, `docs/tech_stack.md` dependency row, and lint/build verification.

## Re-evaluated Constitution Check (post-design)

| Gate | Result | Notes |
| :--- | :--- | :--- |
| Stack and boundaries | PASS | Frontend-only; no new dependency installed |
| Test-first | PASS | Tests are written against the new component contracts before implementation |
| Accessibility | PASS | Focus trap, keyboard contract, live zoom percentage, reduced motion |
| Responsive | PASS | Dialog height is viewport-relative; no JS viewport detection is added |
| KISA | PASS | Viewer and dialog are separate files; no deep nesting or monolithic handlers |
| Dependency documentation | PASS with action | `docs/tech_stack.md` row added during implementation |

## Complexity Tracking

No constitution violations. The only added structure is the dialog/viewer split, which exists to keep per-frame transform state from re-rendering the floating menu and to keep each file within the KISA block limits.
