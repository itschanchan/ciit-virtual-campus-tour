# Feature Specification: MongoDB Connection Configuration

**Feature Branch**: `018-mongodb-connection`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "Configure MongoDB connection for the CIIT Virtual Campus Tour backend, standardizing environment variable naming, startup validation, and connection handshake across db.js, app.js, index.js, and env.js."

## Clarifications

### Session 2026-11-12

- Q: Should `index.js` wire the existing `createApp()` factory from `app.js` into the server startup flow using the CORS origins validated from the environment variable (`CORS_ORIGIN`), or use `createApp()`'s default CORS origin (`http://localhost:5173`) without environment configuration? → A: Wire `createApp({ corsOrigins: config.corsOrigins })` using `CORS_ORIGIN` validated by `env.js` at startup — single source of truth for CORS configuration per FR-002.
- Q: Can `env.js` be removed since `db.js` already calls `dotenv.config()`, or is `env.js` needed for startup validation and exposing `MONGODB_NAME` to `db.js`? → A: Keep `env.js` — it provides structured startup validation (MONGODB_URI, PORT, NODE_ENV, CORS_ORIGIN) that `db.js` does not; expose `MONGODB_NAME` through `validateEnv()`/`loadEnv()` return object so `db.js` receives it via validated config per FR-002.
- Q: What specific exit code should `index.js` or `env.js` use when `MONGODB_URI` is missing or invalid — `process.exit(1)`, `process.exit(2)`, or a different numeric code? → A: `process.exit(1)` — Node.js standard exit code for general fatal startup errors.
- Q: When MongoDB connection fails, what minimum content should the error message include — just the failed operation name, the operation name plus error type/category, or operation name plus retry guidance? → A: Operation name AND error type/category (e.g., "MongoDB connection failed: server selection timeout") — descriptive without exposing credentials.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Backend starts with validated MongoDB configuration (Priority: P1)

A developer starts the backend server and the system validates required configuration (MONGODB_URI) before attempting to connect to MongoDB, failing fast with a clear error if configuration is missing.

**Why this priority**: Constitution Principle IV requires configuration to be validated at startup so the server fails fast when required variables are missing. Without this, the server may boot with an undefined MongoDB URI and fail at runtime.

**Independent Test**: Start the backend with MONGODB_URI unset and confirm the server exits with a clear error message before binding to a port.

**Acceptance Scenarios**:

1. **Given** MONGODB_URI is set and valid, **When** the backend starts, **Then** MongoDB connection is established before the server accepts requests.
2. **Given** MONGODB_URI is unset, **When** the backend starts, **Then** the server exits with a clear error and does not bind to a port.

---

### User Story 2 - Clear connection failure without secret exposure (Priority: P1)

A developer or operator encounters a MongoDB connection failure and receives a clear error message that does not expose the connection string or credentials.

**Why this priority**: Connection failures must be diagnosable without leaking sensitive configuration such as usernames, passwords, or cluster endpoints.

**Independent Test**: Stop MongoDB, start the backend, and confirm the error message indicates connection failure without printing the URI.

**Acceptance Scenarios**:

1. **Given** MongoDB is unreachable, **When** the backend attempts to connect, **Then** an error is logged indicating the connection failed.
2. **Given** MongoDB is unreachable, **When** the error is logged, **Then** the MONGODB_URI value is not included in the error output.

---

### User Story 3 - Consistent environment variable naming across backend files (Priority: P2)

A developer reviews the backend configuration files and finds a single canonical environment variable name (MONGODB_URI) used consistently for the MongoDB connection URI.

**Why this priority**: Inconsistent variable names (MONGO_URI vs MONGODB_URI) cause silent connection failures where validation passes but the actual connection reads an undefined variable.

**Independent Test**: Search all backend configuration files and confirm MONGODB_URI is the only variable name used for the MongoDB connection URI.

**Acceptance Scenarios**:

1. **Given** the backend codebase, **When** a developer searches for MongoDB URI references, **Then** only MONGODB_URI appears as the environment variable name.
2. **Given** MONGODB_URI is set, **When** db.js, env.js, and create-admin.js read the connection URI, **Then** all three use MONGODB_URI.

---

### Edge Cases

- MongoDB is temporarily unavailable during startup; the server should fail fast rather than retry indefinitely.
- MONGODB_URI contains special characters or connection options; parsing should not break.
- The backend runs in test environment without a live MongoDB instance; tests should not require a real connection.
- Multiple backend instances start simultaneously; each should independently validate and connect.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use MONGODB_URI as the single canonical environment variable name for the MongoDB connection URI across all backend configuration files.
- **FR-002**: System MUST validate MONGODB_URI and MONGODB_NAME at startup via `env.js` before attempting to connect to MongoDB.
- **FR-003**: System MUST establish the MongoDB connection before the HTTP server begins accepting requests.
- **FR-004**: System MUST exit with code `process.exit(1)` when MONGODB_URI is missing (unset or empty) or invalid (does not start with `mongodb://` or `mongodb+srv://`).
- **FR-005**: System MUST NOT log the MONGODB_URI value or any credentials contained within it.
- **FR-006**: System MUST fail fast with a descriptive error that names the failed operation AND includes the error type or category when MongoDB connection cannot be established.
- **FR-007**: System MUST wire the `createApp()` factory into `index.js` server startup using `CORS_ORIGIN` validated by `env.js` at startup, not a hardcoded default.

### Key Entities *(include if feature involves data)*

- **MongoDB connection configuration**: The set of environment variables and validation rules that define how the backend connects to MongoDB, including the connection URI and optional database name.
- **Startup validation**: The pre-flight check that confirms required configuration is present before the server binds to a port.
- **Connection handshake**: The sequence of validating config, connecting to MongoDB, and confirming readiness before serving requests.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of backend startups validate MONGODB_URI before attempting any MongoDB connection (per FR-002).
- **SC-002**: 0 instances of MONGODB_URI or credentials appearing in server logs or error output.
- **SC-003**: Server does not accept HTTP requests until MongoDB connection is confirmed established.
- **SC-004**: Missing MONGODB_URI produces a startup exit within 5 seconds with a clear error message.

## Assumptions

- MongoDB is hosted externally (e.g., MongoDB Atlas or a self-managed instance) and reachable via a connection string.
- The database name is provided via MONGODB_NAME environment variable, consistent with existing db.js usage.
- dotenv is used to load environment variables from a .env file that is excluded from version control (Constitution Principle IV).
- The backend runs on Node.js LTS with ES Modules ("type": "module") per Constitution Principle I.
- Mongoose is the ODM for MongoDB, consistent with the approved technology stack.
- Backend fails fast on first MongoDB connection attempt; no automatic retry on transient failure.
