# Feature Specification: Fix Off-Limits Popover Duplicate Message

**Feature Branch**: `031-fix-off-limits-popover`

**Created**: 2026-11-26

**Status**: Draft

**Input**: User description: "The Popover for off limits displays a duplicated one after displaying '__ coming soon.' then another 'coming soon.' is appearing before hiding. Fix this issue immediately."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See one clear message when an off-limits floor is selected (Priority: P1)

A campus visitor browsing the floor list selects a floor that is marked "OFF LIMITS." The tour shows a single, clear message such as "1F is coming soon." that identifies the selected floor and then disappears on its own. The visitor never sees a blank, placeholder, or repeated version of the message.

**Why this priority**: This is the reported defect. The duplicate/placeholder message makes the tour look broken and confusing, and it directly affects first-time visitors exploring the campus.

**Independent Test**: Open the floor list, select an off-limits floor, and observe the notification from appearance to disappearance. Confirm exactly one complete message is shown with the correct floor label.

**Acceptance Scenarios**:

1. **Given** the floor list is open, **When** the visitor selects an off-limits floor, **Then** exactly one notification appears showing that floor's label followed by "is coming soon."
2. **Given** the notification for an off-limits floor is visible, **When** the auto-hide period elapses, **Then** the notification disappears without any second or placeholder message appearing first.
3. **Given** the visitor selects an off-limits floor, **When** the notification is displayed, **Then** it never shows empty, placeholder, or missing label text at any point in its lifecycle.

---

### User Story 2 - Selecting another off-limits floor replaces the message cleanly (Priority: P2)

A visitor selects one off-limits floor and then quickly selects a different off-limits floor. The notification updates to show only the latest floor's message, with no overlapping, stacked, or stale duplicate messages.

**Why this priority**: Rapid exploration of the floor list is common; overlapping notifications would reproduce the same confusing behavior under a realistic interaction.

**Independent Test**: Select one off-limits floor, then select a different off-limits floor before the first message hides. Confirm only one notification is visible and it names the most recently selected floor.

**Acceptance Scenarios**:

1. **Given** a notification is showing for one off-limits floor, **When** the visitor selects a different off-limits floor, **Then** only one notification remains visible and it names the newly selected floor.
2. **Given** the visitor repeatedly selects the same off-limits floor, **When** the notification is showing, **Then** the display restarts without creating a second notification.

---

### User Story 3 - Dismiss the message deliberately (Priority: P3)

A visitor who has already read the message dismisses it early using an on-screen close action or the keyboard, or closes the floor list, and the message disappears immediately without reappearing.

**Why this priority**: Visitors must stay in control of the interface, and a dismissed or cancelled message must not resurface unexpectedly.

**Independent Test**: Show a notification, dismiss it by keyboard or by closing the floor list, and confirm it does not reappear or duplicate.

**Acceptance Scenarios**:

1. **Given** an off-limits notification is visible, **When** the visitor dismisses it, **Then** it disappears immediately and does not reappear.
2. **Given** an off-limits notification is visible or pending, **When** the visitor closes the floor list, **Then** no notification appears afterward.

---

### Edge Cases

- The visitor selects an off-limits floor several times in quick succession; the message must not stack or flash a placeholder.
- The visitor selects an off-limits floor immediately after dismissing a previous message; a single fresh message must appear.
- The visitor dismisses the message at the same moment the auto-hide period ends; the message must not reappear.
- The visitor uses a reduced-motion preference; the message must still appear once, correctly labelled, with no duplicate.
- The visitor uses a small-screen device where the floor list behaves differently; the message must remain a single complete message.
- The floor list is closed while a notification is pending; the pending notification must be cancelled.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When a visitor selects an off-limits floor, the system MUST display exactly one notification identifying that floor.
- **FR-002**: The notification text MUST contain the selected floor's label followed by "is coming soon," and MUST NOT contain empty, placeholder, truncated, or missing label content at any point while visible.
- **FR-003**: The notification MUST auto-hide after its configured display period without showing any additional or repeated message before disappearing.
- **FR-004**: When a visitor selects a different off-limits floor while a notification is visible, the system MUST replace the notification content with the latest floor and MUST keep only one notification visible.
- **FR-005**: When a visitor activates the same off-limits floor repeatedly, the system MUST restart the display period without creating a second notification.
- **FR-006**: When the visitor dismisses the notification (via close action or keyboard), the system MUST remove it immediately and cancel any pending auto-hide.
- **FR-007**: When the floor list is closed, the system MUST dismiss any visible notification and cancel any pending notification.
- **FR-008**: The notification MUST be announced to assistive technology exactly once per activation, with the full floor label included.
- **FR-009**: The single-notification behavior MUST be consistent across mobile, tablet, and desktop layouts and under reduced-motion preferences.

### Key Entities

- **Off-limits floor**: A floor in the campus floor list that is marked unavailable for viewing and shows a "coming soon" notification when selected.
- **Notification**: The transient message anchored near the selected floor, containing the floor label, a visibility state, and a display-period timer.
- **Selection event**: The visitor's activation of an off-limits floor, which starts or restarts the notification lifecycle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of off-limits floor selections display exactly one complete notification.
- **SC-002**: 0 occurrences of placeholder, blank, or duplicate notification text observed from appearance to disappearance across all tested selections.
- **SC-003**: The notification disappears on its own within 2.5 seconds of being shown, unless the visitor dismisses or replaces it first.
- **SC-004**: 100% of rapid multi-floor selections show only the most recently selected floor's label.
- **SC-005**: 100% of deliberate dismissals and floor-list closures result in no notification reappearing.

## Assumptions

- The defect is limited to the transient "coming soon" notification shown for off-limits floors; floor selection and the rest of the tour are unchanged.
- The existing display period of approximately two seconds remains the intended behavior.
- The set of off-limits floors (currently 1F, 2F, 3F, 10F, and 11F) and the message wording remain unchanged; only the duplicate/placeholder presentation is fixed.
- Visitors have a standard modern browser with an accessible name and live-region support for screen readers.
- The existing floor list and notification component are reused rather than redesigned.
