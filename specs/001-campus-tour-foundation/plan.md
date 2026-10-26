# Implementation Plan: CIIT Virtual Campus Tour Foundation

**Branch**: `001-campus-tour-foundation` | **Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-campus-tour-foundation/spec.md`

## Summary

Deliver a runnable foundation for the CIIT Virtual Campus Tour: an interactive 360-degree
panorama viewer wrapped as a React component, sidebar navigation, per-room galleries, narrated
descriptions with transcripts, responsive and keyboard-accessible controls, and migrated
panorama assets. The foundation also establishes the MERN application structure, backend
scaffold, Vitest test setup, dependency-approval process, and reviewed branch workflow.

The tour catalog and media are bundled with the frontend so visitors can explore available
content even when backend-dependent services are unavailable. The backend is scaffolded with
configuration, health checking, error handling, MongoDB connection, and the MVC folders needed
for future user-data features.

## Technical Context

**Language/Version**: JavaScript (ES2023 modules), Node.js 24.x (minimum 22.12 required by
Vitest 5)

**Primary Dependencies**: Express 5.2, Mongoose 9.10, CORS 2.8, dotenv 18.0, cookie-parser 1.4
(to add), jsonwebtoken 9.0; React 19.2, React DOM 19.2, Marzipano 0.10.2 (to add), Vite 8.3

**Storage**: MongoDB via Mongoose for future user data; the tour catalog and media are static
frontend assets in this foundation

**Testing**: Vitest 5 with Supertest 7 for backend HTTP tests; Vitest 5 with Testing Library,
jsdom, and jest-dom for frontend component tests

**Target Platform**: Modern desktop and mobile browsers; Node.js server on Windows, macOS, or
Linux

**Project Type**: Web application (frontend and backend in one repository)

**Performance Goals**: First panorama visible within 5 seconds on typical broadband and within
8 seconds on typical mobile; gesture-to-view response under 100 ms; gallery images lazy-loaded

**Constraints**: No package installation without maintainer approval; no secrets in version
control; explicit CORS allowlist; keyboard-operable controls; reduced-motion support; touch and
mouse parity

**Scale/Scope**: Foundation for a curated catalog of roughly 5-20 campus locations; concurrent
public visitors; user accounts, content administration, analytics, and multilingual narration
are out of scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
| --- | --- | --- |
| MERN stack alignment | PASS | MongoDB/Mongoose, Express, React/Vite, JavaScript ES modules, and Vitest remain the only stack. |
| MVC and application boundaries | PASS | Backend uses `config`, `controllers`, `models`, `routes`, `services`, `tests`, and `utils`; frontend owns all tour UI and assets and never accesses MongoDB. |
| Test-first quality gate | PASS | Backend route/service tests use Vitest and Supertest; frontend behavior tests use Vitest and Testing Library; lint is a completion gate. |
| Security and configuration | PASS | `.env` stays ignored, an `.env.example` is added, CORS uses an explicit origin allowlist, and configuration is validated at startup. |
| Responsive, accessible experience | PASS | All views are designed for desktop and mobile, with keyboard controls, transcripts, alt text, focus states, and reduced-motion handling. |
| Dependency governance | PASS WITH GATE | New packages require approval before installation. See the dependency approval gate below. |
| Reviewed branch workflow | PASS | Contribution guidance requires short-lived branches, pull requests, passing checks, and a protected main branch. |

No constitutional violations require justification. The dependency gate is a process
requirement, not a violation.

## Project Structure

### Documentation (this feature)

```text
specs/001-campus-tour-foundation/
|-- plan.md              # This file
|-- research.md          # Phase 0 research decisions
|-- data-model.md        # Phase 1 domain and catalog model
|-- quickstart.md        # Phase 1 end-to-end validation guide
|-- contracts/
|   |-- content-schema.json   # Tour catalog contract
|   |-- openapi.yaml          # Backend HTTP contract
|   `-- ui-contract.md        # Component, interaction, and accessibility contract
|-- checklists/
|   `-- requirements.md
`-- tasks.md             # Phase 2 output, created by /speckit.tasks
```

### Source Code (repository root)

```text
package.json                         # Root scripts and concurrently (to add)
docs/
|-- tech_stack.md
`-- project_setup.md

apps/backend/
|-- config/
|   |-- db.js
|   `-- env.js
|-- controllers/
|   `-- healthController.js
|-- models/
|   `-- .gitkeep                     # Reserved for future user-data models
|-- routes/
|   `-- healthRoutes.js
|-- services/
|   `-- healthService.js
|-- tests/
|   |-- health.test.js
|   `-- env.test.js
|-- utils/
|   |-- asyncHandler.js
|   `-- errors.js
|-- .env.example
|-- client.rest
|-- index.js
`-- vitest.config.js

