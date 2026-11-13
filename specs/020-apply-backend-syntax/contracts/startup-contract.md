# Startup & Configuration Contract

This contract defines the interface between the runtime environment and the backend startup sequence for `index.js`, `db.js`, and `env.js`. It is not a public API contract; it documents the required environment variables, validation behavior, and startup ordering.

## Required Environment Variables

| Variable | Required | Default | Validation |
|----------|----------|---------|------------|
| MONGODB_URI | Yes | — | Non-empty; must start with `mongodb://` or `mongodb+srv://` |
| MONGODB_NAME | Yes | — | Non-empty |
| PORT | No | 5000 | Integer 1–65535 |
| NODE_ENV | No | development | development / test / production |
| CORS_ORIGIN | No | http://localhost:5173 | Comma-separated list; at least one origin after trimming |
| RAWG_API_KEY | No | — | Warn at startup if unset (non-fatal) |

## Startup Sequence

1. `index.js` loads configuration via `env.js.loadEnv()` (dotenv + validation).
2. If validation fails, `index.js` logs a clear error and exits with code 1 before opening any port.
3. `index.js` starts the Express app only when `NODE_ENV !== "test"`.
4. `index.js` establishes the MongoDB connection via `db.js.connectDB()` before `app.listen()`.
5. If the DB connection fails, `index.js` logs a descriptive error (without the URI) and exits.
6. Once connected, `app.listen()` binds to the configured port and accepts requests.
7. On `SIGINT`/`SIGTERM`, the HTTP server closes and the process exits.

## Test Import Behavior

- Importing the backend app (e.g., in Vitest) starts zero network servers.
- Importing the backend app requires zero live database connections.
- `NODE_ENV=test` skips `app.listen()`.

## What Is Out of Scope

- `app.js` (the createApp factory) — not modified by this feature.
- Public API endpoint contracts — unchanged by this feature.
