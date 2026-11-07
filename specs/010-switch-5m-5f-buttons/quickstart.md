# QuickStart Validation Guide

This guide shows how to manually verify that the **switchable 5M/5F paired row** works as specified.

## Prerequisites
- Node.js 22.12+ (ES modules)
- npm install (React 19, Vite, Tailwind, MUI)
- Run `npm run dev` to start the dev server.

## Steps

1. **Open the Sidebar**
   - Ensure the sidebar is expanded (click the toggle button or set `open` state).
   - Verify the list of floor entries is visible.

2. **Check Row Grouping**
   - Locate the fifth‑floor entries (`5F` and `5M`).
   - Confirm they appear **side‑by‑side** in a single row.
   - All other floors (`4F`, `6F`, etc.) must each occupy their **own separate row**.

3. **Verify Default Order**
   - Confirm the left‑to‑right order of the pair matches the list’s descending order (5M then 5F by default).

4. **Operate the Order‑Switch Control**
   - Locate the clearly labelled control to switch the 5M/5F order.
   - Activate the control (click, or `Enter`/`Space` via keyboard).
   - Confirm 5M and 5F exchange positions immediately with no page reload.
   - Confirm every other floor keeps its own row.

5. **Verify Centering**
   - Each button (including the two in the paired row, in both orders) must be **horizontally centered** within the sidebar column.
   - No button should be left‑aligned; the pair stays centered together.

6. **Independent Activation**
   - Click `5F`. Verify only `5F` is highlighted/selected; `5M` remains unchanged.
   - Click `5M`. Verify only `5M` is highlighted; `5F` remains unchanged.
   - Ensure no cross‑activation occurs, in both default and switched order.

7. **Responsive Readability**
   - Resize the browser width to **320 px** (minimum supported viewport).
   - Confirm both labels (`5F`, `5M`) remain fully visible without horizontal scrolling, in both orders.
   - If needed, the text wraps onto multiple lines inside each button while staying in the same row.

8. **Keyboard Navigation**
   - Use `Tab` to move focus through the sidebar.
   - Focus should reach `5F` and `5M` individually, in the same order as they appear in the row, after any switch.
   - Each button must be reachable and activatable via `Enter`/`Space`.
   - Focus should reach the order‑switch control and activate it via `Enter`/`Space`.

9. **State Styling**
   - Test each state (`current`, `locked`, `unavailable`, `disabled`) on both `5F` and `5M`, in both orders.
   - Verify the correct visual style is applied per floor, not to the whole row, and that state travels with the button after a switch.

10. **Retention Across Collapse/Expand**
    - Switch the order, then collapse the sidebar (click the toggle button).
    - Reopen the sidebar and confirm the switched order is retained.

## Expected Outcomes
- **Row grouping**: exactly one row contains `5M` and `5F`; all other rows are single.
- **Order switching**: the control reverses the pair’s left‑to‑right order immediately with no reload; the switched order is retained across collapse/expand.
- **Centering**: all buttons are centered; the pair stays centered together in both orders.
- **Independence**: activating one floor does not affect the other, in either order.
- **Readability**: labels fully visible at 320 px width; text wraps as needed.
- **Accessibility**: keyboard focusable, screen‑reader operable (each floor announced separately; order‑switch control reachable).
- **State handling**: each floor shows its own current/locked/unavailable/disabled styling; state persists across a switch.

If all checks pass, the feature meets the Success Criteria (SC‑001 – SC‑006).
