# Feature Specification: Admin Login and Dashboard

**Feature Branch**: `017-admin-auth-dashboard`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "Develop a secure administrator login page and an administrative dashboard for the CIIT Virtual Campus Tour website. The system must allow authorized administrators to authenticate and access a protected dashboard for managing the virtual tour platform."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure administrator login (Priority: P1)

An administrator needs to access the protected management area of the campus tour. From the login page, the administrator enters a username or email and a password, the credentials are checked against stored admin records, and a secure JWT-based session is created when access is valid.

**Why this priority**: Without a working login flow, the dashboard is inaccessible and the protected admin experience cannot be used. This is the foundation for all other admin functionality.

**Independent Test**: Open the admin login page, submit valid credentials, and confirm the system creates a secure session and redirects to the dashboard. Submit invalid credentials and confirm access is denied with a clear error.

**Acceptance Scenarios**:

1. **Given** an administrator is on the login page, **When** they enter valid credentials and submit the form, **Then** the system validates them against the administrator records in MongoDB and redirects them to the dashboard.
2. **Given** an administrator is on the login page, **When** they enter a wrong username/email or password, **Then** the system rejects the request and displays an appropriate error without exposing sensitive account details.
3. **Given** the login request is valid, **When** the backend authenticates the admin, **Then** it securely hashes or verifies the password using bcrypt and issues a JWT.
4. **Given** the login succeeds, **When** the server responds, **Then** the JWT is stored in a secure HTTP-only cookie and the browser is redirected to `/admin`.
5. **Given** an administrator is already authenticated, **When** they navigate to the login page, **Then** they are redirected to the dashboard instead of being shown the login form again.
6. **Given** an administrator clicks logout, **When** the logout action is triggered, **Then** the session is cleared and the user is redirected to the login page.
7. **Given** an administrator is authenticated, **When** they refresh the same tab, **Then** their session remains active; **When** they open the admin dashboard in a new tab, **Then** they are asked to sign in.

---

### User Story 2 - Protected admin dashboard access (Priority: P1)

An authenticated administrator needs a single place to manage the tour platform. The dashboard provides a responsive workspace with sidebar navigation, overview content, admin profile information, and a secure log-out action.

**Why this priority**: The dashboard is the administrator-facing product surface and must be protected from unauthenticated access. It delivers the main value of the feature.

**Independent Test**: Attempt to open `/admin` without a valid session and confirm the user is redirected to the login page. Sign in and confirm the dashboard loads with the expected navigation, overview, and profile content.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor is not authenticated, **When** they navigate to `/admin`, **Then** they are redirected to the admin login page.
2. **Given** an authenticated administrator is signed in, **When** they open `/admin`, **Then** they can access the dashboard content and protected routes.
3. **Given** the dashboard loads, **When** the administrator views the page, **Then** they see a responsive sidebar, an overview section, and an administrator profile area.
4. **Given** the dashboard is open, **When** the administrator selects logout, **Then** the session is closed and access to protected routes ends immediately.
5. **Given** the dashboard is open on a mobile screen, **When** the administrator uses the page, **Then** the layout remains usable and responsive across screen sizes.

---

### User Story 3 - Future-ready dashboard structure (Priority: P2)

The dashboard should prepare for future administrative functionality without implementing full content management in this scope. The navigation should clearly reserve space for a Gallery Manager while keeping the current change focused on login and protected access.

**Why this priority**: This establishes a maintainable structure for future admin features while keeping the feature scope constrained to login and dashboard access.

**Independent Test**: Open the dashboard and verify the navigation includes the reserved Gallery Manager entry and the page content remains consistent across views.

**Acceptance Scenarios**:

1. **Given** the dashboard loads, **When** the administrator views the sidebar, **Then** they see navigation for future administrative sections including a Gallery Manager placeholder.
2. **Given** the dashboard content is open, **Then** the layout remains consistent with the project’s responsive design system and no public registration path is exposed.

---

### Edge Cases

- A user submits an empty username or password; the system must reject the request and show a validation message.
- An attacker attempts to access `/admin` with a stale or invalid JWT; the server must reject the request and redirect to login.
- An administrator enters a valid username but mismatched password; the system must handle the failure without revealing whether the username exists.
- A logout request is made after the JWT has expired; the system must still clear the local session state cleanly.
- The dashboard is opened on a narrow viewport; the layout must remain usable without overflow or broken navigation.
- The login page is requested when a valid admin session already exists; the system must redirect the user to the dashboard rather than showing a second login form.
- The system receives a malformed or missing cookie; it must treat the user as unauthenticated and redirect to login.
- The admin dashboard must not expose public registration or self-service account creation.

## Clarifications

### Session 2026-11-14

