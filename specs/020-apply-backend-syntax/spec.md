# Feature Specification: Apply Backend Syntax Principles to Entry and Config Files

**Feature Branch**: `020-apply-backend-syntax`

**Created**: 2026-11-13

**Status**: Draft

**Input**: User description: "Read and analyze @docs/prompts/backend-prompts/main_backend_syntax.md then apply it to @apps/backend/index.js, @apps/backend/config/db.js, and @apps/backend/config/env.js."

## Clarifications

### Session 2026-11-13

- Q: Should this feature standardize only the three files you named (index.js, db.js, env.js), or should it also include app.js (the createApp factory that index.js imports and wires into startup)? → A: Option A — only the three named files (index.js, db.js, env.js). app.js is out of scope for this feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Backend starts only when run directly, not during tests (Priority: P1)

A developer or test runner loads the backend entry file and the HTTP server only begins listening when the file is executed directly; automated tests can import the app without opening a network port or connecting to a live database.

**Why this priority**: Prevents test suites from accidentally starting a live server or requiring a database connection, keeping tests fast, isolated, and safe to run in CI.

**Independent Test**: Import the backend app in a test process and confirm no port is bound and no database connection is attempted.

**Acceptance Scenarios**:

1. **Given** the backend entry file is imported by a test runner with NODE_ENV=test, **When** the module loads, **Then** the server does not listen on a port and does not connect to MongoDB.
2. **Given** the backend entry file is executed directly with valid configuration, **When** startup completes, **Then** the server listens on the configured port and is ready to accept requests.

---

### User Story 2 - Configuration is validated before the server starts (Priority: P1)

A developer starts the backend and the system checks that required configuration (database URI, database name, port, CORS origins, environment) is present and valid, failing fast with a clear error when anything is missing or invalid instead of booting into a broken state.

**Why this priority**: Constitution Principle IV requires configuration to be validated at startup so the server fails fast when required variables are missing, avoiding confusing runtime failures.

**Independent Test**: Start the backend with MONGODB_URI unset and confirm the process exits with a clear error before binding to a port.

**Acceptance Scenarios**:

1. **Given** all required environment variables are present and valid, **When** the backend starts, **Then** startup proceeds normally.
2. **Given** MONGODB_URI is unset or empty, **When** the backend starts, **Then** the process exits with a clear error and does not bind to a port.
3. **Given** PORT is outside the valid range (1-65535), **When** the backend starts, **Then** the process exits with a clear error.
4. **Given** CORS_ORIGIN is empty, **When** the backend starts, **Then** the process exits with a clear error.

---

### User Story 3 - Database connection is established before requests are served (Priority: P1)

An app user or API client sends a request to the backend and the system only accepts HTTP requests after confirming the MongoDB connection is ready, so no request fails due to a missing database connection.

**Why this priority**: Guarantees data-dependent endpoints work from the first request and prevents errors caused by serving before persistence is available.

**Independent Test**: Start the backend with a reachable MongoDB and confirm requests are only served after the connection is established; start with MongoDB unreachable and confirm the server does not accept requests.

**Acceptance Scenarios**:

1. **Given** MongoDB is reachable, **When** the backend starts, **Then** the connection is established before the server accepts requests.
2. **Given** MongoDB is unreachable, **When** the backend starts, **Then** the process exits rather than accepting requests without a database.

---

### User Story 4 - Server shuts down cleanly on termination signals (Priority: P2)

An operator stops the backend and the system closes the HTTP server and exits cleanly on SIGINT or SIGTERM instead of leaving dangling connections or processes.

**Why this priority**: Enables safe restarts, deployments, and local development without orphaned processes or blocked ports.

**Independent Test**: Send SIGINT to a running backend and confirm the process exits cleanly after closing the server.

**Acceptance Scenarios**:

1. **Given** a running backend, **When** SIGINT is received, **Then** the HTTP server closes and the process exits.
2. **Given** a running backend, **When** SIGTERM is received, **Then** the HTTP server closes and the process exits.

