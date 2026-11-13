# Tasks: Apply Backend Syntax Principles to Entry and Config Files

**Input**: Design documents from `/specs/020-apply-backend-syntax/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not included — tests are not explicitly requested in the feature specification; only implementation tasks are generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Confirm apps/backend/index.js, config/db.js, config/env.js exist per implementation plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Standardize env.js startup validation (PORT, NODE_ENV, MONGODB_URI, MONGODB_NAME, CORS_ORIGIN) in apps/backend/config/env.js
- [x] T003 [P] Standardize db.js connection handshake (URI scheme validation, Mongoose connect, isDatabaseReady) in apps/backend/config/db.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Backend starts only when run directly, not during tests (Priority: P1) 🎯 MVP

**Goal**: The HTTP server only begins listening when the entry file is executed directly; tests can import the app without opening a port or connecting to MongoDB.

**Independent Test**: Import the backend app in a test process with NODE_ENV=test and confirm no port is bound and no database connection is attempted.

- [x] T004 [US1] Add NODE_ENV !== "test" guard around app.listen() in apps/backend/index.js
- [x] T005 [US1] Export default app from index.js for test import in apps/backend/index.js
- [x] T006 [US1] Verify test import starts zero servers and zero DB connections in apps/backend/index.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Configuration is validated before the server starts (Priority: P1)

**Goal**: Required configuration (database URI, database name, port, CORS origins, environment) is present and valid at startup, failing fast with a clear error when missing or invalid.

**Independent Test**: Start the backend with MONGODB_URI unset and confirm the process exits with a clear error before binding to a port.

- [x] T007 [US2] Add MONGODB_URI presence/empty validation with process.exit(1) in apps/backend/config/env.js
- [x] T008 [US2] Add PORT range validation (1-65535) in apps/backend/config/env.js
- [x] T009 [US2] Add CORS_ORIGIN non-empty validation in apps/backend/config/env.js
- [x] T010 [US2] Verify secrets/credentials not logged in error output in apps/backend/config/env.js and apps/backend/config/db.js

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Database connection is established before requests are served (Priority: P1)

**Goal**: The system only accepts HTTP requests after confirming the MongoDB connection is ready, so no request fails due to a missing database connection.

**Independent Test**: Start the backend with a reachable MongoDB and confirm requests are only served after the connection is established.

- [x] T011 [US3] Wire connectDB() before app.listen() in apps/backend/index.js
- [x] T012 [P] [US3] Add MongoDB URI scheme validation (mongodb:// or mongodb+srv://) in apps/backend/config/db.js
- [x] T013 [US3] Verify server does not accept requests before DB connection confirmed in apps/backend/index.js

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Server shuts down cleanly on termination signals (Priority: P2)

**Goal**: The system closes the HTTP server and exits cleanly on SIGINT or SIGTERM instead of leaving dangling connections or processes.

**Independent Test**: Send SIGINT to a running backend and confirm the process exits cleanly after closing the server.

- [x] T014 [US4] Add SIGINT handler for graceful shutdown in apps/backend/index.js
- [x] T015 [US4] Add SIGTERM handler for graceful shutdown in apps/backend/index.js
- [x] T016 [US4] Verify server closes and process exits on termination signals in apps/backend/index.js

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - Cross-origin requests are allowed only from configured origins (Priority: P2)

**Goal**: Cross-origin requests succeed only from origins listed in the configured CORS allowlist, with credentials enabled; all other origins are rejected.

**Independent Test**: Send a credentialed request from an allowed origin and confirm it succeeds; send from a disallowed origin and confirm it is rejected.

- [x] T017 [US5] Configure CORS with explicit allowlist from CORS_ORIGIN in apps/backend/index.js
- [x] T018 [US5] Enable credentials in CORS config in apps/backend/index.js
- [x] T019 [US5] Verify allowlist origins accepted and disallowed origins rejected in apps/backend/index.js

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 [P] Review apps/backend/index.js for KISA compliance (no deep nesting, no one-liners, <30 line blocks)
- [x] T021 [P] Review apps/backend/config/db.js for KISA compliance
- [x] T022 [P] Review apps/backend/config/env.js for KISA compliance
- [x] T023 Run quickstart.md validation scenarios to verify all acceptance criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories execute in priority order: US1 (P1) → US2 (P1) → US3 (P1) → US4 (P2) → US5 (P2)
  - Each story is independently testable once its phase completes
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **US2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but independently testable
- **US3 (P1)**: Can start after Foundational (Phase 2) - Depends on US2 config validation being complete
- **US4 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 server existing before adding shutdown handlers
- **US5 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 server existing before adding CORS middleware

### Within Each User Story

- Models/config before services/endpoints
- Core implementation before verification
- Story complete before moving to next priority

### Parallel Opportunities

- **T003 [P]** (db.js) can run alongside T002 (env.js) in Foundational phase since they edit different files
- **T012 [P]** (db.js URI scheme validation) can run alongside T011 (index.js wiring) in US3 since they edit different files and Foundational is complete
- **T020, T021, T022 [P]** (KISA reviews) can run in parallel in Polish phase since they review different files
- Once Foundational completes, user stories could be worked on in parallel by different team members if capacity allows

---

## Parallel Example: User Story 3

```bash
# Tasks touching different files can run in parallel once Foundational is complete:
Task: "Wire connectDB() before app.listen() in apps/backend/index.js" (T011)
Task: "Add MongoDB URI scheme validation in apps/backend/config/db.js" (T012 [P])
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (test import starts zero servers, zero DB connections)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (index.js test guard + export)
   - Developer B: User Story 2 (env.js validation)
   - Developer C: User Story 3 (db.js + index.js wiring)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Setup, Foundational, and Polish phases have NO story label
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
- app.js (createApp factory) is out of scope per clarification Session 2026-11-13; no tasks reference app.js
