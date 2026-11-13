# Tasks: Remove Env Config File and Use Inline Method

**Input**: Design documents from `/specs/021-remove-env-config/`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/startup-contract.md`, `quickstart.md`

**Tests**: Included because Constitution III (NON-NEGOTIABLE) requires backend Vitest/Supertest coverage, and the plan requires migrating every suite that currently depends on `createApp`.

**Organization**: Tasks are grouped by user story. The three P1 stories share `apps/backend/index.js`, so their implementation order is US1 → US2 → US3 and same-file tasks are deliberately sequential.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Backend application: `apps/backend/`
- Backend tests: `apps/backend/tests/`
- Feature documentation: `specs/021-remove-env-config/`
- Repository documentation: `AGENTS.md` and `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the repository is ready for the exact design in `plan.md`.

- [X] T001 [P] Confirm `apps/backend/config/env.js` and `apps/backend/app.js` are absent, then audit `apps/backend/index.js`, `apps/backend/config/db.js`, `apps/backend/services/AdminAuthService.js`, and `apps/backend/tests/*.test.js` for stale `loadEnv`, `createApp`, `readPort`, `readNodeEnv`, and direct-execution references
- [X] T002 [P] Verify `apps/backend/.env.example` contains `PORT`, `NODE_ENV`, `MONGODB_URI`, `MONGODB_NAME`, and `JWT_SECRET`, and does not contain `CORS_ORIGIN` or `RAWG_API_KEY`
- [X] T003 [P] Verify the local `apps/backend/.env` has a non-empty `JWT_SECRET` and is ignored by Git; do not edit or commit the file

**Checkpoint**: The baseline, environment template, and local secret are ready.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared test configuration and a recorded pre-change baseline.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Confirm `apps/backend/vitest.config.js` supplies `NODE_ENV=test` and `JWT_SECRET=test-only-jwt-secret` through `test.env`; add either value only if missing
- [X] T005 Run `npm --prefix apps/backend run test` against `apps/backend/tests/*.test.js` and record the baseline: 17 passed / 2 `startup.test.js` failures because `index.js` has no default app export and still exports `createApp`; do not change source files yet

**Checkpoint**: Test isolation is configured and the pre-change baseline is documented.

---

## Phase 3: User Story 1 - Backend starts as a single self-contained entry point without env.js or app.js (Priority: P1) 🎯 MVP

**Goal**: `apps/backend/index.js` creates one module-scope Express app, wires middleware/routes/error handling inline, exports it as the default export, and defines no `createApp` factory. Tests import that default app and replace service modules with Vitest mocks. `JWT_SECRET` remains mandatory with no fallback.

**Independent Test**: Run `npm --prefix apps/backend run test -- tests/health.test.js tests/adminAuth.test.js tests/adminAuthService.test.js` with `NODE_ENV=test` and no MongoDB; confirm all three pass and `Select-String -Path apps/backend/index.js -Pattern 'createApp|readPort|readNodeEnv'` returns nothing.

### Tests for User Story 1 (REQUIRED by Constitution III) ⚠️

> **NOTE: Write these tests FIRST and confirm T009 fails before T010/T011 implementation.**

- [X] T006 [P] [US1] Rewrite `apps/backend/tests/health.test.js` to import the default `app` from `../index.js` and replace `services/HealthService.js` with `vi.mock` plus `vi.hoisted` mutable status state; keep the 200 healthy, 503 unavailable, and 404 not-found cases
- [X] T007 [P] [US1] Rewrite `apps/backend/tests/adminAuth.test.js` to import the default `app` from `../index.js` and replace `services/AdminAuthService.js` with `vi.mock` plus `vi.hoisted` login/logout/getSessionUser handlers; keep the successful login cookie, invalid login 401, and valid session 200 cases, and remove the JWT configuration test
- [X] T008 [P] [US1] Add `apps/backend/tests/adminAuthService.test.js` that imports the real `createAdminAuthService` from `../services/AdminAuthService.js` and asserts a missing or blank `jwtSecret` throws `JWT_SECRET is required.`
- [X] T009 [US1] Run `npm --prefix apps/backend run test -- tests/health.test.js tests/adminAuth.test.js tests/adminAuthService.test.js` and confirm the health/admin suites fail because `index.js` still exports `createApp` instead of a default app; do not restore `app.js` or `config/env.js`

