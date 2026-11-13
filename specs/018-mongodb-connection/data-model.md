# Data Model: MongoDB Connection Configuration

## Entities

### MongoDB Connection Configuration

Represents the environment variables and validation rules that define how the backend connects to MongoDB.

| Field | Type | Required | Validation Rule |
|-------|------|----------|-----------------|
| MONGODB_URI | string | Yes | Must be a non-empty MongoDB connection string; must not be logged or exposed in error output |
| MONGODB_NAME | string | No | Optional database name; defaults to the database in the connection string if provided |

### Startup Validation

Represents the pre-flight check that confirms required configuration is present before the server binds to a port.

| Field | Type | Required | Validation Rule |
|-------|------|----------|-----------------|
| validationStage | string | Yes | One of: "config", "connection", "ready" |
| missingVariables | string[] | No | List of required environment variables that are absent; if non-empty, server exits |
| exitCode | integer | Yes | Non-zero exit code when validation fails |

### Connection Handshake

Represents the sequence of validating config, connecting to MongoDB, and confirming readiness before serving requests.

| Field | Type | Required | Validation Rule |
|-------|------|----------|-----------------|
| handshakeState | string | Yes | One of: "pending", "connecting", "connected", "failed" |
| connectionAttempts | integer | Yes | Number of connection attempts made (always 1; fail fast, no retry) |
| lastError | string | No | Error message from the last failed connection attempt; must not include MONGODB_URI |

## Relationships

- **Startup Validation → Connection Handshake**: Startup validation must pass (config stage) before the connection handshake begins.
- **Connection Handshake → Server Readiness**: The handshake must reach "connected" state before the HTTP server accepts requests.

## Validation Rules from Requirements

- FR-001: `MONGODB_URI` is the single canonical env var name; `MONGO_URI` must not be used.
- FR-002: `MONGODB_URI` must be validated at startup before any connection attempt.
- FR-003: MongoDB connection must be established before the HTTP server accepts requests.
- FR-004: Missing or invalid `MONGODB_URI` must cause exit with a clear error code.
- FR-005: `MONGODB_URI` value and credentials must never appear in logs or error output.
- FR-006: Connection failure must produce a descriptive error and fail fast.

## State Transitions

```
Startup Validation:
  pending → config (validate MONGODB_URI present)
  config → passed (all required variables present)
  config → failed (missing variables → exit with error code)

Connection Handshake:
  pending → connecting (attempt mongoose.connect)
  connecting → connected (MongoDB connection established → server may accept requests)
  connecting → failed (connection error → exit with descriptive error, no retry)
```

## Data Volume / Scale Assumptions

- Single backend server instance; one MongoDB connection pool managed by Mongoose.
- No sharding or multi-region assumptions; connection string points to a single MongoDB deployment.
- Configuration is read once at startup; no runtime reconfiguration.
