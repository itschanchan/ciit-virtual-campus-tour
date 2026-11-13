# Quickstart: Validate Backend Startup & Configuration

Prerequisites:
- Node.js LTS installed.
- `apps/backend/.env` present with `MONGODB_URI`, `MONGODB_NAME`, `CORS_ORIGIN` (`.env` is excluded from version control).
- A reachable MongoDB instance (for live-startup validation).

## Setup

1. Copy the backend environment example:
   ```
   Copy-Item apps/backend/.env.example apps/backend/.env
   ```
2. Install backend dependencies:
   ```
   npm install
   ```

## Validation Scenarios

### 1. Valid configuration starts the server and connects to MongoDB

Run:
```
NODE_ENV=development node apps/backend/index.js
```

Expected outcome:
- `MongoDB connection established.` is logged.
- `CIIT campus tour API listening on port <port>.` is logged.
- The process stays running (press Ctrl+C to stop).

### 2. Missing MONGODB_URI fails fast with a clear error

Run:
```
NODE_ENV=development MONGODB_URI= node apps/backend/index.js
```
(or unset MONGODB_URI)

Expected outcome:
- A clear configuration error is logged.
- The process exits before binding to a port.
- No MongoDB URI appears in the output.

### 3. Test import starts no server and needs no database

Run a Vitest test that imports `apps/backend/index.js` with `NODE_ENV=test`.

Expected outcome:
- No network port is bound.
- No MongoDB connection is attempted.
- The imported app is usable for endpoint tests.

### 4. Cross-origin requests succeed only from allowed origins

With the server running and a frontend origin listed in `CORS_ORIGIN`:

Expected outcome:
- A credentialed request from an allowed origin is accepted.
- A request from an origin not in `CORS_ORIGIN` is rejected.

### 5. Graceful shutdown on termination signal

With the server running, send `SIGINT` (Ctrl+C) or `SIGTERM`.

Expected outcome:
- A shutdown message is logged.
- The HTTP server closes and the process exits cleanly.

## References

- Feature spec: `spec.md`
- Data model: `data-model.md`
- Startup contract: `contracts/startup-contract.md`
