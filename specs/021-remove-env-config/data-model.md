# Data Model: Backend Configuration & Runtime Entities

## Entities

### Environment Configuration

Represents runtime settings read directly from environment variables at the point of use, without a centralized validation module.

| Field | Source | Default | Validation |
|-------|--------|---------|------------|
| port | `process.env.PORT` | 3000 via `process.env.PORT \|\| 3000` | None |
| nodeEnv | `process.env.NODE_ENV` | — | Not validated; compared with `"test"` only |
| mongoUri | `process.env.MONGODB_URI` | — | Required; validated by `connectDB` for presence and `mongodb://` / `mongodb+srv://` scheme |
| mongoDbName | `process.env.MONGODB_NAME` | — | Passed to Mongoose connect; no separate validation |
| jwtSecret | `process.env.JWT_SECRET` | — | Required and non-empty; no hardcoded fallback; never logged |
| corsOrigins | Hardcoded constant in `index.js` | `["http://localhost:5173"]` | Fixed allowlist; no environment lookup |

**Validation rules**: No centralized validation module (`env.js` stays removed). `PORT` and `NODE_ENV` are read without validation per the 2026-11-13 clarification. Required configuration still fails fast: `connectDB` validates `MONGODB_URI`, and `createAdminAuthService` requires `JWT_SECRET`. Secrets and credentials are never logged (FR-006).

### Application Export

Represents the single Express application exposed by the entry point.

| Field | Type | Validation Rule |
|-------|------|-----------------|
| default | Express application | Created at module scope in every environment; the only export; usable with Supertest when `NODE_ENV=test` |

**Removed exports**: `createApp`, `readPort`, and `readNodeEnv` are not defined or exported.

**Lifecycle**: `index.js` loads dotenv, creates the app, constructs the services, wires routes, and exports the app. Importing the module with `NODE_ENV=test` never starts a database connection or HTTP listener.

### Database Connection

Represents the established link to MongoDB.

| Field | Type | Validation Rule |
|-------|------|-----------------|
| uri | string | `connectDB` requires a non-empty value starting with `mongodb://` or `mongodb+srv://` |
| dbName | string | Passed to Mongoose connect when present |
| readyState | integer | 1 = connected (Mongoose readyState) |

**Lifecycle**: `connectDB` throws on missing/invalid URIs and on Mongoose connection failures. `index.js` awaits it before `app.listen()`, catches failures, logs a safe message, and exits with code 1. A successful connection is logged once by `index.js`.

### HTTP Server

Represents the Express application server.

| Field | Type | Validation Rule |
|-------|------|-----------------|
| port | number or string | From `process.env.PORT \|\| 3000`; no explicit validation |
| listening | boolean | true only when `NODE_ENV !== "test"` and the database connection succeeded |

**Lifecycle**: The app is created unconditionally. `dotenv.config()` runs inline; required values are validated by their consumers; when `NODE_ENV !== "test"`, `connectDB()` is awaited and then `app.listen()` starts. Shutdown listeners close the server on `SIGINT`/`SIGTERM`.

## Relationships

- `index.js` reads `PORT`, `NODE_ENV`, `MONGODB_URI`, `MONGODB_NAME`, and `JWT_SECRET` directly from `process.env`.
- `connectDB` reads `MONGODB_URI` and `MONGODB_NAME` inline and validates them at connection time.
- `createAdminAuthService` reads `JWT_SECRET` and rejects construction when it is missing.
- `DatabaseConnection` must complete successfully before `HTTPServer` begins accepting requests.
- CORS origins are a constant in `index.js`; no environment lookup occurs.
- The default `app` export is both the runtime instance and the Supertest target.

## State Transitions

- **Startup**: `dotenv.config()` → module-scope `app` and services → `JWT_SECRET` required → `NODE_ENV !== "test"` → `await connectDB()` → `app.listen()` → accepting requests.
- **Test import**: `dotenv.config()` → module-scope `app` → `NODE_ENV=test` → no `connectDB()` → no `app.listen()` → app usable by Supertest with mocked services.
- **Configuration failure**: missing `JWT_SECRET` → `Configuration error: JWT_SECRET is required.` → exit 1 → no listener.
- **Database failure**: missing/invalid `MONGODB_URI` or connection failure → safe error message without URI → exit 1 → no listener.
- **Shutdown**: termination signal → server closes → process exits.
