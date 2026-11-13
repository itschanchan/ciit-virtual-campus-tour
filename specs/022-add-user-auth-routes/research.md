# Research: Add User Management and Auth Routes

## Decisions

### Route file export pattern

**Decision**: New route files (`AdminRoutes.js`, `AuthRoutes.js`) use singleton export (`const router = Router(); ...; export default router;`). Existing `AdminAuthRoutes.js` is renamed to `AuthRoutes.js` and converted from the factory pattern (`createAdminAuthRoutes`) to singleton export.

**Rationale**: The user-provided code for both files explicitly uses `export default router` with a module-scope `Router()` instance. This keeps the implementation consistent with the provided code and avoids introducing a factory pattern where the spec calls for a plain router.

**Alternatives considered**:
- Keep `AdminAuthRoutes.js` as a factory function (`createAdminAuthRoutes()`): Rejected because the user-provided replacement code for `AuthRoutes.js` uses singleton export, and mixing patterns within the same feature would be inconsistent.

### Route mounting paths

**Decision**: Mount `AdminRoutes` under `/api/users` and `AuthRoutes` under `/api/auth` in `index.js`.

**Rationale**: The user-provided `AdminRoutes.js` code defines user-scoped routes (`/me`, `/me/rating-count`, `/:id`, etc.) without a path prefix, so they are mounted under `/api/users`. The `AuthRoutes.js` code defines auth-scoped routes (`/register`, `/login`, `/refresh`, `/logout`) mounted under `/api/auth`. This separates user management from authentication concerns.

**Alternatives considered**:
- Mount both under `/api/admin`: Rejected because user management and auth are distinct concerns, and the existing admin auth routes already use `/api/admins`.

### Authorization for user management and rating count

**Decision**: User management routes (create, view, update, delete, activate) and the rating-count route require role-based authorization via `requireRole(...)`. The rating-count route requires `author` or `admin` role; user management routes require `admin` role.

**Rationale**: The spec requires user management to be restricted to authorized administrators, and rating-count access to be limited to authors and administrators. A `requireRole` middleware factory centralizes this check.

**Alternatives considered**:
- Inline role checks in each controller: Rejected because a middleware factory keeps controllers focused on request/response handling and centralizes authorization logic.

### JWT refresh-token cookie handling

**Decision**: Login sets a refresh token cookie; refresh reads it from the cookie; logout clears it. The refresh token is managed through a secure cookie (consistent with Constitution IV).

**Rationale**: The spec states login returns an access token in JSON and sets a refresh token cookie, and refresh uses the browser-sent refresh token cookie. This matches cookie-based session patterns used elsewhere in the project.

**Alternatives considered**:
- Pass refresh token in request body: Rejected because the spec explicitly describes cookie-based refresh token transport.

### Test strategy

**Decision**: Backend tests import the default `app` from `index.js` and use `vi.mock` to replace service/controller modules per test. `npm --prefix apps/backend run test` must pass.

**Rationale**: This matches the established pattern from the `021-remove-env-config` spec and keeps test imports isolated from live servers and databases (NODE_ENV=test gate).

**Alternatives considered**:
- Use `createApp` factory: Rejected because `index.js` is the single module-scope app entry point per Constitution II and the `021-remove-env-config` clarification.

### No new dependencies

**Decision**: No new npm packages are required. All dependencies (express, mongoose, dotenv, cors, cookie-parser, jsonwebtoken) are already declared.

**Rationale**: The feature reuses existing middleware (`verifyToken`) and approved dependencies. Constitution IV requires `cookie-parser` before cookie-based auth, which is already declared.

**Alternatives considered**:
- Add a dedicated role-based authorization package: Rejected because `requireRole` can be implemented as a small middleware using existing `verifyToken` output (`req.user`).
