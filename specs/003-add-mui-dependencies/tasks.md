---

description: "Task list for adding MUI React dependencies and documentation"
---

# Tasks: Add MUI React Dependencies

**Input**: Design documents from `/specs/003-add-mui-dependencies/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: No tests are generated. The feature changes only dependencies and documentation, and the spec does not request TDD. Frontend test tooling remains deferred by the maintainer.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: User story label (US1, US2, US3); setup, foundational, and polish tasks have no label
- Every task names the exact file or directory it touches

## Path Conventions

- Web application: `apps/frontend/`, `docs/`
- Feature artifacts: `specs/003-add-mui-dependencies/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the environment and the approved dependency decisions before changing the manifest.

- [X] T001 Verify Node.js 24.x and npm are available and record the current React and React DOM versions in `apps/frontend/package.json`
- [X] T002 [P] Review `specs/003-add-mui-dependencies/research.md` and `specs/003-add-mui-dependencies/contracts/ui-contract.md` to confirm the package set, versions, and Tailwind coexistence rules

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ensure the dependency change starts from a clean baseline and is governed correctly.

**⚠️ CRITICAL**: Complete this phase before editing the manifest.

- [X] T003 Confirm `apps/frontend/package.json` and `apps/frontend/package-lock.json` have no uncommitted changes that would conflict with the install
- [X] T004 Confirm maintainer approval is recorded in `specs/003-add-mui-dependencies/spec.md` and that no constitution amendment is required for a component library

**Checkpoint**: Foundation ready. User stories can now proceed.

---

## Phase 3: User Story 1 - Install the Approved Component Library (Priority: P1) 🎯 MVP

**Goal**: Add the MUI and Emotion packages to the frontend manifest, install them, and prove the existing application still builds and behaves correctly.

**Independent Test**: Run `npm --prefix apps/frontend install`, then `npm run build` and `npm run lint`, and complete a manual tour smoke test. All commands succeed and the tour is unchanged.

### Implementation for User Story 1

- [X] T005 [US1] Add `@mui/material` `^9.5.0`, `@mui/icons-material` `^9.5.0`, `@emotion/react` `^11.14.0`, and `@emotion/styled` `^11.14.1` to the `dependencies` block in `apps/frontend/package.json`
- [X] T006 [US1] Run `npm --prefix apps/frontend install` to install the packages and regenerate `apps/frontend/package-lock.json`
- [X] T007 [US1] Verify all four packages resolve without unmet peers using `npm --prefix apps/frontend ls @mui/material @mui/icons-material @emotion/react @emotion/styled` against `apps/frontend/package.json`
- [X] T008 [P] [US1] Run `npm run lint` for `apps/frontend/src` and confirm zero errors
- [X] T009 [P] [US1] Run `npm run build` and confirm `apps/frontend/dist` is produced without errors
- [X] T010 [P] [US1] Run `npm run verify:content` against `apps/frontend/src/lib/catalog.json`
- [X] T011 [P] [US1] Run `npm --prefix apps/frontend audit --omit=dev` and confirm no high or critical advisories for `apps/frontend/package-lock.json`
- [X] T012 [US1] Run `npm run dev` and smoke test panorama viewing, sidebar navigation, gallery, and narration in `apps/frontend/src/components/` at a desktop viewport and at 375x667

**Checkpoint**: User Story 1 is complete and the dependency is installed without breaking the tour.

---

## Phase 4: User Story 2 - Record the Dependency in the Technology Stack (Priority: P1)

**Goal**: Make the new packages visible and approved in the technology stack document.

**Independent Test**: Read `docs/tech_stack.md` and confirm all four packages appear with layer, approval, and purpose, and that MUI is acknowledged in the stack summary.

### Implementation for User Story 2

- [X] T013 [US2] Add `@mui/material`, `@mui/icons-material`, `@emotion/react`, and `@emotion/styled` rows with layer, approval, and purpose to the runtime dependency table in `docs/tech_stack.md`
- [X] T014 [US2] Add MUI to the frontend stack summary in `docs/tech_stack.md` and document the Tailwind coexistence rule in the Foundation Implementation Notes
- [X] T015 [P] [US2] Cross-check the package names and versions documented in `docs/tech_stack.md` against `apps/frontend/package.json`

**Checkpoint**: The technology stack document matches the installed dependency set.

---

