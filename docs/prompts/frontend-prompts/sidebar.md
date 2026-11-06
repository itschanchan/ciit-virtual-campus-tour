# Feature Specification: Sidebar

**Feature Branch**: `[###-feature/Sidebar]`

**Created**: [November 05, 2026]

**Status**: Draft

**Input**: User description: "This is the sidebar for the CIIT Virtual Campus Tour UI."

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Collapsible Sidebar React-Tailwind First] (Priority: P1)

The collapsible Sidebar shall be created in a React component with Tailwind CSS for modern visuals and seamless animations.

**Why this priority**: This should be prioritized because it is the main foundational of the component.

**Independent Test**: Use vitesting in testing each floor buttons included in the Sidebar menu.

**Acceptance Scenarios**:

1. **Given** [The sidebar has a reveal and collapse button on the middle edge with Material UI Icon], **When** [Displays a left chevon button when collapsed], **Then** [Displays a right chevron when revealed]
2. **Given** [The sidebar have a smooth animation during collapsing and revealing states], **When** [The collapse/reveal button is clicked], **Then** [Trigger the smooth animation during collapsing and revealing]

---

### User Story 2 - [Sidebar button placement] (Priority: P2)

[The arrangement of buttons of each floor should be strictly followed in accordance to the sorting of buttons in the sidebar menu.]

**Why this priority**: [This is a high priority because it displays the buttons in the sidebar menu and display each floors that renders the 360 panoramic viewer.]

**Independent Test**: Use vitest for testing each floor buttons and if it correctly triggers the right panoramic viewer.

**Acceptance Scenarios**:

1. **Given** [The sidebar menu buttons are displayed in descending order which follows along the real flooring of the CIIT Glitch Tower Campus], **When** [Sidebar is revealed], **Then** [Display UG, LG, 1F, 2F, 3F, 4F, 5F, 5M, 6F, 7F, 8F, 9F, 10F, 11F with UG in the bottom and 11F on top]
2. **Given** [Lock the specific buttons], **When** [1F, 2F, 3F, 10F, 11F is clicked], **Then** [A shake animation and a React MUI popover that says "coming soon" will trigger]
3. **Given** [Buttons in sidebar collapsed state], **When** [The sidebar is collapsed], **Then** [Do not display the buttons]

---

### User Story 3 - [School Logo] (Priority: P3)

[Displays the school logo in the top of the Sidebar menu]

**Why this priority**: [This is medium priority and this US3 only implemented once the ciit_logo.png is in the assets folder.]

**Independent Test**: Use the vitest to test if ciit_logo.png file is already there in the sidebar menu in reveal state.

**Acceptance Scenarios**:

1. **Given** [Display CIIT logo with "360 Virtual Campus Tour" text below the image], **When** [When sidebar menu is revealed], **Then** [The CIIT logo is displayed and "360 Virtual Campus Tour" text below the image]

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.

  - What happens when [boundary condition]?
  - How does system handle [error scenario]?
-->

- What happens when there are still not yet available panoramic photos in public/panoramas folder?
  The panoramic viewer will not display and render the panoramic images, unless there will be contents inside the folder mentioned.

- How does system handle [error scenario]?
  Display a placeholder that says "no panoramic image preview available." in the panoramic viewer.

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST allow users to navigate across CIIT Virtual Campus tour with clicking the floor buttons indicated in the collapsible sidebar menu.
- **FR-002**: System MUST validate if the panoramic images are available in public/panoramas folder.
- **FR-003**: Users MUST be able to switch locations with buttons in the UI.
- **FR-004**: System MUST persist the current state of the floor once the user visits the webpage using web cookies.

<!-- _Example of marking unclear requirements:_

- **FR-005**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified] -->

### Key Entities _(include if feature involves data)_

- **[Entity 1]**: [Floor Name, names of the campus floor (e.g., LG, UG, 1F,...)]

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: The Sidebar menu renders smoothly from 2 seconds or less.
- **SC-002**: This features does not consume too much web cookie memory for persistence (less than 50 bytes of data)
- **SC-003**: The Sidebar menu shall display in revealed in the first time visit.

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- The sidebar menu can still be fast and usable even if the network is slow.
- Mobile support will be included soon.
