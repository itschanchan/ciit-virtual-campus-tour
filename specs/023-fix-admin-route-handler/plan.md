# Implementation Plan: Fix Admin Route Handler Error

**Branch**: `023-fix-admin-route-handler` | **Date**: 2026-11-15 | **Spec**: `specs/023-fix-admin-route-handler/spec.md`

**Input**: Feature specification from `/specs/023-fix-admin-route-handler/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

The backend crashes on startup because `AdminRoutes.js` registers `/login` and `/logout` routes whose handlers (`adminController.login`, `adminController.logout`) do not exist in `AdminController.js`. Express throws `TypeError: argument handler must be a function` when the routes are loaded, so no admin endpoint is available. The fix removes the duplicate, broken login/logout routes from `AdminRoutes.js`, since working equivalents already exist in `AuthRoutes.js` (mounted at `/api/admin`). AdminRoutes keeps only the admin CRUD routes that map to existing controller methods.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js LTS

**Primary Dependencies**: Express.js 5.x, cookie-parser, cors, dotenv, jsonwebtoken, mongoose, bcrypt, Vitest, Supertest

**Storage**: MongoDB + Mongoose (Admin model in `apps/backend/models/Admins.js`)

**Testing**: Vitest with Supertest for HTTP endpoint testing

**Target Platform**: Node.js server (Linux)

**Project Type**: web-service (backend REST API)

**Performance Goals**: Standard web API responsiveness; backend startup completes without errors

**Constraints**: MERN stack alignment (NON-NEGOTIABLE per constitution Principle I); MVC separation with routes wiring only to controllers (Principle II); JWT authentication with cookie-parser and CORS allowlist (Principle IV); no hardcoded secrets; no new dependencies required

**Scale/Scope**: Admin routes for the CIIT virtual campus tour backend; single bug fix affecting route registration at startup

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Assessment | Status |
|---|---|---|
| I. MERN Stack Alignment | Fix uses existing Express.js backend; no new stack, framework, or database introduced. | PASS |
| II. MVC Separation | AdminRoutes remains a routing-only layer wiring endpoints to existing controller methods; business logic stays in services/models. Removing duplicate auth routes keeps auth in AuthRoutes/AuthController where it belongs. | PASS |
| III. Test-First Quality Gate | Regression test will be added to confirm routes register without TypeError and admin endpoints respond; test must fail before fix, pass after. | PASS |
| IV. Security, Secrets, Config | No secrets introduced; authentication remains JWT + cookie-parser; CORS allowlist unchanged. | PASS |
| V. Responsive, Accessible Experience | Backend-only fix; no user-facing UI impact. | PASS |

**Gate result**: All constitution principles pass. No violations require justification. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/023-fix-admin-route-handler/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

The repository follows the fixed layout `root/apps/backend` and `root/apps/frontend` per constitution Principle II. Backend code lives directly under `apps/backend/` (not under a `src/` subdirectory), organized into `config/`, `controllers/`, `models/`, `routes/`, `services/`, `tests/`, and `utils/`, with `index.js` as the entry point.

```text
apps/backend/
├── index.js             # Entry point; mounts AdminRoutes at /api/admins, AuthRoutes at /api/admin
├── config/
│   └── db.js
├── controllers/
│   ├── AdminController.js   # Existing CRUD handlers (getMyProfile, getAdminDetails, createAdmin, updateAdmin, deleteAdmin, changePassword)
│   └── AuthController.js    # Existing auth handlers (login, logout, register, refresh, session)
├── middleware/
│   ├── verifyToken.js
│   └── authorize.js
├── models/
│   └── Admins.js
├── routes/
│   ├── AdminRoutes.js   # FIX TARGET: remove broken /login and /logout routes
│   └── AuthRoutes.js    # Existing /register, /login, /session, /refresh, /logout
├── services/
│   ├── AdminService.js
│   ├── AdminAuthService.js
│   └── AuthService.js
├── tests/
├── utils/
│   └── errors.js
├── package.json
├── .env
└── vitest.config.js
```

**Structure Decision**: Web application structure (constitution Principle II), adapted to the actual repository layout where backend code lives directly under `apps/backend/` (no `src/` subdirectory). Directories: `config/`, `controllers/`, `models/`, `routes/`, `services/`, `tests/`, `utils/`. Entry point: `apps/backend/index.js`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Section not applicable.
