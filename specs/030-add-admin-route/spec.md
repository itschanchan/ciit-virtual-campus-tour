# Feature Specification: Add Admin Route

**Feature Branch**: `[030-add-admin-route]`

**Created**: 2026-11-26

**Status**: Draft

**Input**: User description: "I wanted to have a route for @apps/frontend/src/pages/AdminLoginPage.jsx if I add a "/admin" to the main url. Check the @vercel.json if I am with the right approach."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor reaches the admin login page at /admin (Priority: P1)

A visitor types the main URL plus "/admin" in the browser address bar and reaches the admin sign-in page instead of the campus tour. After successful login, the visitor is taken to the admin dashboard.

**Why this priority**: Reaching the admin area through a predictable URL is the core purpose of this feature. Without it, there is no way to access admin functionality from the main URL.

**Independent Test**: Open the main URL with "/admin" appended and confirm the admin sign-in page renders, then submit valid credentials and confirm navigation to the admin dashboard.

**Acceptance Scenarios**:

1. **Given** a visitor is on the main campus tour URL, **When** they append "/admin" to the address bar and press enter, **Then** the admin login page renders instead of the campus tour.
2. **Given** the visitor is on the admin login page, **When** they enter valid admin credentials and submit, **Then** they are navigated to the admin dashboard.
3. **Given** the visitor is on the admin login page, **When** they enter invalid credentials and submit, **Then** an error message is shown and they remain on the login page.

---

### User Story 2 - Campus tour remains accessible at the main URL (Priority: P1)

A visitor who goes to the main URL (without "/admin") continues to see the campus tour experience unchanged. The admin route must not break the existing public tour.

**Why this priority**: Adding the admin route must not regress the primary public-facing experience of the virtual campus tour.

**Independent Test**: Open the main URL without "/admin" and confirm the campus tour loads and is navigable.

**Acceptance Scenarios**:

1. **Given** a visitor opens the main campus tour URL, **When** the page loads, **Then** the campus tour experience renders instead of the admin login page.

---

## Edge Cases

- The main URL with "/admin" must render the admin login page, not rewrite every path to the admin page.
- Accessing "/admin/login" directly continues to work as before.
- Accessing "/admin/dashboard" continues to require authentication and redirect to login when unauthenticated.
- Refreshing the page while on "/admin" must still render the admin login page (client-side routing preserved).
- An unauthenticated visitor on any "/admin" sub-route is redirected to the login page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render the admin login page when a visitor accesses the main URL with "/admin" appended.
- **FR-002**: The system MUST continue rendering the campus tour when a visitor accesses the main URL without "/admin".
- **FR-003**: The system MUST continue supporting direct access to "/admin/login" for the admin login page.
- **FR-004**: The system MUST require authentication for "/admin/dashboard" and redirect unauthenticated visitors to the login page.
- **FR-005**: The system MUST preserve client-side navigation so refreshing on "/admin" still renders the admin login page.
- **FR-006**: The routing change MUST NOT rewrite every URL path to the admin login page.

## Assumptions

- The frontend is a single-page application where client-side routing in `App.jsx` already handles `/admin/login` and `/admin/dashboard`.
- The deployment host uses `vercel.json` rewrite rules to map incoming URLs to the frontend application entry point.
- The admin login page (`AdminLoginPage.jsx`) already exists and handles authentication and navigation to `/admin`.
- No backend route changes are required; this is purely a frontend routing / deployment rewrite concern.
- The admin area remains out of scope for the public campus tour experience per the existing tour assumptions.

## Clarifications

### Session 2026-11-26

- Q: Should the vercel.json rewrite be scoped to /admin paths and point to the SPA entry point (index.html) so the existing client router renders the login page? → A: Scope the rewrite to /admin and /admin/*, destination = SPA entry (index.html)
- Q: Why does /admin still return 404 on Vercel after adding the rewrite, and what is the correct deployment fix? → A: The rewrite destination must be the built SPA entry `/index.html` (Vercel serves the built `dist/` at the site root, so a source path like `/apps/frontend/index.html` does not exist). Also, `vercel.json` is only read from the Vercel project's Root Directory: add `apps/frontend/vercel.json` when Root Directory = `apps/frontend`, or fix the root `vercel.json` when Root Directory = repo root.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of visits to the main URL with "/admin" appended render the admin login page.
- **SC-002**: 100% of visits to the main URL without "/admin" render the campus tour, not the admin page.
- **SC-003**: 0 URL paths other than those under "/admin" are rewritten to the admin login page.
- **SC-004**: 100% of page refreshes while on "/admin" or any "/admin" sub-route render the expected admin page.

## vercel.json Note (context for planning)

The original `vercel.json` rewrote `"/(.*)"` to the raw `AdminLoginPage.jsx` file path. That rewrites every path to the login page and points browsers at a source file that cannot be executed. Confirmed resolution: scope the rewrite to `/admin` and `/admin/*` with destination = `/index.html` (the built SPA entry served at the site root). Vercel only reads `vercel.json` from the project's Root Directory, so the file must exist there: `apps/frontend/vercel.json` when Root Directory = `apps/frontend`, or the root `vercel.json` when Root Directory = the repo root. The existing client-side router in `App.jsx` then renders the login page.
