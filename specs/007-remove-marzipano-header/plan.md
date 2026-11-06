# Implementation Plan: Remove Marzipano Header

**Branch**: `007-remove-marzipano-header` | **Date**: 2026-11-06 | **Spec**: `specs/007-remove-marzipano-header/spec.md`

**Input**: Feature specification from `/specs/007-remove-marzipano-header/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Remove the Marzipano header bar (title bar), hamburger button (scene list toggle ☰), fullscreen button, and autorotate toggle from the top of the panorama viewer so the 360-degree campus scene fills the full available vertical space, making the tour more immersive — especially on narrow mobile viewports. The change is confined to `PanoramaViewer.jsx` (remove the `#titleBar` div; hide `#sceneListToggle`, `#fullscreenToggle`, and `#autorotateToggle` with CSS). No backend changes, no new dependencies, and no changes to scene switching, floor navigation, link hotspots, or remaining viewer controls (directional view controls).

## Technical Context

**Language/Version**: JavaScript (ES Modules)

**Primary Dependencies**: react, react-dom (frontend); Marzipano vendor library loaded globally via `<script>` tags in `index.html` (`vendor/marzipano.js`, `vendor/bowser.min.js`, `vendor/screenfull.min.js` — no npm package); Vitest declared test framework but not yet installed (deferred per `AGENTS.md`)

**Storage**: N/A — static assets only (panoramic tiles under `public/tiles/`, icons under `public/img/`); no database involvement

**Testing**: Vitest tests authored under `apps/frontend/src/tests/` (incl. `PanoramaViewer.test.jsx`) — currently non-executable until Vitest tooling is approved and installed

**Target Platform**: Web (desktop and mobile viewports)

**Project Type**: Web application

**Performance Goals**: Scene fills full viewport height on load; viewer initializes without JavaScript errors; initial view remains interactive on constrained mobile connections

**Constraints**: MERN stack alignment (React + Vite frontend); no new npm packages without maintainer approval; responsive and accessible (desktop + mobile, keyboard operable, visible focus states per SC-003/SC-004); `reset.min.css` MUST NOT be loaded (Tailwind base is the sole reset); no changes to scene switching, floor navigation, or link hotspots; scene list remains accessible via Sidebar even though hamburger button is removed

**Scale/Scope**: Single component edit (`apps/frontend/src/components/PanoramaViewer.jsx`); remove header bar + hamburger button + fullscreen button; no new screens, entities, or services

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Assessment | Status |
|-----------|-------------|------------|--------|
| I. MERN Stack Alignment | React + Vite frontend, JavaScript ES Modules, Vitest testing | Change stays within React + Vite frontend using ES Modules; no alternative stack introduced; Vitest remains the declared test framework | PASS |
| II. MVC Separation | Frontend owns UI/panorama; strict split between `apps/backend` and `apps/frontend` | Edit is confined to `apps/frontend/src/components/PanoramaViewer.jsx`; no backend/database involvement | PASS |
| III. Test-First Quality Gate | Vitest tests written and observed failing before implementation; frontend ESLint clean | Existing `PanoramaViewer.test.jsx` present but non-executable (Vitest deferred per AGENTS.md); this change introduces no new lint violations if ESLint passes on the edited file | **CONDITIONAL — justified gaps (deferred Vitest tooling)** |
| IV. Security, Secrets, Configuration | No secrets in version control; no hardcoded credentials | Feature requires no authentication, secrets, or environment configuration | PASS |
| V. Responsive, Accessible Immersive Experience | Desktop + mobile, keyboard operable, visible focus states, meaningful alt text | Header and top-button removal must not remove keyboard operability or visible focus states of remaining controls (directional view controls); scene list remains accessible via Sidebar; SC-003/SC-004 measure remaining controls and scene identification | PASS |

**Known Gate Gaps (justified)**:

1. **Vitest not installed** — `vitest` is absent from `apps/frontend/package.json`; `npm run test` fails with "vitest: not found". Deferred per `AGENTS.md`. *Resolution path*: maintainer approves installing `vitest` (+ `jsdom`, Testing Library), then run the existing `src/tests/` suite. No new test introduced by this feature's design; existing `PanoramaViewer.test.jsx` covers viewer behavior.

**Complexity Tracking**

> No design-complexity deviations. The Principle III gap (deferred Vitest tooling) is a pre-existing environment constraint recorded above — it requires no complexity waiver unless a maintainer chooses to ship without fixing it.

## Project Structure

### Documentation (this feature)

