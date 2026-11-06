# Feature Specification: Sidebar 5F and 5M Paired Row

**Feature Branch**: `005-sidebar-floor-pair-row`

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "in 003-sidebar-menu, the 5F and 5M are together side-by-side in row in apps/frontend/src/components/Sidebar.jsx"

## Clarifications

### Session 2026-11-06

- Q: When you ask to center the buttons, which buttons should be centered and centered relative to what? → A: All floor buttons are horizontally centered within the sidebar column, not left-aligned.
- Q: Inside the side-by-side 5F/5M row, how should the two buttons share the row width? → A: Each button sizes to its own content, and the two are centered together as one group.
- Q: When the 5F and 5M buttons cannot both fit side by side at the narrowest viewport, how should they stay in one row and remain readable? → A: Each label wraps onto more lines inside its button so both stay in one row.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See 5F and 5M on one row (Priority: P1)

A visitor browsing the campus floor list sees the 5F and 5M entries next to each other in a single row instead of each taking its own row. This keeps the two fifth-floor levels visually grouped while the rest of the floors remain stacked one per row, with every button centered in the column.

**Why this priority**: This is the requested change. Without it, the feature delivers no value.

**Independent Test**: Open the sidebar at a representative desktop width and confirm that 5F and 5M are the only two floor entries sharing one row, while every other floor occupies its own row.

**Acceptance Scenarios**:

1. **Given** the sidebar is open and the floor list is visible, **When** the fifth-floor entries are inspected, **Then** 5F and 5M appear side by side in a single row.
2. **Given** the paired row exists, **When** the visitor compares it with neighbouring floors, **Then** 4F and 6F each occupy their own separate rows.
3. **Given** the visitor reads the list from top to bottom, **When** they reach the fifth-floor levels, **Then** the side-by-side order matches the existing descending floor order.
4. **Given** the floor list is visible, **When** the visitor looks at any floor entry, **Then** the button is horizontally centered in the sidebar column rather than aligned to the left edge.

---

### User Story 2 - Use each paired floor independently (Priority: P2)

A visitor can still interact with 5F and 5M separately. Pairing the floors in one row is a layout change only; each floor remains its own selectable entry with its own state.

**Why this priority**: Pairing must not merge the two floors into one control or change what happens when either is activated.

**Independent Test**: Activate 5F and 5M separately and confirm each produces only its own response, and that the current, locked, and unavailable states are shown per floor.

**Acceptance Scenarios**:

1. **Given** the paired row, **When** the visitor activates 5F, **Then** only 5F responds.
2. **Given** the paired row, **When** the visitor activates 5M, **Then** only 5M responds.
3. **Given** one of the paired floors is the current location or is locked/unavailable, **When** the row is shown, **Then** only that floor displays the corresponding state styling.

---

### User Story 3 - Paired row on small screens and assistive technology (Priority: P3)

A visitor on a narrow viewport, or using a keyboard or screen reader, can still read both labels and reach each floor individually.

**Why this priority**: The campus tour must remain usable on mobile devices and with assistive technology.

**Independent Test**: At a narrow viewport and with keyboard navigation, confirm both labels stay legible, both buttons are focusable, and each is announced as a separate floor.

**Acceptance Scenarios**:

1. **Given** a narrow viewport, **When** the paired row is shown, **Then** both labels remain fully readable without horizontal scrolling.
2. **Given** keyboard navigation, **When** the visitor moves through the floor list, **Then** focus reaches 5F and 5M individually in the same order as the row.
3. **Given** a screen reader, **When** the paired row is reached, **Then** each floor is announced as its own control with its own name and status.

---

### Edge Cases

- Only one of the two paired floors has a location in the tour content.
- One paired floor is locked or unavailable while the other is selectable.
- Both paired floors are unavailable and therefore disabled, but must still appear as one row.
- Either paired floor becomes the current location; only that floor is highlighted.
- The viewport is very narrow and the two labels compete for space.
- The sidebar is collapsed, so the paired row is hidden with the rest of the list.
- A paired floor name is longer than the other; each button sizes to its own content while the pair stays centered together as a group.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The campus floor list MUST display 5F and 5M together in one row, side by side.
- **FR-002**: Every other floor MUST keep its own separate row.
- **FR-003**: Each floor in the paired row MUST remain a separate control with its own visible label.
- **FR-004**: Activating one floor in the pair MUST NOT activate or select the other.
- **FR-005**: Current, locked, unavailable, and disabled states MUST be presented per floor within the pair, not for the row as a whole.
- **FR-006**: The left-to-right order inside the paired row MUST match the list's existing descending floor order.
- **FR-007**: Both labels MUST remain fully readable on desktop and narrow mobile viewports without horizontal scrolling, wrapping onto more lines when space is tight.
- **FR-008**: Keyboard focus MUST reach 5F and 5M individually and in the same order as the row.
- **FR-009**: Assistive technology MUST announce each floor in the pair as a separate control with its own name and status.
- **FR-010**: The paired row MUST be horizontally centered within the sidebar column, with each floor button sized to its own content and the two buttons grouped side by side.
- **FR-011**: Collapsing the sidebar MUST hide the paired row together with the rest of the floor list, with no change to existing collapse behaviour.
- **FR-012**: Every floor button MUST be horizontally centered within the sidebar column rather than aligned to the left edge.

### Key Entities

- **Floor entry**: One navigation entry for a campus level. It has a short label, may reference a tour location, and carries current, locked, unavailable, or disabled state.
- **Floor list**: The ordered set of floor entries shown in the sidebar, descending from the highest level to the lowest.
- **Paired row**: A single row in the floor list that contains the 5F and 5M entries side by side.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of sidebar views show 5F and 5M in the same row, and 0 other floors share a row.
- **SC-002**: 100% of activations on 5F or 5M affect only the activated floor, with no cross-activation.
- **SC-003**: Both labels are fully visible at a 320-pixel-wide viewport without horizontal scrolling.
- **SC-004**: A keyboard-only traversal reaches each floor exactly once and in the same order as the row.
- **SC-005**: No regression is observed in the ordering of the remaining floors or in sidebar collapse and expand behaviour during a desktop and mobile smoke test.
- **SC-006**: 100% of floor buttons, including the centered 5F/5M pair, render horizontally centered in the sidebar column at both desktop and narrow viewports.

## Assumptions

- This is a follow-up change to the existing sidebar feature and does not add, remove, or rename any floors.
- 5F and 5M stay as two distinct buttons rather than one combined control.
- The list keeps its existing descending order, and the side-by-side order mirrors it in reading order.
- Pairing applies whenever the floor list is visible, in both the expanded desktop sidebar and the compact overlay.
- Every floor button, including each button in the pair, is horizontally centered within the sidebar column.
- No new tour content, data, or external dependencies are required.
- The fifth-floor pair is the only grouping requested; all other floors remain one per row.
