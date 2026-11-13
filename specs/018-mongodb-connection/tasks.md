# Tasks: MongoDB Connection Configuration

**Input**: Design documents from `/specs/018-mongodb-connection/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are required per Constitution Principle III (Test-First Quality Gate) — write tests first, ensure they fail before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/backend/` — existing MVC layout under `config/`, `index.js`, `app.js`, `scripts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [x] T001 Verify project structure matches implementation plan (apps/backend/config/db.js, apps/backend/config/env.js, apps/backend/index.js, apps/backend/app.js, apps/backend/scripts/create-admin.js)
- [x] T002 [P] Confirm backend dependencies installed (mongoose, dotenv, express, vitest)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Update apps/backend/config/db.js to read MONGODB_URI instead of MONGO_URI; remove URI logging (FR-001, FR-005)
- [x] T004 [P] Update apps/backend/config/env.js to expose MONGODB_NAME for db.js consumption (FR-002)
- [x] T005 Update apps/backend/index.js to call loadEnv() validation at startup before connectDB() (FR-002, FR-004)
- [x] T006 Update apps/backend/index.js to await connectDB() before app.listen() (FR-003)
- [x] T007 Wire createApp() factory into apps/backend/index.js startup flow

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Backend starts with validated MongoDB configuration (Priority: P1) 🎯 MVP

**Goal**: Validate MONGODB_URI at startup; fail fast with clear error if missing; establish MongoDB connection before HTTP server accepts requests.

**Independent Test**: Start the backend with MONGODB_URI unset and confirm the server exits with a clear error message before binding to a port.

### Tests for User Story 1 (required per Constitution Principle III)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Add Vitest test for startup validation failure when MONGODB_URI is unset in apps/backend/tests/env.test.js
- [x] T009 [P] [US1] Add Vitest test for successful startup with valid MONGODB_URI in apps/backend/tests/env.test.js

### Implementation for User Story 1

- [x] T010 [US1] Implement startup validation that exits with non-zero error code when MONGODB_URI missing in apps/backend/config/env.js (depends on T003, T004, T008)
- [x] T011 [US1] Implement connection-before-listen: await connectDB() before app.listen() in apps/backend/index.js (depends on T005, T006, T009)
- [x] T012 [US1] Verify server does not accept HTTP requests until MongoDB connection is confirmed established in apps/backend/index.js (depends on T010, T011)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Clear connection failure without secret exposure (Priority: P1)

**Goal**: Connection failure produces a descriptive error that does not expose MONGODB_URI or credentials.

**Independent Test**: Stop MongoDB, start the backend, and confirm the error message indicates connection failure without printing the URI.

### Tests for User Story 2 (required per Constitution Principle III)

- [x] T013 [P] [US2] Add Vitest test that connection failure error does not include MONGODB_URI value in apps/backend/tests/env.test.js

### Implementation for User Story 2

- [x] T014 [US2] Implement connection failure error message that excludes MONGODB_URI value in apps/backend/config/db.js (depends on T003, T013)
- [x] T015 [US2] Verify error output does not contain MONGODB_URI or credentials in apps/backend/config/db.js (depends on T014)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Consistent environment variable naming (Priority: P2)

**Goal**: Single canonical environment variable name (MONGODB_URI) used consistently across all backend configuration files.

**Independent Test**: Search all backend configuration files and confirm MONGODB_URI is the only variable name used for the MongoDB connection URI.

### Implementation for User Story 3

- [x] T016 [US3] Update apps/backend/scripts/create-admin.js to use MONGODB_URI consistently (FR-001) (depends on T003)
- [x] T017 [P] [US3] Verify no MONGO_URI references remain in apps/backend/config/ and apps/backend/scripts/ (FR-001)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 [P] Verify quickstart.md validation scenarios pass end-to-end (SC-003)
- [x] T019 [P] Run full Vitest suite (npx vitest run) to confirm all tests pass (FR-001 through FR-007)
- [x] T020 [P] Verify .env remains excluded from version control per Constitution Principle IV (FR-005)
- [x] T021 [P] Verify SC-001 startup validation coverage: confirm MONGODB_URI is validated before any MongoDB connection in all backend startup paths (apps/backend/index.js, apps/backend/config/env.js)
- [x] T022 [P] Verify SC-004 timing bound: confirm startup exits within 5 seconds when MONGODB_URI is missing/invalid (apps/backend/index.js, apps/backend/config/env.js)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially in priority order (P1 → P2)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) — May integrate with US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — May integrate with US1/US2 but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle III)
- Foundational tasks (Phase 2) before story implementation
- Core implementation before verification tasks

### Parallel Opportunities

- T002 can run in parallel with any other setup task
- T003 and T004 can run in parallel (different files, no dependencies)
- T008 and T009 can run in parallel (different test additions, no dependencies)
- T013 can run in parallel with US1 implementation tasks
- T017 can run in parallel with other US3 tasks
- T018, T019, T020 can run in parallel (independent verification)
- All user stories can be worked on in parallel by different team members once Foundational is complete

### Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add Vitest test for startup validation failure when MONGODB_URI is unset in apps/backend/tests/env.test.js"
Task: "Add Vitest test for successful startup with valid MONGODB_URI in apps/backend/tests/env.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (Constitution Principle III)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
