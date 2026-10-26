# Tasks: Tailwind CSS Integration

**Input**: Design documents from `/specs/002-tailwind-css-integration/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Tests**: No new tests are generated for this styling-only feature. Existing component tests must remain unchanged and are a verification gate when the approved test tooling is available. Manual visual, accessibility, and performance checks are included.

**Organization**: Tasks are grouped by user story so each increment can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: User story label (`US1`, `US2`, `US3`) for user story phases only
- Every task includes an exact file path or command location

## Path Conventions

- Web application frontend: `apps/frontend/src/`
- Feature documents: `specs/002-tailwind-css-integration/`
- Repository documentation: `docs/`
- No backend paths are modified by this feature.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Capture the baseline and resolve approvals before any Tailwind or component changes.

- [x] T001 Record baseline results for `npm run lint`, `npm run build`, CSS sizes, and the `npm run test` failure in `specs/002-tailwind-css-integration/baseline.md`.
- [ ] T002 [P] Capture baseline screenshots at 1440x900, 1024x768, 700x800, 560x800, 375x667, and 320x568 for all eight surfaces and store them under `C:\Users\Takumi\AppData\Local\Temp\opencode\tailwind-baseline\`. Partial: initial surfaces were captured at all six viewports; transient states were validated after migration with the production-CSS harness instead of pre-migration baselines.
- [ ] T003 [P] Obtain maintainer approval for the revised compressed CSS budget and update SC-009 in `specs/002-tailwind-css-integration/spec.md` to the approved limit. Pending: measured 4,671 bytes gzip; the recommended 5,000-byte target and 6,000-byte maximum are met, but SC-009 still has the original cap.
- [x] T004 Record the maintainer decision on deferred frontend test tooling in `specs/002-tailwind-css-integration/baseline.md` (approve the stack separately or accept lint/build/manual verification).
- [x] T005 [P] Add `tailwindcss` and `@tailwindcss/vite` to the frontend development dependency table and Foundation Implementation Notes in `docs/tech_stack.md`.
- [x] T006 Install `tailwindcss@4.3.3` and `@tailwindcss/vite@4.3.3` as devDependencies in `apps/frontend/package.json` and update `apps/frontend/package-lock.json`.

**Checkpoint**: Baseline is captured, the CSS budget and test-tooling decisions are recorded, and the approved packages are installed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the Tailwind build integration, design tokens, and global base layer required by every user story.

**CRITICAL**: No user story migration can begin until this phase is complete.

- [x] T007 [P] Register the Tailwind Vite plugin alongside the React plugin in `apps/frontend/vite.config.js`.
- [x] T008 [P] Rewrite `apps/frontend/src/index.css` with `tailwindcss/theme.css` and `tailwindcss/utilities.css` imports, the `@theme` tokens from `specs/002-tailwind-css-integration/data-model.md`, the curated base reset, body gradients, focus-visible outline, and reduced-motion rule; do not import full Preflight.
- [x] T009 Run `npm run build` and confirm the Tailwind plugin generates utilities, the app still builds, and the compressed CSS size is recorded in `specs/002-tailwind-css-integration/baseline.md`.

**Checkpoint**: Tailwind is installed, registered, themed, and building. All user stories can now start.

---

## Phase 3: User Story 1 - A Consistent, Polished Tour on Every Device (Priority: P1) - MVP

**Goal**: Every visitor-facing surface uses Tailwind utilities and matches the approved visual baseline on desktop and mobile.

**Independent Test**: Load the tour at all six documented viewports, visit the sidebar, panorama, narration, gallery, loading, error, and fatal-error states, and confirm the surfaces are styled, responsive, and free of unstyled flashes.

### Implementation for User Story 1

- [x] T010 [P] [US1] Migrate the app shell, header, skip link, brand, current location, toolbar, loading state, and tour error state in `apps/frontend/src/components/Layout.jsx` to Tailwind utilities.
- [x] T011 [P] [US1] Migrate the sidebar and location list in `apps/frontend/src/components/Sidebar.jsx` to Tailwind utilities, remove the `./Sidebar.css` import, and delete `apps/frontend/src/components/Sidebar.css`.
- [x] T012 [P] [US1] Migrate the gallery dialog and grid in `apps/frontend/src/components/RoomGallery.jsx` to Tailwind utilities, remove the `./RoomGallery.css` import, and delete `apps/frontend/src/components/RoomGallery.css`.
- [x] T013 [P] [US1] Migrate the panorama overlay, loading, error, and instruction states in `apps/frontend/src/components/PanoramaViewer.jsx` to Tailwind utilities, remove the `./PanoramaViewer.css` import, and delete `apps/frontend/src/components/PanoramaViewer.css`.
- [x] T014 [P] [US1] Migrate the narration controls, notices, and transcript in `apps/frontend/src/components/NarrationPlayer.jsx` to Tailwind utilities, remove the `./NarrationPlayer.css` import, and delete `apps/frontend/src/components/NarrationPlayer.css`.
- [x] T015 [P] [US1] Migrate the fatal-error surface in `apps/frontend/src/components/ErrorBoundary.jsx` to Tailwind utilities.
- [x] T016 [US1] Remove the `./App.css` import from `apps/frontend/src/App.jsx` and delete `apps/frontend/src/App.css`.
- [x] T017 [US1] Verify that no component stylesheet imports remain and that only `apps/frontend/src/index.css` is imported from `apps/frontend/src/main.jsx`; record the grep result in `specs/002-tailwind-css-integration/validation.md`.
- [x] T018 [US1] Run the desktop and mobile visual matrix from `specs/002-tailwind-css-integration/quickstart.md` at 1440x900, 1024x768, 700x800, 560x800, 375x667, and 320x568; compare with the baseline screenshots and record results in `specs/002-tailwind-css-integration/validation.md`.
- [ ] T019 [US1] Verify the Marzipano canvas fills its container and remains draggable, keyboard-operable, and touch-operable after a panorama loads; record results in `specs/002-tailwind-css-integration/validation.md`. Partial: sizing and handlers verified with no runtime errors; visible rotation/zoom is blocked by the missing panorama tile assets.
- [x] T020 [US1] Verify the loading, panorama-unavailable, tour-error, and fatal-error states and run three throttled-network loads to confirm no unstyled flash; record results in `specs/002-tailwind-css-integration/validation.md`.

**Checkpoint**: User Story 1 is fully styled, responsive, and independently demonstrable as the MVP.

---

## Phase 4: User Story 2 - Contributors Style New UI Consistently and Quickly (Priority: P2)

**Goal**: The team has one documented styling approach, shared design tokens, and clear rules for adding new UI without creating component stylesheets.

**Independent Test**: Follow the new guide to style a representative element with utilities and tokens, confirm no new component stylesheet is needed, and verify a reviewer can check the result against the documented conventions.

### Implementation for User Story 2

- [x] T021 [P] [US2] Create `docs/styling.md` covering token usage, utility-first ownership, responsive variants, complete class strings, accessibility requirements, global stylesheet boundaries, and an "Adding a new UI surface" checklist.
- [x] T022 [P] [US2] Add the Tailwind primary-styling note and dependency links to `docs/tech_stack.md`.
- [x] T023 [US2] Validate `docs/styling.md` against the migrated `Layout.jsx`, `Sidebar.jsx`, `RoomGallery.jsx`, `PanoramaViewer.jsx`, `NarrationPlayer.jsx`, and `ErrorBoundary.jsx`; close any documented gaps in `docs/styling.md`.

**Checkpoint**: A contributor can follow the guide and style new UI without introducing a second styling system.

---

## Phase 5: User Story 3 - Accessibility and Performance Are Preserved (Priority: P3)

**Goal**: The migrated interface remains keyboard-accessible, preference-aware, responsive at edge cases, backend-independent, and within the approved CSS budget.

**Independent Test**: Complete the accessibility and performance checks in `quickstart.md` and confirm every criterion passes without changing behavior, content, or backend services.

### Verification for User Story 3

- [x] T024 [US3] Verify keyboard order, visible focus, Escape handling, focus return, accessible names, roles, and ARIA state on `apps/frontend/src/components/Layout.jsx`, `Sidebar.jsx`, `RoomGallery.jsx`, `PanoramaViewer.jsx`, and `NarrationPlayer.jsx`; record results in `specs/002-tailwind-css-integration/validation.md`. Focus return was reviewed in source because the scripted `.click()` does not focus the trigger as a real click does.
- [x] T025 [US3] Verify reduced motion, 200 percent zoom, forced-colors mode, 320-pixel width, and landscape phone behavior; record results in `specs/002-tailwind-css-integration/validation.md`.
- [x] T026 [US3] Stop the backend, load `apps/frontend` independently, and confirm the tour remains styled and usable; record results in `specs/002-tailwind-css-integration/validation.md`.
- [x] T027 [US3] Measure compressed production CSS, inspect `apps/frontend/dist/assets/*.css` for unused rules and missing dynamic classes, and confirm only one global stylesheet is emitted; record the result against the approved SC-009 budget in `specs/002-tailwind-css-integration/validation.md`. Measured 4,671 bytes gzip with one stylesheet; SC-009 approval is still pending.
- [x] T028 [US3] Run `npm run test`; if the approved test tooling is available, confirm the unchanged existing tests pass, otherwise record the pre-existing blocker and its decision reference in `specs/002-tailwind-css-integration/validation.md`.

**Checkpoint**: Accessibility, responsive edge cases, panorama behavior, backend independence, and CSS performance are verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final repository hygiene, documentation consistency, and complete end-to-end validation.

- [x] T029 [P] Search `apps/frontend/src` for stale stylesheet imports, dead CSS files, unused tokens, and leftover class names; remove remaining dead styling and record the final state in `specs/002-tailwind-css-integration/validation.md`.
- [x] T030 [P] Review the working diff and confirm no backend files, secrets, environment values, tour content, media, or unapproved dependencies changed; record the review in `specs/002-tailwind-css-integration/validation.md`.
- [x] T031 Run the full validation sequence from `specs/002-tailwind-css-integration/quickstart.md` and update the known-blockers and completion sections in that file with the results.
- [x] T032 Run `npm run lint`, `npm run build`, `npm run verify:content`, and `npm run verify:ignore`; record the final command results in `specs/002-tailwind-css-integration/validation.md`.
- [ ] T033 Measure the final compressed CSS payload and confirm it is within the approved SC-009 budget; record the final measurement in `specs/002-tailwind-css-integration/validation.md`. Measured 20,901 raw / 4,671 gzip; within the recommended budget, but SC-009 approval is pending.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on T006; blocks all user story migration.
- **User Story 1 (Phase 3)**: Depends on Phase 2; this is the MVP.
- **User Story 2 (Phase 4)**: T021 can start after Phase 2; T022 depends on T005; T023 depends on T016 and T021.
- **User Story 3 (Phase 5)**: T024-T027 depend on T016; T028 depends on T004.
- **Polish (Phase 6)**: Depends on all desired user stories.
- **Decisions**: T003 and T004 must be resolved before final acceptance; they do not block the code migration.

### Task Dependencies

- T004 depends on T001 (same file).
- T006 depends on T005.
- T007 and T008 depend on T006.
- T009 depends on T007 and T008.
- T010-T015 depend on T009.
- T016 depends on T010-T015.
- T017-T020 depend on T016.
- T021 and T022 can start after T009; T022 also depends on T005.
- T023 depends on T016, T021, and T022.
- T024-T027 depend on T016.
- T028 depends on T004.
- T029-T033 depend on T016 and the desired user stories.

### User Story Dependencies

- **US1 (P1)**: Independent MVP after Foundational.
- **US2 (P2)**: Documentation can start after Foundational; final validation depends on US1.
- **US3 (P3)**: Verification depends on US1 because it validates the migrated surfaces.

### Within Each User Story

- Migrate surfaces before deleting the shared `App.css`.
- Delete each component stylesheet only after that component's utilities are in place.
- Run visual, accessibility, and performance verification only after all stylesheet imports are removed.
- Keep existing tests unchanged throughout.

### Parallel Opportunities

- Setup: T001, T002, T003, and T005 can run in parallel; T004 follows T001, and T006 follows T005.
- Foundational: T007 and T008 can run in parallel; T009 follows both.
- User Story 1: T010-T015 touch different files and can run in parallel. T016-T020 follow.
- User Story 2: T021 and T022 touch different files and can run in parallel; T023 follows.
- Polish: T029 and T030 can run in parallel.

---

## Parallel Example: User Story 1

```text
Task: "Migrate apps/frontend/src/components/Layout.jsx to Tailwind utilities"
Task: "Migrate apps/frontend/src/components/Sidebar.jsx to Tailwind utilities and delete Sidebar.css"
Task: "Migrate apps/frontend/src/components/RoomGallery.jsx to Tailwind utilities and delete RoomGallery.css"
Task: "Migrate apps/frontend/src/components/PanoramaViewer.jsx to Tailwind utilities and delete PanoramaViewer.css"
Task: "Migrate apps/frontend/src/components/NarrationPlayer.jsx to Tailwind utilities and delete NarrationPlayer.css"
Task: "Migrate apps/frontend/src/components/ErrorBoundary.jsx to Tailwind utilities"
```

## Parallel Example: User Story 2

```text
Task: "Create docs/styling.md with token, utility, responsive, and accessibility conventions"
Task: "Add the Tailwind primary-styling note to docs/tech_stack.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the full visual matrix and Marzipano behavior.
5. Demo the migrated tour.

### Incremental Delivery

1. Setup + Foundational -> Tailwind builds and tokens are live.
2. User Story 1 -> Fully styled, responsive tour (MVP).
3. User Story 2 -> Contributor guide and dependency documentation.
4. User Story 3 -> Accessibility, performance, offline, and CSS-budget verification.
5. Polish -> Final cleanup and complete quickstart validation.

### Notes

- Existing tests must not be rewritten for styling.
- Do not install deferred test packages without the T004 decision.
- Do not declare SC-009 satisfied until T003 resolves the budget and T033 confirms it.
- Use complete class strings; never construct Tailwind class names from fragments.
- Do not modify `apps/backend`, `apps/frontend/src/lib/catalog.json`, or `apps/frontend/public/panoramas/`.
