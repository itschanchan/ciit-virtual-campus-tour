# Tasks: Admin Login and Dashboard

**Input**: Design documents from `specs/017-admin-auth-dashboard/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/admin-auth-api.md`

**Tests**: Included because the constitution requires Vitest coverage for login, protected-route access, and dashboard workflows. Write each test task first and confirm it fails before implementation.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: tasks that can run in parallel when they touch different files and are not blocked by previous work
- **[Story]**: user story label (`US1`, `US2`)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current stack, dependency gate, and test baseline before auth changes

- [X] T001 [P] Review `apps/backend/package.json`, `apps/frontend/package.json`, and `docs/tech_stack.md` to confirm the approved stack and identify the required dependency approval for `bcrypt`
- [X] T002 [P] Confirm the current backend and frontend Vitest suites are runnable and note the expected failing tests before implementing auth changes
- [X] T003 [P] Update `docs/tech_stack.md` to record the `bcrypt` dependency approval and the password-hashing requirement for the admin feature
- [X] T004 [P] Add the `bcrypt` dependency to `apps/backend/package.json` only after the approval record is in place, and confirm the backend install is complete

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the backend auth base used by all protected admin flows

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 [P] Add startup configuration validation inline in `apps/backend/index.js` for MongoDB URI, JWT secret, and cookie settings
- [X] T006 [P] Update `apps/backend/utils/auth.js` with JWT creation, verification, and HTTP-only cookie helpers used by login and route protection
- [X] T007 [P] Create `apps/backend/models/Admins.js` with the admin schema, unique username/email rules, and secure password storage fields
- [X] T008 Create `apps/backend/services/AuthService.js` to verify credentials, issue JWTs, validate admin sessions, and centralize auth logic
- [X] T009 Create `apps/backend/controllers/AdminController.js` to handle login, logout, and session lookup HTTP responses
- [X] T010 Create `apps/backend/routes/AdminRoutes.js` and register the routes in `apps/backend/index.js` for login, logout, and session-check endpoints
- [X] T011 Create backend auth middleware in `apps/backend/utils/auth.js` or a dedicated guard to reject unauthenticated requests on protected admin routes

**Checkpoint**: The auth foundation is ready; login and protected-route flows can now proceed in parallel with frontend work.

---

## Phase 3: User Story 1 - Secure administrator login (Priority: P1) 🎯 MVP

**Goal**: Valid admin users can log in through a secure backend flow, create a session cookie, and be redirected to `/admin`.

**Independent Test**: Submit valid and invalid credentials through the admin login API and UI, verify a JWT cookie is set, and confirm that a bad password or unknown user is rejected cleanly.

### Tests for User Story 1 ⚠️

> NOTE: Write these tests FIRST and confirm they fail before implementing.

- [X] T012 [P] [US1] Add failing backend contract tests in `apps/backend/tests/adminAuth.test.js` covering valid login, invalid credentials, missing username/password, and expired-token rejection
- [X] T013 [P] [US1] Add failing frontend test in `apps/frontend/tests/AdminLoginPage.test.jsx` covering successful login redirect, invalid login feedback, and redirect-for-authenticated-admin behavior

### Implementation for User Story 1

- [X] T014 [US1] Implement `apps/backend/models/Admins.js` password verification behavior and credential lookup rules for admin accounts
- [X] T015 [US1] Implement `apps/backend/services/AuthService.js` login and session validation logic, including bcrypt comparison and JWT generation
- [X] T016 [US1] Implement `apps/backend/controllers/AdminController.js` login, logout, and session endpoints matching the API contract in `specs/017-admin-auth-dashboard/contracts/admin-auth-api.md`
- [X] T017 [US1] Implement `apps/backend/routes/AdminRoutes.js` and wire it into `apps/backend/index.js` with the proper auth middleware and cookie settings
- [X] T018 [US1] Create `apps/frontend/src/components/AdminLoginForm.jsx` with username/email and password fields, submit validation, and login error messaging
- [X] T019 [US1] Create `apps/frontend/src/pages/AdminLoginPage.jsx` and route it into the app so public admin login screens appear without exposing other app content
- [X] T020 [US1] Create `apps/frontend/src/lib/adminApi.js` to call `/api/admins/login`, `/api/admins/logout`, and `/api/admins/session`
- [X] T021 [US1] Add frontend auth state handling in `apps/frontend/src/context/AuthContext.jsx` and ensure authenticated admins are redirected away from the login page
- [X] T022 [US1] Run the Story 1 backend and frontend tests and fix all failures before moving to the next story

**Checkpoint**: The admin login flow works independently and is ready for protected dashboard access.

---

## Phase 4: User Story 2 - Protected admin dashboard shell (Priority: P2)

**Goal**: Authenticated administrators can reach a protected `/admin` dashboard with responsive navigation, overview content, profile information, logout, and a Gallery Manager placeholder.

