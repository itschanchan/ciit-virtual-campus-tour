# Research Summary

## Clarifications Resolved

No [NEEDS CLARIFICATION] markers remain in the specification. All technical context values are known from the existing project setup.

## Key Decisions

- **Row Derivation**: Display rows are derived from the existing ordered floor list plus an in-memory floor-order flag; no duplicate floor markup is needed.
- **Order Switch Control**: A clearly labelled control next to the floor list toggles which of 5M/5F appears first in the paired row.
- **Immediate Effect**: The switch is computed during render, so the new order takes effect immediately with no page reload.
- **Retention Scope**: The switched order is held in component state for the session while the sidebar is open; it resets to default when the sidebar unmounts. Persisting across page reloads is out of scope.
- **Pairing**: Only the 5M/5F pair is grouped; all other floors remain single rows.
- **Ordering**: Within the paired row, left-to-right order follows the active flag — default matches the list's descending order; switched reverses it.
- **Centering**: All floor buttons, including those in the paired row, are horizontally centered in the sidebar column.
- **Responsiveness**: Labels wrap to stay readable at the 320 px minimum viewport; no horizontal scrolling required; the pair stays grouped before and after a switch.
- **Independent Activation**: Each floor button remains a separate control; activating one does not affect the other, in either order.
- **Per-Floor State**: Current, locked, unavailable, and disabled styling remain attached to individual buttons after any switch.
- **Accessibility**: Both floors remain separate keyboard-reachable controls with visible focus states in either order; the order switch control is keyboard-reachable and focus is preserved.
- **Testing**: Regression tests will cover row grouping, order switching, centering, independent activation, state styling, and retention across collapse/expand. Execution awaits restoration of Vitest/Testing Library tooling.
- **Dependency Impact**: No new dependencies; existing MUI and Tailwind usage is reused.

No additional clarifications were required; all unknowns from the Technical Context are resolved.
