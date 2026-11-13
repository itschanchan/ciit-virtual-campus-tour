# Feature Specification: Add User Management and Auth Routes

**Feature Branch**: `022-add-user-auth-routes`

**Created**: 2026-11-13

**Status**: Draft

**Input**: User description: "Add these routes to AdminRoutes.js import { Router } from "express"; ... Then change the name of AdminAuthRoutes.js to AuthRoutes.js with this codes inside: import { Router } from "express"; ... register, login, refresh, logout ..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and manage own user profile (Priority: P1)

An authenticated user can view their own profile through a dedicated endpoint. Authors and administrators can additionally view their own rating count through a role-protected endpoint. This lets each person confirm their account status and activity metrics without needing administrator assistance.

**Why this priority**: Profile access is the most frequently used self-service action and is the foundation for all other user account interactions. It delivers immediate value to every logged-in user.

**Independent Test**: Log in as a user, request the current-user profile endpoint, and confirm the returned profile matches the logged-in account. Log in as an author or administrator, request the rating-count endpoint, and confirm the count is returned; then confirm the same request is denied for a user without the author or administrator role.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they request their own profile, **Then** the system returns the profile for that user.
2. **Given** an unauthenticated request is made to the profile endpoint, **Then** the system denies access.
3. **Given** an author or administrator is authenticated, **When** they request their own rating count, **Then** the system returns the rating count.
4. **Given** a user without the author or administrator role is authenticated, **When** they request the rating-count endpoint, **Then** the system denies access.

---

### User Story 2 - Manage user accounts (Priority: P1)

Authorized administrators can create new user accounts, view a user's details by identifier, update a user's information, deactivate or activate a user account, and delete a user account. This supports lifecycle management of user accounts on the platform.

**Why this priority**: Account lifecycle management is core administrative functionality. Without it, administrators cannot onboard users, correct account information, respond to abuse, or remove accounts.

**Independent Test**: As an administrator, create a new user, view the created user's details, update the user's information, activate/deactivate the user, and delete the user, confirming each operation succeeds. As a non-administrator, confirm each of these operations is denied.

**Acceptance Scenarios**:

1. **Given** an administrator is authenticated, **When** they create a new user account, **Then** the system creates the account and returns the new user's details.
2. **Given** an administrator is authenticated, **When** they request a user's details by identifier, **Then** the system returns that user's details.
3. **Given** an administrator is authenticated, **When** they update a user's information, **Then** the system applies the changes and returns the updated user.
4. **Given** an administrator is authenticated, **When** they deactivate or activate a user account, **Then** the system changes the account's active state accordingly.
5. **Given** an administrator is authenticated, **When** they delete a user account, **Then** the system removes the account.
6. **Given** a non-administrator attempts any user management operation, **Then** the system denies access.

---

### User Story 3 - Authenticate and manage sessions (Priority: P1)

A user can register a new account, log in to receive an access token and a refresh token cookie, refresh an expired access token using the refresh token cookie, and log out to clear the session. This establishes the full authentication lifecycle for platform access.

**Why this priority**: Authentication is the gateway to every protected feature. Registration, login, token refresh, and logout together form the complete session lifecycle users depend on.

**Independent Test**: Register a new account, log in and confirm an access token is returned with a refresh token cookie set, refresh the access token using the cookie, and log out and confirm the refresh token cookie is cleared.

**Acceptance Scenarios**:

1. **Given** new registration details are provided, **When** a user registers, **Then** the system creates the account.
2. **Given** valid credentials are submitted, **When** a user logs in, **Then** the system returns an access token and sets a refresh token cookie.
3. **Given** an expired access token and a valid refresh token cookie, **When** the user requests a token refresh, **Then** the system returns a new access token.
4. **Given** an invalid or missing refresh token cookie, **When** the user requests a token refresh, **Then** the system denies the request.
5. **Given** an authenticated user, **When** they log out, **Then** the system clears the refresh token cookie.
6. **Given** invalid login credentials, **When** a user logs in, **Then** the system denies access without exposing sensitive account details.

### Edge Cases

- A registration request uses an email or username already belonging to an existing account; the system rejects it with a clear message.
- A login request submits an empty or malformed credential; the system rejects it with a validation message.
- A refresh request arrives with an expired or tampered refresh token cookie; the system denies it and does not issue a new access token.
- A user management request targets a user identifier that does not exist; the system returns a not-findable outcome rather than exposing internal data.
- Multiple rapid logout requests are made; each clears the session cleanly without error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to view their own profile.
- **FR-002**: System MUST allow authors and administrators to view their own rating count.
- **FR-003**: System MUST deny rating-count access to users who do not have the author or administrator role.
- **FR-004**: System MUST allow retrieval of a user's details by user identifier.
- **FR-005**: System MUST allow creation of new user accounts.
- **FR-006**: System MUST allow updating an existing user's information.
- **FR-007**: System MUST allow deletion of a user account.
- **FR-008**: System MUST allow activation of a user account.
- **FR-009**: System MUST restrict user management operations (create, view, update, delete, activate) to authorized administrators.
- **FR-010**: System MUST allow new users to register an account.
- **FR-011**: System MUST authenticate users via login, returning an access token and setting a refresh token cookie.
- **FR-012**: System MUST allow refresh of an expired access token using the refresh token cookie.
- **FR-013**: System MUST deny token refresh when the refresh token cookie is missing or invalid.
- **FR-014**: System MUST allow users to log out, clearing the refresh token cookie.
- **FR-015**: System MUST reject login with invalid credentials without exposing sensitive account details.

### Key Entities *(include if feature involves data)*

- **User account**: A registered user profile with identifying details and an active or inactive state.
- **Rating count**: A tally of ratings associated with a user, visible to authors and administrators.
- **Authentication session**: A logged-in state established by valid credentials, represented by an access token and a refresh token cookie.
- **Authorized administrator**: A user with the administrator role permitted to perform user management operations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of authenticated requests to view a user's own profile succeed and return that user's profile.
- **SC-002**: 100% of rating-count requests by users without the author or administrator role are denied.
- **SC-003**: 100% of successful login attempts return an access token and set a refresh token cookie.
- **SC-004**: 100% of logout requests clear the refresh token cookie.
- **SC-005**: User account creation, update, deactivation/activation, and deletion each succeed for authorized administrators.
- **SC-006**: Account activation transitions a user from inactive to active state.
- **SC-007**: 100% of token-refresh requests with a missing or invalid refresh token cookie are denied.
- **SC-008**: Account lifecycle operations are complete end to end: create, retrieve, update, activate/deactivate, and delete.

## Assumptions

- User accounts and ratings are stored in the backend database and are accessible through existing data models.
- Role-based access distinguishes between regular users, authors, and administrators.
- Token-based authentication is already used by the project for protecting endpoints.
- The refresh token is managed through a secure cookie.
- The auth route reorganization preserves existing login and logout behavior while adding registration and token refresh capabilities.
- User management operations are administrative and require administrator authorization.
