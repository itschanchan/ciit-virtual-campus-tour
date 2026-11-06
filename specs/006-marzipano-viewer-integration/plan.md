# Implementation Plan: Marzipano Panorama Viewer Integration

**Branch**: `006-marzipano-viewer-integration` | **Date**: 2026-11-06 | **Spec**: `specs/006-marzipano-viewer-integration/spec.md`

**Input**: Feature specification from `/specs/006-marzipano-viewer-integration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Integrate the Marzipano 360-degree panorama viewer into the React frontend so campus visitors can explore the Glitch Tower campus floor by floor. The viewer loads the Lower Ground first scene (`0-lg---1`) on initial load, switches scenes via Sidebar floor buttons, navigates interconnected scenes via link hotspots, and provides standard viewer controls (autorotate, fullscreen, scene list, directional). Marzipano.jsx contains the complete viewer logic; PanoramaViewer.jsx renders it as a React component; global styles are migrated to Tailwind CSS in PanoramaViewer.jsx or index.css. No new npm packages are required; vendor assets already exist under `vendor/`.

## Technical Context

**Language/Version**: JavaScript (ES Modules)

**Primary Dependencies**: react, react-dom (frontend); Marzipano vendor library loaded globally via `<script>` tags in `index.html` (`vendor/marzipano.js`, `vendor/bowser.min.js`, `vendor/screenfull.min.js` — no npm package); Vitest (testing, **not yet installed** — tooling deferred per `AGENTS.md`)

**Storage**: N/A — panoramic cube tiles are static assets served from `public/tiles/` (54 scene dirs, ~709 MB, committed to git per clarification 2026-11-06); control/hotspot icons from `public/img/`; placeholder from `public/panoramas/placeholder/`; no database involvement

**Testing**: Vitest tests authored under `apps/frontend/src/tests/` (exist, including `PanoramaViewer.test.jsx`) — currently non-executable until Vitest tooling is approved and installed

**Target Platform**: Web (desktop and mobile viewports)

**Project Type**: Web application

**Performance Goals**: Initial view remains interactive on constrained mobile connections; panoramas lazy-loaded or deferred (Marzipano fetches tiles per zoom level on demand); viewer initializes without JavaScript errors

**Constraints**: MERN stack alignment (React + Vite frontend); no new npm packages without maintainer approval; Marzipano source folders placed under frontend and converted from `.js` to React-compatible `.jsx`; responsive and accessible (desktop + mobile, keyboard operable, visible focus states per SC-005); `reset.min.css` MUST NOT be loaded (FR-010 — Tailwind base is the sole reset); rapid floor switching resolves with last-selection-wins (FR-013); info hotspots out of scope (all scenes empty)

**Scale/Scope**: 9 floors (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F); 54 scenes; single-page tour

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Assessment | Status |
|-----------|-------------|------------|--------|
| I. MERN Stack Alignment | React + Vite frontend, JavaScript ES Modules, Vitest testing | Frontend already uses React + Vite with ES Modules; no alternative stack introduced; Vitest is the declared test framework (see Gate III gap below) | PASS |
| II. MVC Separation | Frontend owns UI/panorama; Marzipano `.js` converted to `.jsx` under frontend | Marzipano.jsx already exists as React-compatible `.jsx` under `src/components/`; PanoramaViewer.jsx is the frontend viewer component; no backend/database involvement | PASS |
| III. Test-First Quality Gate | Vitest tests written and observed failing before implementation; frontend ESLint clean | Tests exist under `src/tests/` (incl. `PanoramaViewer.test.jsx`) but cannot execute — Vitest not installed (deferred tooling). ESLint reports exactly 1 error, pre-existing in `Marzipano.jsx:436` (`no-redeclare`), a file explicitly frozen by the migration rule. All other files lint clean | **CONDITIONAL — justified gaps, see below** |
| IV. Security, Secrets, Configuration | No secrets in version control; no hardcoded credentials | Feature requires no authentication, secrets, or environment configuration; the ~709 MB tile set contains only static images | PASS |
| V. Responsive, Accessible Immersive Experience | Draggable 360 view, sidebar navigation, keyboard operable, desktop + mobile | Viewer supports drag, keyboard arrow keys, directional controls; Sidebar provides floor navigation; SC-005 now explicitly measures keyboard operability, visible focus, and alt text | PASS |

**Known Gate Gaps (justified) — Principle III blocks merge until resolved:**

1. **ESLint error `Marzipano.jsx:436` (`no-redeclare`)** — pre-existing in a file the migration rule freezes ("Do not change anything inside `Marzipano.jsx`"), so it cannot be fixed without maintainer approval. *Resolution path*: obtain maintainer approval for a one-line fix (rename the duplicate `eventList`) or a scoped `eslint-disable-next-line no-redeclare` comment on line 436.
2. **Vitest not installed** — `vitest` is absent from `apps/frontend/package.json`; `npm run test` fails with "vitest: not found". Deferred per `AGENTS.md` ("requires approved test tooling"). *Resolution path*: maintainer approves installing `vitest` (+ `jsdom`, Testing Library), then run the existing `src/tests/` suite and add the FR-013 regression test.

Complexity Tracking entry required only if either gap is waived without a fix; otherwise no constitution violations.

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
│   │   ├── PanoramaViewer.jsx  # React viewer: DOM skeleton, then dynamic import() of Marzipano.jsx in useEffect
│   │   └── Sidebar.jsx      # Floor navigation buttons (existing, integrated with viewer)
│   ├── lib/
│   │   ├── data.js          # APP_DATA scene definitions (existing)
│   │   └── marzipano.js     # Marzipano helper utilities (existing)
│   ├── index.css            # @layer base (Marzipano globals) + @layer components (hotspot styles) + Tailwind
│   ├── tests/
│   │   ├── PanoramaViewer.test.jsx  # Vitest viewer tests (exist; non-executable until Vitest installed)
│   │   └── ...               # Sidebar, TourContext, RoomGallery, NarrationPlayer, catalog tests
│   ├── App.jsx              # App root (existing)
│   └── main.jsx             # Entry point (existing)
└── (no separate tests/ dir — tests live in src/tests/)
```

