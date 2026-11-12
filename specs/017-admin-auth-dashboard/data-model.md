# Data Model

## Admin
- **id**: unique MongoDB ObjectId for the administrator account.
- **username**: unique login identifier used for admin sign-in.
- **email**: optional unique email address used for authentication and contact.
- **passwordHash**: bcrypt-hashed password stored securely; never stored in plaintext.
- **fullName**: administrator display name used in the dashboard profile area.
- **role**: fixed admin role value (e.g., `admin`), used to authorize dashboard access.
- **isActive**: boolean indicating whether the account is currently allowed to authenticate.
- **createdAt**: creation timestamp.
- **updatedAt**: last update timestamp.

### Validation Rules
- Username or email must be present for login.
- Passwords must be hashed before persistence.
- Only active admin accounts may authenticate.
- The system must reject logins when the stored account is inactive or missing.

## AuthSession
- **token**: JWT issued after a successful login.
- **expiresAt**: time at which the cookie/session expires.
- **role**: derived admin role used in authorization checks.
- **issuedAt**: timestamp when the token was issued.

### Validation Rules
- The JWT must be validated on every protected admin route.
- Expired or malformed tokens must be rejected.
- The session must be cleared when logout is triggered.

## ProtectedRouteState
- **isAuthenticated**: whether a valid admin session exists.
- **isLoading**: whether session verification is still in progress.
- **user**: the authenticated admin profile data exposed to the dashboard UI.
- **redirectToLogin**: boolean used for unauthorized route redirects.

### Validation Rules
- Unauthenticated users are redirected to the admin login page.
- Authenticated users may access the `/admin` dashboard shell.
- Auth state is rechecked when navigating between protected pages or reloading the route.

## DashboardViewModel
- **overview**: summary data for the dashboard landing area.
- **profile**: current administrator details shown in the profile section.
- **navigationItems**: list of sidebar entries, including the Gallery Manager placeholder.
- **logoutAction**: client action that clears the session and redirects to login.

### Validation Rules
- The dashboard only renders after successful auth state verification.
- The dashboard shell remains responsive across mobile and desktop layouts.
- Placeholder navigation items must not provide route functionality outside the current feature scope.
