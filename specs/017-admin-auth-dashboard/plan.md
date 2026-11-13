# Implementation Plan: Admin Login and Dashboard

**Branch**: `017-admin-auth-dashboard` | **Date**: 2026-11-12 | **Spec**: `specs/017-admin-auth-dashboard/spec.md`

**Input**: Feature specification from `specs/017-admin-auth-dashboard/spec.md`

## Summary

Add a secure administrator authentication flow for the CIIT Virtual Campus Tour and a protected admin dashboard shell. The backend will validate admin credentials against MongoDB, verify passwords with bcrypt, issue a JWT, and set a secure HTTP-only cookie for authenticated sessions. The frontend will include a dedicated admin login page, a protected `/admin` route, and a responsive dashboard that features sidebar navigation, overview content, profile details, logout control, and a Gallery Manager placeholder. The work stays within the existing React/Vite frontend, Express/Mongoose backend, and Vitest suite; the only new dependency required is `bcrypt`, which must be explicitly approved and recorded in the project docs before installation.

## Technical Context

**Language/Version**: JavaScript ES modules on Node.js LTS (project currently uses Node with Vite and Express)

**Primary Dependencies**: Express 5, Mongoose 9, JWT, `cookie-parser`, `cors`, `dotenv`, and `bcrypt` (new runtime dependency requiring explicit approval and documentation); React 19, Vite 8, Tailwind CSS 4, MUI 9

**Storage**: MongoDB with Mongoose; admin account data stored in a dedicated admin model/collection, plus session validation using JWT claims

**Testing**: Vitest + Supertest for backend API tests; Vitest + Testing Library + jsdom for frontend interaction tests

**Target Platform**: Web browsers on desktop, tablet, and mobile with protected admin routes

**Project Type**: Web application with a frontend dashboard and backend auth API

**Performance Goals**: Login response under 2 seconds for a local MongoDB-backed request; dashboard route redirect logic resolves immediately; no UI blocking or layout overflow at supported widths; cookie-based auth state is read and enforced before render

**Constraints**: No public registration flow; no plain-text password storage; JWT lives in an HTTP-only cookie; unauthenticated users are redirected to login; login and dashboard pages must remain responsive on mobile and desktop; `bcrypt` and any auth dependency changes require maintainer approval and a tech-stack update before implementation proceeds; project constitution still governs package and workflow decisions

**Scale/Scope**: Backend auth routes and services, one MongoDB admin model, frontend login page and protected dashboard shell, admin tests, and minimal documentation. Gallery CRUD and Marzipano integration remain out of scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Requirement | Status | Evidence |
| :--- | :--- | :--- | :--- |
| I. MERN Stack Alignment | Existing stack remains Express, MongoDB/Mongoose, React/Vite, JavaScript ES modules, Vitest | PASS | Feature remains within the approved stack and does not introduce a different framework or database |
| I. MERN Stack Alignment | New dependencies require approval and documentation | CONDITIONAL PASS | `bcrypt` is required for password verification and is not in the current approved runtime list; approval + `docs/tech_stack.md` update are required before installation |
| II. MVC Separation and Application Boundaries | Backend owns auth logic and DB access; frontend owns UI | PASS | Auth logic is placed in backend routes/services/models; frontend only renders login/dashboard UI and checks session state |
| III. Test-First Quality Gate | Backend and frontend interaction behaviors must have tests; failing-first workflow | PASS | Backend login/auth and protected-route tests, plus frontend login/dashboard tests, are required before implementation is accepted |
| IV. Security, Secrets, and Configuration Discipline | No secrets in repo; JWT and cookies handled securely | PASS | Auth uses environment variables, secure cookie options, JWT verification, and no plain-text credential storage |
| V. Responsive, Accessible Immersive Experience | Desktop + mobile support, keyboard access, visible focus | PASS | Dashboard shell and login form are responsive with accessibility checks and keyboard-operable controls |
| Development Workflow & Quality Gates | Spec Kit sequence and quality gates | PASS | The spec is in place and this plan follows the required sequence; lint/test/build verification remains mandatory |
| Dependency governance | `cookie-parser` and `bcrypt` must be declared before auth features ship | PASS WITH REVIEW | `cookie-parser` is already part of the constitution’s approved dependencies; `bcrypt` needs approval before install and use |

