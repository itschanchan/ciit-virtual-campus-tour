# Data Model: Add Admin Route

This feature introduces no persistent data entities. It is a client-side routing and deployment-configuration change. The following lightweight model describes the routing rules and guard state that the feature relies on.

## Entities

### RouteRule
Represents a single URL-path mapping handled by the deployment layer and/or the client router.

| Field | Description |
|-------|-------------|
| path | The incoming URL path prefix, e.g. `/admin` or `/admin/*` |
| destination | The SPA entry point served, e.g. `index.html` |
| scope | Whether the rule applies to the exact path only or to sub-paths too |

### RedirectRule
Represents the client-side navigation performed after authentication.

| Field | Description |
|-------|-------------|
| from | The page triggering navigation, e.g. `AdminLoginPage` |
| to | The destination path after successful login, e.g. `/admin` |
| condition | Successful admin credential validation via `AuthContext.login` |

### AuthGuardState
Represents the authentication protection applied to `/admin/*` routes.

| Field | Description |
|-------|-------------|
| protectedPaths | Paths requiring authentication, e.g. `/admin/dashboard` |
| redirectTarget | Where unauthenticated visitors are sent, e.g. `/admin/login` |
| enforcedBy | The `ProtectedRoute` component wrapping `AdminDashboardPage` |

## Validation Rules

- A `RouteRule` for `/admin` must NOT use a catch-all pattern such as `"/(.*)"`.
- A `RouteRule` destination must be the SPA entry (`index.html`), never a raw `.jsx` source file.
- An unauthenticated visitor on any `/admin` sub-route must be redirected to `/admin/login` before reaching `AdminDashboardPage`.
- A successful `AuthContext.login` from `AdminLoginPage` must navigate to `/admin`.

## State Transitions

- Unauthenticated visitor reaches `/admin` → `AuthGuardState` shows `AdminLoginPage` (no redirect; login page is public).
- Visitor submits valid credentials on `AdminLoginPage` → `AuthContext.login` succeeds → client navigates to `/admin` → `AdminDashboardPage` renders.
- Visitor submits invalid credentials → error shown, remains on `AdminLoginPage`.
- Unauthenticated visitor reaches `/admin/dashboard` → `ProtectedRoute` redirects to `/admin/login`.

## Relationships

- `RouteRule` (`/admin` → `index.html`) is the deployment entry point; `App.jsx` client router then resolves the exact page.
- `AuthGuardState` wraps `AdminDashboardPage` via `ProtectedRoute`; `AuthContext.login` is the gatekeeper for the `/admin` → `/admin/dashboard` transition.
- No entities are persisted to MongoDB or any backend store for this feature.
