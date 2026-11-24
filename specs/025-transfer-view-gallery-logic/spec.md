# Feature Specification: Transfer View Gallery Logic to Floating Menu

**Feature Branch**: `025-transfer-view-gallery-logic`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "I already transferred the ViewGallery button inside FloatingMenu.jsx, transfer the remaining logic functionalities codes of ViewGallery from Panorama.jsx to FloatingMenu.jsx."

## Clarifications

### Session 2026-11-15

- Q: Should FloatingMenu receive the gallery open state and toggle handler as props from Layout, or manage them as internal component state? → A: FloatingMenu receives gallery open state and toggle handler as props from Layout.
- Q: Should all borders in FloatingMenu.jsx be replaced with shadows, or should functional borders (error-state accent borders and the play/pause focus-ring spacer border) be preserved? → A: Preserve functional borders (error-state accent borders, transparent focus-ring spacer); replace only decorative borders with shadows.

This confirms FR-002: FloatingMenu.jsx receives the gallery open state and an open/close toggle through its props from Layout, so the View Gallery button is wired to defined controls rather than undefined variables. Layout retains ownership of gallery open/close state via the TourContext.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open the room gallery from the floating menu's View Gallery button (Priority: P1)

A tour visitor can open the room's gallery of images from the floating menu by pressing the "View gallery" button, then browse each image with its caption.

**Why this priority**: The View Gallery button is the entry point to the room gallery. After the button was moved into FloatingMenu.jsx, its open/close toggle logic still lives outside the component, leaving the button wired to undefined variables. Consolidating the toggle logic into FloatingMenu makes the button functional and self-contained.

**Independent Test**: Press the View Gallery button and confirm the gallery overlay opens; press the gallery close control and confirm it closes.

**Acceptance Scenarios**:

1. **Given** a location with gallery images is displayed, **When** the visitor presses the View Gallery button in the floating menu, **Then** the room gallery overlay opens showing that location's images.
2. **Given** the gallery is open, **When** the visitor activates the gallery close control, **Then** the gallery overlay closes.

---

### Edge Cases

- The visitor presses View Gallery on a location with no gallery images.
- The visitor rapidly opens and closes the gallery.
- The gallery is open when the visitor changes location.

## Requirements *(mandatory)*

### Functional Requirements

**View Gallery toggle logic**

- **FR-001**: The "View gallery" button in FloatingMenu.jsx MUST open the room gallery when activated.
- **FR-002**: FloatingMenu.jsx MUST receive the gallery open state and an open/close toggle through its props so the View Gallery button is wired to defined controls, not undefined variables.
- **FR-003**: The gallery MUST remain open/close controllable from FloatingMenu using the same behaviour as the rest of the floating menu (Escape to close, backdrop click to close, focus return on close).
- **FR-004**: Panorama.jsx MUST no longer destructure or reference `galleryOpen` or `toggleGallery` from the tour context.
- **FR-005**: FloatingMenu.jsx MUST retain its existing narration controls (play/pause, mute, transcript, map) alongside the gallery.
- **FR-006**: All floating menu and gallery controls MUST be keyboard operable with visible focus states and accessible names/labels.
- **FR-007**: The gallery MUST work on both desktop and mobile viewports.
- **FR-008**: No new runtime dependencies MUST be introduced without the project's required approval.
- **FR-009**: Decorative borders in FloatingMenu.jsx MUST be removed and replaced with shadows (`shadow-gallery` on the gallery panel, `shadow-narration` on the narration section); functional borders (error-state accent borders and the play/pause focus-ring spacer border) MUST be preserved.
- **FR-010**: Existing gallery and narration automated tests MUST continue to pass.

### Key Entities *(include if feature involves data)*

- **Floating Menu**: The on-screen control surface hosting narration controls and the room gallery, including the View Gallery button.
- **View Gallery Button**: The button that opens the room gallery overlay from the floating menu.
- **Gallery Session**: The open state of the room gallery, toggled by the View Gallery button and the gallery close control.
- **Tour Context**: The shared state source that owns the gallery open/close state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The View Gallery button opens the room gallery in 100% of tested cases.
- **SC-002**: FloatingMenu.jsx's View Gallery button works without errors in 100% of tested cases.
- **SC-003**: Panorama.jsx no longer controls the gallery open/close state.
- **SC-004**: The gallery opens and closes via the View Gallery button and the gallery close control in 100% of tested cases.
- **SC-005**: All floating menu and gallery controls are keyboard operable with visible focus states in 100% of tested cases.
- **SC-006**: The gallery and floating menu remain usable at every supported viewport from mobile through desktop.
- **SC-007**: Existing gallery and narration automated tests pass with no regressions.

## Assumptions

- Layout continues to own the gallery open/close state via the tour context and passes it to FloatingMenu as props.
- The gallery continues to be triggered through the "View gallery" button in the floating menu.
- The gallery preserves its current modal overlay behaviour (backdrop, Escape close, focus management).
- The transfer introduces no backend or API changes and no new runtime dependencies.
- Mobile support is required.
- The project's existing test setup and frontend linting are used for verification.
