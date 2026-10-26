# Tasks: CIIT Virtual Campus Tour Foundation

**Input**: Design documents from `/specs/001-campus-tour-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Tests are REQUIRED by the project constitution. Write each test task first, confirm it
fails, then implement the corresponding behavior.

**Status (2026-10-26)**: 49 of 64 tasks complete. Open tasks are blocked on approved test tooling,
browser validation, an absent `app-files` content source, or `.opencode` tracking. See
`CONTRIBUTING.md` for the dependency, audit, and constitution records.

**Organization**: Tasks are grouped by user story so each story can be implemented, tested, and
demonstrated independently. Core setup, folder structuring, and repository ignore policy are
completed first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes an exact file path

## Path Conventions

- Backend: `apps/backend/`
- Frontend: `apps/frontend/`
- Feature artifacts: `specs/001-campus-tour-foundation/`
- Root tooling and scripts: repository root and `scripts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the repository structure, ignore policy, tooling, approvals, and
contribution process before any feature code is written.

- [X] T001 Create the backend and frontend directory tree from `plan.md` with `.gitkeep` files in empty folders: `apps/backend/config/`, `apps/backend/controllers/`, `apps/backend/models/`, `apps/backend/routes/`, `apps/backend/services/`, `apps/backend/tests/`, `apps/backend/utils/`, `apps/frontend/public/panoramas/`, `apps/frontend/src/api/`, `apps/frontend/src/components/`, `apps/frontend/src/context/`, `apps/frontend/src/lib/`, and `apps/frontend/src/tests/`
- [X] T002 [P] Update root `.gitignore` to remove `/.opencode` and `/.specify`, keep dependency caches, build output, logs, editor state, coverage, and `.vitest/`, replace `*.env` with `.env` and `.env.*` plus `!.env.example`, and add `*.key`, `*.pem`, `*.p12`, `*.pfx`, `secrets.*`, `credentials.*`, and `/apps/backend/client.rest`
- [X] T003 [P] Update `.opencode/.gitignore` to keep only `node_modules` and genuinely sensitive local files, and stop ignoring `package.json`, `package-lock.json`, `bun.lock`, and `.gitignore` so shareable tool configuration is tracked
- [X] T004 [P] Confirm `.specify/.gitignore` ignores only `feature.json` and `extensions/*/local-config.yml`; do not ignore `.specify/memory`, `.specify/scripts`, `.specify/templates`, `.specify/workflows`, `.specify/integrations`, `.specify/init-options.json`, or `.specify/integration.json`
- [X] T005 [P] Create `CONTRIBUTING.md` documenting short-lived branches, pull request review, protected `main`, required checks, the dependency approval rule, and the repository tracking policy
- [X] T006 Request maintainer approval for `marzipano`, `cookie-parser`, `concurrently`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `jsdom`, then record the decision in `CONTRIBUTING.md`; do not install unapproved packages
- [X] T007 [P] Create root `package.json` with `setup`, `dev`, `test`, `lint`, `build`, `verify:content`, and `verify:ignore` scripts plus the approved `concurrently` dev dependency
- [X] T008 [P] Update `apps/backend/package.json` with approved dependencies and `dev`, `start`, `test`, and `test:run` scripts
- [X] T009 [P] Update `apps/frontend/package.json` with approved dependencies and `test`, `test:run`, `lint`, and `build` scripts
- [X] T010 Create `apps/backend/vitest.config.js` for Node environment tests and `apps/frontend/vitest.config.js` for jsdom component tests
- [X] T011 Create `apps/frontend/src/tests/setup.js` with `@testing-library/jest-dom` setup and a shared Marzipano mock
- [X] T012 [P] Create `apps/backend/.env.example` with `PORT`, `NODE_ENV`, `MONGODB_URI`, and `CORS_ORIGIN`, and confirm `.env` is ignored while `.env.example` is tracked in `.gitignore`
- [X] T013 [P] Create `.github/pull_request_template.md` with constitution, test, lint, secret, dependency-approval, and ignore-policy checks
- [X] T014 Update `README.md` with root install, `npm run setup`, `.env` copy, `npm run dev`, test, lint, build, branch workflow, and tool-configuration tracking instructions
- [X] T015 Create `scripts/verify-ignore-policy.mjs` that runs `git check-ignore` for `.opencode/package.json`, `.opencode/package-lock.json`, `.specify/memory/constitution.md`, `.specify/scripts`, `.specify/templates`, and `.specify/init-options.json`, and confirms `.env`, `.env.local`, `apps/backend/client.rest`, `.specify/feature.json`, `.specify/extensions/*/local-config.yml`, and `node_modules/` are ignored

