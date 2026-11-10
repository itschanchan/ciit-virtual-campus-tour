# Quickstart: Remove Marzipano Header

**Feature**: `007-remove-marzipano-header`
**Created**: 2026-11-06
**Spec**: `specs/007-remove-marzipano-header/spec.md`

## Purpose

Runnable validation scenarios that prove the header and top-button removal feature works end-to-end. This is a validation/run guide; implementation details belong in `tasks.md` and the implementation phase.

## Prerequisites

- Repository cloned with the `specs/007-remove-marzipano-header/` feature branch checked out
- `apps/frontend/src/components/PanoramaViewer.jsx` edited to remove the `#titleBar` header div and hide `#sceneListToggle`, `#fullscreenToggle`, `#autorotateToggle` with CSS
- Vendor scripts present (`vendor/marzipano.js`, `vendor/bowser.min.js`, `vendor/screenfull.min.js`) and referenced in `index.html`
- Panoramic tiles present under `public/tiles/`
- Node.js LTS (via nvm) and npm installed

## Setup Commands

```bash
# From repo root
npm install
npm run setup
npm run dev
```

This starts the backend and frontend together (`concurrently`). The frontend dev server serves the tour at `http://localhost:5173` (default Vite port).

## Validation Scenarios

| # | Scenario | Steps | Expected Outcome |
|---|----------|-------|------------------|
| 1 | No header bar, hamburger button, fullscreen button, or autorotate toggle on load | Open the tour; inspect the top of the panorama viewer | No header bar, hamburger button (☰), fullscreen button, or autorotate toggle is rendered/visible; the panoramic scene fills the full viewer height (FR-001, FR-002, FR-004, SC-001, SC-002, SC-003) |
| 2 | Scene fills viewport on mobile | Open the tour at a narrow mobile viewport width | The full panorama is visible without any top-of-viewer button overlay (FR-005, SC-002) |
| 3 | Current scene identifiable via Sidebar | Open the Sidebar; select a different floor | The viewer switches to that floor's first scene; the current scene remains identifiable through the Sidebar floor selection and scene list (FR-003, SC-004) |
| 4 | Remaining controls operable | Click each remaining viewer control (directional up/down/left/right/in/out) | Each control produces its expected effect; keyboard operability and visible focus states are preserved (FR-004, SC-003) |
| 5 | Scene list accessible via Sidebar | Open the Sidebar; scene list is available without the hamburger button | Scene list opens and scenes can be selected from the Sidebar (FR-003) |
| 6 | No console errors | Open browser DevTools console while loading and switching scenes | The viewer initializes and switches scenes without JavaScript errors (SC-008 from spec 006 carried forward) |

## References

- Feature spec: `specs/007-remove-marzipano-header/spec.md`
- Data model: `specs/007-remove-marzipano-header/data-model.md`
- UI contract: `specs/007-remove-marzipano-header/contracts/ui-interaction.md`

## Notes

- Do not include full implementation code, model/service/controller bodies, migrations, or complete test suites here.
- Tests are deferred pending Vitest tooling approval (Constitution Principle III gap); existing `PanoramaViewer.test.jsx` covers viewer behavior once Vitest is installed.
