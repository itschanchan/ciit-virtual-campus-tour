# Feature Specification: Hide Header Logo When Sidebar Open

**Feature Branch**: 001-hide-logo-on-reveal

**Created**: 2026-11-06

**Status**: Draft

**Input**: The logo from @apps/frontend/src/components/Header.jsx should hide when the @apps/frontend/src/components/Sidebar.jsx is in revealed state.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hide Header Logo When Sidebar Open (Priority: P1) 🎯 MVP

**Goal**: As a user, I want the CIIT logo in the Header to automatically hide when the Sidebar is opened, so the interface remains clean and focused.

**Why this priority**: This change directly addresses user feedback about UI clutter and improves the visual hierarchy when navigating the campus tour.

**Independent Test**: Open the sidebar (e.g., click the toggle button), verify the logo is hidden; close the sidebar, verify the logo reappears. The test should be repeatable at desktop and mobile widths.

**Acceptance Scenarios**:
1. **Given** the sidebar is closed, **When** the user opens the sidebar, **Then** the Header logo is hidden.
2. **Given** the sidebar is open, **When** the user closes the sidebar, **Then** the Header logo is visible.

## Edge Cases
- Rapid toggling of the Sidebar may cause flickering; the logo should stabilize quickly.
- If the Sidebar is opened via keyboard navigation, the logo should still hide.
- The logo’s ARIA label and other accessibility attributes must remain unchanged regardless of visibility.

## Requirements *(mandatory)*

- **FR-001**: The Header logo must be hidden when the Sidebar is in the revealed (open) state.
- **FR-002**: The Header logo must be visible when the Sidebar is in the collapsed (closed) state.
- **FR-003**: The visibility change must be triggered automatically by the Sidebar’s open/close event.
- **FR-004**: The logo’s ARIA label and other accessibility attributes must remain unchanged regardless of visibility.

## Key Entities *(include if feature involves data)*
- **Header component**: Contains the logo element.
- **Sidebar component**: Controls the visibility state that influences the Header logo.
- **Logo element**: The CIIT logo image or text with `aria-label CIIT` .

## Success Criteria *(mandatory)*
- **SC-001**: 100% of Sidebar open actions result in the Header logo being hidden.
- **SC-002**: 100% of Sidebar close actions result in the Header logo being visible.
- **SC-002**: The visibility transition occurs instantly (no noticeable delay) after the Sidebar state change.
- **SC-004**: No layout shift occurs when the logo is hidden (page width remains stable).

## Assumptions
- The Sidebar component exposes a public event or method (e.g., `onOpen`/`onClose`) that the Header component can listen to.
- The Header component is capable of toggling the visibility of the logo based on the Sidebar state.
- No other component modifies the visibility of the logo independently of the Sidebar state.