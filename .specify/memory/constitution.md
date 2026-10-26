<!--
Sync Impact Report
Version change: (unversioned template) -> 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles I-V
  - Technology & Dependency Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: None
Follow-up TODOs:
  - The backend MUST declare cookie-parser before cookie-based authentication ships.
  - The root workspace MUST declare concurrently before the documented single-command
    `npm run dev` workflow is relied upon.
  - Marzipano panorama assets and scripts are not yet ported into the React frontend.
    That implementation work is deferred to the Spec Kit feature workflow.
-->

# CIIT Virtual Campus Tour Constitution

## Core Principles

### I. MERN Stack Alignment (NON-NEGOTIABLE)

The application MUST be built on the MERN stack: MongoDB with Mongoose for persistence,
Express.js for the HTTP API, React with Vite for the frontend, and JavaScript using ES
Modules for both frontend and backend. Vitest MUST be the testing framework.

- Backend packages MUST set `"type": "module"`; CommonJS-only patterns MUST NOT be introduced.
- Alternative databases, server frameworks, frontend frameworks, or test runners MUST NOT be
  adopted without a constitution amendment.
- Python is permitted only for future offline data analysis and MUST NOT appear on a production
  request path unless this constitution is amended.

**Rationale**: A single, explicit stack keeps the codebase teachable for the CIIT Glitch Devs,
reduces integration risk, and matches the project's documented technical foundation.

### II. MVC Separation and Application Boundaries

The repository MUST follow MVC with a strict split between `apps/backend` and `apps/frontend`.

- The backend owns business logic, validation, authentication, and database access. It MUST
  organize code into `config/`, `controllers/`, `models/`, `routes/`, `services/`, `tests/`,
  and `utils/`, with `index.js` as the entry point.
- Controllers MUST handle request parsing and HTTP responses; business rules MUST live in
  services; Mongoose schemas MUST live in models; routes MUST only wire endpoints to controllers.
- The frontend owns all UI, panorama viewing, navigation, narration controls, galleries, and
  static assets. It MUST consume backend APIs and MUST NOT access MongoDB directly.
- The frontend MUST organize code into `public/`, `src/`, `tests/`, `context/`, `lib/`, `api/`,
  and `assets/`.
- Marzipano source folders MUST be placed under the frontend and converted from `.js` to
  React-compatible `.jsx` before use.

**Rationale**: Clear boundaries prevent duplicated logic, keep data access auditable, and let
frontend and backend evolve independently.

### III. Test-First Quality Gate (NON-NEGOTIABLE)

Tests MUST be written and observed failing before the corresponding implementation is accepted.

- Backend API endpoints, services, and controllers MUST have Vitest coverage; HTTP behavior MUST
  be exercised with Supertest.
- Frontend components and interaction logic MUST have Vitest tests for behavior that affects
  navigation, narration, galleries, or panorama controls.
- A change MUST NOT be merged when tests fail or when frontend ESLint reports errors.
- Bug fixes MUST include a regression test that fails without the fix.

**Rationale**: The virtual tour is the product's primary interface; regressions in navigation or
panorama behavior are immediately visible to campus visitors and are costly to discover late.

### IV. Security, Secrets, and Configuration Discipline

Secrets and environment-specific configuration MUST never enter version control.

- `.env` files and `.rest` client files MUST remain in `apps/backend` and MUST be excluded by
  `.gitignore`.
- Credentials, JWT signing keys, database URIs, and API keys MUST be supplied through
  environment variables loaded with `dotenv`; they MUST NOT be hardcoded, logged, or committed.
- Authentication MUST use JSON Web Tokens; cookies MUST be handled with `cookie-parser`; CORS
  MUST use an explicit allowlist rather than a permissive wildcard in production.
- Configuration MUST be validated at startup so the server fails fast when required variables
  are missing.
- Passwords and other sensitive values MUST never be stored or transmitted in plaintext.

**Rationale**: The application handles accounts and campus content; leaked configuration or weak
transport rules would compromise both visitors and administrative data.

