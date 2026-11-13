# Research: Remove Env Config File and Use Inline Method

## Decisions

### D1. One module-scope app, no factory

**Decision**: `apps/backend/index.js` creates `const app = express()` at module scope, wires middleware, services, routes, and error handlers inline, and exports it with `export default app`. `createApp` is not defined or exported.

**Rationale**: The 2026-11-13 clarification requires the file to follow the syntax document, which builds the app directly at module scope. A factory is an additional abstraction the user explicitly rejected.

**Alternatives considered**:

- Keep `createApp` for test injection: rejected by the user.
- Restore `app.js`: rejected by FR-008.
- Move the factory into `routes/`: rejected because it spreads wiring away from the entry point.

### D2. Start condition is the document's NODE_ENV check

**Decision**: Wrap `connectDB()` and `app.listen()` in `if (process.env.NODE_ENV !== "test") { ... }`. Remove the direct-execution check (`process.argv[1]` vs `import.meta.url`) and the `node:path`/`node:url` imports used only for it.

**Rationale**: The 2026-11-13 clarification selects the syntax document's exact logic. Tests run with `vitest.config.js` setting `NODE_ENV=test`, so imports bind no port and open no database connection. Importing `index.js` outside tests now starts the server, which is the document's documented behavior.

**Alternatives considered**:

- Direct-execution detection plus `NODE_ENV`: rejected by the clarification.
- Separate `start.js` wrapper: rejected because it introduces another entry point.

### D3. MongoDB connects before the server listens

**Decision**: Inside the non-test block, `await connectDB()` first, then call `app.listen(PORT)`.

**Rationale**: The revised 2026-11-13 clarification restores connect-before-listen. This preserves SC-002 and SC-005: no request is accepted before the database connection is confirmed, and a missing or invalid URI fails before the listener starts. It is the only ordering deviation from the syntax document.

**Alternatives considered**:

- Listen first, connect inside the callback: rejected by the user's revised decision.
- Connect in parallel with listening: rejected because it violates SC-002.

### D4. Tests import the default app and mock services

**Decision**: `tests/health.test.js` and `tests/adminAuth.test.js` import the default `app` from `../index.js` and use `vi.mock` with `vi.hoisted` to replace `services/HealthService.js` and `services/AdminAuthService.js`. A separate `tests/adminAuthService.test.js` imports the real service to assert `JWT_SECRET is required.`.

**Rationale**: Removing the factory removes the injection seam. Module mocks keep the tests isolated without changing production code and without a test-only factory. A separate unmocked file avoids mocking the module under test.

**Alternatives considered**:

- Test only real services: rejected because the healthy `200` and successful login/session cases would be lost.
- Keep a test-only factory: rejected by the user.
- Module-level mocking only: rejected for the `JWT_SECRET` test because the module under test must remain real.

### D5. JWT_SECRET is mandatory with a clean startup error

**Decision**: `createAdminAuthService` reads `process.env.JWT_SECRET` and throws `JWT_SECRET is required.` when it is missing. `index.js` constructs it through a small `requireAdminAuthService()` wrapper that logs `Configuration error: JWT_SECRET is required.` and exits with code 1. The hardcoded `'ciit-dev-secret'` fallback stays removed.

**Rationale**: Constitution IV forbids hardcoded signing keys. The wrapper gives the fail-fast error required by the startup contract without turning the app back into a factory.

**Alternatives considered**:

- Development-only fallback: rejected as a hardcoded key.
- Raw module-level throw: rejected because it prints a stack trace instead of the contract message.
- Generate a secret at startup: rejected because tokens would not survive restarts.

### D6. PORT fallback without validation

**Decision**: Use `const PORT = process.env.PORT || 3000`. Remove `readPort` and `readNodeEnv`, including their tests.

**Rationale**: The 2026-11-13 clarification selects the syntax document's exact expression. `PORT` and `NODE_ENV` are optional settings, so skipping their validation does not violate Constitution IV's requirement that required configuration fails fast. `connectDB` still validates `MONGODB_URI`, and `createAdminAuthService` still requires `JWT_SECRET`.