**Structure Decision**: Web application structure under `apps/frontend/` (Option 2). The repository already uses `apps/frontend` with `src/components/`, `src/lib/`, `src/tests/`, `public/`. Marzipano source folders are placed under the frontend per Constitution Principle II. No backend changes are required — the feature is entirely frontend, serving static tile assets.

## Complexity Tracking

> No design-complexity deviations. The two Principle III gaps (frozen-file lint error, deferred Vitest tooling) are pre-existing environment/tooling constraints recorded under Constitution Check with resolution paths — they require no complexity waiver unless a maintainer chooses to ship without fixing them.

## Phase 0: Outline & Research

Extract unknowns from Technical Context → none (all values resolved). No `NEEDS CLARIFICATION` markers remain in the spec.

Research tasks (completed; see `research.md`):
- Marzipano vendor library integration pattern with React → global `<script>` + `window.Marzipano`, dynamic `import()` of `Marzipano.jsx` after DOM mount
- Lazy-loading panoramic tile assets on mobile → on-demand per-level tile fetch from `public/tiles/` (no preloading)
- Keyboard-accessible 360-degree viewer control patterns → focusable container + focusable control buttons with visible focus states
- CSS layering / reset strategy → `reset.min.css` removed; Marzipano globals in `@layer base`, hotspot styles in `@layer components` (unlayered CSS would otherwise beat every Tailwind layer)

## Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md` (exists; updated):
   - Scene (id, name, levels, faceSize, initialViewParameters, linkHotspots, infoHotspots)
   - Floor (label, scenes, designated first scene id)
   - APP_DATA (scene collection, settings)
   - Link hotspot (target id, yaw, pitch, rotation)
   - Info hotspot (title, text, yaw, pitch) — **out of scope** (all scenes empty; glossary only)

2. **Define interface contracts** → `/contracts/` (exists): frontend-only feature, no external API/CLI/library interfaces. UI contract documented in `contracts/ui-interaction.md`: C1 Sidebar floor click → scene switch (last-selection-wins per FR-013), C2 link hotspot click → scene switch, C3 viewer controls (+ keyboard/focus per SC-005), C4 error/empty-state handling.

3. **Create quickstart validation guide** → `quickstart.md` (exists; updated):
   - Prerequisites: vendor scripts present, tiles under `public/tiles/`, APP_DATA loaded, dev server running
   - Setup commands: `npm install`, `npm run setup`, `npm run dev`
   - Validation scenarios 1–7 (initial load, floor switching, link hotspots, controls, rapid switching, missing-tile placeholder, tests/lint)
   - Expected outcomes: LG first scene loads on open; each floor button switches scene; link hotspots navigate; controls respond; no console errors

**Output**: `data-model.md`, `contracts/ui-interaction.md`, `quickstart.md` — all generated.

**Re-evaluate Constitution Check post-design**: Principles I, II, IV, V remain PASS after design. Principle III remains CONDITIONAL with the two justified gaps recorded above (frozen-file lint error; Vitest tooling deferred) — both must be resolved before merge, neither is introduced by this feature's design.

## Mandatory Post-Execution Hooks

No `.specify/extensions.yml` exists → no `hooks.after_plan` to dispatch.

## Completion Report

- **Branch**: `006-marzipano-viewer-integration`
- **IMPL_PLAN**: `specs/006-marzipano-viewer-integration/plan.md`
- **Generated/updated artifacts**: `plan.md` (updated), `research.md` (Phase 0), `data-model.md` (Phase 1), `contracts/ui-interaction.md` (Phase 1), `quickstart.md` (Phase 1)
- **Known gate gaps**: ESLint `Marzipano.jsx:436` (frozen file) and missing Vitest tooling — both justified, both block merge until resolved (Constitution Principle III)
- **Suggested next command**: `/speckit.tasks`
