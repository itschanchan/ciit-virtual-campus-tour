# Quickstart Validation: CIIT Virtual Campus Tour Foundation

**Feature**: `001-campus-tour-foundation`
**Date**: 2026-10-26

Use this guide after the foundation is implemented to prove the feature works end to end. It
does not contain implementation code.

## Prerequisites

- Node.js 24.x (minimum 22.12) and npm.
- Git and access to the repository.
- A modern browser with JavaScript enabled.
- MongoDB is optional for viewing tour content; it is required only when validating the backend
  database connection.

## Dependency Approval

Before running setup, confirm the maintainer has approved every package listed in
`plan.md` under the dependency approval gate. Do not install undeclared packages. If a required
package is missing, ask the maintainer and state clearly whether it is essential to run the
application.

## Setup

From the repository root:

```powershell
npm install
npm run setup
Copy-Item apps/backend/.env.example apps/backend/.env
npm run dev
```

On macOS or Linux, replace the copy command with:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Expected result:
- The backend starts on its configured port and logs that it is listening.
- The frontend starts on the Vite development URL.
- `npm run dev` runs both applications with one command.

If MongoDB is not available, the tour must still load; only backend-dependent status may show
as unavailable.

## Automated Checks

```powershell
npm run test
npm run lint
npm run build
```

Expected result:
- All backend and frontend tests pass once the maintainer approves Vitest, Supertest, Testing
  Library, and jsdom.
- ESLint reports no errors.
- The production build completes without unresolved asset paths.

## Scenario 1: Desktop Panorama Exploration

1. Open the frontend URL in a desktop browser.
2. Confirm the first featured location appears without a blank screen.
3. Drag the panorama left, right, up, and down.
4. Open the sidebar and select a different location.
5. Confirm the panorama changes and the selected location is marked current.

Expected result: the view rotates smoothly in every direction, the correct room loads, and the
current location is visibly indicated.

## Scenario 2: Mobile Exploration

1. Open the same URL in a mobile browser or use the browser's mobile viewport with touch
   emulation.
2. Swipe across the panorama.
3. Open and close the sidebar.
4. Open the gallery and close it with the on-screen control.
5. Rotate the device to landscape.

Expected result: touch gestures rotate the panorama instead of scrolling the page, all controls
remain reachable, and no horizontal scrolling is required.

## Scenario 3: Gallery and Narration

1. Select a location that has gallery images.
2. Open the gallery and view every image.
3. Confirm each image has a description.
4. Start the narration.
5. Pause and resume it.
6. Open the transcript and confirm it matches the narration.
7. Block autoplay in the browser settings and attempt playback again.

Expected result: all images render with descriptions, playback controls work, the transcript is
available, and blocked playback shows a friendly message that points to the transcript.

## Scenario 4: Content Migration

1. Confirm no `app-files` folder remains at the repository root or inside the applications.
2. Confirm no source file references the old prototype location.
3. Browse every featured location and open every gallery image.
4. Open the browser network panel and confirm there are no failed requests for panorama tiles,
   gallery images, or narration audio.

Expected result: all supplied prototype content is available from the frontend, and there are no
orphaned references or missing assets.

## Scenario 5: Backend Outage Resilience

1. Load the tour and confirm it is interactive.
2. Stop the backend process while leaving the frontend running.
3. Reload the tour and navigate between locations.

Expected result: the tour remains usable, and any backend status indicator reports an
unavailable state without blocking content.

## Scenario 6: Keyboard and Accessibility

1. Navigate the entire tour using only the keyboard.
2. Confirm focus is visible on the sidebar, gallery, narration, and close controls.
3. Open and close the gallery with Enter, Space, and Escape.
4. Enable the operating system's reduced-motion setting and reload.
5. Inspect each interactive control for an accessible name.

Expected result: every control is reachable and operable, focus is visible, motion is reduced,
and no icon-only control is unnamed.

## Scenario 7: Failure Handling

1. Temporarily rename one panorama asset in a local copy.
2. Open the affected location.
3. Restore the asset and retry.

Expected result: the application shows a visitor-friendly message, keeps navigation usable, and
recovers when the asset is restored.

## Scenario 8: Contribution Workflow

1. Read `CONTRIBUTING.md`.
2. Create a short-lived branch from `main`.
3. Make a small documentation-only change.
4. Open a pull request.
5. Confirm the required checks and review expectations are documented.

Expected result: the change is reviewed through a pull request, `main` remains runnable, and no
direct commits to `main` are required.

## Scenario 9: Performance Sanity Check

1. Open browser developer tools and apply a typical mobile network throttle.
2. Reload the tour.
3. Confirm the first panorama becomes visible within 8 seconds.
4. Confirm gallery images below the first viewport load only when scrolled into view.

Expected result: the initial view is usable on a constrained connection, and off-screen images
are not loaded eagerly.

## Validation Record

| Check | Result | Notes |
| --- | --- | --- |
| Dependency approval confirmed | Partial | Runtime dependencies and Marzipano approved on 2026-10-26. Backend test tooling and `cookie-parser` deferred. |
| Automated tests pass | Blocked | Vitest, Supertest, Testing Library, and jsdom are not approved or installed. |
| Lint passes | Pass | `npm run lint` completed without errors. |
| Production build succeeds | Pass | `npm run build` completed successfully. |
| Content verification | Pass | `npm run verify:content` passed for the placeholder catalog and 9 public files. |
| Ignore policy | Pass | `npm run verify:ignore` passed. |
| Desktop panorama | Not run | Requires a browser session. |
| Mobile panorama | Not run | Requires a browser or touch emulation session. |
| Gallery and narration | Not run | Requires a browser session. |
| Content migration complete | Not applicable | No `app-files` folder is present; the placeholder catalog remains. |
| Backend outage resilience | Not run | Requires running both applications and stopping the backend. |
| Keyboard and accessibility | Not run | Requires a browser and assistive technology review. |
| Failure handling | Not run | Requires a browser session. |
| Contribution workflow | Pass | `CONTRIBUTING.md` and the pull request template are present. |
| Performance sanity | Not run | Requires browser network throttling. |
