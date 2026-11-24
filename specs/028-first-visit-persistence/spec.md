# Feature Specification: first-visit-persistence

**Feature Branch**: `[028-first-visit-persistence]`

**Created**: 2026-11-18

**Status**: Draft

**Input**: User description: "Website persistence: Make the @apps/frontend/src/components/WelcomeScreen.jsx and @apps/frontend/src/components/InstructionsScreen.jsx appear only at the first visit of the webpage (persistence). It will only appear again once the user clears cache or cleared his/her data in their browser. Make sure that the welcome and instructions screens are also web responsive to mobile and tablet viewports without scrolling approach on its components."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-time visitor sees welcome and instructions before entering the tour (Priority: P1)

A first-time visitor opens the webpage and sees the welcome screen, then the instructions screen, and only then enters the virtual tour. On the next visit, the visitor skips both screens and enters the tour directly.

**Why this priority**: The core promise of the feature is that the introduction screens appear once per visitor, so verifying the first-time and returning-visitor flows is the highest priority.

**Independent Test**: Open the webpage as a first-time visitor and confirm the welcome screen appears, followed by the instructions screen, then the tour. Reopen the webpage and confirm both screens are skipped and the tour appears directly.

**Acceptance Scenarios**:

1. **Given** a first-time visitor opens the webpage, **When** the page loads, **Then** the welcome screen appears.
2. **Given** the welcome screen is displayed, **When** the visitor starts the tour, **Then** the instructions screen appears.
3. **Given** the instructions screen is completed, **When** the visitor continues, **Then** the virtual tour appears.
4. **Given** a returning visitor opens the webpage, **When** the page loads, **Then** the welcome and instructions screens do not appear and the virtual tour appears directly.

### User Story 2 - Welcome and instructions screens fit mobile and tablet viewports without scrolling (Priority: P1)

A visitor opens the webpage on a mobile phone or tablet. The welcome screen and instructions screen content all fit within the screen without vertical or horizontal scrolling, and every button or tappable area remains reachable without scrolling.

**Why this priority**: Mobile and tablet are the most constrained viewports; if the introduction screens fit without scrolling there, the responsive requirement is proven across all supported devices.

**Independent Test**: Open the welcome screen and instructions screen on a mobile-size and tablet-size viewport and confirm all content and interactive elements fit within the screen without scrolling.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the welcome screen appears, **Then** all welcome screen content fits within the screen without vertical or horizontal scrolling.
2. **Given** a mobile viewport, **When** the instructions screen appears, **Then** all instructions screen content fits within the screen without vertical or horizontal scrolling.
3. **Given** a tablet viewport, **When** the welcome screen appears, **Then** all welcome screen content fits within the screen without vertical or horizontal scrolling.
4. **Given** a tablet viewport, **When** the instructions screen appears, **Then** all instructions screen content fits within the screen without vertical or horizontal scrolling.
5. **Given** a mobile or tablet viewport, **When** either introduction screen is displayed, **Then** every button or tappable area is reachable without scrolling.

### User Story 3 - Introduction screens reappear after browser data is cleared (Priority: P2)

A visitor who previously completed the introduction clears their browser cache or site data and reopens the webpage. The welcome screen and instructions screen appear again as if it were the first visit.

**Why this priority**: The persistence rule states the screens reappear only after browser data is cleared, so this verifies the boundary of the persistence behavior.

**Independent Test**: Complete the introduction flow, clear the browser cache or site data, reopen the webpage, and confirm the welcome and instructions screens appear again.

**Acceptance Scenarios**:

1. **Given** a visitor has previously completed the introduction, **When** the visitor clears browser cache or site data and reopens the webpage, **Then** the welcome screen appears again.
2. **Given** the welcome screen reappears after data is cleared, **When** the visitor starts the tour, **Then** the instructions screen appears again.

### Edge Cases

- What happens when the visitor closes the tab after the welcome screen but before the instructions screen?
- What happens when the visitor rotates the device between portrait and landscape while an introduction screen is open?
- What happens when the visitor resizes the browser window while an introduction screen is open?
- What happens when browser storage is unavailable or blocked?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the welcome screen to a visitor on their first visit to the webpage.
- **FR-002**: System MUST display the instructions screen after the welcome screen is completed on the first visit.
- **FR-003**: System MUST NOT display the welcome screen or instructions screen on subsequent visits until the visitor clears browser cache or site data.
- **FR-004**: System MUST display the welcome screen and instructions screen again on the next visit after the visitor clears browser cache or site data.
- **FR-005**: System MUST fit all welcome screen content within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop viewports.
- **FR-006**: System MUST fit all instructions screen content within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop viewports.
- **FR-007**: System MUST keep every button or tappable area on the welcome and instructions screens reachable without scrolling on mobile and tablet viewports.

### Key Entities *(include if feature involves data)*

- **Welcome screen**: The introductory screen shown to a visitor on their first visit to the webpage.
- **Instructions screen**: The orientation screen shown after the welcome screen on a first visit, explaining how to explore the tour.
- **Returning visitor**: A visitor who has previously seen the introduction screens and should enter the tour directly.
- **Browser data**: Stored browser information that remembers a visitor has seen the introduction; clearing it resets the first-visit state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of first-time visitors see both the welcome screen and instructions screen before entering the virtual tour.
- **SC-002**: 100% of returning visitors enter the virtual tour directly without seeing the welcome screen or instructions screen.
- **SC-003**: All welcome and instructions screen content fits within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop viewports.
- **SC-004**: Every button or tappable area on the welcome and instructions screens remains reachable without scrolling on mobile and tablet viewports.
- **SC-005**: After clearing browser cache or site data, the welcome screen and instructions screen reappear on the next visit.

## Assumptions

- The visitor's first-visit state is remembered by the browser and reset when the visitor clears browser cache or site data.
- Completing the instructions screen and entering the tour counts as having seen the introduction.
- There is no separate option to re-show the introduction outside of clearing browser data.
- Mobile and tablet viewports include both portrait and landscape orientations.
- Browser storage behavior is consistent with standard site-data clearing.
