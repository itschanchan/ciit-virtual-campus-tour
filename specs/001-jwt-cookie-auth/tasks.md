# Tasks: JWT Cookie Access

**Input**: Design documents from `/specs/001-jwt-cookie-auth/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per Constitution Principle III (Test-First Quality Gate). Tests MUST be written and observed failing before implementation. Test tasks are included below for each user story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/backend/`, `apps/frontend/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Add cookie-parser to apps/backend/package.json dependencies
- [x] T002 Add JWT_SECRET and JWT_EXPIRES_IN to apps/backend/.env.example
- [x] T003 Create apps/backend/.env with JWT_SECRET and JWT_EXPIRES_IN=24h

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create User Mongoose model in apps/backend/models/User.js (email unique, passwordHash, createdAt)
- [x] T005 [P] Create auth service with JWT sign/verify functions in apps/backend/services/authService.js
- [x] T006 [P] Create auth middleware to verify JWT from cookie in apps/backend/utils/authMiddleware.js
- [x] T007 [P] Add cookie-parser middleware to apps/backend/app.js
- [x] T008 [P] Create auth routes file stub in apps/backend/routes/authRoutes.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Log in and receive secure access credential (Priority: P1) 🎯 MVP

**Goal**: A registered user authenticates with email/password and receives a time-limited JWT stored in a secure browser cookie (HttpOnly, Secure, SameSite=Strict).

**Independent Test**: Submit valid login credentials via POST /api/auth/login and confirm the system issues a JWT cookie that grants access to a protected endpoint.

### Implementation for User Story 1

- [x] T009 [US1] Implement login controller in apps/backend/controllers/authController.js (depends on T004, T005, T009a, T009b)
- [x] T010 [US1] Wire POST /api/auth/login route in apps/backend/routes/authRoutes.js (depends on T008, T009)

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009a [P] [US1] Contract test for POST /api/auth/login in apps/backend/tests/contract/authLogin.test.js
- [x] T009b [P] [US1] Integration test for login flow in apps/backend/tests/integration/authLogin.test.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 4 - Protected resources require valid authentication (Priority: P1)

**Goal**: Campus tour administration endpoints reject requests that do not include a valid, unexpired JWT cookie.

**Independent Test**: Attempt to access a protected endpoint without a cookie and confirm access is denied; attempt with an expired cookie and confirm denial and re-authentication requirement.

### Implementation for User Story 4

- [x] T011 [US4] Apply auth middleware to protected route(s) in apps/backend/routes/authRoutes.js (depends on T006)
- [x] T012 [US4] Create sample protected administration endpoint in apps/backend/controllers/authController.js (depends on T009)

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011a [P] [US4] Contract test for protected endpoint in apps/backend/tests/contract/authProtected.test.js
- [x] T011b [P] [US4] Integration test for unauthenticated access denial in apps/backend/tests/integration/authProtected.test.js

**Checkpoint**: User Stories 1 AND 4 should both work independently

---

## Phase 5: User Story 2 - Stay signed in across page refreshes (Priority: P2)

**Goal**: Authentication state persists across browser reloads using the stored authentication cookie.

**Independent Test**: Log in, refresh the page, call GET /api/auth/verify, and confirm the user remains authenticated without re-entering credentials.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create GET /api/auth/verify route in apps/backend/routes/authRoutes.js (depends on T008, T006)
- [x] T014 [US2] Implement verify controller in apps/backend/controllers/authController.js (depends on T009, T013, T013a, T013b)

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T013a [P] [US2] Contract test for GET /api/auth/verify in apps/backend/tests/contract/authProtected.test.js
- [x] T013b [P] [US2] Integration test for cookie persistence across refresh in apps/backend/tests/integration/authProtected.test.js

**Checkpoint**: User Stories 1, 4, AND 2 should all work independently

---

## Phase 6: User Story 3 - Log out and end the session (Priority: P2)

**Goal**: An authenticated user can end their session, which clears the stored access credential from the browser cookie.

**Independent Test**: Log in, call POST /api/auth/logout, then attempt to access a protected feature and confirm access is denied.

### Implementation for User Story 3

- [x] T015 [P] [US3] Implement logout controller in apps/backend/controllers/authController.js (depends on T009)
- [x] T016 [US3] Wire POST /api/auth/logout route in apps/backend/routes/authRoutes.js (depends on T008, T015)

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T015a [P] [US3] Contract test for POST /api/auth/logout in apps/backend/tests/contract/authLogout.test.js
- [x] T015b [P] [US3] Integration test for session termination in apps/backend/tests/integration/authLogout.test.js

**Checkpoint**: All user stories should now be independently functional

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 [P] Add IP-based rate limiting for failed login attempts in apps/backend/services/authService.js
- [x] T018 [P] Update apps/backend/.env.example with cookie configuration documentation
- [x] T019 [P] Run quickstart.md validation scenarios against running backend
- [x] T020 [P] Performance test: measure POST /api/auth/login response time against 1-minute SC-001 target in apps/backend/tests/performance/authLogin.test.js
- [x] T021 [P] Reliability test: validate 95% login success rate under concurrent load in apps/backend/tests/performance/authLoad.test.js
- [x] T022 [P] Handle malformed or tampered JWT cookies: return 401 without crashing in apps/backend/services/authService.js
- [x] T023 [P] Handle expired credential mid-session: reject with 401 and require re-authentication in apps/backend/utils/authMiddleware.js
- [x] T024 [P] Handle blocked or deleted cookie: detect missing cookie on protected routes and return 401 in apps/backend/utils/authMiddleware.js

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2) or in parallel if staffed
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - Depends on auth middleware from Foundational
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on login flow from US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on login flow from US1

### Within Each User Story

- Models before services (T004 before T005)
- Services before controllers (T005 before T009)
- Controllers before routes (T009 before T010, T012, T014, T016)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T003) are sequential (dependency chain on package.json → .env.example → .env)
- All Foundational tasks (T004-T008) marked [P] can run in parallel (different files)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members once Foundational is complete

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tasks together:
Task: "Create User Mongoose model in apps/backend/models/User.js"
Task: "Create auth service with JWT sign/verify functions in apps/backend/services/authService.js"
Task: "Create auth middleware to verify JWT from cookie in apps/backend/utils/authMiddleware.js"
Task: "Add cookie-parser middleware to apps/backend/app.js"
Task: "Create auth routes file stub in apps/backend/routes/authRoutes.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently via POST /api/auth/login
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 4 → Test independently → Deploy/Demo
4. Add User Story 2 → Test independently → Deploy/Demo
5. Add User Story 3 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (login)
   - Developer B: User Story 4 (protected resources)
   - Developer C: User Story 2 (cookie persistence)
   - Developer D: User Story 3 (logout)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify each story independently before moving to the next
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
