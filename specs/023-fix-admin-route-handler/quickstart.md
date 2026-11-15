# Quickstart Validation Guide

## Purpose

Validate that the admin route handler fix works end-to-end: the backend starts without a `TypeError: argument handler must be a function`, and admin endpoints respond correctly.

## Prerequisites

- Node.js LTS installed (via `nvm`)
- `.env` file present in `apps/backend/` with:
  - `MONGODB_URI`
  - `MONGODB_NAME`
  - `JWT_SECRET` (non-empty)
- MongoDB reachable (or tests run with `NODE_ENV=test`)

## Setup Commands

From the repo root:

```bash
# Install dependencies (root + backend + frontend)
npm install
npm run setup

# Copy backend environment template if not present
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env to fill in MONGODB_URI, MONGODB_NAME, JWT_SECRET
```

## Validation Scenarios

### Scenario 1: Backend starts without route handler TypeError

**Goal**: Confirm the server initializes without crashing on route registration.

1. Start the backend:
   ```bash
   npm --prefix apps/backend run start
   ```
   (or `npm run dev` with nodemon)

2. **Expected outcome**: The process starts and logs `CIIT campus tour API listening on port 3000.` and `MongoDB connection established.` No `TypeError: argument handler must be a function` appears.

3. Stop the server (`Ctrl+C`).

### Scenario 2: Admin CRUD endpoints respond

**Goal**: Confirm admin routes are mounted and respond (not 404/not crashing) after startup.

1. Start the backend.
2. Send a request to an admin endpoint (requires auth for most):
   ```bash
   # Example: unauthenticated request to /api/admins/me should return 401, not crash
   curl -i http://localhost:3000/api/admins/me
   ```
3. **Expected outcome**: Returns `401 Unauthorized` with a JSON error body. The server does not crash.

### Scenario 3: Login/logout still work via AuthRoutes

**Goal**: Confirm the existing auth endpoints remain functional after the fix.

1. Start the backend.
2. Register/login through `AuthRoutes`:
   ```bash
   curl -i -X POST http://localhost:3000/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"..."}'
   ```
3. **Expected outcome**: Returns `200` with `accessToken` and sets an `httpOnly` `refreshToken` cookie. Then `POST /api/admin/logout` returns `200` and clears the cookie.

## Expected Outcomes (pass criteria)

- Backend startup completes with no `TypeError` on route registration.
- `GET /api/admins/me` without auth returns `401` (server did not crash).
- `POST /api/admin/login` with valid credentials returns `200` + access token + refresh cookie.
- `POST /api/admin/logout` returns `200` and clears the cookie.

## References

- Feature spec: `spec.md`
- Implementation plan: `plan.md`
- Research decisions: `research.md`
- Data model: `data-model.md`
- API contract: `contracts/admin-api.md`
