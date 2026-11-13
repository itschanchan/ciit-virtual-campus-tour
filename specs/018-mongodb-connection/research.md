# Research: MongoDB Connection Configuration

## Decisions

### Decision 1: Canonical environment variable name

**Decision**: Use `MONGODB_URI` as the single canonical environment variable name for the MongoDB connection URI across `config/db.js`, `config/env.js`, and `scripts/create-admin.js`.

**Rationale**: `MONGODB_URI` is already the validated name in `config/env.js` (`validateEnv()`), used by `scripts/create-admin.js`, and referenced in the test suite (`env.test.js`). `config/db.js` currently reads `MONGO_URI`, creating a mismatch where startup validation can pass while the actual connection reads an undefined variable and the server exits without connecting. Standardizing on `MONGODB_URI` eliminates this silent failure mode.

**Alternatives considered**:
- `MONGO_URI`: Used only by `config/db.js`; inconsistent with validation, tests, and admin script.
- Keep both with fallback: Adds complexity and risk of silent misconfiguration; a single canonical name is simpler and more maintainable.

### Decision 2: Startup validation order

**Decision**: Validate `MONGODB_URI` at startup before attempting any MongoDB connection; fail fast with a clear error and non-zero exit code if missing or invalid.

**Rationale**: Constitution Principle IV requires configuration to be validated at startup so the server fails fast when required variables are missing. The current `index.js` starts an inline Express app and calls `connectDB()` without first calling `loadEnv()` validation, so a missing `MONGODB_URI` is not caught before the server attempts to connect.

**Alternatives considered**:
- Validate after connection attempt: Would allow the server to boot with an invalid URI and fail at runtime, violating the fail-fast principle.
- No validation: Server may start accepting requests before MongoDB is ready, causing request failures.

### Decision 3: Connection retry behavior

**Decision**: Fail fast on first MongoDB connection attempt; no automatic retry on transient failure.

**Rationale**: Simplest behavior aligned with Constitution Principle IV (fail fast). The server exits immediately if MongoDB is down, making the failure visible to operators rather than masking it with retry logic. Retry behavior can be added later if operational needs change.

**Alternatives considered**:
- Retry with fixed delay: Adds complexity to startup logic; delays failure detection.
- Retry with exponential backoff indefinitely: Could mask prolonged outages and delay detection of real problems.

### Decision 4: Secret handling in logs

**Decision**: Never log the `MONGODB_URI` value or any credentials contained within it. Log connection failure messages without including the URI.

**Rationale**: Constitution Principle IV requires credentials never to be logged. The current `config/db.js` logs `process.env.MONGO_URI` directly (line 17), which would expose credentials in server output.

**Alternatives considered**:
- Log the URI for debugging: Violates security principle; credentials would appear in logs.
- Log a redacted URI: Adds complexity without clear benefit; a simple "connection failed" message is sufficient for diagnosis.

### Decision 5: Connection before accepting requests

**Decision**: Establish the MongoDB connection before the HTTP server begins accepting requests.

**Rationale**: SC-003 requires the server not to accept HTTP requests until MongoDB connection is confirmed established. The current `index.js` calls `connectDB()` unawaited inside a non-async listener callback, so the server may begin accepting requests before the connection is ready.

**Alternatives considered**:
- Connect asynchronously after server starts: Requests could fail if MongoDB is not yet connected.
- Lazy connection on first request: Adds per-request latency and complexity; violates SC-003.

## Open items for implementation

- Update `config/db.js` to read `MONGODB_URI` instead of `MONGO_URI`; remove URI logging.
- Update `config/env.js` to also expose `MONGODB_NAME` if needed by `db.js`.
- Update `index.js` to call `loadEnv()` validation at startup, await `connectDB()` before `app.listen()`, and wire the `createApp()` factory.
- Update `app.js` if needed to integrate with the startup flow.
- Update `scripts/create-admin.js` if needed for consistency.
- Add/update Vitest tests for startup validation and connection behavior.