**Checkpoint**: Folder structure, ignore policy, and tooling are ready. No user story work begins until Phase 2 is complete.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared catalog, state, backend scaffold, and app shell that every user
story depends on.

**CRITICAL**: Complete this phase before starting any user story phase.

- [X] T016 [P] Write failing catalog contract tests in `apps/frontend/src/tests/catalog.test.js` covering required fields, unique ids and order values, default location, and narration transcript rules from `contracts/content-schema.json`
- [ ] T017 Implement catalog loading and validation in `apps/frontend/src/lib/catalog.js` until `apps/frontend/src/tests/catalog.test.js` passes
- [X] T018 Create a development placeholder equirectangular panorama at `apps/frontend/public/panoramas/placeholder/equirect.svg` and a valid placeholder entry in `apps/frontend/src/lib/catalog.json`
- [X] T019 [P] Write failing TourContext tests in `apps/frontend/src/tests/TourContext.test.jsx` covering initial location, location selection, sidebar toggle, gallery toggle, and narration state transitions
- [ ] T020 Implement `apps/frontend/src/context/TourContext.jsx` with `useReducer` and the actions defined in `contracts/ui-contract.md` until `apps/frontend/src/tests/TourContext.test.jsx` passes
- [X] T021 [P] Implement the Marzipano viewer factory, scene controller, and teardown helper in `apps/frontend/src/lib/marzipano.js`
- [X] T022 [P] Create the optional backend status client in `apps/frontend/src/api/client.js` that calls `/api/health` and never blocks tour rendering
- [X] T023 [P] Write failing backend tests in `apps/backend/tests/env.test.js` and `apps/backend/tests/health.test.js` for required environment validation, `GET /api/health` success, and error response shape
- [ ] T024 Implement environment validation in `apps/backend/config/env.js` until `apps/backend/tests/env.test.js` passes
- [X] T025 Implement the MongoDB connection in `apps/backend/config/db.js` using `MONGODB_URI`, with a clear startup failure when configuration is invalid
- [ ] T026 Implement `apps/backend/services/healthService.js`, `apps/backend/controllers/healthController.js`, `apps/backend/routes/healthRoutes.js`, `apps/backend/utils/asyncHandler.js`, `apps/backend/utils/errors.js`, and wire them in `apps/backend/index.js` until `apps/backend/tests/health.test.js` passes
- [X] T027 Create `apps/frontend/src/components/ErrorBoundary.jsx` and `apps/frontend/src/components/Layout.jsx`, then wrap the app with `TourProvider` and `ErrorBoundary` in `apps/frontend/src/App.jsx`
- [X] T028 [P] Replace `apps/frontend/src/index.css` and `apps/frontend/src/App.css` with base reset, full-height layout, focus-visible styles, and reduced-motion defaults

**Checkpoint**: Foundation is ready. User stories US1-US4 can begin in priority order or in parallel.

---

## Phase 3: User Story 1 - Explore Campus in 360 Degrees (Priority: P1) - MVP

**Goal**: Visitors can open the tour, see the first panorama, and rotate the view with mouse or touch.

**Independent Test**: Open the app on desktop and mobile, load the placeholder location, drag or
swipe in every direction, and confirm the view rotates without page scrolling.

### Tests for User Story 1

