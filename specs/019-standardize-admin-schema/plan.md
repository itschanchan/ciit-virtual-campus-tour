# Implementation Plan: Standardize Admin Mongoose Schema

**Branch**: `019-standardize-admin-schema` | **Date**: November 13, 2026 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-standardize-admin-schema/spec.md`

## Summary

Standardize the Admin Mongoose schema in `apps/backend/models/Admins.js` to follow the industry-standard instantiation pattern from `docs/prompts/backend-prompts/admin_schema.md`. The change introduces compact field definitions, a constrained role field, pre-save password-hashing middleware, and a `comparePassword` instance method so admin credentials are never stored or compared in plaintext.

## Technical Context

**Language/Version**: JavaScript (ES Module)

**Primary Dependencies**: mongoose, bcrypt

**Storage**: MongoDB + Mongoose

**Testing**: Vitest

**Target Platform**: Node.js server (backend)

**Project Type**: web-service (backend API)

**Performance Goals**: N/A — schema standardization introduces no user-facing latency requirement

**Constraints**: Passwords must never be stored or transmitted in plaintext (Constitution Principle IV); MERN stack alignment (Principle I); MVC separation with Mongoose schemas in `models/` (Principle II); admin model stays named "Admin" in `apps/backend/models/Admins.js`

**Scale/Scope**: Single admin model; one collection; scoped to admin authentication data only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Requirement | Status | Evidence |
|------------------------|-------------|--------|----------|
| I. MERN Stack Alignment | Backend uses MongoDB + Mongoose, JavaScript ES Modules | PASS | mongoose schema, ES module imports, `"type": "module"` expected |
| II. MVC Separation | Mongoose schemas live in `models/`; backend owns auth and DB access | PASS | Schema resides in `apps/backend/models/Admins.js` |
| III. Test-First Quality Gate | Backend API/services have Vitest coverage | PASS | Vitest is the approved test runner; tests to be added in implementation |
| IV. Security, Secrets, Configuration | Passwords never plaintext; hashed before storage | PASS | pre-save bcrypt hashing + comparePassword method per reference schema |
| V. Responsive, Accessible Experience | N/A — backend-only schema change, no UI impact | N/A | No user-facing UI introduced by this feature |

**Gate Result (pre-design)**: PASS — No violations. The schema standardization aligns with all applicable constitution principles.

**Gate Result (post-design)**: PASS — No new violations introduced. research.md documents field-naming reconciliation (Decision 5) as an implementation-task concern, not a constitution violation. data-model.md and contracts/ respect MVC separation (schemas in `models/`) and security (passwords hashed, never plaintext).


## Project Structure

### Documentation (this feature)

```text
specs/019-standardize-admin-schema/
├── spec.md              # Feature specification (/speckit.specify output)
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
├── models/
│   └── Admins.js        # Admin Mongoose schema (standardized)
├── config/
├── controllers/
├── routes/
├── services/
├── tests/
├── utils/
└── index.js
```

**Structure Decision**: MVC backend structure per Constitution Principle II. The Admin schema lives in `apps/backend/models/`. No frontend changes are required because this is a backend-only data model standardization.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
