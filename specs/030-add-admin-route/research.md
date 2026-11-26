# Research: Add Admin Route

## Decisions

### Decision: Scope the vercel.json rewrite to /admin and /admin/*, destination = SPA entry index.html

**Rationale**: The current `vercel.json` uses a catch-all `"/(.*)"` rewrite that points every URL at a raw `AdminLoginPage.jsx` source file. That (a) rewrites the entire campus tour to the login page, breaking the public experience, and (b) serves a `.jsx` file browsers cannot execute. Scoping the rewrite to `/admin` and `/admin/*` with destination `index.html` lets the existing client-side router in `App.jsx` render `AdminLoginPage` for `/admin` and `/admin/login`, and `AdminDashboardPage` (guarded by `ProtectedRoute`) for `/admin/dashboard`. This matches the constitution's MVC split (frontend owns UI, backend untouched) and requires no new dependencies or backend routes.

**Alternatives considered**:
- Backend route for `/admin` server-rendering the login page: rejected — adds backend surface and a new dependency path for a frontend-owned UI concern.
- Catch-all `"/(.*)"` with destination `index.html`: rejected — would still rewrite every non-asset path to the SPA, which is too broad and could interfere with other routes; scoping to `/admin` is precise and safe.

### Decision: No changes to App.jsx, AdminLoginPage.jsx, or AdminDashboardPage.jsx

**Rationale**: `App.jsx` already maps `/admin/login` to `AdminLoginPage` and `/admin/*` (protected) to `AdminDashboardPage`. `AdminLoginPage` already calls `onNavigate('/admin')` after login. The only missing piece is the deployment-level rewrite that maps an incoming `/admin` URL to the SPA entry so client routing can take over.

## Open items

None. All clarifications from `/speckit.clarify` are resolved (see `spec.md` `## Clarifications`).
