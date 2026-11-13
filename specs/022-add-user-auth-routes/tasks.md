# Tasks: Add User Management and Auth Routes

**Input**: Design documents from `/specs/022-add-user-auth-routes/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are MANDATORY per Constitution III (Test-First Quality Gate) and plan.md (Vitest + Supertest coverage required).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/` → this project uses `apps/backend/` for backend code
- Paths below follow the plan.md structure under `apps/backend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [x] T001 Verify `apps/backend/` structure exists with `index.js`, `controllers/`, `middleware/`, `routes/`, `tests/` per plan.md project structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create `apps/backend/middleware/authorize.js` with `requireRole(...)` factory that checks `req.user.role` against allowed roles
- [x] T003 Update `apps/backend/index.js` to mount `AdminRoutes` under `/api/users` and `AuthRoutes` under `/api/auth`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View and manage own user profile (Priority: P1) 🎯 MVP

**Goal**: An authenticated user can view their own profile; authors and administrators can view their own rating count through a role-protected endpoint.

**Independent Test**: Log in as a user, request `GET /api/users/me` and confirm the profile matches. Log in as an author/admin, request `GET /api/users/me/rating-count` and confirm the count is returned; confirm a regular user is denied (403).

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Write Vitest/Supertest contract test for `GET /api/users/me` in `apps/backend/tests/userProfile.test.js`
- [x] T005 [P] [US1] Write Vitest/Supertest contract test for `GET /api/users/me/rating-count` (200 for author/admin, 403 for regular user) in `apps/backend/tests/userProfile.test.js`

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `apps/backend/controllers/UserController.js` with `getMyProfile` and `getUserDetails` methods
- [x] T007 [P] [US1] Create `apps/backend/controllers/GamesController.js` with `getMyRatingCount` method
- [x] T008 [US1] Create `apps/backend/routes/AdminRoutes.js` with `GET /me`, `GET /me/rating-count` routes wired to controllers, protected by `verifyToken` and `requireRole("author","admin")`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage user accounts (Priority: P1)

**Goal**: Authorized administrators can create, view, update, activate/deactivate, and delete user accounts.

**Independent Test**: As an administrator, create a user, view details by id, update info, activate/deactivate, and delete; confirm each succeeds. As a non-administrator, confirm each operation is denied (403).

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US2] Write Vitest/Supertest contract tests for user management endpoints (`POST /`, `GET /:id`, `PUT /:id`, `PATCH /:id/activate`, `DELETE /:id`) in `apps/backend/tests/userManagement.test.js`

### Implementation for User Story 2

- [ ] T010 [US2] Add `createUser`, `updateUser`, `deleteUser`, `changePassword` methods to `apps/backend/controllers/UserController.js` (depends on T006)
- [ ] T011 [US2] Add `POST /`, `GET /:id`, `PUT /:id`, `PATCH /:id/activate`, `DELETE /:id` routes to `apps/backend/routes/AdminRoutes.js` protected by `verifyToken` and `requireRole("admin")` (depends on T008)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Authenticate and manage sessions (Priority: P1)

**Goal**: A user can register, log in (access token + refresh token cookie), refresh an expired token, and log out (clear cookie).

**Independent Test**: Register a new account, log in and confirm access token + refresh cookie, refresh the token using the cookie, log out and confirm cookie is cleared.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US3] Write Vitest/Supertest contract tests for auth endpoints (`POST /register`, `POST /login`, `POST /refresh`, `POST /logout`) in `apps/backend/tests/authRoutes.test.js`

### Implementation for User Story 3

- [ ] T013 [P] [US3] Create `apps/backend/controllers/AuthController.js` with `register`, `login`, `refresh`, `logout` methods
- [ ] T014 [US3] Rename `apps/backend/routes/AdminAuthRoutes.js` to `apps/backend/routes/AuthRoutes.js` with singleton export (`export default router`) and routes `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T015 [P] Run `npm --prefix apps/backend run test` and confirm all tests pass
- [ ] T016 [P] Update `docs/tech_stack.md` with route reorganization and new auth endpoints
- [ ] T017 [P] Run quickstart.md validation scenarios (registration, login, profile, rating count, user lifecycle, refresh, logout)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (US1): Can start after Foundational - no dependencies on other stories
  - User Story 2 (US2): Depends on US1 for `UserController.js` and `AdminRoutes.js` (shared files)
  - User Story 3 (US3): Can start after Foundational - independent (separate controller and route files)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories. Creates `UserController.js` and `AdminRoutes.js`.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for shared `UserController.js` and `AdminRoutes.js` files but independently testable.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent (separate `AuthController.js` and `AuthRoutes.js`).

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution III)
- Controllers before routes
- Core implementation before integration tests
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Story 1 and User Story 3 can start in parallel (different files)
- User Story 2 starts after User Story 1 creates shared files (`UserController.js`, `AdminRoutes.js`)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members (where files don't conflict)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write Vitest/Supertest contract test for GET /api/users/me in apps/backend/tests/userProfile.test.js"
Task: "Write Vitest/Supertest contract test for GET /api/users/me/rating-count in apps/backend/tests/userProfile.test.js"

# Launch controllers for User Story 1 together:
Task: "Create apps/backend/controllers/UserController.js with getMyProfile and getUserDetails methods"
Task: "Create apps/backend/controllers/GamesController.js with getMyRatingCount method"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
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
   - Developer A: User Story 1 (creates shared UserController.js and AdminRoutes.js)
   - Developer B: User Story 3 (separate AuthController.js and AuthRoutes.js - parallel with US1)
   - Developer C: User Story 2 (starts after US1 creates shared files)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (Constitution III)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
