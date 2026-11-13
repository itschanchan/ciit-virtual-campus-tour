# Tasks: Standardize Admin Mongoose Schema

**Input**: Design documents from `/specs/019-standardize-admin-schema/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in the feature specification. No test tasks are included. The constitution Principle III (Test-First Quality Gate) requires tests to be written and observed failing before implementation is accepted; this should be addressed during the implementation phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/backend/`, `apps/frontend/`
- Paths shown below assume the MVC backend structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [x] T001 Verify project structure and dependencies per plan.md (apps/backend/models/Admins.js, apps/backend/services/adminAuthService.js, apps/backend/scripts/create-admin.js)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete. Both user stories depend on the standardized Admin Mongoose model.

- [x] T002 Standardize Admin schema field definitions in apps/backend/models/Admins.js (compact syntax: username, email, password, first_name, last_name; role enum ["admin"] default "admin"; is_active default true; timestamps: true)
- [x] T003 Add pre-save password-hashing middleware to apps/backend/models/Admins.js (bcrypt hash with 10 salt rounds when password field is modified)
- [x] T004 Add comparePassword instance method to apps/backend/models/Admins.js (bcrypt.compare candidate password against stored hash)

**Checkpoint**: Foundation ready - Admin schema is standardized per admin_schema.md reference; user story implementation can now begin

---

## Phase 3: User Story 1 - Create a new admin account (Priority: P1) 🎯 MVP

**Goal**: Enable creation of a new admin account with all required fields (username, email, password, first_name, last_name), hashed password, unique username/email constraints, active status default true, and timestamps.

**Independent Test**: Run the create-admin script with valid data and confirm the admin is stored with all required fields, a hashed password (not plaintext), active status, and createdAt/updatedAt timestamps.

### Implementation for User Story 1

- [x] T005 [US1] Fix import path in apps/backend/scripts/create-admin.js from '../models/Admin.js' to '../models/Admins.js'
- [x] T006 [US1] Update create-admin.js field names in apps/backend/scripts/create-admin.js (passwordHash → password, isActive → is_active, fullName → first_name/last_name handling)
- [x] T007 [US1] Remove manual bcrypt.hash from create-admin.js so the pre-save middleware handles password hashing in apps/backend/scripts/create-admin.js (avoid double-hashing)
- [x] T008 [US1] Verify unique username/email constraints reject duplicate admin creation in apps/backend/scripts/create-admin.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - admin accounts can be created with all required fields and stored correctly.

---

## Phase 4: User Story 2 - Verify admin login credentials (Priority: P2)

**Goal**: Enable credential verification by comparing a submitted password against the stored hash and confirming the account is active.

**Independent Test**: Submit valid and invalid credentials via the login flow and confirm correct acceptance/rejection, including inactive account denial.

### Implementation for User Story 2

- [x] T009 [US2] Reconcile service-layer field names in apps/backend/services/adminAuthService.js (passwordHash → password, isActive → is_active to match standardized schema)
- [x] T010 [US2] Verify login flow uses comparePassword for credential verification in apps/backend/services/adminAuthService.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - accounts can be created and credentials can be verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation that affect multiple user stories

- [x] T011 [P] Run quickstart.md validation scenarios for all 5 test scenarios (admin creation, duplicate rejection, plaintext password check, credential verification, timestamps)
- [x] T012 [P] Verify all admin auth tests pass in apps/backend/tests/adminAuth.test.js

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories (T002 → T003 → T004 sequential, all modify Admins.js)
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - Depends on standardized Admin model from Phase 2
  - User stories can proceed in parallel (if staffed) or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on standardized Admin model with comparePassword method

### Within Each User Story

- Models (Phase 2) before services
- Services before endpoints/scripts
- Core implementation before validation
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003, T004: NOT parallel - all modify Admins.js sequentially
- T005, T006, T007, T008 (US1): Sequential - all modify create-admin.js
- T009, T010 (US2): Sequential - both modify adminAuthService.js
- T011, T012 (Polish): [P] - parallel, different validation concerns
- Once Foundational completes, US1 and US2 can be worked on in parallel by different team members

### Parallel Example: User Story 1

```bash
# US1 tasks are sequential (same file), but US1 and US2 can run in parallel:
# Developer A: US1 tasks (T005-T008) in apps/backend/scripts/create-admin.js
# Developer B: US2 tasks (T009-T010) in apps/backend/services/adminAuthService.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently via create-admin script
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (create-admin.js)
   - Developer B: User Story 2 (adminAuthService.js)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- Tasks without [P] modify the same file and must be sequential
- [Story] label maps task to specific user story for traceability
- Setup and Foundational phases have NO story labels
- User Story phases MUST have story labels ([US1], [US2])
- Polish phase has NO story label
- Field-naming reconciliation (passwordHash→password, isActive→is_active, fullName→first_name/last_name) is documented in research.md Decision 5
- create-admin.js import path bug (Admin.js → Admins.js) must be fixed
- Manual bcrypt.hash in create-admin.js (12 rounds) must be removed to avoid double-hashing with pre-save middleware (10 rounds)