**Alternatives considered**:

- Keep explicit validation helpers: rejected by the clarification.
- Validate only `NODE_ENV`: rejected because the clarification removes both helpers.

### D7. Keep the hardcoded CORS allowlist

**Decision**: `const ALLOWED_ORIGINS = ['http://localhost:5173']` is passed to `cors({ origin: ALLOWED_ORIGINS, credentials: true })`. `CORS_ORIGIN` is not read.

**Rationale**: FR-007 and the clarification require a hardcoded allowlist. An array is explicit and contains no wildcard. `docs/tech_stack.md` still describes `CORS_ORIGIN` and must be updated.

**Alternatives considered**:

- Restore `CORS_ORIGIN`: rejected by FR-007.
- Use `origin: true` or `*`: rejected because credentials and the constitution require an explicit allowlist.
- Keep the callback form that throws on unknown origins: rejected as extra logic not present in the syntax document; the array form omits the CORS header for unknown origins.

### D8. Database failures log safely and exit

**Decision**: Catch `connectDB()` failures in `index.js`, log `error.message` (which contains only `MONGODB_URI is required.`, the scheme hint, or `MongoDB connection failed (<error name>).`), and exit with code 1 before `app.listen()`.

**Rationale**: SC-003 forbids URI or credential leakage, and SC-005 requires a startup error before requests are accepted. `connectDB` throws instead of calling `process.exit`, leaving one error path in the entry point.

**Alternatives considered**:

- Keep `process.exit` in `connectDB`: rejected because the caller cannot handle or test the failure.
- Log the full Mongoose error: rejected because it can include the URI.
- Keep listening after a failed connection: rejected because the server would accept requests without a database.

### D9. Drop stale RAWG content

**Decision**: Do not implement a `RAWG_API_KEY` warning. Keep RAWG out of the startup contract and leave the spec free of RAWG references.

**Rationale**: No RAWG route, service, or configuration exists in this project. The syntax document's RAWG block is sample content from another codebase.

**Alternatives considered**:

- Implement the warning: rejected because no integration consumes the key.
- Leave the spec edge case: already removed during clarification.

### D10. Retain graceful shutdown

**Decision**: Keep `SIGINT`/`SIGTERM` handlers inside the non-test block, closing the HTTP server before exit.

**Rationale**: The spec's edge cases allow graceful shutdown to be retained. It is operational behavior outside the documented handshake and does not affect testability.

**Alternatives considered**:

- Remove shutdown handling to match the document literally: rejected because it would regress existing operational behavior for no benefit.

### D11. Match the document's middleware order

**Decision**: Apply `express.json()`, then `cookieParser()`, then `cors(...)`, exactly as the syntax document shows. Do not add `app.disable('x-powered-by')`.

**Rationale**: The user asked for the document's coding syntax. Express's default JSON limit is already 100kb, so no explicit limit is needed. The CORS allowlist and mandatory JWT remain the security controls.

**Alternatives considered**:

- Keep the previous order (`cookieParser`, `cors`, `express.json`): rejected as an unnecessary deviation.
- Keep `x-powered-by` suppression: rejected to stay close to the document; it is not required by the spec or constitution.

## Resolved Clarifications

- `index.js` creates one module-scope app and exports it; no `createApp` factory.
- The start condition is `NODE_ENV !== "test"`; direct-execution detection is removed.
- `connectDB()` is awaited before `app.listen()`.
- A failed connection logs a safe message and exits 1 before listening.
- Tests import the default app and use Vitest module mocks; the JWT requirement has its own unmocked test.
- `PORT` uses `process.env.PORT || 3000`; `PORT`/`NODE_ENV` validation helpers are removed.
- `JWT_SECRET` is mandatory and never logged.
- CORS stays a hardcoded allowlist.

No `NEEDS CLARIFICATION` items remain for implementation.