### Implementation for User Story 1

- [X] T010 [US1] Rewrite `apps/backend/index.js` as a module-scope `const app = express()` with `dotenv.config()`, `const PORT = process.env.PORT || 3000`, `const ALLOWED_ORIGINS = ['http://localhost:5173']`, middleware in the order `express.json()` → `cookieParser()` → `cors({ origin: ALLOWED_ORIGINS, credentials: true })`, `/api/health`, `/api/admin`, `notFoundHandler`, `errorHandler`, and `export default app`; remove `createApp`, `readPort`, `readNodeEnv`, `checkCorsOrigin`, `createDefaultApp`, the `x-powered-by` suppression, and the `node:path`/`node:url` imports (no startup block yet)
- [X] T011 [US1] Add a small `requireAdminAuthService()` wrapper in `apps/backend/index.js` that calls `createAdminAuthService()`, logs `Configuration error: JWT_SECRET is required.` and exits with code 1 when construction fails, and use it when wiring `createAdminAuthRoutes`
- [X] T012 [P] [US1] Confirm `apps/backend/services/AdminAuthService.js` still reads `process.env.JWT_SECRET` at call time, throws `JWT_SECRET is required.` when empty, has no hardcoded fallback, and has no module-scope singleton or default export
- [X] T013 [US1] Run `npm --prefix apps/backend run test -- tests/health.test.js tests/adminAuth.test.js tests/adminAuthService.test.js` and confirm all three suites pass without a live MongoDB connection

**Checkpoint**: User Story 1 is independently functional: the default app is self-contained, endpoint tests pass with mocks, and JWT configuration fails fast.

---

## Phase 4: User Story 2 - Database connection uses inline URI validation (Priority: P1)

**Goal**: `connectDB` validates `MONGODB_URI` itself, and `index.js` awaits it before `app.listen()`. Missing, invalid, or failed connections log a safe message and exit with code 1 before the server listens.

**Independent Test**: Run `npm --prefix apps/backend run test -- tests/env.test.js tests/startup.test.js`; confirm URI validation/redaction passes and a child process with `MONGODB_URI=''` exits with code 1, prints `MONGODB_URI is required.`, and never prints a listening message.

### Tests for User Story 2 (REQUIRED by Constitution III) ⚠️

> **NOTE: Write these tests FIRST and confirm T016 fails before T017 implementation.**

- [X] T014 [P] [US2] Rewrite `apps/backend/tests/env.test.js` to remove the `readPort`/`readNodeEnv` suites; keep `connectDB` missing-URI, invalid-scheme, and URI-redaction cases, and add a case that `connectDB()` reads `process.env.MONGODB_URI` at call time using `vi.stubEnv` and a mocked `mongoose.connect`
- [X] T015 [P] [US2] Add a startup-failure case to `apps/backend/tests/startup.test.js` using `spawnSync` from `node:child_process`: run a child `node --input-type=module -e "import('./index.js')"` with `NODE_ENV=development`, a valid `JWT_SECRET`, and `MONGODB_URI=''`; assert exit code 1, stderr containing `MONGODB_URI is required.`, and no listening or MongoDB-success output
- [X] T016 [US2] Run `npm --prefix apps/backend run test -- tests/env.test.js tests/startup.test.js` and confirm the new startup-failure case fails because `index.js` has no startup block yet

### Implementation for User Story 2

- [X] T017 [US2] Add the startup block to `apps/backend/index.js` inside `if (process.env.NODE_ENV !== "test")`: import `connectDB`, `await connectDB({ uri: process.env.MONGODB_URI, dbName: process.env.MONGODB_NAME })` inside `try`, log `MongoDB connection established.` on success, and on failure log `error.message` then `process.exit(1)` before any `app.listen()` call; then call `app.listen(PORT, ...)` and keep `registerShutdownHandlers(server)` for `SIGINT`/`SIGTERM`
- [X] T018 [P] [US2] Confirm `apps/backend/config/db.js` validates URI presence and the `mongodb://`/`mongodb+srv://` scheme, wraps connection failures as `MongoDB connection failed (<error name>).`, contains no `process.exit`, and never logs the URI
- [X] T019 [US2] Run `npm --prefix apps/backend run test -- tests/env.test.js tests/startup.test.js` and confirm URI validation, redaction, and exit-before-listen behavior pass

