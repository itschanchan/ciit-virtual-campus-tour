# QuickStart Validation Guide

This guide shows how to manually verify the user management and authentication routes feature.

## Prerequisites

- Node.js LTS installed
- MongoDB running locally or reachable via environment variables
- Backend dependencies installed (`npm install` in `apps/backend`)
- Backend environment variables configured (`MONGODB_URI`, `MONGODB_NAME`, `JWT_SECRET`)
- Backend started (`npm run dev` or `node apps/backend/index.js` from repository root)

## Steps

1. **Register a new account**
   - Send `POST /api/auth/register` with `username`, `email`, and `password`.
   - Confirm the account is created (status 201) and no password hash is returned.
   - Register again with the same email; confirm the request is rejected (status 409).

2. **Log in and receive tokens**
   - Send `POST /api/auth/login` with valid `username` and `password`.
   - Confirm the response returns an `accessToken` and sets a refresh token cookie (status 200).
   - Send `POST /api/auth/login` with invalid credentials; confirm rejection (status 401) with no sensitive details exposed.

3. **View your own profile**
   - Send `GET /api/users/me` with the access token in the `Authorization: Bearer` header.
   - Confirm the response returns your profile (status 200).
   - Send the same request without a token; confirm rejection (status 401).

4. **View your rating count (author/admin only)**
   - As an author or admin, send `GET /api/users/me/rating-count` with a valid token.
   - Confirm the rating count is returned (status 200).
   - As a regular user, send the same request; confirm rejection (status 403).

5. **Create, retrieve, update, activate, and delete a user (admin only)**
   - As an admin, send `POST /api/users/` to create a new user (status 201).
   - Send `GET /api/users/:id` for the created user; confirm details are returned (status 200).
   - Send `PUT /api/users/:id` to update the user's information; confirm changes are applied (status 200).
   - Send `PATCH /api/users/:id/activate` with `isActive: false`; confirm the account is deactivated (status 200).
   - Send `DELETE /api/users/:id`; confirm the account is removed (status 200 or 204).
   - As a non-admin, repeat any of the above; confirm rejection (status 403).

6. **Refresh an expired access token**
   - With a valid refresh token cookie, send `POST /api/auth/refresh`.
   - Confirm a new `accessToken` is returned (status 200).
   - Clear the cookie or send an invalid cookie; confirm rejection (status 401).

7. **Log out**
   - Send `POST /api/auth/logout` with a valid session.
   - Confirm the refresh token cookie is cleared (status 200).
   - Attempt to use the old refresh token for another refresh; confirm rejection (status 401).

8. **Verify error handling**
   - Send `GET /api/users/:id` for a non-existent user id; confirm a not-found response (status 404).
   - Send `POST /api/users/` with missing required fields; confirm validation failure (status 400).

## Expected Outcomes

- Valid registration creates an account; duplicate emails are rejected.
- Valid login returns an access token and sets a refresh token cookie.
- Profile access succeeds for authenticated users and fails without a token.
- Rating-count access succeeds for authors/admins and is denied for other roles.
- Full user lifecycle (create → retrieve → update → activate/deactivate → delete) succeeds for admins.
- Token refresh succeeds with a valid cookie and fails without one.
- Logout clears the refresh token cookie.
- All responses avoid exposing sensitive account details or secrets.

If all checks pass, the feature meets the acceptance criteria and the constitutional quality gates for auth and user management behavior.
