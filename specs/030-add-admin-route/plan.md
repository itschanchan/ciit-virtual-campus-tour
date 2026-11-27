# Implementation Plan: Add Admin Route

**Branch**: `030-add-admin-route` | **Date**: 2026-11-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/030-add-admin-route/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command from `.specify/templates/plan-template.md`.

## Summary

Add a `/admin` route that renders the existing `AdminLoginPage.jsx` when a visitor appends `/admin` to the main campus tour URL, while keeping the public tour accessible at the main URL. The fix is scoped to `vercel.json` (rewrite `/admin` and `/admin/*` to the SPA entry `index.html`) so the existing client-side router in `App.jsx` renders the login page; no backend changes and no new dependencies.

## Technical Context

**Language/Version**: JavaScript (ES Modules, ES2022); React 19 + Vite; Node.js 24 LTS

**Primary Dependencies**: React, react-dom (existing); `vercel.json` deployment config only; no new packages

**Storage**: N/A — no persistent storage; client-side routing only; existing AuthContext login state remains in memory/localStorage per current auth flow

**Testing**: Vitest for frontend behavior; existing `AuthContext` and `App` routing coverage extended for `/admin`; backend tests untouched

**Target Platform**: Modern evergreen browsers on desktop, tablet, and mobile viewports

**Project Type**: Web application (`apps/frontend` + `apps/backend`); frontend-only feature plus `vercel.json` deployment config

**Performance Goals**: `/admin` renders the login page without a full-page reload; client navigation preserved on refresh; zero rewrite of non-`/admin` paths

**Constraints**: `vercel.json` rewrite must be scoped to `/admin` and `/admin/*` only (never `"/(.*)"` catch-all); destination must be the SPA entry (`index.html`), not a raw `.jsx` source file; KISA style (max indent 3, blocks 25–30 active lines); no backend route changes; admin area stays out of scope for the public tour

**Scale/Scope**: One route prefix (`/admin`) plus the existing `/admin/login` and `/admin/dashboard` client routes; single `vercel.json` rewrite rule

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Evidence |
| :--- | :--- | :--- |
| I. MERN Stack Alignment (NON-NEGOTIABLE) | PASS | React + Vite + JavaScript ES Modules + Vitest; no new dependencies and no backend framework changes |
| II. MVC Separation and Application Boundaries | PASS | All routing/UI work stays in `apps/frontend` (`App.jsx`, `AdminLoginPage.jsx`) plus `vercel.json`; backend is untouched; frontend owns UI |
| III. Test-First Quality Gate (NON-NEGOTIABLE) | PASS | New Vitest behavior tests added for `/admin` routing before implementation; no new test failures introduced |
| IV. Security, Secrets, and Configuration Discipline | PASS | No secrets or credentials added; `/admin/dashboard` remains guarded by existing `ProtectedRoute` + `AuthContext`; unauthenticated visitors redirect to login |
| V. Responsive, Accessible Immersive Experience | PASS | Existing `AdminLoginPage` is already responsive and accessible; the `/admin` route does not alter the public tour UX |

**Baseline note**: No pre-existing failures are affected by this feature. The plan must not introduce new frontend lint errors or test failures.

**Post-design re-check**: PASS. Phase 1 introduces no new principles, projects, dependencies, or backend surface. See `research.md` for resolved decisions.

## Project Structure

### Documentation (this feature)

```text
specs/030-add-admin-route/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── vercel-routing.md
├── checklists/
│   └── requirements.md  # Created during /speckit.specify
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created here)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── App.jsx            # Client router: /admin/login -> AdminLoginPage, /admin/* -> dashboard (existing)
│   ├── pages/
│   │   ├── AdminLoginPage.jsx  # Admin sign-in (existing)
│   │   └── AdminDashboardPage.jsx  # Admin dashboard (existing)
│   └── context/
│       └── AuthContext.jsx   # login / isAuthenticated (existing)
vercel.json              # Deployment rewrite: scope /admin and /admin/* to SPA entry index.html
```

**Structure Decision**: Web application structure (`apps/frontend` + `apps/backend`). This feature touches only `apps/frontend/src/App.jsx` (no change needed — routing already exists), `apps/frontend/src/pages/AdminLoginPage.jsx` (no change needed), and the root `vercel.json`. Documentation artifacts live under `specs/030-add-admin-route/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations; this section is intentionally empty.