```text
specs/007-remove-marzipano-header/
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
│   ├── tiles/           # Panoramic cube tiles (static assets, unchanged)
│   └── img/             # Viewer control icons (unchanged)
├── vendor/              # marzipano.js, bowser.min.js, screenfull.min.js (unchanged)
├── index.html           # Vendor <script> tags (unchanged)
├── src/
│   ├── components/
│   │   ├── Marzipano.jsx    # Complete Marzipano viewer logic (existing, unchanged)
│   │   ├── PanoramaViewer.jsx  # React viewer — REMOVE `#titleBar` header div; HIDE `#sceneListToggle`, `#fullscreenToggle`, `#autorotateToggle` with CSS (kept in DOM for frozen Marzipano.jsx); remaining controls (directional) stay visible
│   │   └── Sidebar.jsx      # Floor navigation buttons (existing, unchanged — scene identification remains here; scene list still openable via Sidebar)
│   ├── lib/
│   │   └── data.js          # APP_DATA scene definitions (existing, unchanged)
│   ├── index.css            # Tailwind + Marzipano globals (existing, unchanged)
│   ├── tests/
│   │   └── PanoramaViewer.test.jsx  # Vitest viewer tests (existing, non-executable until Vitest installed)
│   ├── App.jsx              # App root (existing, unchanged)
│   └── main.jsx             # Entry point (existing, unchanged)
└── (no separate tests/ dir — tests live in src/tests/)
```

**Structure Decision**: Web application structure under `apps/frontend/` (Option 2). The repository already uses `apps/frontend` with `src/components/`, `src/lib/`, `src/tests/`, `public/`. No backend changes are required — the feature is entirely frontend.

## Phase 0: Outline & Research

Extract unknowns from Technical Context → none (all values resolved). No `NEEDS CLARIFICATION` markers remain in the spec.

Research tasks (see `research.md`):
- Confirm the `#titleBar`, `#sceneListToggle`, `#fullscreenToggle`, and `#autorotateToggle` elements are the only top-of-viewer button elements in `PanoramaViewer.jsx` and hiding them does not break layout of remaining controls (directional controls)
- Confirm scene identification remains available via Sidebar floor selection after header and top button removal (FR-003 / SC-004)
- Confirm keyboard operability and visible focus states are preserved on remaining controls after header and top button removal (SC-003, Constitution Principle V)
- Confirm scene list remains openable via Sidebar even though hamburger button is hidden

## Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md` (generated below):
   - Panorama viewer (component rendering 360-degree view and controls)
   - Header bar (top bar being removed)
   - Hamburger button (scene list toggle being removed)
   - Fullscreen button being removed
   - Current scene identification (provided via Sidebar floor selection, outside the removed header and top buttons)

2. **Define interface contracts** → `/contracts/` (generated below): frontend-only feature, no external API/CLI/library interfaces. UI contract notes that removing the header and top buttons does not change existing interaction contracts (Sidebar floor click → scene switch; link hotspot click → scene switch; remaining viewer controls respond; scene list still openable via Sidebar).

3. **Create quickstart validation guide** → `quickstart.md` (generated below):
   - Prerequisites: dev server running, vendor scripts present, tiles under `public/tiles/`
   - Setup commands: `npm install`, `npm run setup`, `npm run dev`
   - Validation scenarios: no header bar/hamburger/fullscreen button on load; scene fills full height; remaining controls operable; current scene identifiable via Sidebar; works on mobile viewport

**Output**: `data-model.md`, `contracts/ui-interaction.md`, `quickstart.md` — all generated.

## Re-evaluate Constitution Check post-design

Principles I, II, IV, V remain PASS after design. Principle III remains CONDITIONAL with the one justified gap recorded above (Vitest tooling deferred) — not introduced by this feature's design, must be resolved before merge.

## Mandatory Post-Execution Hooks

No `.specify/extensions.yml` exists → no `hooks.after_plan` to dispatch.

## Completion Report

- **Branch**: `007-remove-marzipano-header`
- **IMPL_PLAN**: `specs/007-remove-marzipano-header/plan.md`
- **Generated/updated artifacts**: `plan.md` (updated), `research.md` (Phase 0), `data-model.md` (Phase 1), `contracts/ui-interaction.md` (Phase 1), `quickstart.md` (Phase 1)
- **Known gate gaps**: missing Vitest tooling — justified, blocks merge until resolved (Constitution Principle III); not introduced by this feature
- **Suggested next command**: `/speckit.tasks`
