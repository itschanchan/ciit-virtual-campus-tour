# Quickstart: Marzipano Panorama Viewer Integration

**Feature**: Marzipano Panorama Viewer Integration
**Branch**: `006-marzipano-viewer-integration`
**Date**: 2026-11-06 | **Updated**: 2026-11-07

## Purpose

Runnable validation scenarios that prove the Marzipano panorama viewer integration works end-to-end. This is a validation/run guide; implementation details belong in `tasks.md`.

## Prerequisites

- Repository cloned and dependencies installed (`npm install` at root, then `npm run setup`)
- Vendor scripts present under `vendor/` (`marzipano.js`, `bowser.min.js`, `screenfull.min.js`) and referenced via `<script>` tags in `apps/frontend/index.html`; `reset.min.css` must NOT be linked (FR-010)
- Panoramic tiles present under `apps/frontend/public/tiles/` (54 scene dirs, committed to git); icons under `apps/frontend/public/img/`
- APP_DATA present at `src/lib/data.js` with all 54 scenes
- `Marzipano.jsx` present at `src/components/Marzipano.jsx` (frozen — complete viewer logic, unchanged)
- `PanoramaViewer.jsx` present at `src/components/PanoramaViewer.jsx`
- `Sidebar.jsx` present at `src/components/Sidebar.jsx` with floor buttons for LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F
- `src/lib/floorSceneMap.js` present (floor sequence, floor→first-scene map, scene id → floor resolution for Rule #1)

## Setup Commands

```bash
# From repo root
npm install
npm run setup
# Start the dev server (frontend + backend)
npm run dev
# Or run frontend only
cd apps/frontend && npm run dev
```

Open the tour at `http://localhost:5173` (or the port shown by Vite).

## Validation Scenarios

### Scenario 1: Initial load shows LG first scene

**Steps**:
1. Open the tour homepage
2. Observe the panorama viewer

**Expected outcome**:
- The viewer displays scene `0-lg---1` (LG - 1)
- The scene name "LG - 1" appears in the title bar
- The Sidebar LG button is highlighted as current
- No JavaScript errors in the browser console

### Scenario 2: Sidebar floor switching

**Steps**:
1. Open the Sidebar
2. Click each floor button in turn: UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F, then back to LG
3. After each click, observe the viewer

**Expected outcome**:
- Each floor's designated first scene loads without a page reload
- The scene name updates in the title bar for each floor
- The clicked floor button is highlighted; previous floor is unhighlighted
- The active button additionally shows its location name (from `catalog.json`); no inactive button shows a location name (Rule 2)

### Scenario 3: Link hotspot navigation within a floor

**Steps**:
1. With any floor loaded, look for link hotspots in the panorama
2. Click a link hotspot
3. Observe the viewer transition

**Expected outcome**:
- The viewer switches to the target scene
- The transition occurs without a page reload
- The Sidebar highlights the floor of the displayed scene — the same floor for intra-floor links, and the *target* floor for cross-floor links (e.g. `2-lg---3` → `5-ug---1` activates UG)

### Scenario 4: Viewer controls

**Steps**:
1. Click autorotate toggle → observe rotation start/stop
2. Click fullscreen toggle → observe fullscreen expansion/restore
3. Click directional controls (up/down/left/right/in/out) → observe view change
4. Repeat on a narrow mobile viewport (resize browser or use device tools)

**Expected outcome**:
- Each control produces its expected effect
- Controls work on both desktop and mobile viewports
- Controls are keyboard operable with visible focus states

### Scenario 5: Rapid floor switching (last selection wins)

**Steps**:
1. With the Sidebar open, click two or three floor buttons in quick succession (e.g. 4F → 9F → LG)
2. Wait for loading to settle

**Expected outcome**:
- The last clicked floor's first scene is the one displayed
- The Sidebar highlight matches the displayed scene
- No page reload occurs; no JavaScript errors in the console

### Scenario 6: Missing-tile placeholder

**Steps**:
1. Simulate a scene without tiles (e.g. temporarily rename one scene directory under `public/tiles/`) and select that floor/scene
2. Observe the viewer

**Expected outcome**:
- A visible placeholder/empty-state message is shown instead of a blank or broken viewer
- The rest of the UI remains usable so another floor can be selected

### Scenario 7: Full button-sync sweep (Integration Rule 1)

**Steps**:
1. With the Sidebar open, open the viewer's scene list (or follow link hotspots) and step through scenes across different floors — e.g. an LG scene that is not LG's first scene (`2-lg---3`), then a non-first 4F scene (`16-4f---11`)
2. After each scene change, inspect the Sidebar
3. Run the automated coverage test

```bash
cd apps/frontend && npx vitest run src/tests/floorSceneMap.test.js
```

**Expected outcome**:
- Every displayed scene activates the button matching its id's floor code — all `*-lg-*` scenes → LG, all `*-5m-*` scenes → 5M, and so on (not just the nine designated first scenes)
- Exactly one button is active at any time; the location name appears only on it (Rule 2)
- The automated test resolves all 54 scene ids in `APP_DATA` to a floor button (0 unresolvable)
- No page reload, no console errors

### Scenario 8: Tests and lint

**Steps**:
1. Run `npm run test` from the repo root (backend + frontend Vitest)
2. Run `npm run lint` (ESLint frontend)

**Expected outcome**:
- All tests pass (63 total: backend 8, frontend 55 as of 2026-11-07)
- ESLint reports no errors (including the frozen `Marzipano.jsx`)

**Tooling status (verified 2026-11-07)**: both former Principle III gaps are resolved — Vitest/jsdom/Testing Library/supertest are installed and `npm run test` passes; `npx eslint .` is clean.

## References

- Feature specification: `spec.md`
- Data model: `data-model.md`
- UI interaction contract: `contracts/ui-interaction.md`
- Research decisions: `research.md`
- Sidebar button / panorama ID guide (authoritative first-scene ids + Rules #1/#2): `docs/prompts/frontend-prompts/sidebar_buttons.md`
- Implementation tasks: `tasks.md`