### V. Responsive, Accessible Immersive Experience

Every user-facing feature MUST work on both desktop and mobile devices.

- The core experience MUST provide a draggable 360-degree panoramic view, a sidebar for quick
  navigation, narrated descriptions per location, and a gallery for each room.
- Panorama and gallery assets MUST be lazy-loaded or otherwise deferred so the initial view
  remains interactive on constrained mobile connections.
- Narration MUST provide a text alternative, and interactive controls MUST be keyboard operable
  with visible focus states.
- Images and panoramas MUST include meaningful alternative text or descriptions.
- Layout and touch controls MUST be verified at representative desktop and mobile viewports
  before a feature is considered complete.

**Rationale**: The tour is the public face of the Glitch Tower campus and must remain usable for
prospective students, guests, and CIITzens on any device.

## Technology & Dependency Constraints

The approved stack is:

| Domain   | Technology            |
| :------- | :-------------------- |
| Database | MongoDB + Mongoose    |
| Backend  | Express.js            |
| Frontend | React + Vite          |
| Language | JavaScript (ESModule) |
| Testing  | Vitest                |

Approved runtime dependencies are `cookie-parser`, `cors`, `dotenv`, `express`,
`jsonwebtoken`, and `mongoose` for the backend, and `react` plus `react-dom` for the frontend.
Approved development dependencies are `nodemon`, `supertest`, and `vitest` for the backend,
`eslint`, `vite`, and their required plugins for the frontend, and `concurrently` at the
workspace root.

- Before installing any package, contributors MUST inspect the relevant `package.json` and MUST
  obtain maintainer approval for dependencies not listed above.
- New runtime dependencies MUST be justified in the change description, recorded in
  `docs/tech_stack.md`, and reviewed for maintenance and security risk.
- `npm audit fix` MUST be run when dependency advisories affect the project.
- The backend MUST declare `cookie-parser` before cookie-based authentication is implemented,
  and the root workspace MUST declare `concurrently` before the documented single-command
  development workflow is used.
- Package installation MUST use npm and the Node.js LTS release selected through `nvm`.

## Development Workflow & Quality Gates

The repository layout is fixed at `root/apps/backend` and `root/apps/frontend`, with `backend`
containing the server entry point, environment files, and API test configuration, and
`frontend` containing the Vite application, tests, and static assets.

- Features MUST flow through the Spec Kit sequence: specification, plan, tasks, then
  implementation.
- The root development command MUST start frontend and backend together once `concurrently` is
  declared; each application MUST also remain independently runnable.
- Every pull request MUST verify compliance with this constitution, pass all tests, and pass
  frontend linting.
- API contract changes MUST include updated tests and updated request examples.
- Changes to the stack, folder boundaries, or approved dependencies MUST update
  `docs/tech_stack.md` in the same change.
- Code review MUST reject hardcoded secrets, direct database access from the frontend, and
  untested behavior in navigation, narration, galleries, or panorama controls.

## Governance

This constitution supersedes conflicting local practices and ad hoc conventions.

- Amendments MUST be proposed in writing with the rationale, affected principles, and migration
  impact, and MUST be approved by the project maintainers before taking effect.
- Versioning follows semantic versioning: MAJOR for removing or redefining governance or
  principles, MINOR for adding principles or materially expanding guidance, and PATCH for
  clarifications and non-semantic refinements.
- Every amendment MUST update the Sync Impact Report, the version line, and the last-amended
  date. MAJOR amendments MUST include a migration plan for existing code.
- All pull requests and reviews MUST verify compliance. Any complexity or deviation MUST be
  explicitly justified in the change description.
- Runtime development guidance is maintained in `AGENTS.md` and `docs/tech_stack.md`; when they
  conflict with this constitution, this constitution prevails.
- The constitution MUST be reviewed whenever the stack changes or at least once per project
  phase.

**Version**: 1.0.0 | **Ratified**: 2026-10-26 | **Last Amended**: 2026-10-26
