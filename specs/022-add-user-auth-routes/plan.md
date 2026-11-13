# Implementation Plan: Add User Management and Auth Routes

**Branch**: `022-add-user-auth-routes` | **Date**: 2026-11-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/022-add-user-auth-routes/spec.md`

## Summary

Add user management routes (create, read by id, update, activate/deactivate, delete) plus authentication routes (register, login, refresh token, logout) to the backend. Reorganize route files: create `AdminRoutes.js` for user management endpoints, rename `AdminAuthRoutes.js` to `AuthRoutes.js` for authentication endpoints, and add the supporting controllers (`UserController`, `GamesController`, `AuthController`) and `requireRole` middleware. Mount both route sets in `index.js` so they are served under distinct API paths.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js LTS

**Primary Dependencies**: express, mongoose, dotenv, cors, cookie-parser, jsonwebtoken (all existing; no new dependencies)

**Storage**: MongoDB via Mongoose

**Testing**: Vitest with Supertest. Tests import the default `app` and use `vi.mock` to replace service/controller modules per test.

**Target Platform**: Linux server / Node.js runtime

**Project Type**: web-service (backend API)

**Performance Goals**: Route registration occurs once at module load; JWT verification runs per authenticated request; MongoDB queries run per user lifecycle operation. Test imports bind zero ports and open zero database connections.

**Constraints**: MERN stack and ES Modules are non-negotiable. Backend MVC layout under `apps/backend`. Routes wire endpoints to controllers only; controllers handle request parsing and responses; business rules live in services. `index.js` remains the single entry point exporting a default Express app. No new dependencies. `cookie-parser` is already declared for cookie-based auth. CORS uses an explicit allowlist.

**Scale/Scope**: `apps/backend/index.js`, `apps/backend/routes/AdminRoutes.js` (new), `apps/backend/routes/AuthRoutes.js` (renamed from `AdminAuthRoutes.js`), `apps/backend/controllers/UserController.js` (new), `apps/backend/controllers/GamesController.js` (new), `apps/backend/controllers/AuthController.js` (new), `apps/backend/middleware/authorize.js` (new), `apps/backend/middleware/verifyToken.js` (existing). Backend-only feature; no frontend changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Notes |
|-----------|--------|-------|
| I. MERN Stack Alignment | PASS | MongoDB + Mongoose, Express, React untouched, JavaScript ES Modules. No new dependencies. |
| II. MVC Separation | PASS | `index.js` remains entry point; routes wire endpoints to controllers; controllers handle parsing/responses; business rules in services; schemas in models. |
| III. Test-First Quality Gate | PASS WITH REQUIRED TEST TASKS | Endpoint tests must use Vitest + Supertest, import default app with `vi.mock`; `npm --prefix apps/backend run test` must pass. |
| IV. Security and Configuration | PASS | JWT-based auth; refresh token via cookie; `cookie-parser` already declared; CORS explicit allowlist; secrets via env vars only; no hardcoded secrets; passwords never plaintext. |
| V. Responsive and Accessible Experience | N/A | Backend-only feature; no user-facing UI changes. |

No constitution violations. Complexity Tracking is not required.

## Project Structure

### Documentation (this feature)

```text
specs/022-add-user-auth-routes/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── auth-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/backend/
├── index.js                     # Mounts /api/users (AdminRoutes) and /api/auth (AuthRoutes)
├── config/
│   └── db.js                    # URI validation, connection contract, isDatabaseReady
├── controllers/
│   ├── AdminAuthController.js   # Unchanged (existing factory pattern)
│   ├── UserController.js        # New: getMyProfile, getUserDetails, createUser, updateUser, deleteUser, changePassword
│   ├── GamesController.js       # New: getMyRatingCount
│   └── AuthController.js        # New: register, login, refresh, logout
├── middleware/
│   ├── verifyToken.js           # Existing: JWT verification
│   └── authorize.js             # New: requireRole factory
├── routes/
│   ├── AdminRoutes.js           # New: user management routes (singleton export)
│   └── AuthRoutes.js            # Renamed from AdminAuthRoutes.js; auth routes (singleton export)
├── services/                    # Unchanged (existing AdminAuthService)
├── tests/                       # New/updated test files for routes and controllers
├── utils/                       # Unchanged
├── models/                      # Unchanged
├── vitest.config.js             # Test-only NODE_ENV and JWT_SECRET
└── package.json                 # Unchanged
```

### Repository documentation

```text
docs/tech_stack.md               # Route reorganization and new auth endpoints
AGENTS.md                        # Backend setup/environment instructions
specs/022-add-user-auth-routes/contracts/auth-api.md
specs/022-add-user-auth-routes/quickstart.md
```

**Structure Decision**: Existing monorepo backend layout under `apps/backend`. `index.js` is modified to mount `AdminRoutes` under `/api/users` and `AuthRoutes` under `/api/auth`. New route files use singleton export (`export default router`) per the user-provided code. Existing `AdminAuthRoutes.js` uses a factory function (`createAdminAuthRoutes`); it is renamed to `AuthRoutes.js` and converted to singleton export per the user-provided code.

## Requirement Traceability

| Requirement | Design Response |
|-------------|-----------------|
| FR-001 view own profile | `GET /api/users/me` in `AdminRoutes.js`, wired to `UserController.getMyProfile`, protected by `verifyToken`. |
| FR-002 view own rating count | `GET /api/users/me/rating-count` in `AdminRoutes.js`, wired to `GamesController.getMyRatingCount`, protected by `verifyToken` + `requireRole("author","admin")`. |
| FR-003 deny rating-count to non-author/admin | `requireRole("author","admin")` middleware rejects users without the author or admin role. |
| FR-004 retrieve user by id | `GET /api/users/:id` in `AdminRoutes.js`, wired to `UserController.getUserDetails`. |
| FR-005 create user account | `POST /api/users/` in `AdminRoutes.js`, wired to `UserController.createUser`. |
| FR-006 update user info | `PUT /api/users/:id` in `AdminRoutes.js`, wired to `UserController.updateUser`. |
| FR-007 delete user account | `DELETE /api/users/:id` in `AdminRoutes.js`, wired to `UserController.deleteUser`. |
| FR-008 activate user account | `PATCH /api/users/:id/activate` in `AdminRoutes.js`, wired to `UserController.changePassword`. |
| FR-009 restrict user management to admins | User management routes (create, view, update, delete, activate) are protected by admin authorization. |
| FR-010 register new account | `POST /api/auth/register` in `AuthRoutes.js`, wired to `AuthController.register`. |
| FR-011 login with access token + refresh cookie | `POST /api/auth/login` in `AuthRoutes.js`, wired to `AuthController.login`. |
| FR-012 refresh access token | `POST /api/auth/refresh` in `AuthRoutes.js`, wired to `AuthController.refresh`. |
| FR-013 deny refresh with missing/invalid cookie | `AuthController.refresh` rejects missing or invalid refresh token cookies. |
| FR-014 logout clears refresh cookie | `POST /api/auth/logout` in `AuthRoutes.js`, wired to `AuthController.logout`. |
| FR-015 reject invalid login credentials | `AuthController.login` rejects invalid credentials without exposing sensitive details. |
| SC-001 profile requests succeed | Verified by `GET /api/users/me` returning the authenticated user's profile. |
| SC-002 rating-count denied to non-author/admin | Verified by `requireRole("author","admin")` rejection. |
| SC-003 login returns token + cookie | Verified by `POST /api/auth/login` response and Set-Cookie header. |
| SC-004 logout clears cookie | Verified by `POST /api/auth/logout` clearing the refresh token cookie. |
| SC-005 account lifecycle succeeds for admins | Verified by create → retrieve → update → activate/deactivate → delete sequence. |
| SC-006 activation transitions inactive → active | Verified by `PATCH /api/users/:id/activate` changing account state. |
| SC-007 refresh denied with missing/invalid cookie | Verified by `POST /api/auth/refresh` rejection. |
| SC-008 full lifecycle end to end | Verified by the complete create-retrieve-update-activate-delete sequence. |
| Constitution III | Test migration to default-app + `vi.mock`, plus passing Vitest/Supertest coverage, is mandatory. |
| Constitution IV | Required values validated at startup; mandatory `JWT_SECRET`; explicit CORS allowlist; no secret logging. |

## Design Phases

### Phase 0: Research

`research.md` records decisions: singleton export pattern for new route files, route mounting paths (`/api/users`, `/api/auth`), controller method mappings, role-based authorization for rating-count and user management, JWT refresh-token cookie handling, and test strategy. No `NEEDS CLARIFICATION` items remain.

### Phase 1: Design and Contracts

- `data-model.md` defines User account, Authentication session, Rating count, and Authorized administrator entities.
- `contracts/auth-api.md` defines the `/api/users/*` and `/api/auth/*` endpoint contracts (request/response shapes, status codes, auth requirements).
- `quickstart.md` provides runnable verification scenarios for registration, login, token refresh, logout, profile access, rating count, and full user lifecycle.

## Implementation Order

1. **Middleware**: Create `apps/backend/middleware/authorize.js` with `requireRole(...)` factory.
2. **Controllers**: Create `UserController.js`, `GamesController.js`, `AuthController.js` with stub implementations mapped to route handlers.
3. **Routes**: Create `AdminRoutes.js` (user management routes); rename `AdminAuthRoutes.js` to `AuthRoutes.js` and rewrite with singleton export (register, login, refresh, logout).
4. **Entry point**: Update `index.js` to mount `AdminRoutes` under `/api/users` and `AuthRoutes` under `/api/auth`.
5. **Tests**: Add Vitest/Supertest coverage for all new and renamed routes and controllers.
6. **Documentation**: Update `docs/tech_stack.md`, `AGENTS.md`, and the quickstart.
7. **Verification**: Run the backend suite and the quickstart failure/success scenarios.

## Post-Design Constitution Re-check

After Phase 1 design, no new stack, framework, dependency, or folder boundary is introduced. The design preserves the MERN/ESM stack, keeps `index.js` as the entry point, adds the `requireRole` middleware and new controllers within the existing MVC layout, uses JWT + cookie auth consistent with Constitution IV, and keeps required-value validation. All gates remain PASS.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Not applicable. New middleware, controllers, and route files are direct additions within the existing MVC layout, not a new architectural layer.
