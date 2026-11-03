# API Contract: JWT Cookie Access

**Feature**: JWT Cookie Access (001-jwt-cookie-auth)
**Base Path**: `/api/auth`

## POST /api/auth/login

Authenticates a user and issues a JWT in a secure cookie.

**Request**:
- Content-Type: `application/json`
- Body:
  ```json
  {
    "email": "string (required, valid email format)",
    "password": "string (required)"
  }
  ```

**Success Response (200)**:
- Sets `Set-Cookie` header with `auth_token=<JWT>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
- Body:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "string (ObjectId)",
      "email": "string"
    }
  }
  ```

**Error Responses**:
- `400`: Missing or invalid email/password format
- `401`: Invalid credentials (email not found or password mismatch)
- `429`: Rate limit exceeded (too many failed attempts from this IP)

## POST /api/auth/logout

Clears the authentication cookie and ends the session.

**Request**:
- No body required
- Cookie: `auth_token` (optional; logout is idempotent)

**Success Response (200)**:
- Sets `Set-Cookie` header with `auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
- Body:
  ```json
  {
    "message": "Logout successful"
  }
  ```

## GET /api/auth/verify

Verifies the authentication cookie and returns the authenticated user.

**Request**:
- Cookie: `auth_token` (required)

**Success Response (200)**:
- Body:
  ```json
  {
    "authenticated": true,
    "user": {
      "id": "string (ObjectId)",
      "email": "string"
    }
  }
  ```

**Error Responses**:
- `401`: No cookie present, malformed token, expired token, or invalid signature

## Middleware: Authentication Verification

Applied to protected routes (e.g., campus tour administration endpoints). Reads `auth_token` from `req.cookies`, verifies the JWT signature and expiration, and attaches the decoded payload to `req.user`. Rejects with `401` if missing or invalid.

## Cookie Attributes

| Attribute | Value |
|-----------|-------|
| Name | `auth_token` |
| HttpOnly | true |
| Secure | true |
| SameSite | `Strict` |
| Path | `/` |
| Max-Age | 86400 seconds (24 hours) |
