# Feature Specification: Panorama Empty State Message

**Feature Branch**: `004-panorama-empty-state`

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "The 'No panorama available yet.' message should be displayed in the panorama viewer, not in the sidebar."

## Clarifications

### Session 2026-11-05

- Q: When a visitor activates a locked floor button, what should the 1–2 second timing apply to? → A: Delayed reveal — the popover appears 1–2 seconds after the button is activated.
- Q: If a visitor activates a locked floor a second time while the 1–2 second delay is still counting down, what should happen? → A: Restart the delay and show the popover for the most recently activated floor.
- Q: Once the coming-soon popover appears, how should it be dismissed? → A: It stays visible until the visitor dismisses it by clicking outside or pressing Escape.
- Q: Should the locked floor button still acknowledge the activation on screen immediately, before the popover appears? → A: Yes — acknowledge immediately (for example, a brief shake), then show the popover after the delay.
- Q: When a visitor has requested reduced motion, what should the immediate acknowledgement for a locked floor be? → A: A non-motion acknowledgement, such as a brief colour or border change.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the missing-panorama message in the viewer (Priority: P1)

A visitor lands on or selects a campus location that does not have a panorama. The tour viewer shows "No panorama available yet." in the main viewing area so the visitor understands why there is no 360-degree view.

**Why this priority**: The main viewing area is where visitors expect feedback about the panorama; a message in the floor list can be missed or mistaken for a floor label.

**Independent Test**: Present a location with no panorama and confirm the viewer shows "No panorama available yet."

**Acceptance Scenarios**:

1. **Given** no location is selected, **When** the tour is ready, **Then** the viewer displays "No panorama available yet."
2. **Given** a selected location has no panorama, **When** the location is displayed, **Then** the viewer displays "No panorama available yet."
3. **Given** a selected location has a panorama, **When** the location is displayed, **Then** the viewer shows the panorama and does not show the message.

---

### User Story 2 - Keep the floor list free of availability messages (Priority: P2)

A visitor browsing the campus floor list sees floor names and clearly marked unavailable or locked floors without the "No panorama available yet." text appearing in the floor list.

**Why this priority**: Repeating the message on every floor without content clutters the list and makes floor labels harder to scan.

**Independent Test**: Open the floor list with several floors that have no location and confirm the message does not appear anywhere in the list.

**Acceptance Scenarios**:

1. **Given** a floor has no location, **When** the floor list is visible, **Then** that floor entry does not display "No panorama available yet."
2. **Given** a floor is locked, **When** the visitor activates it, **Then** the button acknowledges the activation immediately and the coming-soon popover appears 1–2 seconds later.
3. **Given** a location exists but its panorama is unavailable, **When** the floor list is visible, **Then** the existing location-unavailable feedback remains in the list.

---

### User Story 3 - Accessible feedback in every layout (Priority: P3)

A visitor using a small screen or assistive technology receives the missing-panorama message in the viewer even when the floor list is collapsed.

**Why this priority**: The message must be usable without opening or expanding navigation.

**Independent Test**: Collapse the floor list, reach the unavailable state, and confirm the message is visible and announced as an alert.

**Acceptance Scenarios**:

1. **Given** the floor list is collapsed, **When** no panorama is available, **Then** the viewer displays and announces the message.
2. **Given** a narrow viewport, **When** the message appears, **Then** it remains readable without horizontal scrolling.

---

### Edge Cases

- The tour content is ready but no location is selected.
- A selected location exists but has no panorama data.
- A floor has no location entry in the tour content.
- The floor list is collapsed while the message is shown.
- A locked floor is activated repeatedly before the popover appears.
- The visitor has requested reduced motion while activating a locked floor.
- Several floors lack panoramas at the same time.
- A location's panorama becomes available after the visitor previously saw the message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The panorama viewer MUST display "No panorama available yet." when no location is selected.
- **FR-002**: The panorama viewer MUST display "No panorama available yet." when the selected location has no panorama.
- **FR-003**: The campus floor list MUST NOT display "No panorama available yet." on any floor entry.
- **FR-004**: The campus floor list MUST retain its existing distinct feedback for locked floors and for locations whose panorama is unavailable.
- **FR-005**: When a selected location has an available panorama, the viewer MUST display the panorama and MUST NOT display the missing-panorama message.
- **FR-006**: The message MUST remain visible in the viewer regardless of whether the floor list is open or collapsed.
- **FR-007**: The message MUST be presented as an accessible alert that assistive technology can announce.
- **FR-008**: The message MUST remain readable on desktop and mobile viewports.
- **FR-009**: When a visitor activates a locked floor, the coming-soon popover MUST appear between 1 and 2 seconds after activation.
- **FR-010**: If a locked floor is activated again before the popover appears, the delay MUST restart and the popover MUST describe the most recently activated floor.
- **FR-011**: Once shown, the coming-soon popover MUST remain visible until the visitor dismisses it by clicking outside it or pressing Escape.
- **FR-012**: The locked floor button MUST acknowledge the activation immediately, before the coming-soon popover appears.
- **FR-013**: When reduced motion is preferred, the immediate acknowledgement MUST use a non-motion effect, such as a brief colour or border change.

### Key Entities

- **Location**: A campus room or floor entry that may include a panorama. It has a name and an availability state.
- **Panorama availability**: Whether a location has usable 360-degree imagery; this determines whether the viewer shows imagery or the empty-state message.
- **Floor entry**: A row in the campus floor list. It may reference a location or carry locked or coming-soon status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unavailable-panorama scenarios show "No panorama available yet." in the viewer and 0 occurrences in the floor list.
- **SC-002**: The missing-panorama message becomes visible within 1 second of the unavailable state being reached.
- **SC-003**: 100% of tested keyboard and screen-reader flows can perceive the message without opening the floor list.
- **SC-004**: 100% of locked floors respond with coming-soon feedback, and 100% of locations with no panorama retain location-unavailable feedback in the floor list.
- **SC-005**: No visitor-facing regression is observed in a desktop and mobile smoke test of selecting available locations.
- **SC-006**: 100% of locked-floor activations show the coming-soon popover between 1 and 2 seconds after activation.
- **SC-007**: 100% of repeated locked-floor activations during the delay show exactly one popover, describing the most recently activated floor.
- **SC-008**: 100% of shown coming-soon popovers remain visible until the visitor performs an explicit dismissal action.
- **SC-009**: 100% of locked-floor activations produce an immediate on-screen acknowledgement before the popover appears.
- **SC-010**: 100% of reduced-motion locked-floor activations produce an immediate, motion-free acknowledgement.

## Assumptions

- The missing-panorama message applies both when no location is selected and when the selected location lacks a panorama.
- Floors without a location remain non-selectable in the floor list; the message is shown in the viewer instead of the list.
- Locked floors retain their coming-soon popover feedback, and locations with no panorama retain their location-unavailable feedback in the floor list.
- Panorama availability continues to come from the tour content; no content-authoring changes are required.
- The viewer is available whenever the tour content is ready, including the no-location state.
