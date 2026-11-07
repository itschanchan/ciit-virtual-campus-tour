# Feature Specification: Fix Sidebar Buttons

**Feature Branch**: `008-fix-sidebar-buttons`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Sidebar buttons with available tiles are unclickable — fix floor-to-location mapping so available panorama tiles are clickable"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Click an available floor button to view its panorama tile (Priority: P1)

A visitor browsing the virtual campus tour clicks a sidebar floor button for a floor that has an available panorama tile. The viewer switches to that floor's panorama scene so the visitor can explore the campus scenery.

**Why this priority**: This is the core navigation behavior of the tour. If floor buttons with available tiles cannot be clicked, visitors cannot access the panoramic content, making the tour unusable for its primary purpose.

**Independent Test**: Open the tour, identify a floor button that has an available panorama tile, click it, and confirm the viewer switches to that floor's panorama scene.

**Acceptance Scenarios**:

1. **Given** the tour loads with floor buttons displayed in the sidebar, **When** the visitor clicks a floor button that has an available panorama tile, **Then** the viewer switches to that floor's panorama scene.
2. **Given** a floor button corresponds to a floor with an available tile, **When** the visitor clicks it, **Then** the button is not disabled and responds to the click.

---

### User Story 2 - Identify unavailable floors without being able to click them (Priority: P2)

A visitor can see which floors do not have available panorama tiles because those buttons are visually distinct and do not respond to clicks, preventing confusion about why a click produces no result.

**Why this priority**: Visitors need to understand why some floor buttons do not work, rather than wondering if the tour is broken.

**Independent Test**: Open the tour, identify a floor button that does not have an available panorama tile, confirm it is visually marked as unavailable and does not switch the viewer when clicked.

**Acceptance Scenarios**:

1. **Given** a floor button corresponds to a floor without an available panorama tile, **When** the visitor views the sidebar, **Then** the button is visually marked as unavailable.
2. **Given** a floor button is marked unavailable, **When** the visitor clicks it, **Then** the viewer does not switch to a different scene.

---

### Edge Cases

- A floor has a location entry but no panorama data assigned to it.
- The locations list contains fewer floors than the full floor sequence, breaking position-based alignment.
- All floors have available tiles; every button is clickable.
- No floors have available tiles; all buttons are unavailable.
- A visitor rapidly clicks multiple floor buttons in sequence.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A sidebar floor button for a floor with an available panorama tile MUST be clickable.
- **FR-002**: Clicking a clickable sidebar floor button MUST switch the panorama viewer to that floor's designated panorama scene.
- **FR-003**: A sidebar floor button for a floor without an available panorama tile MUST NOT be clickable.
- **FR-004**: A sidebar floor button for a floor without an available panorama tile MUST be visually distinguished from clickable buttons.
- **FR-005**: Floor buttons MUST be matched to their corresponding location data by floor label, not by position in a list.

### Key Entities

- **Floor button**: A clickable button in the sidebar representing a campus floor.
- **Available panorama tile**: Panorama scene data assigned to a floor that can be displayed in the viewer.
- **Floor-to-location mapping**: The association between a floor label and its corresponding location data with panorama information.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of sidebar floor buttons with available panorama tiles are clickable and switch the viewer to the correct scene.
- **SC-002**: 0% of sidebar floor buttons without available panorama tiles are clickable.
- **SC-003**: Visitors can distinguish clickable floor buttons from unavailable ones at a glance.
- **SC-004**: Floor-to-scene switching completes without errors for every clickable floor button.

## Assumptions

- Each floor label in the sidebar has at most one corresponding location entry.
- Location data includes an indicator of whether a panorama tile is available for that floor.
- The panorama viewer can switch scenes when given a floor's designated scene identifier.
- All floors in the floor sequence may not have corresponding location entries; only floors with available tiles are expected to be clickable.
