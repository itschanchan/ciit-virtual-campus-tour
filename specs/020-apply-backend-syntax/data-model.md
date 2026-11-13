# Data Model: Backend Configuration & Runtime Entities

## Entities

### BackendConfiguration

Represents the validated runtime settings loaded from environment variables at startup.

| Field | Type | Validation Rule | Source |
|-------|------|-----------------|--------|
| port | integer | 1–65535 | PORT (default 5000) |
| nodeEnv | string | development / test / production | NODE_ENV (default development) |
| mongoUri | string | non-empty; starts with mongodb:// or mongodb+srv:// | MONGODB_URI (required) |
| mongoDbName | string | non-empty | MONGODB_NAME |
| corsOrigins | string[] | at least one origin after trimming | CORS_ORIGIN (comma-separated) |

**Validation rules**: All fields validated by `env.js` at startup before the server opens a port or connects to a database. Missing or invalid values cause a startup exit with a clear error (FR-002, FR-004). Secrets/credentials are never logged (FR-005).

### DatabaseConnection

Represents the established link to MongoDB.

| Field | Type | Validation Rule |
|-------|------|-----------------|
| uri | string | non-empty; valid MongoDB connection scheme |
| dbName | string | database name for the connection |
| readyState | integer | 1 = connected (Mongoose readyState) |

**Lifecycle**: Connection is established via Mongoose before the HTTP server accepts requests (FR-003). Connection failure causes startup exit (no retry). `isDatabaseReady()` reports readiness (readyState === 1).

### HTTPServer

Represents the Express application server.

| Field | Type | Validation Rule |
|-------|------|-----------------|
| port | integer | from BackendConfiguration |
| listening | boolean | true only after DB connection confirmed |

**Lifecycle**: Server starts only when run directly (`NODE_ENV !== "test"`) (FR-001). App is exported for test import without starting the server (FR-009).

### TerminationSignal

Represents OS signals that trigger graceful shutdown.

| Value | Action |
|-------|--------|
| SIGINT | Close HTTP server, exit process |
| SIGTERM | Close HTTP server, exit process |

## Relationships

- `BackendConfiguration` feeds `port`, `mongoUri`, `mongoDbName`, `corsOrigins` into startup.
- `DatabaseConnection` must reach `readyState === 1` before `HTTPServer` begins accepting requests.
- `TerminationSignal` (SIGINT/SIGTERM) triggers `HTTPServer` close and process exit.

## State Transitions

- Startup: config validated → DB connected → server listens → accepting requests.
- Shutdown: termination signal → server closes → process exits.
