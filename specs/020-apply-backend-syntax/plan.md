# Implementation Plan: Apply Backend Syntax Principles to Entry and Config Files

**Branch**: `020-apply-backend-syntax` | **Date**: 2026-11-13 | **Spec**: specs/020-apply-backend-syntax/spec.md

**Input**: Feature specification from /specs/020-apply-backend-syntax/spec.md

## Summary

Standardize the backend entry and configuration files (index.js, db.js, env.js) to apply the Express handshake and startup principles: validate configuration at startup (fail fast), establish the database connection before the server accepts requests, only start the HTTP server when run directly (not during tests), apply a CORS allowlist with credentials, parse JSON bodies and cookies, and shut down cleanly on termination signals.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js LTS
**Primary Dependencies**: express, mongoose, dotenv, cors, cookie-parser (constitution-approved runtime dependencies)
**Storage**: MongoDB (via Mongoose)
**Testing**: Vitest (per constitution; backend tooling currently deferred per AGENTS.md, but code remains testable by design)
**Target Platform**: Linux server / Node.js runtime
**Project Type**: web-service (backend API)
**Performance Goals**: Backend startup validates configuration within 5 seconds (SC-004); zero requests served before DB connection confirmed
**Constraints**: MERN stack is non-negotiable (Principle I); ES Modules only, no CommonJS; index.js is the entry point; configuration validated at startup and fails fast (Principle IV); CORS uses explicit allowlist, never a wildcard; secrets never logged (FR-005); cookie-parser declared; app.js is out of scope per clarification
**Scale/Scope**: 3 backend files (index.js, db.js, env.js); backend only; no frontend changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Principle I (MERN Stack / ESM): PASS — Express + Mongoose + MongoDB, ES Modules, "type": "module".
Principle II (MVC / index.js entry): PASS — index.js is the entry point; config lives in config/; DB connection via mongoose.
Principle III (Test-First): PASS — app exported for test import without starting a server (FR-001, FR-009); Vitest/Supertest tooling deferred per AGENTS.md but the code is structured to be testable.
Principle IV (Security / Config): PASS — dotenv loaded; MONGODB_URI required and validated at startup; CORS allowlist (no wildcard); credentials enabled; secrets never logged (FR-005); cookie-parser declared.
Principle V (Responsive / Accessible): N/A — backend-only feature, no user-facing UI.

All gates pass. No violations; Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/020-apply-backend-syntax/
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
├── index.js             # Entry point: config validation, DB connection, server listen, graceful shutdown
├── config/
│   ├── db.js            # MongoDB connection handshake (Mongoose), URI scheme validation
│   └── env.js           # dotenv load, startup validation of PORT/NODE_ENV/MONGODB_URI/MONGODB_NAME/CORS_ORIGIN
```

**Structure Decision**: Existing monorepo backend layout under apps/backend; this feature modifies the three named files in place. app.js is out of scope per clarification Session 2026-11-13.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Not applicable — no Constitution Check violations.

## Post-Design Constitution Re-check

After Phase 1 design (data model, contracts, quickstart), no design introduces a new stack, framework, dependency, or folder boundary. All gates remain PASS. No Complexity Tracking entries required.
