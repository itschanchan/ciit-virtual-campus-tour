# Admin API Contract

## Scope

This contract documents the admin-facing HTTP endpoints after the fix. `AdminRoutes.js` is mounted at `/api/admins`. `AuthRoutes.js` is mounted at `/api/admin`.

## Admin Routes (AdminRoutes.js — fixed)

| Method | Path | Description | Auth Required | Handler |
|---|---|---|---|---|
| GET | `/api/admins/me` | Get current admin's own profile | Yes (verifyToken) | `AdminController.getMyProfile` |
| GET | `/api/admins/:id` | Get admin details by ID | Yes | `AdminController.getAdminDetails` |
| POST | `/api/admins/` | Create a new admin | Yes | `AdminController.createAdmin` |
| PUT | `/api/admins/:id` | Update an admin by ID | Yes | `AdminController.updateAdmin` |
| DELETE | `/api/admins/:id` | Delete an admin by ID | Yes | `AdminController.deleteAdmin` |
| PATCH | `/api/admins/:id/activate` | Activate/deactivate an admin account | Yes | `AdminController.changePassword` |

> Note: The broken `POST /api/admins/login` and `POST /api/admins/logout` registrations have been removed from `AdminRoutes.js` because their handlers (`adminController.login`, `adminController.logout`) do not exist. Working equivalents already exist in `AuthRoutes.js` (see below).

## Auth Routes (AuthRoutes.js — existing, unchanged)

| Method | Path | Description | Auth Required | Handler |
|---|---|---|---|---|
| POST | `/api/admin/register` | Register a new admin account | No | `AuthController.register` |
| POST | `/api/admin/login` | Authenticate admin; returns access token + sets refresh cookie | No | `AuthController.login` |
| GET | `/api/admin/session` | Get admin from refresh token cookie | Yes (cookie) | `AuthController.session` |
| POST | `/api/admin/refresh` | Refresh expired access token using refresh cookie | Yes (cookie) | `AuthController.refresh` |
| POST | `/api/admin/logout` | Clear refresh token cookie | Yes (cookie) | `AuthController.logout` |

## Request / Response Shapes

### Login (POST /api/admin/login)

Request body:
```json
{ "username": "string", "password": "string" }
```

Success response (200):
```json
{ "status": "success", "message": "Login successful", "accessToken": "string", "user": { ... } }
```
Sets `httpOnly` `refreshToken` cookie.

Error response (401):
```json
{ "error": { "code": "INVALID_CREDENTIALS", "message": "string" } }
```

### Logout (POST /api/admin/logout)

Request body: none.

Success response (200):
```json
{ "status": "success", "message": "Logout successful" }
```
Clears `refreshToken` cookie.

### Admin CRUD (representative: GET /api/admins/me)

Success response (200):
```json
{ "status": "success", "data": { ...admin fields... } }
```

Error response (401/403/404/500):
```json
{ "status": "error", "message": "string" }
```
or
```json
{ "error": { "code": "string", "message": "string" } }
```

## Authentication & Security

- Authentication uses JSON Web Tokens (constitution Principle IV).
- `verifyToken` middleware reads the JWT from the HTTP-only session cookie or `Authorization` header.
- `cookie-parser` is declared in `index.js` before cookie-based routes.
- CORS uses an explicit allowlist (`http://localhost:5173`), not a wildcard.
- No secrets are hardcoded; `JWT_SECRET`, `MONGODB_URI`, `MONGODB_NAME` come from environment variables.
