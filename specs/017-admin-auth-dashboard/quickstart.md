# QuickStart Validation Guide

This guide shows how to manually verify the admin login and protected dashboard feature.

## Prerequisites
- Node.js LTS installed
- MongoDB running locally or reachable via environment variables
- Backend and frontend dependencies installed
- Backend environment variables configured for MongoDB and JWT secrets
- `npm run dev` started from the repository root

## Steps

1. **Open the admin login page**
   - Visit the login route for the admin experience.
   - Confirm the page shows username/email and password inputs, plus a submit action.

2. **Test valid login**
   - Enter valid administrator credentials.
   - Submit the form.
   - Confirm the server verifies the password against MongoDB and issues a JWT cookie.
   - Confirm the browser redirects to `/admin`.

3. **Test invalid login**
   - Enter an incorrect password or unknown admin record.
   - Confirm the login fails with a readable error and the user remains on the login page.
   - Verify no sensitive account details are exposed in the response.

4. **Verify protected route enforcement**
   - Clear cookies or open the dashboard in a new anonymous session.
   - Navigate to `/admin` directly.
   - Confirm the request is redirected to the login page.

5. **Verify logout**
   - Sign in as an admin and open the dashboard.
   - Trigger logout.
   - Confirm the JWT cookie is cleared and the browser returns to the login page.

6. **Verify same-tab refresh and new-tab login**
   - Sign in and refresh the admin dashboard in the same tab.
   - Confirm the dashboard remains open without asking for credentials.
   - Open `/admin` in a new tab.
   - Confirm the new tab redirects to the login page and the login form remains accessible.

7. **Check dashboard content**
   - Confirm the dashboard includes a responsive sidebar, overview content, profile section, and logout action.
   - Confirm the Gallery Manager placeholder appears in navigation without implementing full gallery operations.

8. **Check responsiveness**
   - View the login and dashboard on a mobile viewport and a desktop viewport.
   - Confirm there is no overflow, clipping, or broken layout.
   - Verify that the sidebar and cards remain readable and usable.

9. **Check keyboard accessibility**
   - Tab through the login form and dashboard controls.
   - Confirm all interactive controls are keyboard reachable and show visible focus states.
   - Confirm logout and route navigation can be used without a mouse.

## Expected Outcomes
- Valid admin logins succeed and redirect to `/admin`.
- Invalid credentials are rejected cleanly.
- Protected admin routes redirect anonymous access to the login screen.
- Logout clears the session state.
- The dashboard remains responsive and usable across desktop and mobile widths.
- The implementation stays within the approved scope for login and dashboard access only.

If all checks pass, the feature meets the acceptance criteria and the constitutional quality gates for auth and responsive dashboard behavior.
