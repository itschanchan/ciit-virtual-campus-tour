# User Management and Auth API Contract

## Endpoints

### User Management — `AdminRoutes` (mounted under `/api/users`)

All user management endpoints require a valid JWT access token in the `Authorization: Bearer <token>` header.

#### GET `/api/users/me`
Returns the authenticated user's own profile.

**Success Response**
- **Status**: `200 OK`
- **Body**:
```json
{
  "id": "user_id",
  "username": "user_name",
  "email": "user@example.com",
  "role": "user",
  "isActive": true
}
```

**Error Response**
- **Status**: `401 Unauthorized`
- **Body**: `{ "error": "Access token required" }` or `{ "error": "Invalid or expired access token" }`

#### GET `/api/users/me/rating-count`
Returns the authenticated user's rating count. Requires `author` or `admin` role.

**Success Response**
- **Status**: `200 OK`
- **Body**:
```json
{
  "userId": "user_id",
  "count": 5
}
```

**Error Response**
- **Status**: `401 Unauthorized` — missing or invalid token
- **Status**: `403 Forbidden` — user does not have `author` or `admin` role

#### GET `/api/users/:id`
Returns a user's details by identifier.

**Success Response**
- **Status**: `200 OK`
- **Body**:
```json
{
  "id": "user_id",
  "username": "user_name",
  "email": "user@example.com",
  "role": "user",
  "isActive": true
}
```

**Error Response**
- **Status**: `404 Not Found` — user not found
- **Status**: `401 Unauthorized` — missing or invalid token

#### POST `/api/users/`
Creates a new user account.

**Request Body**
```json
{
  "username": "new_user",
  "email": "new_user@example.com",
  "password": "StrongPassword123!",
  "role": "user"
}
```

**Success Response**
- **Status**: `201 Created`
- **Body**: created user details (without password hash)

**Error Response**
- **Status**: `400 Bad Request` — validation failure
- **Status**: `409 Conflict` — username or email already exists
- **Status**: `401 Unauthorized` — missing or invalid token
- **Status**: `403 Forbidden` — caller is not an admin

#### PUT `/api/users/:id`
Updates an existing user's information.

**Request Body**
```json
{
  "email": "updated@example.com",
  "role": "author",
  "isActive": true
}
```

**Success Response**
- **Status**: `200 OK`
- **Body**: updated user details

**Error Response**
- **Status**: `404 Not Found` — user not found
- **Status**: `400 Bad Request` — validation failure
- **Status**: `401 Unauthorized` — missing or invalid token
- **Status**: `403 Forbidden` — caller is not an admin

#### DELETE `/api/users/:id`
Deletes a user account.

**Success Response**
- **Status**: `200 OK` or `204 No Content`

**Error Response**
- **Status**: `404 Not Found` — user not found
- **Status**: `401 Unauthorized` — missing or invalid token
- **Status**: `403 Forbidden` — caller is not an admin

#### PATCH `/api/users/:id/activate`
Activates or deactivates a user account.

**Request Body**
```json
{
  "isActive": true
}
```

**Success Response**
- **Status**: `200 OK`
- **Body**: updated user details with new `isActive` state

**Error Response**
- **Status**: `404 Not Found` — user not found
- **Status**: `400 Bad Request` — validation failure
- **Status**: `401 Unauthorized` — missing or invalid token
- **Status**: `403 Forbidden` — caller is not an admin

## Authentication — `AuthRoutes` (mounted under `/api/auth`)

#### POST `/api/auth/register`
Creates a new account (public registration).

**Request Body**
```json
{
  "username": "new_user",
  "email": "new_user@example.com",
  "password": "StrongPassword123!"
}
```

**Success Response**
- **Status**: `201 Created`
- **Body**: created account summary (without password hash)

**Error Response**
- **Status**: `400 Bad Request` — validation failure
- **Status**: `409 Conflict` — username or email already exists

#### POST `/api/auth/login`
Authenticates a user, returns an access token in JSON and sets a refresh token cookie.

**Request Body**
```json
{
  "username": "user_name",
  "password": "StrongPassword123!"
}
```

**Success Response**
- **Status**: `200 OK`
- **Headers**: `Set-Cookie` containing the refresh token (HTTP-only, secure)
- **Body**:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "username": "user_name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response**
- **Status**: `401 Unauthorized`
- **Body**: `{ "message": "Invalid credentials" }` (no sensitive account details exposed)

#### POST `/api/auth/refresh`
Issues a new access token using the refresh token cookie sent by the browser.

**Success Response**
- **Status**: `200 OK`
- **Body**:
```json
{
  "accessToken": "eyJhbGc..."
}
```

**Error Response**
- **Status**: `401 Unauthorized` — missing or invalid refresh token cookie

#### POST `/api/auth/logout`
Clears the refresh token cookie.

**Success Response**
- **Status**: `200 OK`
- **Body**: `{ "message": "Logout successful" }`

## Security Requirements

- All authentication responses use HTTPS-sensitive cookie settings in production.
- The refresh token is stored in an HTTP-only cookie and not exposed in JavaScript-accessible storage.
- Passwords are never returned or logged in plaintext.
- The backend must reject expired or malformed tokens before allowing access to protected routes.
- Invalid login errors must not reveal whether the username or email exists.
- Role-based access (`requireRole`) enforces authorization on rating-count and user management endpoints.
