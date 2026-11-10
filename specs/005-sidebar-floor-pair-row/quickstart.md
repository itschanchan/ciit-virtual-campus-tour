# QuickStart Validation Guide

This guide shows how to manually verify that the **5F/5M paired row** works as specified.

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

3. **Verify Centering**
   - Each button (including the two in the paired row) must be **horizontally centered** within the sidebar column.
   - No button should be left‑aligned.

4. **Independent Activation**
   - Click `5F`. Verify only `5F` is highlighted/selected; `5M` remains unchanged.
   - Click `5M`. Verify only `5M` is highlighted; `5F` remains unchanged.
   - Ensure no cross‑activation occurs.

5. **Responsive Readability**
   - Resize the browser width to **320 px** (minimum supported viewport).
   - Confirm both labels (`5F`, `5M`) remain fully visible without horizontal scrolling.
   - If needed, the text should wrap onto multiple lines inside each button while staying in the same row.

6. **Keyboard Navigation**
   - Use `Tab` to move focus through the sidebar.
   - Focus should reach `5F` and `5M` individually, in the same order as they appear in the row.
   - Each button must be reachable and activatable via `Enter`/`Space`.

7. **State Styling**
   - Test each state (`current`, `locked`, `unavailable`, `disabled`) on both `5F` and `5M`.
   - Verify the correct visual style (e.g., `border-accent`, `bg-surface-strong/30`, etc.) is applied per floor, not to the whole row.

8. **Collapse/Expand Sidebar**
   - Collapse the sidebar (click the toggle button).
   - Verify the paired row disappears together with the rest of the floor list; no visual glitch occurs.

## Expected Outcomes
- **Row grouping**: exactly one row contains `5F` and `5M`; all other rows are single.
- **Centering**: all buttons are centered; the pair stays centered together.
- **Independence**: activating one floor does not affect the other.
- **Readability**: labels fully visible at 320 px width; text wraps as needed.
- **Accessibility**: keyboard focusable, screen‑reader operable (each floor announced separately).
- **State handling**: each floor shows its own current/locked/unavailable/disabled styling.

If all checks pass, the feature meets the Success Criteria (SC‑001 – SC‑006).