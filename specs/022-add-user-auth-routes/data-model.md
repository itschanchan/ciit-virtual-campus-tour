# Data Model

## User Account

- **id**: unique identifier for the user account (MongoDB ObjectId).
- **username**: unique login identifier.
- **email**: unique email address used for authentication and contact.
- **passwordHash**: bcrypt-hashed password stored securely; never stored in plaintext.
- **role**: account role (e.g., `user`, `author`, `admin`), used for authorization.
- **isActive**: boolean indicating whether the account is currently active.
- **createdAt**: creation timestamp.
- **updatedAt**: last update timestamp.

### Validation Rules

- Username or email must be present for account creation.
- Passwords must be hashed before persistence.
- Email and username must be unique across accounts.
- Inactive accounts cannot authenticate or perform protected actions.

## Authentication Session

- **accessToken**: JWT issued after successful login or token refresh.
- **refreshToken**: refresh token stored in a secure HTTP-only cookie.
- **expiresAt**: time at which the access token expires.
- **issuedAt**: timestamp when the token was issued.
- **role**: derived user role used in authorization checks.

### Validation Rules

- The JWT must be validated on every protected route.
- Expired or malformed tokens must be rejected.
- Token refresh requires a valid, non-expired refresh token cookie.
- The session must be cleared when logout is triggered.

## Rating Count

- **userId**: reference to the user account the ratings belong to.
- **count**: tally of ratings associated with the user.
- **updatedAt**: last update timestamp.

### Validation Rules

- Rating count is visible only to the account owner, authors, and administrators.
- Count updates only through the rating service (out of scope for this feature).

## Authorized Administrator

- A user account with the `admin` role permitted to perform user management operations (create, view, update, activate/deactivate, delete).

### Validation Rules

- Only `admin` role accounts may access user management endpoints.
- Non-admin requests to user management endpoints are rejected.

## Relationships

- An **Authentication Session** is created for a **User Account** after successful login.
- A **Rating Count** belongs to one **User Account**.
- An **Authorized Administrator** is a **User Account** with the `admin` role.