apps/frontend/
|-- public/
|   `-- panoramas/                   # Migrated app-files img/tiles content
|-- src/
|   |-- api/
|   |   `-- client.js                # Optional backend health/status calls
|   |-- assets/                      # UI imagery and icons
|   |-- components/
|   |   |-- ErrorBoundary.jsx
|   |   |-- Layout.jsx
|   |   |-- NarrationPlayer.jsx
|   |   |-- PanoramaViewer.jsx
|   |   |-- RoomGallery.jsx
|   |   `-- Sidebar.jsx
|   |-- context/
|   |   `-- TourContext.jsx
|   |-- lib/
|   |   |-- catalog.js               # Loads and validates the migrated catalog
|   |   |-- catalog.json             # Migrated data.js content
|   |   |-- marzipano.js             # Viewer factory and teardown helpers
|   |   `-- normalizeLocation.js
|   |-- tests/
|   |   |-- PanoramaViewer.test.jsx
|   |   |-- Sidebar.test.jsx
|   |   |-- RoomGallery.test.jsx
|   |   |-- NarrationPlayer.test.jsx
|   |   `-- TourContext.test.jsx
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- eslint.config.js
|-- index.html
|-- package.json
|-- vite.config.js
`-- vitest.config.js

CONTRIBUTING.md                      # Branch, PR, and dependency approval workflow
```

**Structure Decision**: Keep the existing `apps/backend` and `apps/frontend` split. The backend
is a conventional MVC Express application with a health endpoint and MongoDB connection. The
frontend owns the tour catalog, panorama media, and all visitor-facing behavior. Tour content is
static in the frontend for this foundation, so a backend outage cannot blank the tour; future
user-data features can add backend models and APIs without changing the tour's asset pipeline.

## Implementation Phases

### Phase A - Repository Foundation and Approval Gate

1. Add a root `package.json` with `dev`, `setup`, `test`, `lint`, and `build` scripts.
2. Request approval before adding `marzipano`, `cookie-parser`, `concurrently`, and the frontend
   test libraries (`@testing-library/react`, `@testing-library/jest-dom`, `jsdom`,
   `@testing-library/user-event`).
3. Add `CONTRIBUTING.md` covering branch-per-change, pull request review, protected `main`,
   dependency approval, and required checks.
4. Add backend `.env.example`; ignore secrets, `.env` files, `client.rest`, dependency caches, build
   output, logs, editor state, coverage, and machine-local tool state while tracking shareable
   `.opencode/` and `.specify/` configuration.

### Phase B - Backend Scaffold

1. Add `index.js`, `config/env.js`, `config/db.js`, and the MVC folders.
2. Implement a health endpoint through route, controller, and service layers.
3. Add centralized error handling and a not-found response.
4. Write failing tests first for environment validation and the health endpoint, then implement.

### Phase C - Content Migration

1. Locate any uploaded `app-files` folder and inventory `img`, `titles`, `vendor`, `data.js`,
   `index.html`, `index.js`, and `style.css`.
2. Move panorama images and tiles to `apps/frontend/public/panoramas/` using location slugs.
3. Convert `data.js` into `src/lib/catalog.json` and validate it against the content schema.
4. Replace `vendor` scripts with the approved Marzipano package; do not copy vendored duplicates.
5. Port `index.html`, `index.js`, and `style.css` behavior into React components and scoped CSS.
6. Remove references to the original prototype location and confirm no orphaned files remain.

### Phase D - Frontend Tour Experience

1. Build `TourContext` for current location, sidebar state, gallery state, narration state, and
   loading/error state.
2. Build `PanoramaViewer` with a React ref and an effect that creates the Marzipano viewer,
   switches scenes, and destroys the viewer on cleanup, including React StrictMode remounts.
3. Build `Sidebar` with all locations, current-location indication, keyboard navigation, and
   unavailable-location messaging.
4. Build `RoomGallery` with lazy-loaded images, captions, and alt text.
5. Build `NarrationPlayer` with play, pause, resume, transcript, and blocked-autoplay fallback.
6. Add responsive layout, touch/mouse parity, focus styles, and reduced-motion handling.

### Phase E - Verification and Handoff

1. Run backend and frontend tests with Vitest and fix failures.
2. Run frontend ESLint and fix all errors.
3. Execute the quickstart scenarios on desktop and mobile viewports.
4. Confirm dependency approval records, branch workflow documentation, and a runnable main
   branch.

## Dependency Approval Gate

The following packages were reviewed on 2026-10-26. Runtime dependencies and Marzipano were
approved; test tooling and `cookie-parser` remain deferred:

| Package | Layer | Why Needed | Status |
| --- | --- | --- | --- |
| `marzipano` | Frontend runtime | 360-degree panorama rendering | Approved |
| `cookie-parser` | Backend runtime | Cookie handling required by the constitution before auth work | Deferred |
| `concurrently` | Root dev | Single-command frontend and backend development | Approved |
| `@testing-library/react` | Frontend dev | Component behavior tests | Deferred |
| `@testing-library/jest-dom` | Frontend dev | Accessible DOM assertions | Deferred |
| `@testing-library/user-event` | Frontend dev | Realistic keyboard and pointer tests | Deferred |
| `jsdom` | Frontend dev | Browser environment for Vitest | Deferred |

## Complexity Tracking

No constitutional violations or unjustified complexity were identified.
