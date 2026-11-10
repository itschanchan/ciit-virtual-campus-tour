# Quickstart Validation: Panorama Empty State Message

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **UI Contract**: [contracts/ui-contract.md](./contracts/ui-contract.md)

Use this guide after implementation to prove the message moved from the floor list to the viewer. All commands run from the repository root.

## Prerequisites

- Node.js 24.x (minimum 22.12) and npm.
- Dependencies installed with `npm install` and `npm run setup`.
- A checkout containing the feature changes.
- No `.env` file is required for these checks.
- Vitest tooling is optional for the automated scenario; it remains deferred by the maintainer.

## Scenario 1: Viewer Shows the Message With No Selected Location

**Setup**: Start the app with content ready but no location selected (or use a test harness that renders the viewer with no location).

**Expected outcome**:

- The viewer displays "No panorama available yet." in a centered panel.
- The panel is exposed as an alert.
- The floor list is not required to be open for the message to appear.

## Scenario 2: Viewer Shows the Message for a Location Without a Panorama

**Setup**: Select or render a location whose panorama data is absent.

**Expected outcome**:

- The viewer displays "No panorama available yet."
- No panorama scene is created.
- The previous panorama, if any, is removed.

## Scenario 3: Floor List Does Not Show the Message

**Command**:

```bash
npm run dev
```

Then open the app and inspect every floor entry.

**Expected outcome**:

- No floor entry contains "No panorama available yet."
- Floors without a location show only the floor label and remain disabled.
- The message never appears in the sidebar, whether open or collapsed.

## Scenario 4: Existing Sidebar Feedback Is Preserved

**Setup**: Use a locked floor and a location that exists without a panorama.

**Expected outcome**:

- The locked floor acknowledges the activation immediately and shows its coming-soon popover about 1.5 seconds later.
- The location without a panorama still shows the location-unavailable feedback.
- Neither status is replaced by the new message.

## Scenario 5: Available Panorama Is Unaffected

**Setup**: Select a location with a valid panorama.

**Expected outcome**:

- The panorama loads and can be dragged.
- The message is absent.
- Gallery and narration controls remain available.

## Scenario 6: Responsive and Collapsed-Sidebar Check

**Setup**: Repeat Scenario 1 at 1440x900, 1024x768, 700x800, 560x800, 375x667, 320x568, and a landscape phone viewport. Collapse the floor list at least once.

**Expected outcome**:

- The message remains centered, readable, and announced.
- No horizontal scrolling is introduced.
- The floor-list toggle and skip link remain usable.

## Scenario 7: Lint and Build

**Commands**:

```bash
npm run lint
npm run build
```

**Expected outcome**:

- ESLint exits with code 0.
- Vite exits with code 0 and produces `apps/frontend/dist/`.

## Scenario 8: Automated Component Tests

**Command** (only when the deferred tooling is installed):

```bash
npm --prefix apps/frontend run test
```

**Expected outcome**:

- `PanoramaViewer.test.jsx` confirms the message appears for a missing panorama and for no selected location.
- `Sidebar.test.jsx` confirms the floor list does not render the message.
- `Sidebar.test.jsx` confirms the locked-floor popover delay, restart on repeat activation, dismissal, and reduced-motion acknowledgement using fake timers.
- Existing viewer, sidebar, gallery, narration, and catalog tests continue to pass.

Do not install Vitest, Testing Library, or jsdom without maintainer approval.

## Scenario 9: Locked-Floor Popover Timing and Lifecycle

**Setup**: Open the floor list and activate a locked floor.

**Expected outcome**:

- The button acknowledges the activation immediately.
- No popover is visible immediately after activation.
- The coming-soon popover appears about 1.5 seconds later, inside the 1-2 second window, naming the activated floor.
- Activating another locked floor before the popover appears restarts the delay; only the latest floor is named.
- The visible popover stays open until the visitor clicks outside it or presses Escape.
- Closing the sidebar cancels a pending popover or closes a visible one.

## Scenario 10: Reduced-Motion Acknowledgement

**Setup**: Emulate `prefers-reduced-motion: reduce` in the browser and activate a locked floor.

**Expected outcome**:

- The button does not shake.
- A brief border and background change acknowledges the activation immediately.
- The coming-soon popover still appears within 1-2 seconds and dismissal behavior is unchanged.

## Failure Handling

- **Message appears in the sidebar**: remove the message branch from the floor status logic and rerun the sidebar check.
- **Message is missing from the viewer**: confirm the viewer is mounted when content is ready and that the missing state covers both no-location and missing-panorama conditions.
- **Message persists over an available panorama**: clear the missing state when a valid location is selected.
- **Gallery or narration appears without a location**: keep those controls scoped to a selected location.
- **Popover appears immediately or never appears**: confirm the timer is scheduled with `POPOVER_DELAY_MS` (1500 ms) and that the MUI `open` state changes only when the timer fires.
- **Popover names the wrong floor**: clear the previous timer on every locked-floor activation and store the latest floor and anchor together.
- **Popover auto-closes**: remove any timer-based dismissal and keep only outside-click and Escape handlers.
- **No acknowledgement under reduced motion**: keep the non-motion border and background change active when the motion preference matches.
- **Accessibility regression**: confirm the panel keeps alert semantics, the popover keeps polite status semantics, and both remain reachable without opening the floor list.
- **Test tooling unavailable**: record lint, build, and manual scenario evidence in the pull request until the tooling is restored.
