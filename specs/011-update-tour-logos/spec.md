# Feature Specification: Update Sidebar and Header Tour Logos

**Feature Branch**: `011-update-tour-logos`

**Created**: 2026-11-07

**Status**: Draft

**Input**: User description: "I wanted to use @apps/frontend/public/img/ciit_glitch_virtual_tour_logo.png as the @apps/frontend/src/components/Sidebar.jsx logo, and @apps/frontend/public/img/CIIT_Logo_Inverse_cropped.svg for the header logo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the campus tour brand logo in the sidebar (Priority: P1)

A visitor opens the campus floor sidebar and sees the CIIT glitch virtual tour logo image displayed at the top of the sidebar, in place of the current text-only "CIIT" mark. The logo is accompanied by the "360° Virtual Campus Tour" subtitle below it.

**Why this priority**: The sidebar is the primary navigation surface of the tour; showing the branded tour logo there reinforces the CIIT virtual tour identity as soon as the visitor opens the menu.

**Independent Test**: Open the sidebar and confirm the glitch virtual tour logo image appears at the top of the sidebar instead of a text-only mark; confirm the subtitle text remains below it.

**Acceptance Scenarios**:

1. **Given** the sidebar is opened, **When** the sidebar header area is inspected, **Then** the CIIT glitch virtual tour logo image is displayed at the top of the sidebar.
2. **Given** the sidebar logo image cannot load, **When** the sidebar is opened, **Then** descriptive alt text or a fallback keeps the brand identifiable.

---

### User Story 2 - See the CIIT brand logo in the header (Priority: P1)

A visitor views the virtual campus tour and sees the CIIT Logo Inverse cropped SVG image in the header at the top of the viewer, in place of the current text-only "CIIT" mark. The header retains the "Virtual Campus Tour" title text and the current location name alongside the logo.

**Why this priority**: The header is always visible at the top of the viewer; displaying the CIIT brand mark there strengthens brand presence throughout the tour experience.

**Independent Test**: Open the tour and confirm the CIIT Logo Inverse cropped SVG image appears in the header instead of a text-only mark; confirm the title and current location remain visible.

**Acceptance Scenarios**:

1. **Given** the tour loads with the sidebar closed, **When** the header is inspected, **Then** the CIIT Logo Inverse cropped SVG image is displayed as the header logo.
2. **Given** the sidebar is open and the header mark is hidden, **When** the sidebar is closed, **Then** the header logo image is visible.

---

### Edge Cases

- The sidebar is collapsed, so the sidebar logo is hidden with the rest of the sidebar content.
- The header logo is hidden when the sidebar is open (consistent with existing header mark visibility behaviour).
- A logo image file is missing or fails to load; alt text or a fallback keeps the brand identifiable.
- The header logo renders correctly on both desktop and narrow mobile viewports.
- The sidebar logo renders correctly in both the expanded desktop sidebar and the compact overlay.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The campus floor sidebar MUST display the CIIT glitch virtual tour logo image at the top of the sidebar, in place of any text-only logo mark.
- **FR-002**: The sidebar logo MUST be accompanied by the "360° Virtual Campus Tour" subtitle text below it.
- **FR-003**: The tour header MUST display the CIIT Logo Inverse cropped SVG image as the header logo, in place of the text-only "CIIT" mark.
- **FR-004**: The header MUST retain the "Virtual Campus Tour" title text and the current location name alongside the header logo.
- **FR-005**: The sidebar logo MUST be hidden when the sidebar is collapsed and shown when the sidebar is expanded, consistent with existing sidebar collapse behaviour.
- **FR-006**: The header logo MUST be hidden when the sidebar is open and shown when the sidebar is closed, consistent with existing header mark visibility behaviour.
- **FR-007**: Both logos MUST render correctly on desktop and narrow mobile viewports without layout breakage.
- **FR-008**: Each logo image MUST have descriptive alt text so assistive technology can identify the brand when the image is present or fails to load.

### Key Entities

- **Sidebar logo**: The brand image shown at the top of the campus floor sidebar.
- **Header logo**: The brand image shown in the top header of the virtual campus tour viewer.
- **Logo fallback**: The alt text or fallback shown when a logo image cannot be loaded.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of expanded sidebar views display the CIIT glitch virtual tour logo image at the top of the sidebar.
- **SC-002**: 100% of tour header views with the sidebar closed display the CIIT Logo Inverse cropped SVG image as the header logo.
- **SC-003**: Both logos display without layout breakage on desktop and narrow mobile viewports.
- **SC-004**: Both logo images include descriptive alt text announced by assistive technology.

## Assumptions

- The sidebar `logoUrl` prop mechanism already exists in `Sidebar.jsx` and only needs to be supplied with the glitch virtual tour logo image.
- The header currently uses a text-only "CIIT" mark that is replaced by the SVG image.
- No new tour content, data, or external dependencies are required.
- The existing header visibility behaviour (mark hidden when sidebar is open) applies to the new header logo image.
