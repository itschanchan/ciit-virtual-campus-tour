# Startup, Configuration, and Test-Import Contract

This contract defines the interface between the runtime environment, `apps/backend/index.js`, and `apps/backend/config/db.js` after `config/env.js` and `app.js` are removed. It covers required environment variables, the start gate, startup ordering, error behavior, and the application export used by tests.

## Required Environment Variables

| Variable | Required | Default | Validation |
|----------|----------|---------|------------|
| MONGODB_URI | Yes | — | `connectDB`: non-empty; starts with `mongodb://` or `mongodb+srv://` |
| MONGODB_NAME | No | Mongoose uses the URI database | Passed to Mongoose connect when present |
| PORT | No | 3000 | `process.env.PORT \|\| 3000`; no explicit validation |
| NODE_ENV | No | — | Not validated; `test` disables database connection and listening |
| JWT_SECRET | Yes | — | Required by `createAdminAuthService`; non-empty; never logged |
| CORS origins | No | — | Hardcoded `["http://localhost:5173"]` in `index.js`; no environment variable |

`RAWG_API_KEY` is not part of this feature.

## Application Export Contract

`apps/backend/index.js` exposes exactly one export:

| Export | Type | Behavior |
|--------|------|----------|
| `default` | Express application | Created at module scope in every environment; usable with Supertest when `NODE_ENV=test` |

The module does **not** export `createApp`, `readPort`, or `readNodeEnv`. Tests inject behavior by mocking the service modules with `vi.mock`; they do not receive an app factory.

The application always includes `express.json()`, `cookie-parser`, the hardcoded CORS allowlist with credentials, `/api/health`, `/api/admin`, `notFoundHandler`, and `errorHandler`.

## Start Gate

```js
if (process.env.NODE_ENV !== "test") {
  // connect to MongoDB, then listen
}
```

This is the syntax document's exact condition. Importing `index.js` with `NODE_ENV=test` skips both the database connection and the HTTP listener. Importing it with any other `NODE_ENV` starts the server.

## Startup Sequence

1. `index.js` calls `dotenv.config()` inline to load `.env`.
2. `index.js` creates the Express app at module scope and wires middleware, services, routes, and error handlers.
3. `requireAdminAuthService()` calls `createAdminAuthService()`. A missing or empty `JWT_SECRET` logs `Configuration error: JWT_SECRET is required.` and exits with code 1.
4. `PORT` is read with `process.env.PORT || 3000`.
5. When `NODE_ENV !== "test"`, `index.js` calls `await connectDB()` with `MONGODB_URI` and `MONGODB_NAME`.
6. `connectDB` validates URI presence and scheme, then connects through Mongoose. Missing, invalid, or failed connections throw.
7. `index.js` catches connection errors, logs a safe message that never contains the URI or credentials, and exits with code 1. The listener is never created.
8. On success, `index.js` logs `MongoDB connection established.` once, then calls `app.listen(PORT)`.
9. The server logs `CIIT campus tour API listening on port <port>.` and accepts requests.
10. On `SIGINT`/`SIGTERM`, the HTTP server closes and the process exits.

## Test Import Behavior

- Importing `index.js` with `NODE_ENV=test` starts zero network servers.
- Importing `index.js` with `NODE_ENV=test` opens zero live database connections.
- The imported default app remains usable for Supertest endpoint tests.
- Endpoint tests replace `services/HealthService.js` and `services/AdminAuthService.js` with `vi.mock` and `vi.hoisted`.
- The `JWT_SECRET` requirement is tested in a separate file that imports the real service.
- The Vitest configuration supplies `NODE_ENV=test` and a test-only `JWT_SECRET`; tests never depend on a developer's `.env`.

## Error Behavior

| Condition | Output | Side Effect |
|-----------|--------|-------------|
| Missing `JWT_SECRET` | `Configuration error: JWT_SECRET is required.` | Exit 1; no listener |
| Missing `MONGODB_URI` | `MONGODB_URI is required.` | Exit 1; no listener |
| Invalid URI scheme | `MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'.` | Exit 1; no listener |
| Mongoose connection failure | `MongoDB connection failed (<error name>).` | Exit 1; no listener |
| Unsupported CORS origin | Response omits `Access-Control-Allow-Origin` | Browser rejects the response; no wildcard fallback |

No error output may contain the MongoDB URI, database credentials, JWT secret, or other secret values.

## What Is Removed

- `config/env.js` deleted entirely (FR-001).
- `app.js` deleted entirely (FR-008).
- No `loadEnv` or validation import from `env.js` (FR-002).
- No `createApp` factory, `readPort` helper, or `readNodeEnv` helper.
- No direct-execution detection (`process.argv[1]` / `import.meta.url`).
- No `process.exit` inside `connectDB`; exit responsibility belongs to `index.js`.
- No hardcoded JWT signing-key fallback.

## What Is Out of Scope

- Production CORS origin selection beyond the hardcoded development allowlist.
- RAWG/games/users/auth route modules not present in this feature.
- Public API endpoint contracts beyond `/api/health` and `/api/admin`.
- `PORT` and `NODE_ENV` validation.
