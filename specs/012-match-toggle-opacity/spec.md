# Feature Specification: Match Sidebar Toggle Opacity to Sidebar

**Feature Branch**: `012-match-toggle-opacity`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Make the toggle button same opacity as with the sidebar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle button visually blends with the sidebar edge (Priority: P1)

A visitor opens or closes the campus floor sidebar and the toggle button at the sidebar's edge has the same opacity as the sidebar itself, so the toggle reads as one continuous piece attached to the sidebar rather than a separate element with a different solidity.

**Why this priority**: When the toggle's opacity differs from the sidebar, the toggle looks detached from the sidebar even after border fixes, breaking the visual attachment. Matching opacity completes the attached look.

**Independent Test**: Open and close the sidebar and confirm the toggle button's background opacity matches the sidebar's background opacity throughout the animation.

**Acceptance Scenarios**:

1. **Given** the sidebar is open, **When** the toggle button is inspected, **Then** the toggle button background opacity equals the sidebar background opacity.
2. **Given** the sidebar is closing, **When** the sidebar and toggle animate together, **Then** the toggle and sidebar maintain matching opacity for the full animation duration.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The sidebar toggle button background MUST use the same opacity value as the sidebar background when the sidebar is open.
- **FR-002**: The sidebar toggle button background opacity MUST remain consistent with the sidebar throughout the open and close animations.

### Key Entities

- **Sidebar toggle button**: The circular button at the right edge of the campus floor sidebar used to open and close the sidebar.
- **Sidebar background opacity**: The opacity applied to the sidebar background color.

### Edge Cases

- The sidebar is closed, so there is no sidebar edge for the toggle to visually attach to.
- The sidebar is in compact mode on narrow mobile viewports, where the sidebar width differs.
- A visitor has prefers-reduced-motion enabled, so the open/close animation is disabled or shortened.
- The sidebar toggles rapidly open and closed multiple times in succession.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of sidebar-open views show the toggle button with the same background opacity as the sidebar.
- **SC-002**: The toggle button and sidebar opacity stay matched for the entire open/close animation duration.

## Assumptions

- The sidebar background currently uses a semi-transparent opacity.
- The toggle button currently uses full opacity.
- Applying matching opacity to the toggle button will not break layout or touch targets.
