# Research: Apply Backend Syntax Principles to Entry and Config Files

## Decisions

- **Stack**: MERN (MongoDB + Mongoose, Express.js, Node.js ES Modules) per Constitution Principle I (non-negotiable).
- **Entry point**: `index.js` per Constitution Principle II; loads config via `env.js`, connects DB via `db.js`, then starts the Express server.
- **Configuration**: `env.js` loads dotenv and validates `NODE_ENV`, `MONGODB_URI`, `MONGODB_NAME`, `PORT`, `CORS_ORIGIN` at startup; fails fast on missing/invalid values (Principle IV).
- **Database**: Mongoose `mongoose.connect(uri, { dbName })` with URI scheme validation (`mongodb://` or `mongodb+srv://`) before server listens (FR-003).
- **Server start guard**: HTTP server only starts when `NODE_ENV !== "test"` (FR-001, FR-009); app exported for test import.
- **CORS**: Explicit allowlist from `CORS_ORIGIN`, credentials enabled, no wildcard (Principle IV).
- **Graceful shutdown**: Close server and exit on `SIGINT`/`SIGTERM` (FR-006).
- **Scope**: Limited to `index.js`, `db.js`, `env.js`; `app.js` is out of scope per clarification Session 2026-11-13.

## Rationale

The three named files already implement most of the handshake principles; this feature confirms and tightens them (fail-fast validation, DB-before-listen, no secrets logged, test-safe import) without introducing new frameworks, patterns, or dependencies.

## Alternatives Considered

- Including `app.js` (the createApp factory): Rejected — out of scope per clarification; keeps change minimal per the KISA principle.
- Adding a separate config module / config class: Rejected — would over-engineer; `env.js` already provides structured validation.
- Automatic retry on MongoDB connection failure: Rejected — fail-fast is required (Principle IV, FR-004); no retry per spec assumptions.

## Alternatives Not Chosen

None beyond the above; all decisions align with the existing constitution and approved dependencies.
