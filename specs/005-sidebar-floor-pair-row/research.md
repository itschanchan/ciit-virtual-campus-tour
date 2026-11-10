# Research Summary

## Clarifications Resolved
- **Logo redundancy**: The school logo in Header should be hidden when Sidebar is revealed to avoid visual redundancy. (Answered in clarification Q4)

## Key Decisions
- **Row Derivation**: Display rows are derived from the existing ordered floor list; no duplicate markup needed.
- **Pairing**: Only the 5F/5M pair is grouped; all other floors remain single rows.
- **Ordering**: Within the paired row, 5M is placed left of 5F to preserve the list’s descending order.
- **Centering**: All floor buttons, including those in the paired row, are horizontally centered in the sidebar column.
- **Responsiveness**: Labels wrap to stay readable at the 320 px minimum viewport; no horizontal scrolling required.
- **Independent Activation**: Each floor button remains a separate control; activating one does not affect the other.
- **Testing**: Regression tests will cover row grouping, ordering, centering, independent activation, and state styling. Execution awaits restoration of Vitest/Testing Library tooling.

No additional clarifications were required; all unknowns from the Technical Context are resolved.