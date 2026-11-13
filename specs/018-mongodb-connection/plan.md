# Implementation Plan: MongoDB Connection Configuration

**Branch**: `018-mongodb-connection` | **Date**: 2026-11-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/018-mongodb-connection/spec.md`

## Summary

Standardize MongoDB connection configuration across the CIIT Virtual Campus Tour backend. Use `MONGODB_URI` as the single canonical environment variable name across `config/db.js`, `config/env.js`, and `scripts/create-admin.js`. Validate configuration at startup before connecting to MongoDB, fail fast on missing or invalid configuration, establish the database connection before the HTTP server accepts requests, and never log connection credentials.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js LTS

**Primary Dependencies**: mongoose, dotenv, express (backend)

**Storage**: MongoDB

**Testing**: Vitest

**Target Platform**: Linux server

**Project Type**: web-service (backend API)

**Performance Goals**: Startup validation and connection established within 5 seconds (SC-004)

**Constraints**: `.env` file excluded from version control (Constitution Principle IV); `MONGODB_URI` value never logged (FR-005); fail fast on connection failure (FR-006)

**Scale/Scope**: Single backend server instance; all backend configuration files share one canonical env var name

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I — MERN Stack Alignment**: PASS
- MongoDB + Mongoose for storage, Express.js for HTTP API, JavaScript ES Modules — all per approved stack.
- No alternative databases, frameworks, or test runners introduced.

**Principle II — MVC Separation and Application Boundaries**: PASS
- Backend code remains in `apps/backend/` with existing `config/`, `routes/`, `services/`, `controllers/`, `models/`, `utils/`, and `tests/` organization.
- `index.js` remains the entry point. Frontend does not access MongoDB directly.

**Principle III — Test-First Quality Gate**: PASS
- Existing Vitest tests cover `env.js` validation and route behavior. New connection logic will be covered by test updates in the implementation phase.

**Principle IV — Security, Secrets, and Configuration Discipline**: PASS
- `.env` remains excluded from version control.
- `MONGODB_URI` loaded via `dotenv`, never hardcoded or logged.
- Configuration validated at startup so the server fails fast on missing variables.

**Principle V — Responsive, Accessible Immersive Experience**: N/A
- This feature is backend-only; no user-facing UI changes.

**GATE RESULT**: All applicable gates pass. No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/018-mongodb-connection/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/backend/
├── config/
│   ├── db.js            # MongoDB connection (connectDB, MONGODB_URI)
│   └── env.js           # Environment validation (loadEnv, validateEnv, MONGODB_URI)
├── index.js             # Server entry point (startup validation, connection handshake)
├── app.js               # Express app factory (createApp, used by index.js and tests)
└── scripts/
    └── create-admin.js  # Admin creation script (reads MONGODB_URI)
```

**Structure Decision**: Web application structure (Option 2). Backend code lives under `apps/backend/` with the existing MVC layout. No new directories are created; existing files `config/db.js`, `config/env.js`, `index.js`, `app.js`, and `scripts/create-admin.js` are modified to standardize on `MONGODB_URI` and wire startup validation into the server entry point.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations exist. Complexity Tracking is not required.
