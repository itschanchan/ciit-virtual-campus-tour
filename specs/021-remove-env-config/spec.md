# Feature Specification: Remove Env Config File and Use Inline Method

**Feature Branch**: `021-remove-env-config`

**Created**: 2026-11-13

**Status**: Draft

**Input**: User description: "Remove the @apps/backend/config/env.js file and use the my own method in @docs/prompts/backend-prompts/main_backend_syntax.md instead for the @apps/backend/index.js."

## Clarifications

### Session 2026-11-13

- Q: How should CORS origins be configured in index.js without env.js providing corsOrigins — hardcoded allowlist, inline default, or passed differently to createApp? → A: Option A — hardcoded allowlist in index.js (e.g., `["http://localhost:5173"]`), matching the syntax-document pattern exactly.
- Q: When app.js is removed and its responsibilities move into index.js per the syntax document, what should happen to the routes, middleware, and error handling that app.js currently provides (health routes, admin auth routes, cookie-parser, JSON body parsing, error handlers)? → A: Option A — index.js absorbs all middleware, routes, and error handling inline (single self-contained entry point per syntax doc).
- Q: Once `createApp` is removed from `apps/backend/index.js`, how should backend tests obtain an Express app to exercise the API? → A: Option A — tests import the default `app` and use Vitest module mocks to replace the health and admin auth services per test.
- Q: Should the server start condition follow the syntax document's `NODE_ENV !== "test"` check exactly, or keep the current direct-execution check? → A: Option A — use `if (process.env.NODE_ENV !== "test")` exactly as the document shows; importing `index.js` outside tests starts the server.
- Q: Should MongoDB still connect before the server starts listening, or should the file follow the syntax document's listen-first ordering? → A: Option A — call and await `connectDB()` before `app.listen()` so requests are not accepted until MongoDB is ready.
- Q: What should happen if `connectDB()` fails during startup? → A: Option A — catch the rejection, log the safe error message, and exit with code 1 before the server listens.
- Q: Should `index.js` use the document's `const PORT = process.env.PORT || 3000` and drop the validation helpers, or keep explicit PORT/NODE_ENV validation? → A: Option A — use `const PORT = process.env.PORT || 3000` and remove the `readPort`/`readNodeEnv` helpers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Backend starts as a single self-contained entry point without env.js or app.js (Priority: P1)

A developer starts the backend and the system reads required settings directly from environment variables inline in index.js, without importing a separate env.js validation module or the app.js factory, matching the syntax-document handshake pattern. index.js is the single self-contained entry point containing middleware, routes, and error handling. It creates one module-scope Express app and exports it as the default export; no `createApp` factory is defined or exported.

**Why this priority**: The user explicitly wants to remove the env.js dependency from index.js and use the simpler inline environment-reading approach documented in the syntax reference.

**Independent Test**: Start the backend with env.js removed and confirm the server starts using inline env reads without importing env.js.

**Acceptance Scenarios**:

1. **Given** env.js is removed from the codebase, **When** index.js is loaded or executed outside tests, **Then** the server starts using inline environment variable reads without importing env.js.
2. **Given** env.js is removed, **When** index.js is imported during tests with NODE_ENV=test, **Then** the server does not listen on a port.

---

### User Story 2 - Database connection uses inline URI validation (Priority: P1)

A developer starts the backend and the MongoDB connection URI is read inline or validated within connectDB itself, without relying on env.js to pre-validate MONGODB_URI before the connection attempt.

**Why this priority**: Removing env.js shifts configuration validation responsibility to where the values are consumed (connectDB for the URI, index.js for PORT), keeping the startup flow simple per the syntax reference.

**Independent Test**: Start the backend with a valid MONGODB_URI and confirm MongoDB connects; start with an invalid or missing URI and confirm a clear startup error.

**Acceptance Scenarios**:

1. **Given** MONGODB_URI is set and valid, **When** the backend starts, **Then** MongoDB connection is established before the server starts listening.
2. **Given** MONGODB_URI is unset or invalid, **When** the backend starts, **Then** a clear error is logged, the process exits with code 1, and the server never listens.

