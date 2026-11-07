# Feature Specification: Switch 5M and 5F Floor Order

**Feature Branch**: `010-switch-5m-5f-buttons`

**Created**: 2026-11-07

**Status**: Complete

**Input**: User description: "switch the 5M and 5F buttons in @apps/frontend/src/components/Sidebar.jsx. Make a comprehensive code that I can switch these floors at anytime."

**Implementation**: `apps/frontend/src/components/Sidebar.jsx` — `buildFloorRows` always reverses the fifth-floor pair to render 5F then 5M directly. No toggle state, no order-switch control UI, no new dependencies added.

## Clarifications

### Session 2026-11-07

- Q: Use the `.reverse()` function for the FLOOR_PAIR? → A: Yes, always. `buildFloorRows` applies `.reverse()` to the paired row's entries unconditionally, so the pair renders as 5F then 5M with no switch control.
- Q: Remove the floor order switch feature, only switch 5M and 5F to 5F and 5M directly? → A: Yes. The `floorOrderSwitched` state, `toggleFloorOrder()` function, and order-switch control UI were removed. The pair is fixed as 5F then 5M.
- Q: For the paired fifth-floor row, should the buttons render 5F then 5M or 5M then 5F? → A: 5F then 5M. Re-apply the unconditional `.reverse()` in `buildFloorRows` per FR-001 and update the stale `Sidebar.test.jsx` assertions ("orders the pair as 5M then 5F" and the group reading-order test) to expect 5F before 5M.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See 5F and 5M side by side in fixed order (Priority: P1)

A visitor browsing the campus floor list sees the fifth-floor levels (5F and 5M) grouped together side by side, with 5F appearing first then 5M. The pair order is fixed and not switchable.

**Why this priority**: This is the core request — to place 5F before 5M in the fifth-floor row, and keep that order fixed.

**Independent Test**: Open the sidebar and confirm 5F and 5M share one row in the order 5F then 5M; all other floors occupy separate rows; each button retains its own current/locked/unavailable/disabled state.

**Acceptance Scenarios**:

1. **Given** the sidebar floor list is open, **When** the fifth-floor row is inspected, **Then** 5F and 5M appear side by side in a single row in the order 5F then 5M.
2. **Given** the paired row exists, **When** the visitor compares it with neighbouring floors, **Then** 4F and 6F each occupy their own separate rows.

---

### User Story 2 - Interact with each fifth floor independently (Priority: P2)

A visitor can activate either 5F or 5M individually. Each floor keeps its own label, state, and navigation behaviour.

**Why this priority**: Pairing the floors in one row is a layout change only; each floor remains its own selectable entry.

**Independent Test**: Activate 5F and 5M separately; confirm each responds only for itself and shows its own current/locked/unavailable state.

**Acceptance Scenarios**:

1. **Given** the paired row, **When** the visitor activates the left floor (5F), **Then** only 5F responds.
2. **Given** the paired row, **When** the visitor activates the right floor (5M), **Then** only 5M responds.
3. **Given** one paired floor is current, locked, or unavailable, **When** the row is shown, **Then** only that floor displays the corresponding state styling.

---

### Edge Cases

- Only one of the two paired floors has a tour location.
- One paired floor is locked or unavailable while the other is selectable.
- Both paired floors are disabled but must still appear as one row.
- Either paired floor becomes the current location; only that floor is highlighted.
- The viewport is very narrow and the two labels compete for space.
- The sidebar is collapsed, so the paired row is hidden with the rest of the list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The sidebar floor list MUST display 5F and 5M together in one row, side by side, in the order 5F then 5M.
- **FR-002**: Every other floor MUST keep its own separate row.
- **FR-003**: Each floor in the pair MUST remain a separate control with its own visible label.
- **FR-004**: Activating one floor in the pair MUST NOT activate or select the other.
- **FR-005**: Current, locked, unavailable, and disabled states MUST be presented per floor within the pair, not for the row as a whole.
- **FR-009**: Both labels MUST remain fully readable on desktop and narrow mobile viewports without horizontal scrolling, wrapping onto more lines when space is tight.
- **FR-010**: Keyboard focus MUST reach 5F and 5M individually and in the same order as the row.
- **FR-011**: Assistive technology MUST announce each floor in the pair as a separate control with its own name and status.
- **FR-012**: The paired row MUST be horizontally centered within the sidebar column, with each floor button sized to its own content and the two buttons grouped side by side.
- **FR-013**: Collapsing the sidebar MUST hide the paired row together with the rest of the floor list, with no change to existing collapse behaviour.

### Key Entities

- **Floor entry**: One navigation entry for a campus level. It has a short label, may reference a tour location, and carries current, locked, unavailable, or disabled state.
- **Floor list**: The ordered set of floor entries shown in the sidebar, descending from the highest level to the lowest.
- **Paired row**: A single row in the floor list that contains the 5F and 5M entries side by side in the fixed order 5F then 5M.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of sidebar views show 5F and 5M in the same row, in the order 5F then 5M, and 0 other floors share a row.
- **SC-002**: 100% of activations on 5F or 5M affect only the activated floor, with no cross-activation.
- **SC-003**: Both labels are fully visible at a 320-pixel-wide viewport without horizontal scrolling.
- **SC-004**: A keyboard-only traversal reaches each floor exactly once and in the same order as the row.
- **SC-005**: 100% of floor buttons, including each button in the 5F/5M pair, render horizontally centered in the sidebar column at desktop and narrow viewports.

## Assumptions

- 5F and 5M stay as two distinct buttons rather than one combined control.
- Pairing applies whenever the floor list is visible, in both the expanded desktop sidebar and the compact overlay.
- No new tour content, data, or external dependencies are required.
- The fifth-floor pair is the only grouping; all other floors remain one per row.
