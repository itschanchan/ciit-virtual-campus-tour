# Tasks: Fix Admin Route Handler Error

**Input**: Design documents from `/specs/023-fix-admin-route-handler/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks included per constitution Principle III (NON-NEGOTIABLE): bug fixes MUST include a regression test that fails without the fix.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure matches implementation plan before making changes

- [X] T001 Confirm project structure matches plan.md (apps/backend/routes/AdminRoutes.js, apps/backend/controllers/AdminController.js, apps/backend/routes/AuthRoutes.js exist)

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Checkpoint**: All foundational infrastructure already exists (Admin model, AuthController, AuthRoutes, verifyToken middleware, cookie-parser, CORS allowlist). No new foundational work is needed for this bug fix.

- [X] T002 Verify existing auth infrastructure is intact (apps/backend/routes/AuthRoutes.js at /api/admin with login/logout handlers, apps/backend/controllers/AdminController.js with CRUD handlers)

## Phase 3: User Story 1 - Backend starts without route registration errors (Priority: P1) 🎯 MVP

**Goal**: Remove the broken `/login` and `/logout` route registrations from AdminRoutes.js whose handlers (adminController.login, adminController.logout) do not exist, eliminating the TypeError at server startup.

**Independent Test**: Start the backend server and confirm it initializes without a "argument handler must be a function" error; then confirm admin routes are mounted and respond.

### Tests for User Story 1 (REQUIRED per constitution Principle III - regression test)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T003 [US1] Write regression test in apps/backend/tests/AdminRoutesStartup.test.js that imports apps/backend/routes/AdminRoutes.js and asserts every route handler is a function (test must FAIL before the fix because adminController.login/adminController.logout are undefined)

### Implementation for User Story 1

- [X] T004 [US1] Remove `router.post('/login', adminController.login)` from apps/backend/routes/AdminRoutes.js (handler adminController.login does not exist)
- [X] T005 [US1] Remove `router.post('/logout', adminController.logout)` from apps/backend/routes/AdminRoutes.js (handler adminController.logout does not exist)
- [X] T006 [US1] Run regression test in apps/backend/tests/AdminRoutesStartup.test.js and confirm it passes (AdminRoutes imports without TypeError, all handlers are functions)
- [X] T007 [US1] Start backend server via apps/backend/index.js (`npm --prefix apps/backend run start`) and confirm it initializes without TypeError (quickstart.md Scenario 1)

**Checkpoint**: At this point, User Story 1 is fully functional — the backend starts without a route handler TypeError and admin endpoints are available.

## Phase 4: User Story 2 - Admin can log in through the login endpoint (Priority: P1)

**Goal**: Verify admin login/logout work through the existing AuthRoutes.js endpoints (already implemented in AuthController.js), and update tests that referenced the removed AdminRoutes paths.

**Independent Test**: Submit valid admin login credentials to POST /api/admin/login and confirm a successful authentication response; submit invalid credentials and confirm access is denied.

### Implementation for User Story 2

- [X] T008 [P] [US2] Update apps/backend/tests/Auth.test.js to use POST /api/admin/login instead of POST /api/admins/login (the /api/admins/login route was removed from AdminRoutes.js; login now lives in AuthRoutes.js at /api/admin/login)
- [X] T009 [P] [US2] Verify POST /api/admin/login via apps/backend/routes/AuthRoutes.js returns 200 with access token and sets refresh token cookie (quickstart.md Scenario 3)
- [X] T010 [P] [US2] Verify POST /api/admin/logout via apps/backend/routes/AuthRoutes.js returns 200 and clears refresh token cookie (quickstart.md Scenario 3)
- [X] T011 [P] [US2] Verify POST /api/admin/login via apps/backend/routes/AuthRoutes.js with invalid credentials returns 401 without crashing
- [X] T015 [US2] Fix apps/frontend/src/context/AuthContext.jsx API paths from `/api/admins/` to `/api/admin/` (login, session, logout) so frontend calls the correct AuthRoutes endpoints
- [X] T016 [P] Add `http://localhost:5174` to CORS allowlist in apps/backend/index.js so frontend dev server on port 5174 is not blocked