**Independent Test**: Open `/admin` as an anonymous user and confirm redirection to login; sign in as an admin and confirm the dashboard loads with overview, profile, sidebar, and logout controls.

### Tests for User Story 2 ⚠️

- [X] T023 [P] [US2] Add failing frontend test in `apps/frontend/tests/AuthGuard.test.jsx` covering anonymous redirect and authenticated access to the dashboard
- [X] T024 [P] [US2] Add failing dashboard test in `apps/frontend/tests/AdminDashboardPage.test.jsx` covering overview, profile section, sidebar navigation, and logout flow

### Implementation for User Story 2

- [X] T025 [US2] Create `apps/frontend/src/components/ProtectedRoute.jsx` to gate dashboard access and redirect unauthenticated users to the login page
- [X] T026 [US2] Create `apps/frontend/src/components/AdminSidebar.jsx` with a responsive sidebar and a Gallery Manager placeholder navigation item
- [X] T027 [US2] Create `apps/frontend/src/components/AdminLayout.jsx` to render the page shell with sidebar and content area consistent with the admin experience
- [X] T028 [US2] Create `apps/frontend/src/pages/AdminDashboardPage.jsx` with a dashboard overview, administrator profile section, and the protected layout wrapper
- [X] T029 [US2] Update `apps/frontend/src/App.jsx` to route the public login page and protected dashboard route based on auth state
- [X] T030 [US2] Ensure logout clears the JWT cookie and returns the user to the login page through the same auth context mechanism
- [X] T031 [US2] Run the Story 2 tests and fix all failures until the dashboard route behavior is stable

**Checkpoint**: The dashboard is accessible only to authenticated administrators and behaves correctly on desktop and mobile widths.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, responsive checks, and quality gates for the release

- [X] T032 [P] Run `npm --prefix apps/backend run test` and fix all failing auth tests in `apps/backend/tests/adminAuth.test.js`
- [X] T033 [P] Run `npm --prefix apps/frontend run test` and fix all failing login/protected-route/dashboard tests in `apps/frontend/tests/`
- [X] T034 [P] Run `npm --prefix apps/frontend run lint` and resolve any ESLint or formatting issues in the frontend source
- [X] T035 [P] Run `npm --prefix apps/frontend run build` and confirm the admin login and dashboard shell are production-safe
- [X] T036 [P] Execute the manual validation scenarios in `specs/017-admin-auth-dashboard/quickstart.md` at desktop and mobile widths, checking form validation, redirect behavior, logout, and responsive layout
- [X] T037 [P] Verify no secrets or credentials were committed and that the implementation remains inside the approved stack and protected-scope boundaries
- [X] T038 [P] Review the final admin auth flow for accessible keyboard use, visible focus states, and no public registration path
- [X] T039 [P] Add regression test asserting no public admin registration route exists (covers FR-009)
- [X] T040 [P] Add test for session persistence across tab refresh and new-tab re-auth requirement (covers FR-025)
- [X] T041 [P] Fix existing broken test suites: repair imports in `adminProfile.test.js` and `AuthService.test.js`, and restore 0-test suites `Auth.test.js` and `startup.test.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundations; can proceed once the backend auth base is ready
- **User Story 2 (Phase 4)**: Depends on Foundations and the login flow; can proceed after Story 1 is stable
- **Polish (Phase 5)**: Depends on all required user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Base auth flow and login API; no dependency on other features
- **User Story 2 (P2)**: Depends on Story 1 for admin session availability and login redirect behavior

### Within Each User Story

- Write tests first and confirm they fail
- Build the backend logic before the frontend route interaction
- Keep the dashboard shell independent from gallery CRUD or Marzipano features
- Validate the story before moving to the next one

### Parallel Opportunities

- T001–T004 can run in parallel because they touch docs and package metadata without conflicting with app logic
- T005–T007 can run in parallel because they create independent foundation files
- T012 and T013 (the failing tests) should be created in parallel once the backend and frontend file paths are known
- T023 and T024 can run in parallel once the dashboard shell is being tested
- T032–T038 can run in parallel after the feature is complete, provided they are separately validated in the same pass

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational
2. Complete User Story 1
3. Stop and validate valid/invalid login and cookie-based redirect behavior
4. Only then continue to the dashboard shell

### Incremental Delivery

1. Setup + Foundations → backend auth primitives available
2. User Story 1 → secure login and session cookie
3. User Story 2 → protected dashboard shell
4. Polish phase → tests, lint, build, and quickstart validation

---

## Notes

- `[P]` marks tasks that can run in parallel when they touch different files and have no incomplete dependency
- Tests are mandatory under constitution Principle III
- The `bcrypt` dependency is a required approval gate and must be recorded before installation
- The dashboard shell must remain within feature scope; gallery management and Marzipano features stay out of scope
- Commit after each logical task group or once a story passes its own validation