**Checkpoint**: User Story 2 is independently functional: database validation and fail-fast startup behavior are verified.

---

## Phase 5: User Story 3 - Server listens only outside the test environment (Priority: P1)

**Goal**: The start condition is exactly `if (process.env.NODE_ENV !== "test")`, with no direct-execution detection or path/url machinery. Importing `index.js` under tests binds no port and opens no database connection, and the module exposes only the default app.

**Independent Test**: Run `npm --prefix apps/backend run test -- tests/startup.test.js`; confirm a child import with `NODE_ENV=test` prints `function`, exits 0, and logs no listening or MongoDB connection message, and that `createApp`, `readPort`, and `readNodeEnv` are not exported.

### Tests for User Story 3 (REQUIRED by Constitution III) ⚠️

- [X] T020 [US3] Extend `apps/backend/tests/startup.test.js` to assert the default export is a function, `createApp`/`readPort`/`readNodeEnv` are undefined, and a child import with `NODE_ENV=test` prints `function`, exits 0, and contains no listening or MongoDB connection output

### Implementation for User Story 3

- [X] T021 [US3] Run `npm --prefix apps/backend run test -- tests/startup.test.js` and confirm the export-contract and test-import cases pass; if any fail, adjust `apps/backend/index.js` without reintroducing a factory
- [X] T022 [US3] Verify `apps/backend/index.js` uses the exact gate `if (process.env.NODE_ENV !== "test")`, contains no `node:path`, `node:url`, `process.argv`, or `import.meta.url` direct-execution logic, and has `export default app` as its only export

**Checkpoint**: All three user stories are independently functional and the test-import contract is satisfied.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, security review, and end-to-end validation across all stories.

- [X] T023 [P] Update `AGENTS.md` so the constraints describe one module-scope app exported as default in `apps/backend/index.js`, the `NODE_ENV !== "test"` gate, and connect-before-listen ordering
- [X] T024 [P] Update `docs/tech_stack.md` to remove the claim that `PORT` and `NODE_ENV` are validated, and to describe `const PORT = process.env.PORT || 3000`, the hardcoded CORS allowlist, mandatory `JWT_SECRET`, and connect-before-listen
- [X] T025 [P] Audit `apps/backend/` for `createApp`, `readPort`, `readNodeEnv`, `loadEnv`, `config/env.js`, `app.js`, `CORS_ORIGIN`, `RAWG_API_KEY`, `process.argv`, and `ciit-dev-secret`; remove any remaining production or test references
- [X] T026 [P] Review `apps/backend/index.js`, `apps/backend/config/db.js`, and `apps/backend/services/AdminAuthService.js` for KISA compliance: maximum indent level 3, no monolithic block over 30 lines of active logic, and clear early returns
- [X] T027 Run `npm --prefix apps/backend run test` across `apps/backend/tests/*.test.js` and fix any failures before proceeding
- [X] T028 Run every scenario in `specs/021-remove-env-config/quickstart.md` that does not require a live MongoDB: missing `JWT_SECRET`, missing/invalid `MONGODB_URI`, test import, `PORT` fallback review, CORS allowlist, and the syntax parity greps; record any live-startup step blocked by an unreachable database
- [X] T029 [P] Confirm `apps/backend/.env.example` is tracked, `apps/backend/.env` remains ignored, and run `npm run verify:ignore`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001–T003 can run in parallel.
- **Foundational (Phase 2)**: Depends on Setup. T004 must complete before T005.
- **User Stories (Phases 3–5)**: All depend on Foundational completion.
  - **US1 (Phase 3)** establishes the module-scope app and test access.
  - **US2 (Phase 4)** depends on US1 because the startup block is added to the same `index.js`.
  - **US3 (Phase 5)** depends on US2 because the test-import contract is only meaningful once the startup block exists.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational. No dependency on other stories. Delivers the default app, endpoint tests, and JWT fail-fast.
- **US2 (P1)**: Depends on US1. Adds URI-driven startup and exit-before-listen behavior.
- **US3 (P1)**: Depends on US1 and US2. Verifies and finalizes the `NODE_ENV` gate and export contract.