---

### User Story 5 - Cross-origin requests are allowed only from configured origins (Priority: P2)

A frontend application running on a configured origin makes requests to the backend and the system accepts them with credentials, while requests from unlisted origins are rejected.

**Why this priority**: Constitution Principle IV requires CORS to use an explicit allowlist rather than a permissive wildcard, protecting campus visitor and administrative data.

**Independent Test**: Send a request from an allowed origin with credentials and confirm it succeeds; send from a disallowed origin and confirm it is rejected.

**Acceptance Scenarios**:

1. **Given** an origin listed in CORS_ORIGIN, **When** the frontend sends a credentialed request, **Then** the backend accepts the request.
2. **Given** an origin not listed in CORS_ORIGIN, **When** the frontend sends a request, **Then** the backend rejects it.

### Edge Cases

- The backend is started in the test environment without a live MongoDB instance; no connection is required and no port is bound.
- Required environment variables contain whitespace-only values; these are treated as missing.
- MONGODB_URI uses an invalid scheme (not mongodb:// or mongodb+srv://); startup fails with a clear error.
- Multiple termination signals arrive in quick succession; the server closes once and exits cleanly.
- CORS_ORIGIN contains multiple comma-separated origins with surrounding whitespace; each is parsed and trimmed correctly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST start the HTTP server only when the backend entry file is run directly, never when imported during tests.
- **FR-002**: System MUST validate all required configuration (database URI, database name, port, CORS origins, environment) at startup before opening a network port or connecting to a database.
- **FR-003**: System MUST establish the database connection before the HTTP server accepts any requests.
- **FR-004**: System MUST exit with a clear error when required configuration is missing, empty, or invalid (for example, a database URI without a valid connection scheme).
- **FR-005**: System MUST NOT log or expose database connection strings, credentials, or secrets in error output or logs.
- **FR-006**: System MUST close the HTTP server and exit cleanly when SIGINT or SIGTERM is received.
- **FR-007**: System MUST accept cross-origin requests only from origins listed in the configured allowlist, with credentials enabled.
- **FR-008**: System MUST parse JSON request bodies and cookies so endpoints can read structured input.
- **FR-009**: System MUST export the backend application for use by tests without starting the server.

### Key Entities *(include if feature involves data)*

- **Backend configuration**: The validated set of runtime settings (port, environment, database URI, database name, CORS origins) loaded from environment variables at startup.
- **Database connection**: The established link to MongoDB that must be confirmed ready before the server serves requests.
- **HTTP server**: The application that listens on the configured port, parses requests, applies CORS, and routes API calls.
- **Termination signals**: Operating system signals (SIGINT, SIGTERM) that trigger a graceful shutdown of the server.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of backend startups validate required configuration before binding to a port or connecting to a database.
- **SC-002**: 0 startups accept HTTP requests before the database connection is confirmed established.
- **SC-003**: 0 instances of database URIs, credentials, or secrets appearing in server logs or error output.
- **SC-004**: Missing or invalid required configuration produces a startup exit within 5 seconds with a clear error message.
- **SC-005**: 100% of test imports of the backend app start zero network servers and require zero live database connections.
- **SC-006**: Cross-origin requests succeed only from configured allowlist origins; all other origins are rejected.

## Assumptions

- MongoDB is reachable via a connection string provided through MONGODB_URI, with the database name in MONGODB_NAME.
- dotenv loads environment variables from a .env file that is excluded from version control.
- The backend runs on Node.js LTS using ES Modules per the project constitution.
- Express is the HTTP framework and Mongoose is the MongoDB ODM, consistent with the approved stack.
- CORS allowlist origins are provided as a comma-separated list in CORS_ORIGIN.
- A graceful shutdown completes within a short, bounded time after a termination signal.
- app.js (the createApp factory) is out of scope; this feature standardizes only index.js, db.js, and env.js.
