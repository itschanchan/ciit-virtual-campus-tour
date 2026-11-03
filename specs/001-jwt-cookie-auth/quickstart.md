# Quickstart Validation Guide: JWT Cookie Access

**Feature**: JWT Cookie Access (001-jwt-cookie-auth)
**Date**: 2026-11-04

This guide documents runnable validation scenarios that prove the JWT cookie authentication feature works end-to-end. It references the contracts and data model without duplicating implementation code.

## Prerequisites

- Node.js LTS installed (via nvm)
- MongoDB running locally at `mongodb://127.0.0.1:27017/ciit-campus-tour`
- Backend dependencies installed: `npm run setup` from repo root
- Backend `.env` file copied from `.env.example` with `JWT_SECRET` and `JWT_EXPIRES_IN` set
- An existing user record in MongoDB with a known email and password hash (for login tests)

## Setup Commands

```powershell
# From repo root
npm install
npm run setup
Copy-Item apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env to add JWT_SECRET=<random-string> and JWT_EXPIRES_IN=24h
```

## Test / Run Commands

```powershell
# Start the backend in watch mode
npm --prefix apps/backend run dev

# Run backend tests (Vitest + Supertest)
npm --prefix apps/backend run test

# Run backend lint (if configured)
npm run lint
```

## Validation Scenarios

### Scenario 1: Successful login issues a cookie

1. Send `POST /api/auth/login` with valid `email` and `password` for an existing user.
2. **Expected**: HTTP 200 response; `Set-Cookie` header present with `auth_token=`, `HttpOnly`, `Secure`, `SameSite=Strict` attributes; response body contains `message` and `user.id`/`user.email`.

### Scenario 2: Invalid credentials are denied

1. Send `POST /api/auth/login` with a wrong password for an existing user.
2. **Expected**: HTTP 401 response; no `Set-Cookie` header; body indicates authentication failure.

### Scenario 3: Session persists across requests

1. Log in successfully (captures the `auth_token` cookie).
2. Send `GET /api/auth/verify` with the cookie attached.
3. **Expected**: HTTP 200; body `authenticated: true` with the user's `id` and `email`.

### Scenario 4: Missing cookie is rejected

1. Send `GET /api/auth/verify` without any cookie.
2. **Expected**: HTTP 401 response; body indicates authentication required.

### Scenario 5: Expired token is rejected

1. Log in successfully.
2. Wait for JWT expiration (or set `JWT_EXPIRES_IN` to a very short value for testing).
3. Send `GET /api/auth/verify` with the cookie attached.
4. **Expected**: HTTP 401; body indicates token expired and re-authentication required.

### Scenario 6: Logout clears the cookie

1. Log in successfully (cookie present).
2. Send `POST /api/auth/logout`.
3. **Expected**: HTTP 200; `Set-Cookie` header clears `auth_token` with an expired date; subsequent `GET /api/auth/verify` returns HTTP 401.

### Scenario 7: Protected endpoint rejects unauthenticated access

1. Send a request to a protected campus tour administration endpoint (e.g., `GET /api/admin/locations`) without a cookie.
2. **Expected**: HTTP 401; access denied.

## Expected Outcomes

- All seven scenarios pass when run against a running backend instance.
- `npm --prefix apps/backend run test` exits with code 0.
- No hardcoded secrets appear in source code (verified by scanning for `JWT_SECRET` literals).
- `cookie-parser` is declared in `apps/backend/package.json` dependencies.

## References

- Feature specification: `spec.md`
- API contracts: `contracts/auth-api.md`
- Data model: `data-model.md`
- Research decisions: `research.md`
