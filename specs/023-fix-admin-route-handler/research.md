# Research: Fix Admin Route Handler Error

## Problem

`AdminRoutes.js` (mounted at `/api/admins`) registers two routes at lines 9–10:

```js
router.post('/login', adminController.login)
router.post('/logout', adminController.logout)
```

`AdminController.js` exports `getMyProfile`, `getAdminDetails`, `createAdmin`, `updateAdmin`, `deleteAdmin`, and `changePassword` — but **no `login` or `logout` methods**. Express receives `undefined` as the route handler and throws `TypeError: argument handler must be a function` during route registration at server startup. As a result, the backend cannot start and no admin endpoint is available.

## Existing Auth Infrastructure (already works)

`AuthRoutes.js` (mounted at `/api/admin`) already provides working login/logout:

| Route | Method | Controller | Status |
|---|---|---|---|
| `POST /api/admin/register` | `AuthController.register` | exists | working |
| `POST /api/admin/login` | `AuthController.login` | exists | working |
| `GET /api/admin/session` | `AuthController.session` | exists | working |
| `POST /api/admin/refresh` | `AuthController.refresh` | exists | working |
| `POST /api/admin/logout` | `AuthController.logout` | exists | working |

`AuthController.login` validates credentials via `authService.login`, returns an access token, and sets an `httpOnly` refresh token cookie. `AuthController.logout` clears the refresh token cookie. These follow the project's JWT + cookie-parser authentication pattern (constitution Principle IV).

## Decision: Remove duplicate routes vs. add controller methods

Two options were evaluated:

**Option A — Add `login` and `logout` to `AdminController.js`**
- Would duplicate existing `AuthController.login`/`AuthController.logout` logic.
- Would place auth concerns inside the admin CRUD controller, blurring MVC boundaries (constitution Principle II: controllers handle request parsing/HTTP responses; business rules live in services; auth already has its own service/controller).
- Requires new service methods or reuse of `AuthService`.

**Option B — Remove the broken `/login` and `/logout` routes from `AdminRoutes.js`** (selected)
- Eliminates the `undefined` handler → TypeError resolved at startup.
- No duplication: login/logout already exist in `AuthRoutes.js`/`AuthController.js` at `/api/admin/login` and `/api/admin/logout`.
- Keeps `AdminRoutes.js` as a routing-only layer for admin CRUD (`GET /me`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/activate`), consistent with MVC separation.
- Minimal change: delete two lines; no new files, no new dependencies.

## Constitution Alignment

- **Principle I (MERN Stack)**: No new stack, framework, or database. Uses existing Express.js backend. — PASS
- **Principle II (MVC Separation)**: AdminRoutes remains routing-only; auth stays in AuthRoutes/AuthController. — PASS
- **Principle III (Test-First)**: Regression test added to confirm routes register without TypeError and admin endpoints respond. — PASS
- **Principle IV (Security)**: No secrets introduced; JWT + cookie-parser unchanged; CORS allowlist unchanged. — PASS
- **Principle V (Responsive)**: Backend-only fix; no UI impact. — PASS

## Alternatives Considered

- Keeping the routes and adding stub `login`/`logout` methods that return 501: rejected because it leaves non-functional endpoints and contradicts the existing working auth in AuthRoutes.
- Moving auth entirely out of AuthRoutes into AdminRoutes: rejected because it duplicates working code and contradicts the established route organization.

## Conclusion

Remove `router.post('/login', adminController.login)` and `router.post('/logout', adminController.logout)` from `AdminRoutes.js`. Working login/logout already exist in `AuthRoutes.js`. Add a regression test verifying backend startup and admin route responses.
