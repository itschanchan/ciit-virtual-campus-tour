# Implementation Plan: JWT Cookie Access

**Branch**: `001-jwt-cookie-auth` | **Date**: 2026-11-04 | **Spec**: `specs/001-jwt-cookie-auth/spec.md`

**Input**: Feature specification from `specs/001-jwt-cookie-auth/spec.md`

## Summary

Enable registered users to authenticate with an email address, receive a time-limited JSON Web Token stored in a secure browser cookie (HttpOnly, Secure, SameSite=Strict), persist authentication across page reloads, log out to clear the cookie, and protect campus tour administration endpoints so unauthenticated or expired requests are denied. Login attempts are rate-limited by IP address to prevent brute-force attacks.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js LTS

**Primary Dependencies**: Express.js (HTTP API), jsonwebtoken (JWT signing/verification), cookie-parser (cookie parsing), mongoose (MongoDB ODM), cors (CORS with explicit allowlist), dotenv (environment variables), vitest (testing), supertest (HTTP integration tests)

**Storage**: MongoDB (existing user account data used for credential validation)

**Testing**: Vitest with Supertest for backend API endpoint, service, and controller coverage

**Target Platform**: Linux server, backend port 5000, frontend origin http://localhost:5173

**Project Type**: Web application (MERN stack - backend + frontend)

**Performance Goals**: Login completes within 1 minute; at least 95% of valid login attempts succeed

**Constraints**: Backend must declare `cookie-parser` before cookie-based authentication; JWT signing key supplied via environment variable (never hardcoded); CORS uses explicit allowlist not wildcard; backend organized into config/, controllers/, models/, routes/, services/, tests/, utils/ with index.js entry point; `"type": "module"` set

**Scale/Scope**: Administrative campus tour endpoints only; public campus tour viewing remains unauthenticated; session duration of 24 hours

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. MERN Stack Alignment | Pass | Express.js + MongoDB/Mongoose + React/Vite + ES Modules; `"type": "module"` |
| II. MVC Separation | Pass | Backend owns auth logic, validation, DB access; organized into config/controllers/models/routes/services/tests/utils |
| III. Test-First Quality Gate | Pass | Vitest + Supertest for backend endpoints, services, controllers |
| IV. Security, Secrets, Config | Pass | JWT signing key via env var; `.env` excluded from git; `cookie-parser` declared; CORS explicit allowlist; no plaintext passwords |
| V. Responsive, Accessible Experience | N/A | Backend-only feature; no direct UI impact |

**Gate Result**: PASS — no violations requiring justification. Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-jwt-cookie-auth/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/backend/
├── config/
│   ├── db.js            # MongoDB connection
│   └── env.js           # Environment variable loading/validation
├── controllers/
│   ├── healthController.js
│   └── authController.js   # NEW: login, logout, verify endpoints
├── models/
│   └── User.js          # NEW: Mongoose schema for user authentication
├── routes/
│   ├── healthRoutes.js
│   └── authRoutes.js    # NEW: POST /auth/login, POST /auth/logout, GET /auth/verify
├── services/
│   ├── healthService.js
│   └── authService.js   # NEW: JWT sign/verify, cookie set/clear, rate limiting
├── utils/
│   ├── asyncHandler.js
│   ├── errors.js
│   └── authMiddleware.js # NEW: JWT verification middleware from cookie
├── app.js               # Updated: mount auth routes, cookie-parser middleware
├── index.js             # Unchanged
├── .env                 # NEW vars: JWT_SECRET, JWT_EXPIRES_IN, COOKIE_*
├── .env.example         # Updated: add JWT/cookie env vars
├── index.js
├── package.json         # Updated: add cookie-parser dependency
├── vitest.config.js
└── tests/
    ├── authController.test.js    # NEW
    ├── authService.test.js       # NEW
    └── authMiddleware.test.js    # NEW

apps/frontend/
├── src/
│   ├── api/             # NEW: auth API client (login, logout, verify)
│   ├── context/         # NEW: auth context provider
│   └── ...
```

**Structure Decision**: Option 2 — Web application (frontend + backend detected). Source code lives under `apps/backend/` per constitution MVC split; frontend remains unchanged for this phase.

## Complexity Tracking

> Not required — Constitution Check passed with no violations.
