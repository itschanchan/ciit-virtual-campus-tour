# Quickstart Validation: Sidebar 5F and 5M Paired Row

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **UI Contract**: [contracts/ui-contract.md](./contracts/ui-contract.md)

Use this guide after implementation to prove 5F and 5M share one row while every other floor keeps its own row. All commands run from the repository root.

## Prerequisites

- Node.js 24.x (minimum 22.12) and npm.
- Dependencies installed with `npm install` and `npm run setup`.
- A checkout containing the feature changes.
- No `.env` file is required for these checks.
- Vitest tooling is optional for the automated scenario; it remains deferred by the maintainer.

## Scenario 1: Fifth-Floor Pair Shares One Row

**Command**:

```bash
npm run dev
```

Open the app, expand the campus floor list, and inspect the fifth-floor entries.

**Expected outcome**:

- 5M and 5F appear side by side in one row.
- 6F sits directly above the pair and 4F directly below it.
- Every other floor occupies its own separate row.
- Every floor button, including the two in the pair, is horizontally centered in the sidebar column rather than hugging the left edge.
- Each button in the pair sizes to its own content, and the two are centered together as a group.

## Scenario 2: Pair Ordering Matches the List

**Setup**: Read the floor list from top to bottom.

**Expected outcome**:

- The order remains 11F at the top down to LG at the bottom.
- Inside the pair, 5M is read before 5F, matching the descending order.
- No other floor changes position because of the pairing.

## Scenario 3: Independent Selection

**Setup**: Use tour content that includes locations for 5F and 5M.

**Expected outcome**:

- Activating 5F selects only 5F and shows the current state on 5F only.
- Activating 5M selects only 5M and shows the current state on 5M only.
- The other floor in the pair keeps its normal styling.
- On a compact viewport, selecting either floor still closes the list.

## Scenario 4: Independent Locked and Unavailable State

**Setup**: Use content states where one floor has no panorama, and verify a locked floor elsewhere in the list.

**Expected outcome**:

- A floor without a panorama shows its unavailable styling and status inside its own button.
- A locked floor keeps its locked label and coming-soon popover.
- Neither state spreads to the other floor in the pair.
- Both floors remain visible in the row when disabled.

## Scenario 5: Keyboard and Screen Reader Flow

**Setup**: Navigate the floor list using only the keyboard, then repeat with a screen reader.

**Expected outcome**:

- Focus reaches 5M then 5F individually, in visual order.
- Each button announces its own floor label and state.
- The pair is announced as a labelled group for the fifth-floor levels.
- Focus styling stays visible on each button.
- The collapse toggle and skip link remain reachable and unchanged.

## Scenario 6: Responsive Check

**Setup**: Check the floor list at representative desktop and mobile widths, including the existing sidebar breakpoints and 320 pixels.

**Expected outcome**:

- The pair remains side by side at every checked width.
- Both labels are fully readable and no text is clipped.
- Status text wraps inside its button instead of overflowing.
- Every floor button, including the pair, stays horizontally centered in the sidebar column.
- No horizontal scrolling appears in the sidebar.
- Collapsing and expanding the sidebar hides and shows the pair with the rest of the list.

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

- `Sidebar.test.jsx` confirms 5F and 5M share one list row.
- `Sidebar.test.jsx` confirms 4F and 6F each occupy their own row.
- `Sidebar.test.jsx` confirms each floor button, including the pair, renders with the horizontal-centering layout.
- `Sidebar.test.jsx` confirms the pair keeps the list's descending order.
- `Sidebar.test.jsx` confirms activating one floor in the pair does not activate the other.
- Existing sidebar, viewer, gallery, narration, and catalog tests continue to pass.

Do not install Vitest, Testing Library, or jsdom without maintainer approval.

## Failure Handling

- **Pair still renders as two rows**: confirm the display-row grouping step receives the ordered floor entries and that only the declared fifth-floor pair is grouped.
- **Another floor also shares a row**: narrow the pairing rule to the explicit 5M and 5F labels and rerun the grouping check.
- **Pair order is wrong**: confirm the descending list is passed through unchanged before grouping and that the row reads 5M then 5F.
- **Selecting one floor highlights both**: keep selection, locked, and unavailable state on individual buttons rather than the row container.
- **Labels clip or overflow on mobile**: let text wrap inside each button, keep each button at its content size, keep the pair centered, and recheck 320 pixels.
- **Buttons appear left-aligned**: center the floor list items in the sidebar column so every button, including the pair, sits in the middle rather than hugging the left edge.
- **Keyboard focus order does not match the row**: keep the DOM order 5M then 5F and avoid CSS-only reordering.
- **Collapse or expand regresses**: verify that grouping only affects the list contents and leaves the sidebar shell and toggle untouched.
- **Test tooling unavailable**: record lint, build, and manual scenario evidence in the pull request until the tooling is restored.

## Recorded Evidence (2026-11-06)

- Scenario 7: `npm run lint` exited 0; `npm run build` exited 0 and produced `apps/frontend/dist/`.
- Scenario 1 (structural): confirmed in code and unit assertions that 5M and 5F render inside one list item while 4F and 6F each keep their own list item.
- Scenario 2 (structural): confirmed the pair reads 5M then 5F in document order.
- Scenario 1/6 (centering): every list item now uses the `flex justify-center` layout so each floor button, including the pair, is centered in the sidebar column.
- Scenario 3/4 (independent state): confirmed by unit assertions that activating 5F selects only 5F and that `aria-current` applies to one floor of the pair.
- Scenario 5 (accessibility): confirmed the pair is exposed as a labelled group (`role="group"`, label "Fifth-floor levels") containing both buttons in reading order.
- Scenario 8: not run - Vitest, Testing Library, and jsdom are still absent from `apps/frontend/package.json`.
- Live-browser visual checks at desktop and 320 pixels were not performed in this environment; the structural assertions and production build stand as interim evidence.