- [X] T029 [P] [US1] Write failing PanoramaViewer tests in `apps/frontend/src/tests/PanoramaViewer.test.jsx` covering viewer creation, scene switching, cleanup on unmount, loading state, and error fallback

### Implementation for User Story 1

- [ ] T030 [US1] Implement `apps/frontend/src/components/PanoramaViewer.jsx` with a React ref, Marzipano viewer creation, scene switching, and full teardown until T029 passes
- [X] T031 [US1] Add mouse and touch rotation behavior, accessible location labeling, and keyboard arrow-key rotation to `apps/frontend/src/components/PanoramaViewer.jsx`
- [X] T032 [US1] Add loading, missing-asset, and visitor-friendly error states to `apps/frontend/src/components/PanoramaViewer.jsx`
- [X] T033 [P] [US1] Add viewer layout, responsive sizing, and focus styles in `apps/frontend/src/components/PanoramaViewer.css`
- [X] T034 [US1] Render `PanoramaViewer` with the current location from `TourContext` inside `apps/frontend/src/components/Layout.jsx` and `apps/frontend/src/App.jsx`

**Checkpoint**: User Story 1 is fully functional and is the MVP.

---

## Phase 4: User Story 2 - Navigate Quickly Between Locations (Priority: P2)

**Goal**: Visitors can see every location in a sidebar and jump directly to any room.

**Independent Test**: Open the sidebar, confirm every location is listed, select three
locations, and verify the correct panorama and current-location state each time.

### Tests for User Story 2

- [X] T035 [P] [US2] Write failing Sidebar tests in `apps/frontend/src/tests/Sidebar.test.jsx` covering location rendering, current-location indication, keyboard selection, and unavailable-location messaging

### Implementation for User Story 2

- [ ] T036 [US2] Implement `apps/frontend/src/components/Sidebar.jsx` with sorted locations, selection callbacks, and `aria-current` until T035 passes
- [X] T037 [P] [US2] Add sidebar layout, active state, and mobile drawer styles in `apps/frontend/src/components/Sidebar.css`
- [X] T038 [US2] Integrate `Sidebar` into `apps/frontend/src/components/Layout.jsx` and connect selection to `TourContext`
- [X] T039 [US2] Add the mobile menu toggle, close-on-select behavior, and Escape-key close handling in `apps/frontend/src/components/Layout.jsx` and `apps/frontend/src/components/Sidebar.jsx`

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: User Story 3 - View Room Details and Narration (Priority: P3)

**Goal**: Visitors can browse a room gallery and play narrated descriptions with a transcript.

**Independent Test**: For a room with gallery and narration, open every image, play and pause the
narration, open the transcript, and confirm blocked autoplay shows a fallback message.

### Tests for User Story 3

- [X] T040 [P] [US3] Write failing RoomGallery tests in `apps/frontend/src/tests/RoomGallery.test.jsx` covering image rendering, alt text, empty state, focus movement, and Escape handling
- [X] T041 [P] [US3] Write failing NarrationPlayer tests in `apps/frontend/src/tests/NarrationPlayer.test.jsx` covering play, pause, resume, transcript toggle, and blocked-playback messaging

### Implementation for User Story 3

- [ ] T042 [US3] Implement `apps/frontend/src/components/RoomGallery.jsx` until T040 passes
- [ ] T043 [US3] Implement `apps/frontend/src/components/NarrationPlayer.jsx` until T041 passes
- [X] T044 [P] [US3] Add gallery and narration styles in `apps/frontend/src/components/RoomGallery.css` and `apps/frontend/src/components/NarrationPlayer.css`
- [X] T045 [US3] Integrate gallery and narration controls into `apps/frontend/src/components/Layout.jsx` using the current location from `TourContext`
- [X] T046 [US3] Add focus return, Escape handling, transcript access, and blocked-autoplay guidance across `apps/frontend/src/components/RoomGallery.jsx` and `apps/frontend/src/components/NarrationPlayer.jsx`

**Checkpoint**: User Stories 1, 2, and 3 are independently functional.

---