- Q: How long should a JWT admin session token remain valid before expiration? → A: 8 hours
- Q: Which user attributes are required when creating an administrator account? → A: All current model fields (first_name, last_name, date_of_birth, address, contact_number)
- Q: Should repeated failed login attempts be rate-limited to prevent brute-force attacks? → A: No rate limiting (unlimited retry attempts)
- Q: What maximum response time should the admin login API return results within? → A: 2 seconds

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an administrator login page with username/email and password fields.
- **FR-002**: The login page MUST validate credentials against administrator records stored in MongoDB.
- **FR-003**: The system MUST verify passwords using bcrypt before accepting a login.
- **FR-004**: The system MUST issue a JWT after successful authentication.
- **FR-005**: The JWT MUST be stored in a secure HTTP-only cookie.
- **FR-006**: The system MUST redirect authenticated administrators to `/admin` after a successful login.
- **FR-007**: The system MUST reject invalid credentials with an appropriate error message without exposing sensitive account details.
- **FR-008**: The system MUST provide a logout mechanism that clears the admin session and redirects to the login page.
- **FR-009**: The system MUST not provide public administrator registration.
- **FR-010**: The system MUST expose a dashboard route at `/admin` for authenticated administrators.
- **FR-011**: The dashboard MUST include a responsive sidebar navigation.
- **FR-012**: The dashboard MUST display a dashboard overview section.
- **FR-013**: The dashboard MUST include an administrator profile section.
- **FR-014**: The dashboard MUST provide a logout button that works consistently with the backend session logic.
- **FR-015**: The dashboard MUST reserve navigation space for a Gallery Manager feature placeholder.
- **FR-016**: The system MUST restrict access to the dashboard to authenticated administrators only.
- **FR-017**: Unauthenticated users MUST be redirected to the login page when they try to access protected routes.
- **FR-018**: The admin experience MUST follow the project’s frontend and backend structure using React + Vite on the frontend and Node.js + Express.js with MongoDB + Mongoose on the backend.
- **FR-019**: The admin login and dashboard experience MUST use JWT-based authentication and secure cookie handling consistent with the project constitution.
- **FR-020**: The admin login and dashboard UI MUST use reusable React components and Tailwind CSS styling.
- **FR-021**: The design MUST remain responsive and usable on desktop and mobile screens.
- **FR-022**: Authentication behavior and protected-route access MUST be covered by automated tests using Vitest.
- **FR-023**: The dashboard UI MUST preserve a consistent visual design across all admin pages in scope.
- **FR-024**: The feature scope MUST be limited to admin authentication and the dashboard shell; gallery CRUD operations, Marzipano API integration, and other admin features are out of scope for this release.
- **FR-025**: The authenticated admin tab MUST retain its session marker across refreshes and MUST require authentication in a new tab.

### Key Entities

- **Administrator**: A user with authenticated admin access to the tour platform; includes username or email, password hash, first name, last name, date of birth, address, contact number, and active status.
- **Admin Session**: The authenticated security state created after valid login, represented by a JWT stored in an HTTP-only cookie.
- **Login Page**: The public entry point for admin access that accepts credentials and triggers server-side verification.
- **Dashboard**: The protected admin landing area containing overview content, profile information, and navigation.
- **Protected Route**: Any admin-only page or API endpoint that requires a valid JWT and admin authentication.
- **Gallery Manager Placeholder**: A reserved navigation item showing that future admin functionality will be added without defining the full feature in this spec.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid admin login attempts result in a successful authentication and redirect to `/admin`.
- **SC-002**: 100% of invalid login attempts are rejected and show a clear error to the user.
- **SC-003**: 100% of protected dashboard requests without a valid cookie or JWT are redirected to the login page.
- **SC-004**: 100% of authenticated administrators can reach the dashboard and access the overview and profile sections.
- **SC-005**: Logout clears the session and prevents further access to protected admin routes.
- **SC-006**: The admin login and dashboard experience works on both desktop and mobile screen sizes without critical layout breakage.
- **SC-007**: At least one automated authentication test and one protected-route test pass for the admin workflow under Vitest.
- **SC-008**: Passwords are never stored or transmitted in plaintext and are verified through bcrypt.
- **SC-009**: The admin dashboard remains limited to admin-only access and contains no public registration flow.
- **SC-010**: JWT admin session tokens expire after 8 hours, requiring re-authentication once expired.
- **SC-011**: The admin login API responds within 2 seconds for valid and invalid credential attempts.

## Assumptions

- The project already contains the required backend and frontend architecture described in the constitution.
- Administrator credentials are stored in MongoDB by the backend and are accessible via Mongoose models.
- The JWT secret and database configuration are supplied by environment variables as required by project security rules.
- This feature is limited to login and admin dashboard shell behavior; gallery management and other admin tasks are deferred.
- The project continues to use React + Vite, Tailwind CSS, Express.js, MongoDB, Mongoose, and Vitest as its approved technology stack.
- Protected routes redirect unauthenticated users to the login page instead of rendering the admin UI.
- The admin dashboard includes placeholder navigation to support future management features without requiring those features in this release.
- Failed login attempts are not rate-limited (unlimited retry attempts allowed); this is an explicit design decision documented in the Clarifications section.
