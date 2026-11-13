# Implementation Plan: Remove Env Config File and Use Inline Method

**Branch**: `021-remove-env-config` | **Date**: 2026-11-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/021-remove-env-config/spec.md`

## Summary

Remove `config/env.js` and `app.js` and make `apps/backend/index.js` the single self-contained entry point, following the handshake pattern in `docs/prompts/backend-prompts/main_backend_syntax.md`:

- create one module-scope Express `app` and export it as the default export;
- do not define or export a `createApp` factory;
- use `const PORT = process.env.PORT || 3000`;
- start the server only inside `if (process.env.NODE_ENV !== "test")`;
- `await connectDB()` before `app.listen()`;
- log a safe message and exit with code 1 when the connection fails;
- keep `JWT_SECRET` mandatory with no hardcoded fallback.

This plan reflects the clarifying answers recorded on 2026-11-13: backend tests import the default `app` and replace service modules with Vitest mocks; the start condition is the document's `NODE_ENV` check; and MongoDB connects before the server listens.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js LTS

**Primary Dependencies**: express, mongoose, dotenv, cors, cookie-parser, jsonwebtoken, bcrypt (all existing; no new dependencies)

**Storage**: MongoDB via Mongoose

**Testing**: Vitest with Supertest. Tests import the default `app` and use `vi.mock` with `vi.hoisted` to replace `services/HealthService.js` and `services/AdminAuthService.js`. A separate unmocked test file covers the `JWT_SECRET` requirement. `vitest.config.js` supplies `NODE_ENV=test` and a test-only `JWT_SECRET`.

**Target Platform**: Linux server / Node.js runtime

**Project Type**: web-service (backend API)

**Performance Goals**: Configuration is read once at startup; MongoDB is connected before the listener accepts requests; test imports bind zero ports and open zero database connections.

**Constraints**: MERN stack and ES Modules are non-negotiable. `index.js` remains the entry point. `env.js` and `app.js` remain deleted. No factory helpers (`createApp`, `readPort`, `readNodeEnv`). No direct-execution detection. `PORT` uses `process.env.PORT || 3000` without validation. Required values (`MONGODB_URI`, `JWT_SECRET`) are validated at startup. CORS uses a hardcoded allowlist. Secrets are never logged. No new packages.

**Scale/Scope**: `apps/backend/index.js`, `config/db.js`, `services/AdminAuthService.js`, `vitest.config.js`, five backend test files, `.env.example`, and setup/configuration documentation. No frontend changes.

## Baseline Findings

The working tree still contains the previous design, which the clarified spec supersedes:

1. **Factory removal required.** `index.js` exports `createApp` and `readPort`/`readNodeEnv`; the spec now forbids all three.
2. **Start condition changes.** The direct-execution check (`process.argv[1]` vs `import.meta.url`) must be replaced by the document's `NODE_ENV !== "test"` check.
3. **Connection ordering changes.** `connectDB()` currently runs before `app.listen()`; this is retained and the listen-first clarification is withdrawn.
4. **Tests depend on the factory.** Every endpoint test calls `createApp`; they must import the default `app` and mock service modules instead.
5. **Configuration validation narrows.** `PORT` and `NODE_ENV` validation is removed; URI and JWT validation remain mandatory.
6. **Design artifacts are stale.** `research.md`, `data-model.md`, `contracts/startup-contract.md`, `quickstart.md`, and `tasks.md` still describe the factory design.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Notes |
|-----------|--------|-------|
| I. MERN Stack Alignment | PASS | MongoDB + Mongoose, Express, React untouched, JavaScript ES Modules. No new dependencies. |
| II. MVC Separation | PASS | `index.js` remains the entry point and absorbs only app wiring. Controllers, services, models, routes, and utilities keep their responsibilities. |
| III. Test-First Quality Gate | PASS WITH REQUIRED TEST TASKS | Endpoint tests import the default app with `vi.mock`; the `JWT_SECRET` requirement gets a dedicated unmocked test; `npm --prefix apps/backend run test` must pass. |
| IV. Security and Configuration | PASS | `connectDB` validates `MONGODB_URI`; `createAdminAuthService` requires `JWT_SECRET`; CORS stays an explicit allowlist; secrets are never logged. `PORT` and `NODE_ENV` are optional settings, so the clarification to skip their validation does not violate the required-variable rule. |
| V. Responsive and Accessible Experience | N/A | Backend-only feature; no user-facing UI changes. |

No constitution violations. Complexity Tracking is not required.

## Project Structure

### Documentation (this feature)

```text
specs/021-remove-env-config/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── startup-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks - regenerate)
```

### Source Code (repository root)

```text
apps/backend/
├── index.js                     # Module-scope app, inline middleware/routes, NODE_ENV gate, connect before listen
├── config/
│   └── db.js                    # URI validation, throwing connection contract, isDatabaseReady
├── services/
│   ├── AdminAuthService.js      # JWT secret required; no hardcoded fallback
│   └── (other services unchanged)
├── vitest.config.js             # Test-only NODE_ENV and JWT_SECRET
├── .env.example                 # Restored local setup template
├── tests/
│   ├── health.test.js           # Default app with mocked HealthService
│   ├── adminAuth.test.js        # Default app with mocked AdminAuthService
│   ├── adminAuthService.test.js # Real service; JWT_SECRET required
│   ├── env.test.js              # connectDB validation and URI redaction
│   └── startup.test.js          # Default export and NODE_ENV=test child import
├── controllers/                 # Unchanged
├── models/                      # Unchanged
├── routes/                      # Unchanged
├── shared/                      # Unchanged
└── utils/                       # Unchanged
```

### Repository documentation

```text
docs/tech_stack.md               # Inline configuration, NODE_ENV gate, CORS allowlist
AGENTS.md                        # Backend setup/environment instructions
specs/021-remove-env-config/contracts/startup-contract.md
specs/021-remove-env-config/quickstart.md
```

**Structure Decision**: Existing monorepo backend layout under `apps/backend`. `index.js` is modified in place; `config/env.js` and `app.js` stay deleted. Following the syntax document, `index.js` creates the Express app directly at module scope and exports it as the default export. The only helper retained is a small `requireAdminAuthService()` wrapper that converts a missing `JWT_SECRET` into the contract's `Configuration error: ...` message and exit code 1.

## Requirement Traceability

| Requirement | Design Response |
|-------------|-----------------|
| FR-001 remove `config/env.js` | File stays deleted; no imports remain. |
| FR-002 no `loadEnv` import | Configuration is read inline; no validation module returns. |
| FR-003 inline environment reads | `PORT` via `process.env.PORT || 3000`; `NODE_ENV` gate; `MONGODB_URI`/`MONGODB_NAME` read by `connectDB`; `JWT_SECRET` read by the auth service. |
| FR-004 start only outside tests | `if (process.env.NODE_ENV !== "test") { ... }` exactly as the syntax document shows. |
| FR-005 DB connection before requests | `await connectDB()` runs before `app.listen()`; missing/invalid/failed connections log a safe message and exit 1. |
| FR-006 no secrets in logs | `connectDB` wraps errors with the error name only; `index.js` logs the safe message and never the URI. |
| FR-007 hardcoded CORS allowlist | `ALLOWED_ORIGINS = ['http://localhost:5173']` passed to `cors()` with credentials. |
| FR-008 remove `app.js`, no factory | `app` is a module-scope instance wired inline; `createApp` is not defined or exported. |
| SC-001 no `env.js` at startup | No startup or module import references `config/env.js`. |
| SC-002 no requests before DB | `app.listen()` follows the awaited `connectDB()` call. |
| SC-003 no database secrets in output | Connection errors use `error.name`; tests assert URI redaction. |
| SC-004 test imports safe | `NODE_ENV=test` skips `connectDB()` and `app.listen()`; the default app remains usable with Supertest. |
| SC-005 missing/invalid URI fails | `connectDB` throws before `app.listen()`; `index.js` exits with code 1. |
| Constitution III | Test migration to default-app + `vi.mock`, plus passing Vitest/Supertest coverage, is mandatory. |
| Constitution IV | Required values validated at startup; mandatory `JWT_SECRET`; explicit CORS allowlist; no secret logging. |

## Design Phases

### Phase 0: Research

`research.md` records the clarified decisions: module-scope app without a factory, `NODE_ENV`-only start gate, connect-before-listen ordering, mock-based test access, mandatory `JWT_SECRET`, `PORT` fallback without validation, CORS allowlist, and safe database failure handling. No `NEEDS CLARIFICATION` items remain.

### Phase 1: Design and Contracts

- `data-model.md` updates the environment, application export, database connection, and HTTP server entities.
- `contracts/startup-contract.md` defines the required environment, startup order, the single default export, test-import behavior, and error behavior.
- `quickstart.md` provides runnable verification scenarios for startup, tests, invalid configuration, and CORS.

## Implementation Order

1. **Entry point**: replace `index.js` with the module-scope app, inline middleware/routes, `NODE_ENV` gate, and awaited connection before listening; delete `createApp`, `readPort`, and `readNodeEnv`.
2. **Services and connection**: keep `JWT_SECRET` mandatory with no fallback; keep `connectDB` throwing safe errors.
3. **Tests**: migrate `health.test.js` and `adminAuth.test.js` to the default app with `vi.mock`; add `adminAuthService.test.js`; rewrite `env.test.js`; rewrite `startup.test.js`.
4. **Setup and documentation**: restore `.env.example`, update `AGENTS.md`, `docs/tech_stack.md`, and the quickstart.
5. **Verification**: run the backend suite and the quickstart failure/success scenarios.

## Post-Design Constitution Re-check

After Phase 1 design, no new stack, framework, dependency, or folder boundary is introduced. The design preserves the MERN/ESM stack, keeps `index.js` as the entry point, adds the required test migration, and keeps required-value validation. All gates remain PASS.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Not applicable. The module-scope app and the small auth-service guard are direct entry-point wiring, not a new architectural layer.
