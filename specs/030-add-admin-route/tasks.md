# Tasks: Add Admin Route

**Input**: Design documents from `/specs/030-add-admin-route/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. This feature makes a single `vercel.json` config change; no new source code is added, so no new test files are required. Validation is via the quickstart scenarios plus the existing frontend lint/test suite.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/frontend/src/`, root `vercel.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing project state before making the routing change.

- [X] T001 Review existing vercel.json catch-all rewrite and confirm App.jsx already maps /admin/login and /admin/* (root/vercel.json, apps/frontend/src/App.jsx)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirm auth and route-guard infrastructure that /admin/dashboard depends on already exists.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Confirm AuthContext login/isAuthenticated and ProtectedRoute guard exist for /admin/dashboard (apps/frontend/src/context/AuthContext.jsx, apps/frontend/src/components/ProtectedRoute.jsx)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visitor reaches the admin login page at /admin (Priority: P1) 🎯 MVP

**Goal**: A visitor appending /admin to the main URL reaches the admin sign-in page; after valid login they reach the admin dashboard; invalid login shows an error and stays on the login page.

**Independent Test**: Open the main URL with /admin appended and confirm the admin sign-in page renders (not the campus tour); submit valid credentials and confirm navigation to the admin dashboard.

### Implementation for User Story 1

- [X] T003 [P] [US1] Update vercel.json to scope the rewrite to /admin and /admin/* with destination = SPA entry index.html (replacing the catch-all "/(.*)" → raw .jsx file) (root/vercel.json)
- [X] T004 [US1] Verify /admin renders AdminLoginPage via the dev server (per quickstart.md Scenario 1)
- [X] T005 [US1] Verify valid login navigates to /admin/dashboard using the existing AdminLoginPage onNavigate flow (apps/frontend/src/pages/AdminLoginPage.jsx)

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - Campus tour remains accessible at the main URL (Priority: P1)

**Goal**: A visitor opening the main URL without /admin continues to see the campus tour; no non-/admin path is rewritten to the login page.

**Independent Test**: Open the main campus tour URL without /admin and confirm the campus tour loads; confirm any non-/admin path is not rewritten to the login page.

### Implementation for User Story 2

- [X] T006 [P] [US2] Verify the main URL (no /admin) renders the campus tour, not the admin login page (per quickstart.md Scenario 2)
- [X] T007 [P] [US2] Confirm non-/admin paths are not rewritten to the admin login page (root/vercel.json, per quickstart.md Scenario 6)

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation that affects the whole feature (lint, tests, quickstart).

- [X] T008 [P] Run frontend lint and confirm no errors (npm --prefix apps/frontend run lint)
- [X] T009 [P] Run the frontend test suite and confirm no new failures (npm --prefix apps/frontend run test)
- [X] T010 [P] Run the quickstart validation scenarios for the /admin route (specs/030-add-admin-route/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (US1) and User Story 2 (US2) are independent; either can proceed first
- **Polish (Final Phase)**: Depends on User Story 1 (MVP) completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories. MVP scope.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of US1; verifies no regression of the public tour.

### Within Each User Story

- Core implementation before verification
- Story complete before moving to the next checkpoint
- Verification tasks reference quickstart.md scenarios

### Parallel Opportunities

- T006 and T007 (US2 verification) can run in parallel with each other
- T008, T009, T010 (Polish) can run in parallel with each other
- T003 is the single implementation task; T004/T005 depend on T003 completing

---

## Parallel Example: User Story 2

```bash
# Launch both US2 verification tasks together:
Task: "Verify the main URL renders the campus tour, not the admin login page"
Task: "Confirm non-/admin paths are not rewritten to the admin login page"
```

```bash
# Launch all Polish tasks together:
Task: "Run frontend lint and confirm no errors"
Task: "Run the frontend test suite and confirm no new failures"
Task: "Run the quickstart validation scenarios for the /admin route"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - confirms auth/guard exist)
3. Complete Phase 3: User Story 1 (T003 vercel.json change, then T004/T005 verification)
4. **STOP and VALIDATE**: Test User Story 1 independently via quickstart.md Scenario 1
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (confirms no public-tour regression)
4. Run Polish phase (lint, tests, quickstart)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. One developer completes Setup + Foundational
2. Once Foundational is done:
   - Developer A: User Story 1 (vercel.json edit + verification)
   - Developer B: User Story 2 (public-tour no-regression verification)
3. Both stories complete and integrate independently
4. Either developer runs the Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No new source files are created: the implementation is a single vercel.json edit; App.jsx, AdminLoginPage.jsx, and AdminDashboardPage.jsx already exist and require no changes
- No new test files are created: validation uses the existing quickstart.md scenarios plus the existing frontend lint/test suite
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