## Phase 6: User Story 4 - Contribute Safely to the Project Foundation (Priority: P4)

**Goal**: The team can migrate prototype content, run the complete app, and contribute through a
reviewed branch with approved dependencies and a correct ignore policy.

**Independent Test**: Follow `quickstart.md` on a clean machine, run the app, migrate an
`app-files` folder, verify every asset, confirm the ignore policy, create a branch, and open a
pull request.

### Implementation for User Story 4

- [X] T047 [P] [US4] Create `scripts/verify-content.mjs` that validates `apps/frontend/src/lib/catalog.json` against `specs/001-campus-tour-foundation/contracts/content-schema.json` and checks that every referenced asset exists
- [ ] T048 [US4] Locate any uploaded `app-files` folder and migrate `img` and `titles` content into `apps/frontend/public/panoramas/<location-slug>/`
- [ ] T049 [US4] Convert `data.js`, title files, and prototype view settings into `apps/frontend/src/lib/catalog.json`, preserving location names, descriptions, order, initial views, galleries, and narration metadata
- [ ] T050 [US4] Remove the original `app-files` folder and all source references to prototype paths, vendor copies, `index.html`, `index.js`, and `style.css` from `apps/frontend/`
- [X] T051 [US4] Add the `setup`, `verify:content`, and `verify:ignore` implementations to root `package.json` so `npm run setup` installs both apps and both verification scripts run from the root
- [X] T052 [P] [US4] Update `CONTRIBUTING.md` with the final approved dependency list, the migration location rule, the repository tracking policy, and the pull request checklist
- [X] T053 [P] [US4] Update `README.md` and `docs/tech_stack.md` with the final folder structure, approved dependencies, content migration location, tracked tool configuration, ignore policy, and development commands
- [ ] T054 [US4] Execute every scenario in `specs/001-campus-tour-foundation/quickstart.md` and record results in its validation table, including the tool-configuration tracking check
- [ ] T055 [US4] Run `npm run verify:ignore` and `git ls-files .opencode .specify`; confirm shareable `.opencode/` and `.specify/` configuration is tracked, sensitive files and machine-local state are absent from Git tracking, and record the output in `CONTRIBUTING.md`

**Checkpoint**: The repository is ready for the team to branch, review, and extend safely.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Remove starter noise, harden the app, and complete final validation across stories.

- [X] T056 [P] Remove Vite starter UI, unused starter assets, and starter references from `apps/frontend/src/App.jsx`, `apps/frontend/src/assets/`, and `apps/frontend/index.html`, and set the tour title and metadata
- [X] T057 [P] Add final responsive breakpoints, contrast-safe colors, focus-visible states, and reduced-motion rules in `apps/frontend/src/index.css`, `apps/frontend/src/App.css`, and component CSS files
- [X] T058 [P] Add lazy loading for gallery images, deferred loading for Marzipano, and adjacent-panorama preloading in `apps/frontend/src/components/RoomGallery.jsx` and `apps/frontend/src/components/PanoramaViewer.jsx`
- [X] T059 [P] Add the explicit CORS allowlist and safe error responses in `apps/backend/index.js`, `apps/backend/config/env.js`, and `apps/backend/utils/errors.js`
- [X] T060 [P] Run `npm audit` and record accepted advisories or fixes in `CONTRIBUTING.md`
- [ ] T061 Run `npm run test`, `npm run lint`, `npm run build`, and `npm run verify:ignore` from the repository root and fix all failures in `apps/backend/`, `apps/frontend/`, and `scripts/`
- [ ] T062 Run the desktop and mobile quickstart scenarios again and update the validation record in `specs/001-campus-tour-foundation/quickstart.md`
- [X] T063 Review the completed implementation against `.specify/memory/constitution.md` and record any justified deviations in `CONTRIBUTING.md`
- [X] T064 Update `AGENTS.md` with the final setup, test, lint, build, content verification, and ignore-policy verification commands

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately. T001, T002, T003, T004, and T005 establish structure,
  ignore policy, and contribution rules. T006 blocks all dependency installation.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks every user story.
