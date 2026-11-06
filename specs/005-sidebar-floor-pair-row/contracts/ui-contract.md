# UI Contract for Sidebar 5F/5M Paired Row

## Overview
The sidebar must expose a **row‑based** UI contract that guarantees:
- Correct grouping of the 5F and 5M entries.
- Independent, accessible controls for each floor.
- Consistent horizontal centering.
- Responsive behavior at the minimum 320 px viewport.

## Contract Sections

### 1. Row Definition
- **Row Type**: `"single"` or `"pair"`.
- **Pair Row**: Contains exactly two `FloorEntry` objects (`5F` and `5M`) ordered left‑to‑right as `5M` then `5F` to preserve descending list order.
- **Single Row**: Contains one `FloorEntry`.

### 2. Button Component
- **Label**: `FloorEntry.label` (e.g., `5F`).
- **State Indicators**:
  - `current` → `border-accent` + `bg-accent-soft`.
  - `locked` → `OFF LIMITS` label, muted style.
  - `unavailable` → disabled visual style.
  - `disabled` → disabled attribute, muted style.
- **Centering**: Each button is horizontally centered within the sidebar column (`flex items-center justify-center`).
- **Grouping**: In a `"pair"` row, the two buttons are wrapped in a flex container that centers the pair as a whole.

### 3. Accessibility
- **ARIA**:
  - Sidebar element: `aria-label="Campus floors"`.
  - Toggle button: `aria-expanded`, `aria-controls="location-sidebar"`.
  - Each button: `aria-current="true"` when selected.
  - Grouped pair: `role="group"` with an accessible name indicating the pair (e.g., "Fifth‑floor levels").
- **Keyboard**: All buttons must be reachable via `Tab` and activatable via `Enter`/`Space`.

### 4. Responsiveness
- **320 px Minimum**: Labels may wrap onto multiple lines but must stay within the same row; no horizontal scroll.
- **Narrow Viewports**: Buttons remain centered; pair stays grouped.

### 5. State Persistence
- **Current**: Highlighted visual state persists across collapse/expand.
- **Locked/Unavailable/Disabled**: Styling reflects the per‑floor state, not the row.

### 6. Testability
- **Regression Tests**: Verify row grouping, ordering, centering, independent activation, and state styling for each floor.
- **Manual Checks**: Resize to 320 px, toggle sidebar, verify no layout shift.

## Acceptance Criteria (derived from Requirements)
- **FR‑001**: 5F and 5M appear side‑by‑side in one row.
- **FR‑002**: All other floors keep separate rows.
- **FR‑003**: Each floor remains a separate control with its own label.
- **FR‑004**: Activating one floor does not affect the other.
- **FR‑005**: Per‑floor state styling is shown.
- **FR‑006**: Pair order matches descending list order.
- **FR‑007**: Labels readable without horizontal scroll at 320 px.
- **FR‑008**: Keyboard focus reaches each floor individually, same order as row.
- **FR‑009**: Screen readers announce each floor separately.
- **FR‑010**: Pair is centered; each button sized to its own content.
- **FR‑011**: Collapsing sidebar hides the pair with the rest of the list.
- **FR‑012**: All floor buttons are horizontally centered in the sidebar column.

*All items must be satisfied for the contract to be considered fulfilled.*