### Within Each User Story

- Tests MUST be written and fail before implementation.
- T006/T007/T008 before T009.
- T009 before T010/T011/T012.
- T010 before T011 (same file).
- T013 after T010/T011/T012.
- T014/T015 before T016.
- T016 before T017.
- T017 before T019; T018 can run beside T017.
- T020 before T021/T022.
- Story verification tasks (T013, T019, T021) run after their story implementation.
- Same-file tasks run sequentially: T010, T011, T017, and T022 all edit `apps/backend/index.js`.

### Parallel Opportunities

- **Setup**: T001, T002, and T003 target different files or read-only checks.
- **US1 tests**: T006, T007, and T008 target different test files.
- **US1 implementation**: T010 (`index.js`) and T012 (`AdminAuthService.js`) touch different files.
- **US2 tests**: T014 (`env.test.js`) and T015 (`startup.test.js`) touch different files.
- **US2 implementation**: T017 (`index.js`) and T018 (`config/db.js`) touch different files.
- **Polish**: T023, T024, T025, T026, and T029 are independent documentation, audit, or verification tasks.

---

## Parallel Example: User Story 1

```text
Task: "Rewrite apps/backend/tests/health.test.js with default app and vi.mock" (T006)
Task: "Rewrite apps/backend/tests/adminAuth.test.js with default app and vi.mock" (T007)
Task: "Add apps/backend/tests/adminAuthService.test.js for the JWT requirement" (T008)
```

```text
Task: "Rewrite apps/backend/index.js app wiring and default export" (T010)
Task: "Confirm apps/backend/services/AdminAuthService.js requires JWT_SECRET" (T012)
```

## Parallel Example: User Story 2

```text
Task: "Rewrite apps/backend/tests/env.test.js for connectDB only" (T014)
Task: "Add the missing-URI startup failure case to apps/backend/tests/startup.test.js" (T015)
```

```text
Task: "Add the connect-before-listen startup block to apps/backend/index.js" (T017)
Task: "Confirm apps/backend/config/db.js validates URIs and redacts errors" (T018)
```

## Parallel Example: Polish

```text
Task: "Update AGENTS.md backend constraints" (T023)
Task: "Update docs/tech_stack.md startup and configuration notes" (T024)
Task: "Audit apps/backend for stale factory and env references" (T025)
Task: "Run the KISA review across backend startup files" (T026)
Task: "Verify .env.example and the ignore policy" (T029)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1 (self-contained default app, mocked endpoint tests, JWT fail-fast).
4. **STOP and VALIDATE**: Run `npm --prefix apps/backend run test -- tests/health.test.js tests/adminAuth.test.js tests/adminAuthService.test.js`.
5. Demo the app wiring only; live startup still needs US2 and US3.

### Incremental Delivery

1. Complete Setup + Foundational → test isolation and baseline ready.
2. Add US1 → default app and endpoint tests pass → MVP app layer.
3. Add US2 → URI validation, connect-before-listen, and exit-before-listen behavior pass.
4. Add US3 → `NODE_ENV` gate and test-import contract pass.
5. Complete Polish → docs, audits, full suite, and quickstart validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Developer A completes US1 because it rewrites `apps/backend/index.js`.
3. Developer B prepares US2 test files (`env.test.js`, `startup.test.js`) in parallel, then waits for US1 before editing `index.js`.
4. Developer C prepares documentation and audits in parallel, then validates after US2/US3.
5. Finish with the full suite, quickstart, and ignore-policy checks.

---

## Notes

- [P] tasks touch different files or are read-only audits with no file conflicts.
- [Story] labels map tasks to `spec.md` user stories for traceability.
- Tests are included because Constitution III is non-negotiable.
- Same-file tasks are deliberately sequential: `apps/backend/index.js` is edited by T010, T011, T017, and T022.
- Do not restore `apps/backend/config/env.js` or `apps/backend/app.js` to make tests pass; migrate tests to the default app and `vi.mock`.
- Do not commit `apps/backend/.env` or secrets; only `.env.example` belongs in version control.
- The design intentionally omits `readPort`/`readNodeEnv`: `PORT` uses `process.env.PORT || 3000` and `NODE_ENV` is only compared with `"test"`.
