# UI Contract: Sidebar 5F and 5M Paired Row

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data Model**: [data-model.md](../data-model.md)

This contract defines how the fifth-floor pair behaves inside the campus floor list.

## Row Contract

- The floor list contains exactly one paired row.
- The paired row contains 5M and 5F.
- Every floor button, including each button in the pair, is horizontally centered in the sidebar column rather than aligned to the left edge.
- The paired row groups two content-sized buttons, each sized to its own label and status content, centered together.
- Every other floor keeps its own separate row.
- The paired row appears in the same position the two floors occupy today, between 6F and 4F.
- The two floors read left to right as 5M then 5F, matching the list's descending order.
- The pair is hidden together with the rest of the list when the sidebar is collapsed.

## Floor Button Contract

- 5F and 5M remain two separate buttons with their own visible labels.
- Each button keeps the existing floor-button styling and interaction feedback.
- Activating 5F selects or responds for 5F only; it never activates 5M, and the reverse also holds.
- Current, locked, unavailable, and disabled state is applied per button, not to the paired row.
- A locked or unavailable floor keeps its existing feedback, including the locked label and the coming-soon popover.
- Selecting either floor follows the existing selection behaviour, including closing the list on compact viewports.

## Accessibility Contract

- Both buttons are reachable by keyboard and remain individually focusable.
- Keyboard focus order matches the visual order: 5M then 5F.
- The pair is exposed as a labelled group that identifies the fifth-floor levels.
- Each button exposes its own accessible name and status; pairing does not merge or rename them.
- The group label supplements the button labels and never replaces them.
- Focus remains visible on each button using the existing focus styling.
- The collapse toggle, skip link, and other sidebar controls are unaffected.

## Responsive Contract

- The pair remains side by side on desktop and compact viewports.
- Each button keeps its own content-sized width, and the two are centered together as a group.
- Labels and status text may wrap inside their button but must not be clipped.
- No horizontal scrolling is introduced at 320 CSS pixels or at the representative desktop widths already used for the sidebar.
- The existing `compact`, `narrow`, and `tiny` variants remain the only responsive variants used; no new breakpoint is added.

## Layout Contract

- The pairing rule lives in the floor-list display logic, not in the tour content.
- The change does not alter the resolved location order or the floor-to-location mapping.
- The change does not alter the sidebar shell width, toggle position, or collapse animation.
- The change does not add a new overlay, modal, or navigation surface.
- The change does not alter the panorama viewer, gallery, narration, or header.

## Out of Scope

- Pairing any floors other than 5F and 5M.
- Renaming, adding, removing, or reordering floors.
- Changing the tour catalog, panorama assets, or location mapping.
- Changing the locked-floor set or coming-soon popover behaviour.
- Adding or upgrading dependencies.
- Changing the backend or API.
