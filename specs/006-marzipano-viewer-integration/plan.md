# Implementation Plan: Marzipano Panorama Viewer Integration

**Branch**: `006-marzipano-viewer-integration` | **Date**: 2026-11-06 | **Re-planned**: 2026-11-07 | **Spec**: `specs/006-marzipano-viewer-integration/spec.md`

**Working branch (current)**: `fix/sidebar-buttons` (sidebar sync work for Integration Rules #1/#2)

**Input**: Feature specification from `/specs/006-marzipano-viewer-integration/spec.md` (clarified 2026-11-07: scene→floor sync resolution + unresolvable-floor fallback)

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Integrate the Marzipano 360-degree panorama viewer into the React frontend so campus visitors can explore the Glitch Tower campus floor by floor. The viewer loads the Lower Ground first scene (`0-lg---1`) on initial load, switches scenes via Sidebar floor buttons, navigates interconnected scenes via link hotspots, and provides standard viewer controls (autorotate, fullscreen, scene list, directional). Marzipano.jsx contains the complete viewer logic; PanoramaViewer.jsx renders it as a React component; global styles are migrated to Tailwind CSS in PanoramaViewer.jsx or index.css. No new npm packages are required; vendor assets already exist under `vendor/`.

**Sidebar sync (clarified 2026-11-07, Integration Rules #1/#2)**: every displayed scene syncs back to its Sidebar floor button by parsing the floor code embedded in the scene id (`0-lg---1` → LG), so all 54 scenes — not just the nine designated first scenes — move the highlight; the active button alone displays its location name; an unresolvable floor code keeps the previous button active.

## Technical Context

**Language/Version**: JavaScript (ES Modules)

**Primary Dependencies**: react, react-dom (frontend); Marzipano vendor library loaded globally via `<script>` tags in `index.html` (`vendor/marzipano.js`, `vendor/bowser.min.js`, `vendor/screenfull.min.js` — no npm package); Vitest (testing — **installed and executable**: `vitest` ^5.1.0 + `jsdom` ^29 + Testing Library in `apps/frontend`, `vitest` ^5.0.2 + `supertest` in `apps/backend`)

**Storage**: N/A — panoramic cube tiles are static assets served from `public/tiles/` (54 scene dirs, ~709 MB, committed to git per clarification 2026-11-06); control/hotspot icons from `public/img/`; placeholder from `public/panoramas/placeholder/`; no database involvement

**Testing**: Vitest tests authored under `apps/frontend/src/tests/` (7 files, 55 tests, incl. `PanoramaViewer.test.jsx`, `Sidebar.test.jsx`, `floorSceneMap.test.js`) — **executable**: root `npm run test` runs backend (2 files, 8 tests) + frontend (7 files, 55 tests); all 63 pass as of 2026-11-07

**Target Platform**: Web (desktop and mobile viewports)

**Project Type**: Web application

**Performance Goals**: Initial view remains interactive on constrained mobile connections; panoramas lazy-loaded or deferred (Marzipano fetches tiles per zoom level on demand); viewer initializes without JavaScript errors

**Constraints**: MERN stack alignment (React + Vite frontend); no new npm packages without maintainer approval; Marzipano source folders placed under frontend and converted from `.js` to React-compatible `.jsx`; responsive and accessible (desktop + mobile, keyboard operable, visible focus states per SC-005); `reset.min.css` MUST NOT be loaded (FR-010 — Tailwind base is the sole reset); rapid floor switching resolves with last-selection-wins (FR-013); info hotspots out of scope (all scenes empty); Sidebar sync resolves the floor from the scene id's floor code (FR-006, clarification 2026-11-07)

**Scale/Scope**: 9 floors (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F); 54 scenes; single-page tour

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Assessment | Status |
|-----------|-------------|------------|--------|
| I. MERN Stack Alignment | React + Vite frontend, JavaScript ES Modules, Vitest testing | Frontend already uses React + Vite with ES Modules; no alternative stack introduced; Vitest is the declared test framework and is installed/executable (see Testing above) | PASS |
| II. MVC Separation | Frontend owns UI/panorama; Marzipano `.js` converted to `.jsx` under frontend | Marzipano.jsx already exists as React-compatible `.jsx` under `src/components/`; PanoramaViewer.jsx is the frontend viewer component; no backend/database involvement | PASS |
| III. Test-First Quality Gate | Vitest tests written and observed failing before implementation; frontend ESLint clean | Tests execute and pass: root `npm run test` → backend 8/8 + frontend 55/55 (incl. `floorSceneMap.test.js` covering all 54 scene ids). `npx eslint .` reports 0 errors; `Marzipano.jsx` (frozen file) lints with 0 errors/0 warnings | **PASS** (both former gaps resolved 2026-11-07) |
| IV. Security, Secrets, Configuration | No secrets in version control; no hardcoded credentials | Feature requires no authentication, secrets, or environment configuration; the ~709 MB tile set contains only static images | PASS |
| V. Responsive, Accessible Immersive Experience | Draggable 360 view, sidebar navigation, keyboard operable, desktop + mobile | Viewer supports drag, keyboard arrow keys, directional controls; Sidebar provides floor navigation; SC-005 now explicitly measures keyboard operability, visible focus, and alt text | PASS |

**Gate gaps from the 2026-11-06 plan — both RESOLVED (verified 2026-11-07):**

1. ~~ESLint error `Marzipano.jsx:436` (`no-redeclare`)~~ → `npx eslint src/components/Marzipano.jsx --format json` reports `errorCount: 0`; full `npx eslint .` is clean.
2. ~~Vitest tooling not installed~~ → `vitest` ^5.1.0 (frontend) and ^5.0.2 (backend) with `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `supertest` are declared and installed; `npm run test` passes 63/63.

No constitution violations remain; no complexity waiver is required.

## Project Structure

### Documentation (this feature)

```text
specs/006-marzipano-viewer-integration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
├── public/
│   ├── tiles/           # Panoramic cube tiles, 54 scene dirs (e.g. tiles/0-lg---1/...), ~709 MB, committed to git
│   ├── img/             # Viewer control + hotspot icons (zoom-in.png, link.png, ...)
│   └── panoramas/
│       └── placeholder/equirect.svg  # Fallback image for scenes without tiles
├── vendor/              # marzipano.js, bowser.min.js, screenfull.min.js (loaded via index.html script tags)
├── index.html           # Vendor <script> tags; NO reset.min.css link (FR-010)
├── src/
│   ├── components/
│   │   ├── Marzipano.jsx    # Complete Marzipano viewer logic (existing, FROZEN — do not change)
│   │   ├── PanoramaViewer.jsx  # React viewer: DOM skeleton, dynamic import() of Marzipano.jsx, onSceneChange sync callback (Rule 1)
│   │   ├── Layout.jsx       # handleSceneChange: scene id → floor → location select (Rule 1 sync)
│   │   └── Sidebar.jsx      # Floor buttons; active button shows location name (Rule 2)
│   ├── lib/
│   │   ├── data.js          # APP_DATA scene definitions (existing, 54 scenes)
│   │   ├── floorSceneMap.js # FLOOR_SEQUENCE, FLOOR_SCENE_MAP, getFloorForSceneId (floor-code parsing), getSceneIdForFloor
│   │   └── marzipano.js     # Marzipano helper utilities (existing)
│   ├── index.css            # @layer base (Marzipano globals) + @layer components (hotspot styles) + Tailwind
│   ├── tests/
│   │   ├── PanoramaViewer.test.jsx  # Vitest viewer tests (executable)
│   │   ├── floorSceneMap.test.js    # Rule 1 sync coverage: all 54 scene ids resolve to a floor button
│   │   └── ...               # Sidebar, TourContext, RoomGallery, NarrationPlayer, catalog tests
│   ├── App.jsx              # App root (existing)
│   └── main.jsx             # Entry point (existing)
└── (no separate tests/ dir — tests live in src/tests/)
```

**Structure Decision**: Web application structure under `apps/frontend/` (Option 2). The repository already uses `apps/frontend` with `src/components/`, `src/lib/`, `src/tests/`, `public/`. Marzipano source folders are placed under the frontend per Constitution Principle II. No backend changes are required — the feature is entirely frontend, serving static tile assets.

## Complexity Tracking

> No design-complexity deviations. The two Principle III gaps recorded in the 2026-11-06 plan (frozen-file lint error, deferred Vitest tooling) were pre-existing environment constraints and are now **resolved** (verified 2026-11-07) — no complexity waiver is needed. The 2026-11-07 sync design (floor-code parsing) is a single pure helper in `src/lib/floorSceneMap.js`; it introduces no new dependency, abstraction layer, or deviation from the KISA syntax rules in `AGENTS.md`.

## Phase 0: Outline & Research

Extract unknowns from Technical Context → none (all values resolved). No `NEEDS CLARIFICATION` markers remain in the spec.

Research tasks (completed; see `research.md`):
- Marzipano vendor library integration pattern with React → global `<script>` + `window.Marzipano`, dynamic `import()` of `Marzipano.jsx` after DOM mount
- Lazy-loading panoramic tile assets on mobile → on-demand per-level tile fetch from `public/tiles/` (no preloading)
- Keyboard-accessible 360-degree viewer control patterns → focusable container + focusable control buttons with visible focus states
- CSS layering / reset strategy → `reset.min.css` removed; Marzipano globals in `@layer base`, hotspot styles in `@layer components` (unlayered CSS would otherwise beat every Tailwind layer)
- **Scene → floor resolution for Sidebar sync (clarified 2026-11-07)** → parse the floor code from the scene id (`{index}-{floorCode}---{n}`) instead of matching only the nine first-scene ids, so all 54 scenes sync; unresolvable codes keep the previous highlight

## Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md` (exists; updated 2026-11-07):
   - Scene (id, name, levels, faceSize, initialViewParameters, linkHotspots, infoHotspots)
   - Floor (label, scenes, designated first scene id — corrected to match the ID guide in `docs/prompts/frontend-prompts/sidebar_buttons.md`)
   - Floor↔Scene sync mapping (`FLOOR_SEQUENCE`, `FLOOR_SCENE_MAP`, floor-code parsing rule, keep-previous fallback)
   - APP_DATA (scene collection, settings)
   - Link hotspot (target id, yaw, pitch, rotation) — cross-floor targets move the highlight to the target scene's floor
   - Info hotspot (title, text, yaw, pitch) — **out of scope** (all scenes empty; glossary only)

2. **Define interface contracts** → `/contracts/` (exists; updated 2026-11-07): frontend-only feature, no external API/CLI/library interfaces. UI contract in `contracts/ui-interaction.md`: C1 Sidebar floor click → scene switch (last-selection-wins per FR-013), C2 link hotspot click → scene switch (highlight follows target floor), C3 viewer controls (+ keyboard/focus per SC-005), C4 error/empty-state handling, **C5 scene change → Sidebar sync for all 54 scenes (Rule 1, FR-006/SC-007)**, **C6 active button shows the location name only (Rule 2)**.

3. **Create quickstart validation guide** → `quickstart.md` (exists; updated 2026-11-07):
   - Prerequisites: vendor scripts present, tiles under `public/tiles/`, APP_DATA loaded, `floorSceneMap.js` present, dev server running
   - Setup commands: `npm install`, `npm run setup`, `npm run dev`
   - Validation scenarios 1–8 (initial load, floor switching, link hotspots incl. cross-floor sync, controls, rapid switching, missing-tile placeholder, **Rule 1 full-sync sweep across all 54 scenes**, tests/lint)
   - Expected outcomes: LG first scene loads on open; each floor button switches scene; every displayed scene moves the highlight to its floor button; the active button alone shows its location name; no console errors

**Output**: `data-model.md`, `contracts/ui-interaction.md`, `quickstart.md` — all updated.

**Re-evaluate Constitution Check post-design**: Principles I, II, IV, V remain PASS. Principle III now reads **PASS** — both former gate gaps (frozen-file lint error, deferred Vitest tooling) are resolved and verified: `npm run test` → 63/63 passing, `npx eslint .` → 0 errors. The sync design adds no new dependencies, no backend surface, and no accessibility regression (the active-button location name is also exposed in the button's accessible name).

## Mandatory Post-Execution Hooks

No `.specify/extensions.yml` exists → no `hooks.before_plan` / `hooks.after_plan` to dispatch.

## Completion Report

- **Branch**: `006-marzipano-viewer-integration` (spec/feature branch) — current working branch: `fix/sidebar-buttons`
- **IMPL_PLAN**: `specs/006-marzipano-viewer-integration/plan.md`
- **Generated/updated artifacts**: `plan.md` (updated 2026-11-07), `research.md` (Phase 0 — sync-resolution decision added), `data-model.md` (Phase 1 — sync mapping + corrected first-scene ids), `contracts/ui-interaction.md` (Phase 1 — C5/C6 added), `quickstart.md` (Phase 1 — full-sync scenario added)
- **Constitution Check**: Principles I–V all PASS; the two former Principle III gaps (frozen-file lint error, deferred Vitest tooling) verified resolved — `npm run test` 63/63, `npx eslint .` clean
- **Suggested next command**: `/speckit.tasks`