---

### User Story 3 - Server listens only outside the test environment (Priority: P1)

A developer or test runner loads index.js and the HTTP server only begins listening when NODE_ENV is not `test`, keeping test suites isolated from live servers and databases.

**Why this priority**: Prevents test suites from accidentally starting a live server or requiring a database connection.

**Independent Test**: Import index.js in a test process with NODE_ENV=test and confirm no port is bound.

**Acceptance Scenarios**:

1. **Given** NODE_ENV=test, **When** index.js is imported, **Then** the server does not listen on a port.
2. **Given** NODE_ENV is not test, **When** index.js is loaded or executed, **Then** the server listens on the configured port.

### Edge Cases

- PORT is unset; the inline default of 3000 is used.
- MONGODB_URI uses an invalid scheme (not mongodb:// or mongodb+srv://); startup fails with a clear error.
- Multiple termination signals arrive; behavior depends on whether graceful shutdown is retained.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST remove the config/env.js file from the codebase.
- **FR-002**: System MUST NOT import loadEnv or any validation function from env.js in index.js.
- **FR-003**: System MUST read required environment variables inline in index.js or within the consuming functions (such as connectDB for MONGODB_URI).
- **FR-004**: System MUST start the HTTP server only when `NODE_ENV` is not `test`, using `if (process.env.NODE_ENV !== "test")` exactly as the syntax document shows.
- **FR-005**: System MUST establish the database connection using MONGODB_URI read at connection time, with clear errors for missing or invalid URIs. `connectDB()` MUST be awaited before `app.listen()`; a failure MUST log a safe message and exit with code 1 before the server listens.
- **FR-006**: System MUST NOT log or expose database connection strings, credentials, or secrets in error output or logs.
- **FR-007**: System MUST configure CORS origins via a hardcoded allowlist in index.js (e.g., `["http://localhost:5173"]`), matching the syntax-document pattern exactly, without importing env.js.
- **FR-008**: System MUST remove app.js and absorb its middleware (cookie-parser, CORS allowlist, JSON body parsing), routes (health, admin auth), and error handling inline in index.js as a single self-contained entry point per the syntax document. index.js MUST create one module-scope `app`, export it as the default export, and MUST NOT define or export a `createApp` factory.

### Key Entities *(include if feature involves data)*

- **Environment configuration**: The set of runtime settings (PORT, MONGODB_URI, MONGODB_NAME, NODE_ENV, JWT_SECRET) read directly from environment variables at the point of use, without a centralized validation module.
- **Database connection**: The Mongoose connection to MongoDB, established using the URI read inline or within connectDB.
- **HTTP server**: The Express application that listens on the configured port when NODE_ENV is not `test`, after the MongoDB connection is established.
- **JWT secret**: The signing key required by the admin authentication service. It has no hardcoded fallback and is never logged.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of backend startups read configuration without importing env.js.
- **SC-002**: 0 startups accept HTTP requests before the database connection is confirmed established.
- **SC-003**: 0 instances of database URIs, credentials, or secrets appearing in server logs or error output.
- **SC-004**: 100% of test imports of the backend app start zero network servers and require zero live database connections.
- **SC-005**: Missing or invalid MONGODB_URI produces a startup error before the server accepts requests.

## Assumptions

- The syntax-document method (inline env reads, PORT default of 3000, connectDB validating its own URI) is the reference pattern for index.js.
- connectDB validates MONGODB_URI presence and scheme (mongodb:// or mongodb+srv://) internally.
- PORT uses `process.env.PORT || 3000`; PORT and NODE_ENV are not explicitly validated.
- JWT_SECRET is required and has no hardcoded fallback; startup fails when it is missing.
- The backend runs on Node.js LTS using ES Modules per the project constitution.
- app.js is removed; index.js creates and exports a single module-scope app, and no `createApp` factory exists.
- Backend tests import the default app and use Vitest module mocks to replace the health and admin auth services per test.