- **User Stories (Phases 3-6)**: Depend on Phase 2. US1 is the MVP. US2 and US3 can proceed in
  parallel after Phase 2 if staffed. US4 can proceed after Phase 2, but its content migration
  should be completed before final end-to-end validation.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories. Uses the placeholder catalog from T018.
- **US2 (P2)**: Uses `TourContext` from Phase 2. Independently testable with mocked context.
- **US3 (P3)**: Uses `TourContext` from Phase 2. Independently testable with mocked media.
- **US4 (P4)**: Uses the Phase 2 scaffold and shell. Content migration and ignore-policy
  verification can run in parallel with US1-US3, but final validation waits for the viewer,
  sidebar, gallery, and narration.

### Within Each User Story

- Tests MUST be written and observed failing before implementation.
- Shared state and helpers precede components.
- Components precede integration.
- Integration precedes quickstart validation.

### Parallel Opportunities

- T001, T002, T003, T004, and T005 can start together.
- After T006 approval, T007, T008, T009, T012, and T013 can run in parallel.
- T016, T019, T021, T022, T023, and T028 can run in parallel during Phase 2.
- After Phase 2, US1, US2, US3, and US4 can be staffed in parallel.
- Within US1, T029 and T033 can run in parallel; T030-T032 share one file and must be sequential.
- Within US2, T035 and T037 can run in parallel.
- Within US3, T040, T041, and T044 can run in parallel.
- Within US4, T047, T052, and T053 can run in parallel.

---

## Parallel Example: User Story 1

```text
Task: "Write failing PanoramaViewer tests in apps/frontend/src/tests/PanoramaViewer.test.jsx"
Task: "Add viewer layout, responsive sizing, and focus styles in apps/frontend/src/components/PanoramaViewer.css"
```

## Parallel Example: User Story 3

```text
Task: "Write failing RoomGallery tests in apps/frontend/src/tests/RoomGallery.test.jsx"
Task: "Write failing NarrationPlayer tests in apps/frontend/src/tests/NarrationPlayer.test.jsx"
Task: "Add gallery and narration styles in apps/frontend/src/components/RoomGallery.css and apps/frontend/src/components/NarrationPlayer.css"
```

## Parallel Example: User Story 4

```text
Task: "Create scripts/verify-content.mjs"
Task: "Update CONTRIBUTING.md with the final approved dependency list and tracking policy"
Task: "Update README.md and docs/tech_stack.md with the final structure, tracking policy, and commands"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup, folder structure, and ignore policy.
2. Complete Phase 2: Foundational catalog, state, backend scaffold, and app shell.
3. Complete Phase 3: User Story 1.
4. Stop and validate the panorama independently on desktop and mobile.
5. Demo the MVP before starting US2-US4.

### Incremental Delivery

1. Setup + Foundational -> runnable foundation with a correct ignore policy.
2. US1 -> panorama MVP.
3. US2 -> sidebar navigation.
4. US3 -> gallery and narration.
5. US4 -> migrated content, verified tracking policy, and safe team workflow.
6. Polish -> performance, security, accessibility, and final validation.

### Parallel Team Strategy

1. Team completes Phase 1 and Phase 2 together.
2. Developer A takes US1 (panorama).
3. Developer B takes US2 (sidebar).
4. Developer C takes US3 (gallery and narration).
5. Developer D takes US4 (migration and repository policy).
6. Integrate at the Phase 7 checkpoint and run the full quickstart.

---

## Notes

- `[P]` tasks touch different files and have no dependency on incomplete tasks.
- `[US1]`-`[US4]` labels map every story task to `spec.md`.
- Tests are required by the constitution and must fail before implementation.
- Do not install any package before T006 approval is recorded.
- Do not begin user story work before Phase 2 is complete.
- `.opencode/` and `.specify/` shareable configuration must be tracked; only secrets, dependency
  caches, and machine-local state are ignored.
- Commit after each task or logical group once the team workflow is in place.
