# Feature Specification: Standardize Admin Mongoose Schema

**Feature Branch**: `[019-standardize-admin-schema]`

**Created**: November 13, 2026

**Status**: Draft

**Input**: User description: "In @apps/backend/models/Admins.js use the @docs/prompts/backend-prompts/admin_schema.md code syntax as a reference for industry-standard way of instantiating the schema."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Create a new admin account (Priority: P1)

A system administrator registers a new admin account by providing a username, email, password, first name, and last name. The system stores the account with a hashed password and marks it active by default.

**Why this priority**: Admin account creation is the foundational action that enables all other administrative capabilities; without it, no administrator can access the system.

**Independent Test**: Can be fully tested by attempting to create an admin account with valid data and confirming the account is stored with required fields, then delivers value by allowing an admin to exist in the system.

**Acceptance Scenarios**:

1. **Given** no admin account exists with the given username or email, **When** a new admin account is submitted with all required fields, **Then** the account is created with a hashed password, active status, and creation timestamp.
2. **Given** an admin account already exists with the same username, **When** a new account is submitted with that username, **Then** the submission is rejected.
3. **Given** an admin account already exists with the same email, **When** a new account is submitted with that email, **Then** the submission is rejected.

---

### User Story 2 - Verify admin login credentials (Priority: P2)

An administrator signs in by providing a username and password. The system verifies the password against the stored hash and confirms the account is active.

**Why this priority**: Credential verification is the gatekeeper for administrative access and directly protects administrative data.

**Independent Test**: Can be fully tested by submitting valid and invalid credentials against a stored admin account and observing acceptance or rejection, delivering secure access control.

**Acceptance Scenarios**:

1. **Given** an active admin account exists with a stored password hash, **When** the correct password is submitted, **Then** the credentials are accepted.
2. **Given** an active admin account exists, **When** an incorrect password is submitted, **Then** the credentials are rejected.
3. **Given** an admin account is marked inactive, **When** credentials are submitted, **Then** access is denied even with the correct password.

---

### Edge Cases

- What happens when a password is changed on an existing account?
- How does the system handle an empty or missing required field?
- What happens when the same admin attempts to register twice with the same email?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST store an admin account with username, email, password, first name, last name, role, and active status.
- **FR-002**: System MUST reject creation of an admin account with a username that already exists.
- **FR-003**: System MUST reject creation of an admin account with an email that already exists.
- **FR-004**: System MUST hash an admin's password before it is stored so the plaintext password is never persisted.
- **FR-005**: System MUST verify login credentials by comparing a submitted password against the stored password hash.
- **FR-006**: System MUST track whether an admin account is active or inactive.
- **FR-007**: System MUST record the creation time and last update time for each admin account.

### Key Entities *(include if feature involves data)*

- **Admin**: Represents an administrative user account; key attributes are username, email, password, first name, last name, role, active status, creation time, and last update time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new admin account can be created with all required fields present and stored successfully.
- **SC-002**: Attempts to create an admin account with a duplicate username or email are rejected every time.
- **SC-003**: Stored admin passwords are never retrievable in plaintext form.
- **SC-004**: A correct password is accepted and an incorrect password is rejected during credential verification on every attempt.
- **SC-005**: Every admin account displays both its creation time and its last update time.

## Assumptions

- The admin model remains named "Admin" and lives in `apps/backend/models/Admins.js`.
- Password hashing uses industry-standard salt rounds consistent with the reference schema.
- The admin role defaults to "admin" and may be scoped to allowed values.
- Existing authentication flows will consume this model without changes to their contract.