## Phase 5: User Story 3 - Record Setup Guidance for Contributors (Priority: P2)

**Goal**: Make the setup guide explain installation, Tailwind coexistence, version compatibility, and where new MUI surfaces belong.

**Independent Test**: Follow the setup guidance in `docs/project_setup.md` from a clean checkout and confirm a contributor can install and use MUI as described.

### Implementation for User Story 3

- [X] T016 [US3] Document the frontend install workflow and the added package set in `docs/project_setup.md`
- [X] T017 [US3] Document the Tailwind coexistence rule, the supported React version, and conflict-resolution behavior in `docs/project_setup.md`
- [X] T018 [US3] Document the convention for placing new MUI surfaces in `apps/frontend/src/components/` in `docs/project_setup.md`

**Checkpoint**: All three user stories are independently complete and the documentation matches the implementation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across the dependency, documentation, and repository state.

- [X] T019 [P] Run every validation scenario in `specs/003-add-mui-dependencies/quickstart.md` and record any deviations
- [X] T020 [P] Confirm `docs/tech_stack.md` and `docs/project_setup.md` match the package set in `apps/frontend/package.json`
- [X] T021 Review `git diff` for `apps/frontend/package.json`, `apps/frontend/package-lock.json`, `docs/tech_stack.md`, and `docs/project_setup.md`, confirming no secrets and no unrelated changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Stories (Phases 3–5)**: All depend on Foundational.
  - US1 installs the dependency.
  - US2 and US3 can be written in parallel with each other after the package set is confirmed.
  - US2 and US3 should be verified against the installed manifest after US1.
- **Polish (Phase 6)**: Depends on US1, US2, and US3.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories.
- **User Story 2 (P1)**: Uses the package set from `research.md`; final cross-check depends on US1.
- **User Story 3 (P2)**: Uses the package set and coexistence rules; final accuracy depends on US1.

### Within Each User Story

- US1: manifest edit → install/lockfile → verification commands → manual smoke test.
- US2: dependency table → stack summary/coexistence note → cross-check.
- US3: install guidance → coexistence/version guidance → placement convention.

### Parallel Opportunities

- T002 can run alongside T001.
- T008, T009, T010, and T011 can run together after T006.
- T015 can run in parallel with the US3 documentation tasks because it reads `docs/tech_stack.md` and `apps/frontend/package.json` while US3 edits `docs/project_setup.md`.
- T019 and T020 can run together during polish.

---

## Parallel Example: User Story 1

```bash
# After T006 install completes, run the independent checks together:
npm run lint
npm run build
npm run verify:content
npm --prefix apps/frontend audit --omit=dev
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Stop and validate the install, build, lint, and tour smoke test.
4. The dependency is installed and usable.

### Incremental Delivery

1. US1 → installable dependency MVP.
2. US2 → technology stack documentation, required by the constitution before merge.
3. US3 → contributor setup guidance.
4. Polish → full quickstart validation and diff review.

### Minimum Shippable Scope

Although US1 alone is the functional MVP, US2 is also P1 and is a constitution gate. Ship US1 + US2 before merge; add US3 in the same change because the request explicitly names `docs/project_setup.md`.

---

## Notes

- [P] tasks touch different files or are read-only checks with no ordering dependency.
- No test tasks are included; the feature has no behavior change and test tooling is deferred.
- Commit after each logical group, keeping the manifest, lockfile, and documents in the same change.
- Do not migrate existing Tailwind components to MUI in this feature.
- Do not add `@mui/material-pigment-css`, `@mui/lab`, or MUI X packages.

## Implementation Verification Notes

- `npm run verify:content` was executed during T010. It fails on pre-existing content gaps unrelated to this feature: the placeholder catalog references missing panorama tiles and `narration.wav`, and the script also expects the deleted `specs/001-campus-tour-foundation/contracts/content-schema.json`. The MUI dependency change does not affect this result.
- `npm --prefix apps/frontend audit --omit=dev` reports 0 vulnerabilities. The full `npm audit` reports 4 moderate advisories from the pre-existing ESLint 10 toolchain (`minimatch` via `@eslint/config-array`), not from the added MUI or Emotion packages. No high or critical advisories were found.
- T012 verified that the Vite dev server starts and serves the application HTML and transformed entry modules with HTTP 200. Interactive panorama, navigation, gallery, and narration behavior was not exercised because no browser automation tooling is available in this environment.
