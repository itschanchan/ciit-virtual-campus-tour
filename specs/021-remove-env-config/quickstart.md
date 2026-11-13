# Quickstart: Validate Env.js/App.js Removal, Inline Syntax, and Startup

Prerequisites:

- Node.js LTS installed.
- `apps/backend/.env.example` present in the repository.
- `apps/backend/.env` created from the example and populated with `MONGODB_URI`, `MONGODB_NAME`, and `JWT_SECRET`.
- A reachable MongoDB instance for live-startup validation.

## Setup

1. Copy the backend environment example:

   ```powershell
   Copy-Item apps/backend/.env.example apps/backend/.env
   ```

2. Fill in `MONGODB_URI`, `MONGODB_NAME`, and a non-empty `JWT_SECRET` in `apps/backend/.env`. Do not commit `.env`.

3. Install dependencies:

   ```powershell
   npm install
   ```

4. Run the backend tests:

   ```powershell
   npm --prefix apps/backend run test
   ```

   Expected: all backend suites pass. No live MongoDB connection is required, and endpoint tests use `vi.mock` instead of a factory.

## Validation Scenarios

### 1. Backend starts with inline configuration

Run:

```powershell
npm --prefix apps/backend run dev
```

Expected outcome:

- `config/env.js` and `app.js` do not exist.
- `index.js` does not import `loadEnv`, `config/env.js`, or `app.js`.
- `index.js` creates a module-scope `app` and exports it as the default export.
- `MongoDB connection established.` is logged before `CIIT campus tour API listening on port <port>.`
- The process stays running; press Ctrl+C to stop.

### 2. Missing or invalid MONGODB_URI fails before listening

For a missing URI, temporarily remove `MONGODB_URI` from `apps/backend/.env`, then run:

```powershell
npm --prefix apps/backend run start
```

For an invalid URI, override the value:

```powershell
$env:NODE_ENV = 'development'
$env:MONGODB_URI = 'invalid-scheme://example'
npm --prefix apps/backend run start
```

Expected outcome:

- A clear error is logged by `index.js`.
- The process exits with code 1.
- No `CIIT campus tour API listening` line appears.
- No MongoDB URI or credentials appear in the output.

### 3. Missing JWT_SECRET fails fast

Temporarily remove `JWT_SECRET` from `apps/backend/.env`, then run:

```powershell
npm --prefix apps/backend run start
```

Expected outcome:

- `Configuration error: JWT_SECRET is required.` is logged.
- The process exits with code 1 before connecting to MongoDB or listening.

### 4. PORT defaults to 3000

With `PORT` unset in `apps/backend/.env` and a reachable MongoDB, start the server and confirm the listening log reports port 3000. `PORT` and `NODE_ENV` are not validated; the server uses `process.env.PORT || 3000`.

### 5. Test import starts no server and needs no database

Run from `apps/backend`:

```powershell
$env:NODE_ENV = 'test'
node -e "import('./index.js').then((m) => console.log(typeof m.default))"
```

Expected outcome:

- Output is `function` (the default Express app is defined).
- No network port is bound.
- No MongoDB connection is attempted.
- Tests import this same default app and replace services with `vi.mock`.

### 6. CORS allowlist applied

With the server running, a request from `http://localhost:5173` includes `Access-Control-Allow-Origin: http://localhost:5173`. A request from an origin not in `["http://localhost:5173"]` does not receive that header. No wildcard fallback exists.

### 7. Syntax parity checks

Run:

```powershell
Select-String -Path apps/backend/index.js -Pattern 'createApp|readPort|readNodeEnv'
Select-String -Path apps/backend/index.js -Pattern 'NODE_ENV !== "test"'
Select-String -Path apps/backend/index.js -Pattern 'connectDB'
```

Expected outcome:

- The first command returns no matches.
- The second returns the start gate.
- The third shows `await connectDB(...)` occurring before `app.listen(...)`.

## References

- Feature spec: `spec.md`
- Data model: `data-model.md`
- Startup and test-import contract: `contracts/startup-contract.md`
- Research decisions: `research.md`
