# Admin Authentication API Contract

## Endpoints

### POST `/api/admin/login`
Creates an authenticated admin session through a secure JWT cookie.

**Request Body**
```json
{
  "username": "admin_user",
  "password": "StrongPassword123!"
}
```

**Success Response**
- **Status**: `200 OK`
- **Headers**: `Set-Cookie` containing the JWT in an HTTP-only cookie
- **Body**:
```json
{
  "message": "Login successful",
  "user": {
    "id": "admin_id",
    "username": "admin_user",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

**Error Response**
- **Status**: `401 Unauthorized`
- **Body**:
```json
{
  "message": "Invalid credentials"
}
```

### POST `/api/admin/logout`
Clears the admin session cookie and signs the user out.

**Success Response**
- **Status**: `200 OK`
- **Body**:
```json
{
  "message": "Logout successful"
}
```

### GET `/api/admin/session`
Returns the current authenticated admin session if present.

**Success Response**
- **Status**: `200 OK`
- **Body**:
```json
{
  "user": {
    "id": "admin_id",
    "username": "admin_user",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

**Error Response**
- **Status**: `401 Unauthorized`
- **Body**:
```json
{
  "message": "Unauthorized"
}
```

## Security Requirements
- All authentication responses use HTTPS-sensitive cookie settings in production.
- The JWT is stored in an HTTP-only cookie and not passed around in local storage.
- Passwords are never returned or logged in plaintext.
- The backend must reject expired or malformed tokens before allowing access to admin routes.