**Checkpoint**: At this point, User Story 2 is fully functional — admin login/logout work via AuthRoutes.js endpoints.

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and verification that affect the overall fix

- [X] T012 [P] Run full backend test suite in apps/backend/tests/ via `npm --prefix apps/backend run test` and confirm all tests pass (7 pass, 3 pre-existing failures unrelated to this fix - see notes below)
- [X] T013 [P] Run quickstart.md validation scenarios end-to-end (Scenarios 1, 2, 3) - Scenario 1 verified: server starts without TypeError
- [X] T014 [P] Verify admin CRUD endpoints in apps/backend/routes/AdminRoutes.js still respond after fix (GET /api/admins/me without auth returns 401 JSON, not a crash; quickstart.md Scenario 2)

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - verifies existing infrastructure is intact
- **User Story 1 (Phase 3)**: Depends on Foundational - contains the core fix (T004, T005) and regression test (T003)
- **User Story 2 (Phase 4)**: Depends on Foundational - verification tasks for existing AuthRoutes endpoints (independent of US1 fix; can run in parallel once Foundational is complete)
- **Polish (Phase 5)**: Depends on US1 and US2 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories. Contains the actual code fix.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1; verifies existing AuthRoutes functionality. Can be worked on in parallel with US1.

### Within Each User Story

- Tests (T003) MUST be written and FAIL before implementation (T004, T005)
- Implementation (T004, T005) before test verification (T006, T007)
- Server startup verification (T007) after routes are fixed

### Parallel Opportunities

- T008 (update Auth.test.js) can run in parallel with T004/T005 (different file, read-only on the fix side)
- T009, T010, T011 (verify login/logout via AuthRoutes) can run in parallel with US1 implementation (read-only verification of existing endpoints)
- T012, T013, T014 (Polish phase) can run in parallel once US1 and US2 are complete

## Parallel Example: User Story 1

```bash
# Write regression test (must fail before fix):
Task: "Write regression test in apps/backend/tests/AdminRoutesStartup.test.js"

# After fix is applied, run verification in parallel:
Task: "Run regression test and confirm it passes"
Task: "Start backend server and confirm it initializes without TypeError"
```

## Parallel Example: User Story 2

```bash
# These can all run in parallel with each other and with US1:
Task: "Update apps/backend/tests/Auth.test.js to use POST /api/admin/login"
Task: "Verify POST /api/admin/login returns 200 with access token"
Task: "Verify POST /api/admin/logout returns 200 and clears cookie"
Task: "Verify POST /api/admin/login with invalid credentials returns 401"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (verify existing infrastructure)
3. Complete Phase 3: User Story 1 (the actual fix - remove broken routes + regression test)
4. **STOP and VALIDATE**: Test User Story 1 independently - backend starts without TypeError
5. Deploy/demo if ready (MVP is the bug fix itself)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! - the bug is fixed)
3. Add User Story 2 → Test independently → Deploy/Demo (login/logout verified via AuthRoutes)
4. Run Polish phase → Full validation complete

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (fix AdminRoutes.js + regression test)
   - Developer B: User Story 2 (update Auth.test.js, verify AuthRoutes login/logout)
3. Stories complete and integrate independently
4. Team runs Polish phase together

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Regression test (T003) MUST fail before the fix (T004, T005) and PASS after
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No new dependencies required; no new stack or framework introduced
- Fix is minimal: delete two lines from AdminRoutes.js

## Pre-Existing Test Issues (not caused by this fix)

The following test files have pre-existing issues that were previously hidden by the AdminRoutes.js crash (which prevented them from loading at all):

| Test File | Issue | Status |
|---|---|---|
| tests/adminProfile.test.js | Mock provides `getUserDetails` but AdminRoutes.js references `getAdminDetails` (line 21). Pre-existing mock mismatch. | Pre-existing |
| tests/AuthService.test.js | `createAdminAuthService` is not a function (import shape mismatch). Pre-existing. | Pre-existing |
| tests/Auth.test.js | Mock targets AuthService.js but vitest mock interception doesn't apply to deeply nested import chain. Login success/session tests return 401 instead of 200. Invalid login test passes. | Pre-existing |

Our regression test (tests/AdminRoutesStartup.test.js) passes 2/2 and confirms the fix works.
