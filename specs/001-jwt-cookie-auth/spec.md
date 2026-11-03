# Feature Specification: JWT Cookie Access

**Feature Branch**: `001-jwt-cookie-auth`

**Created**: 2026-11-04

**Status**: Draft

**Input**: User description: "Let's start building up the backend of the project, specifically, setting up JSON Web Token Access and Web Cookies"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log in and receive a secure JWT (Priority: P1)

A registered user submits their credentials and receives a time-limited JWT that grants them entry to protected campus tour administration features.

**Why this priority**: Authentication is the foundation of the feature; without it, no protected resources can be secured.

**Independent Test**: Can be tested by submitting valid login credentials and confirming the system issues a JWT that allows access to a protected endpoint.

**Acceptance Scenarios**:

1. **Given** a registered user with valid credentials, **When** they submit their login information, **Then** the system issues a time-limited JWT.
2. **Given** an unregistered user with invalid credentials, **When** they attempt to log in, **Then** the system denies access and does not issue a JWT.

---

### User Story 2 - Stay signed in across page refreshes (Priority: P2)

An authenticated user's JWT is stored in a browser cookie so their session persists when they refresh the page or navigate between protected features.

**Why this priority**: Users should not need to re-authenticate on every page load; cookie-based persistence delivers a usable session experience.

**Independent Test**: Can be tested by logging in, refreshing the page, and confirming the user remains authenticated without re-entering credentials.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a stored cookie, **When** they refresh the browser, **Then** they remain signed in and can access protected features.
2. **Given** an authenticated user, **When** they navigate to a different protected page, **Then** their authentication state is preserved.

---

### User Story 3 - Log out and end the session (Priority: P2)

An authenticated user can end their session, which clears the stored JWT from the browser cookie.

**Why this priority**: Users must be able to terminate their session, especially on shared or public devices.

**Independent Test**: Can be tested by logging in, logging out, and confirming the credential is cleared and protected features become inaccessible.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an active session cookie, **When** they log out, **Then** the stored JWT is cleared from the browser.
2. **Given** a user who has logged out, **When** they attempt to access a protected feature, **Then** access is denied.

---

### User Story 4 - Protected resources require valid authentication (Priority: P1)

Campus tour administration endpoints reject requests that do not include a valid, unexpired JWT.

**Why this priority**: Security is the core purpose of the feature; protected data must not be accessible to unauthenticated users.

**Independent Test**: Can be tested by attempting to access a protected endpoint without a JWT and confirming the request is denied.

**Acceptance Scenarios**:

1. **Given** no JWT is present, **When** a request is made to a protected endpoint, **Then** the system denies access.
2. **Given** an expired JWT, **When** a request is made to a protected endpoint, **Then** the system denies access and requires re-authentication.

---

### Edge Cases

- What happens when a user's cookie is blocked or deleted by the browser?
- How does the system handle concurrent logins from multiple devices?
- What occurs when a JWT expires mid-session?
- How are malformed or tampered credentials handled?
- Are login attempts rate-limited by IP address to prevent brute-force attacks?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow registered users to authenticate using an email address and receive a time-limited JWT.
- **FR-002**: System MUST store the JWT in a browser cookie with HttpOnly, Secure, and SameSite=Strict attributes.
- **FR-003**: System MUST preserve authentication state across page reloads using the stored cookie.
- **FR-004**: System MUST allow users to end their session and clear the stored JWT.
- **FR-005**: System MUST reject access to protected resources when no valid JWT is present.
- **FR-006**: System MUST reject expired JWTs and require re-authentication.

### Key Entities *(include if feature involves data)*

- **User**: Represents a person who can authenticate with credentials and access protected campus tour features.
- **Session**: Represents an active authenticated period tied to a user, with a defined expiry time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can log in and access protected features within 1 minute.
- **SC-002**: At least 95% of login attempts with valid credentials succeed.
- **SC-003**: Authenticated sessions persist across browser refreshes without requiring re-login.
- **SC-004**: All unauthenticated access attempts to protected resources are denied.
- **SC-005**: Authentication cookies use HttpOnly, Secure, and SameSite=Strict attributes to prevent theft and cross-site misuse.

## Assumptions

- Users have standard web browsers with cookie support enabled.
- Public campus tour viewing remains open and does not require authentication.
- Administrative campus tour endpoints require authentication.
- A session duration of 24 hours is sufficient for typical use.
- Existing user account data in MongoDB will be used for credential validation.
- The backend declares `cookie-parser` before cookie-based authentication is implemented, per the project constitution.

## Clarifications

### Session 2026-11-04

- Q: How should the system identify a user at login — email address, username, or either one? → A: Email address only
- Q: Should the authentication cookie be protected with HttpOnly, Secure, and SameSite attributes? → A: Yes, enable HttpOnly, Secure, and SameSite=Strict
- Q: Should login attempts be rate-limited to prevent brute-force attacks? → A: Rate limit only by IP address