No direct constitution violations are identified, but the feature introduces a dependency approval gate for `bcrypt` before implementation can proceed.

## Project Structure

### Documentation (this feature)

```text
specs/017-admin-auth-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── admin-auth-api.md # Phase 1 output (login, logout, session validation endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks command — not created here)
```

### Source Code (repository root)

```text
apps/backend/
├── config/
│   └── env.js                     # Validate JWT and MongoDB configuration
├── controllers/
│   └── adminAuthController.js     # Login, logout, and session verification logic
├── models/
│   └── Admin.js                   # Admin account schema and password verification
├── routes/
│   └── adminAuthRoutes.js         # POST /login, POST /logout, GET /me or /session
├── services/
│   └── adminAuthService.js        # Token issuance and credential verification
├── utils/
│   └── auth.js                   # JWT helpers, secure cookie helpers
├── tests/
│   └── adminAuth.test.js         # Login, invalid credentials, protected routes
├── app.js                       # Register auth routes and middleware
└── index.js                     # Bootstraps server

apps/frontend/
├── src/
│   ├── components/
│   │   ├── AdminLoginForm.jsx     # Login form and validation UI
│   │   ├── AdminLayout.jsx        # Dashboard shell with sidebar and content areas
│   │   ├── AdminSidebar.jsx       # Responsive admin navigation
│   │   └── ProtectedRoute.jsx     # Redirect unauthenticated visitors to login
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state and session checks
│   ├── pages/
│   │   ├── AdminLoginPage.jsx     # Login page screen
│   │   └── AdminDashboardPage.jsx # Dashboard overview and profile screen
│   ├── lib/
│   │   └── adminApi.js            # Auth API helpers
│   └── styles/
│       └── admin.css              # Optional minor admin-only styling if needed
├── tests/
│   ├── AdminLoginPage.test.jsx    # Form validation and redirect behavior
│   └── AuthGuard.test.jsx         # Protected route and unauthenticated redirect
└── vite.config.js                 # Unchanged
```

**Structure Decision**: Web application structure (frontend + backend) with clear MVC responsibilities. Backend modules own authentication logic and MongoDB access; frontend modules own render logic, route protection, and UI state.

## Phase 0: Research Summary

See `research.md`. Key decisions:

- Login and dashboard behavior are treated as a single admin-auth feature with a protected route boundary.
- A dedicated `Admin` model is used for administrator credentials, profile values, and password verification.
- Password verification uses `bcrypt.compare()` against the stored hash, with `bcrypt.hash()` used only during user creation or credential updates.
- JWT issuance uses a short-lived token stored in an HTTP-only cookie for the browser and optionally also exposed through a session response for API usage.
- Authentication checks happen in backend middleware and a frontend route guard so a user without a valid session cannot reach `/admin`.
- The login page is public only when no valid admin session exists; authenticated users are redirected to `/admin`.
- The dashboard shell includes a sidebar, overview, profile section, and future Gallery Manager placeholder without implementing gallery CRUD.
- Responsive design follows the project’s mobile-first Tailwind pattern and uses standard utility classes, no JavaScript viewport detection.
- The admin login and protected-route flows are covered by failing-first Vitest tests before implementation.

## Phase 1: Design & Contracts

See `data-model.md`, `quickstart.md`, and `contracts/admin-auth-api.md`.

- `data-model.md` captures the admin entity, authentication session, and protected route state model.
- `contracts/admin-auth-api.md` defines the login, logout, and auth-check contract so both frontend and backend agree on request and response behavior.
- `quickstart.md` provides a manual validation checklist for login success, invalid credentials, redirect flows, logout, and responsive behavior at mobile and desktop widths.

**Post-design constitution re-check**: The design remains aligned with the project constitution with one required dependency gate: `bcrypt` must be explicitly approved and recorded in the project dependency docs before installation. The backend and frontend implementation still satisfy the stack, MVC, tests, security, and responsive/accessibility rules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New bcrypt dependency | Password verification requires secure hashing and the project does not currently declare `bcrypt` | Using a custom hash implementation or plaintext storage would violate the constitution and create an unacceptable security risk |
| Cookie-based auth setup | HTTP-only JWT cookies are required for secure admin sessions and are already mandated by the constitution | Client-side-only storage would expose tokens to XSS and contradict the project’s security policy |

No additional major complexity beyond the dependency approval gate is required.
