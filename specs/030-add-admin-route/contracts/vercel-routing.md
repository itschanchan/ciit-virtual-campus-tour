# Contract: Vercel Routing for /admin

## Purpose

Defines the deployment-level URL rewrite contract that exposes the admin login page at `/admin` without breaking the public campus tour.

## Contract

| Aspect | Specification |
|--------|---------------|
| Trigger path | `/admin` and `/admin/*` (scoped; not a catch-all) |
| Destination | SPA entry point `index.html` |
| Owner | `vercel.json` (deployment configuration) |
| Enforced at | Edge / deployment layer before the client app loads |
| Client responsibility | `App.jsx` client router renders `AdminLoginPage` for `/admin`/`/admin/login` and `AdminDashboardPage` (protected) for `/admin/*` |

## Behavior

- A request to `{mainUrl}/admin` returns `index.html`; the client router mounts `AdminLoginPage`.
- A request to `{mainUrl}/admin/login` returns `index.html`; the client router mounts `AdminLoginPage`.
- A request to `{mainUrl}/admin/dashboard` (unauthenticated) returns `index.html`; `ProtectedRoute` redirects to `/admin/login`.
- Any path not under `/admin` is NOT rewritten by this rule (the campus tour and other routes are unaffected).

## Out of scope

- Backend API routes (none added; backend untouched).
- Persistent storage (none; client-side routing only).
- Authentication implementation (already exists in `AuthContext`).
