# Quickstart: Validate the /admin Route

## Purpose

Runnable validation scenarios proving the `/admin` route renders the admin login page, keeps the public tour at the main URL, and preserves existing authentication behavior. No implementation code is included here.

## Prerequisites

- Frontend dev server running (`npm run dev` in the workspace root, or `apps/frontend` independently).
- `vercel.json` at the repo root contains the scoped `/admin` rewrite (destination `index.html`).
- Existing `AuthContext`, `AdminLoginPage`, `AdminDashboardPage`, and `App.jsx` client router are present.

## Validation Scenarios

### Scenario 1: /admin renders the admin login page

1. Open the main campus tour URL with `/admin` appended (e.g. `https://<site>/admin`).
2. Confirm the page loads without a full-page redirect.
3. Confirm the "CIIT Admin" sign-in form (`AdminLoginPage`) is visible, not the campus tour.

**Expected outcome**: The admin login page renders at `/admin`.

### Scenario 2: Main URL (no /admin) still renders the campus tour

1. Open the main campus tour URL (e.g. `https://<site>/`).
2. Confirm the campus tour experience loads, not the admin login page.

**Expected outcome**: The public tour remains accessible at the main URL.

### Scenario 3: Direct access to /admin/login works

1. Open `https://<site>/admin/login`.
2. Confirm the admin login page renders.

**Expected outcome**: `/admin/login` continues to work as before.

### Scenario 4: /admin/dashboard requires authentication

1. Open `https://<site>/admin/dashboard` without logging in.
2. Confirm you are redirected to `/admin/login`.
3. After logging in with valid credentials, confirm navigation to `/admin` / the admin dashboard.

**Expected outcome**: Unauthenticated access to `/admin/dashboard` redirects to login; successful login reaches the dashboard.

### Scenario 5: Refresh on /admin preserves the login page

1. On `https://<site>/admin`, refresh the browser.
2. Confirm the admin login page still renders (client-side routing preserved).

**Expected outcome**: Refresh on `/admin` does not lose the login page.

### Scenario 6: No other paths are rewritten

1. Open any non-`/admin` path (e.g. a panorama or room route).
2. Confirm it is not rewritten to the admin login page.

**Expected outcome**: Only `/admin` and `/admin/*` are affected.

## Verification Command

No dedicated test command is added by this feature. Run the existing frontend test suite (`npm --prefix apps/frontend run test`) and confirm no new failures, plus lint (`npm run lint`) confirms no errors.
