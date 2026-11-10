# UI Contract for Switchable 5M/5F Paired Row

## Overview
The sidebar must expose a **row‑based** UI contract that guarantees:
- Correct grouping of the 5M and 5F entries.
- A clearly labelled control to switch which floor appears first at any time.
- Immediate visual effect of the switch with no page reload.
- Independent, accessible controls for each floor in either order.
- Consistent horizontal centering.
- Responsive behavior at the minimum 320 px viewport.
- Retention of the switched order across sidebar collapse/expand.

## Contract Sections

### 1. Row Definition
- **Row Type**: `"single"` or `"pair"`.
- **Pair Row**: Contains exactly two `FloorEntry` objects (`5F` and `5M`) ordered left‑to‑right per the active floor‑order state (default matches descending order; switched reverses it).
- **Single Row**: Contains one `FloorEntry`.
- **Constraint**: Exactly one pair row exists; all other rows are `"single"`.

### 2. Order‑Switch Control
- **Presence**: A clearly labelled control must be provided to switch the 5M and 5F order at any time.
- **Location**: Reachable alongside the floor list while the sidebar is open.
- **Effect**: Toggling reverses the left‑to‑right order of 5M and 5F in the paired row immediately; every other floor keeps its own row.
- **Retention**: The switched order is retained across collapse/expand cycles while the sidebar remains mounted.
- **Keyboard**: The control must be reachable via `Tab` and activatable via `Enter`/`Space`; focus is preserved after activation.

### 3. Button Component
- **Label**: `FloorEntry.label` (e.g., `5F`).
- **State Indicators**:
  - `current` → highlighted visual state (`border-accent` + `bg-accent-soft`).
  - `locked` → `OFF LIMITS` label, muted style.
  - `unavailable` → disabled visual style.
  - `disabled` → disabled attribute, muted style.
- **Per‑Floor State**: Current, locked, unavailable, and disabled styling are shown per floor within the pair, not for the row as a whole; state travels with the button when the order is switched.
- **Centering**: Each button is horizontally centered within the sidebar column (`flex items-center justify-center`).
- **Grouping**: In a `"pair"` row, the two buttons are wrapped in a flex container that centers the pair as a whole.
- **Independence**: Activating one floor in the pair does not activate or select the other, in either order.

### 4. Accessibility
- **ARIA**:
  - Sidebar element: `aria-label="Campus floors"`.
  - Toggle button: `aria-expanded`, `aria-controls="location-sidebar"`.
  - Each button: `aria-current="true"` when selected.
  - Grouped pair: `role="group"` with an accessible name indicating the pair (e.g., "Fifth‑floor levels").
  - Order‑switch control: clear accessible name describing its purpose.
- **Keyboard**: All buttons and the order‑switch control must be reachable via `Tab` and activatable via `Enter`/`Space`.
- **Screen Reader**: Each floor in the pair is announced as its own control with its own name and status in either order.

### 5. Responsiveness
- **320 px Minimum**: Labels may wrap onto multiple lines but must stay within the same row; no horizontal scroll, before or after a switch.
- **Narrow Viewports**: Buttons remain centered; pair stays grouped; order‑switch control remains usable.

### 6. State Persistence
- **Current**: Highlighted visual state persists across collapse/expand.
- **Locked/Unavailable/Disabled**: Styling reflects the per‑floor state, not the row, and persists across a switch.
- **Switched Order**: Retained across collapse/expand while the sidebar is mounted; session scope only (resets on unmount/reload).

### 7. Testability
- **Regression Tests**: Verify row grouping, order switching, centering, independent activation, state styling, accessibility, responsiveness, and retention across collapse/expand.
- **Manual Checks**: Resize to 320 px, toggle the order switch, toggle sidebar collapse/expand, verify no layout shift and no horizontal scroll.

## Acceptance Criteria (derived from Requirements)
- **FR‑001**: 5M and 5F appear side‑by‑side in one row.
- **FR‑002**: All other floors keep separate rows.
- **FR‑003**: Each floor remains a separate control with its own label after any switch.
- **FR‑004**: Activating one floor does not affect the other, in either order.
- **FR‑005**: Per‑floor state styling is shown.
- **FR‑006**: Pair order is switchable at any time so either 5M or 5F appears first.
- **FR‑007**: Switching takes effect immediately with no page reload.
- **FR‑008**: Switched order is retained across collapse/expand.
- **FR‑009**: Labels readable without horizontal scroll at 320 px before and after a switch.
- **FR‑010**: Keyboard focus reaches each floor individually, same order as row, after any switch.
- **FR‑011**: Screen readers announce each floor separately in either order.
- **FR‑012**: Pair is centered; each button sized to its own content.
- **FR‑013**: Collapsing sidebar hides the pair with the rest of the list.
- **FR‑014**: A clearly labelled control is provided to switch the order at any time.

*All items must be satisfied for the contract to be considered fulfilled.*
