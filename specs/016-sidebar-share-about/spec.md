# Feature Specification: Sidebar Share, About, Website Link, and Footer Layout

**Feature Branch**: `016-sidebar-share-about`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "In apps/frontend/src/components/Sidebar.jsx, format the miscellaneous <div> row below the floor buttons. The row should be formatted as centered. The link should be functional, the share button should have a modal to copy link, share to Facebook, Messenger, X, Discord, etc. For the about button, a modal will appear that contains about the virtual campus tour and credits. Fix the position of the 'All rights reserved 2026' text on the bottom of the sidebar."

## Clarifications

### Session 2026-11-10

- Q: How should the dialogs be dismissed besides the visible close control and the Escape key? → A: Clicking outside the dialog on its backdrop closes the dialog.
- Q: Which component and icon system should the dialogs and their actions use? → A: The project's existing Material components and Material icons, with no new UI dependency.
- Q: How should the Share and About dialogs size and scroll on narrow mobile screens? → A: Full-width up to a comfortable desktop maximum (Material `fullWidth` with `maxWidth="sm"`), with scrollable content and the close control kept outside the scroll area.
- Q: Where should the sidebar close button live when the sidebar body scrolls? → A: Absolutely positioned at the top-left of the non-scrolling sidebar shell, with body padding so content never sits behind it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Share the tour with others (Priority: P1)

A visitor exploring the virtual campus tour wants to send the tour to a friend, classmate, or social community. From the sidebar, the visitor selects Share, receives a dialog containing the current tour link, and chooses to copy the link or open a supported sharing destination. The recipient can then open the same tour.

**Why this priority**: Sharing is the main new capability requested and directly extends the tour's reach to prospective students and guests. It delivers full value on its own.

**Independent Test**: Open the sidebar, select Share, copy the tour link, and confirm the clipboard contains the current tour address. Reopen the dialog and confirm that each sharing destination is available and launches with the tour link attached.

**Acceptance Scenarios**:

1. **Given** the sidebar is open, **When** the visitor selects Share, **Then** a share dialog appears showing the current tour link.
2. **Given** the share dialog is open, **When** the visitor selects Copy link, **Then** the current tour link is copied and a visible confirmation appears.
3. **Given** the share dialog is open, **When** the visitor selects Facebook or X, **Then** that sharing destination opens in a new tab with the tour link attached.
4. **Given** the share dialog is open, **When** the visitor selects Messenger or Discord, **Then** the tour link is copied, the destination opens, and a notice explains that the copied link should be pasted there.
5. **Given** the share dialog is open, **When** the visitor selects WhatsApp or Email, **Then** the corresponding sharing flow opens with the tour link and a short tour message attached.
6. **Given** the share dialog is open on a device that supports the system share sheet, **When** the visitor selects More options, **Then** the system share sheet opens with the tour link.
7. **Given** the share dialog is open, **When** the visitor closes it by the close control, the Escape key, or by clicking outside the dialog, **Then** the dialog closes and the sidebar remains open.

---

### User Story 2 - Learn about the tour and its credits (Priority: P2)

A visitor wants to understand what the virtual campus tour is and who made it. From the sidebar, the visitor selects About and reads a short explanation of the tour plus a credits section.

**Why this priority**: The About content builds trust and gives appropriate recognition, but the tour remains usable without it.

**Independent Test**: Open the sidebar, select About, and confirm the dialog shows a tour description, a credits section with multiple entries, and a working link to the official CIIT website.

**Acceptance Scenarios**:

1. **Given** the sidebar is open, **When** the visitor selects About, **Then** an About dialog appears.
2. **Given** the About dialog is open, **Then** it explains the purpose and scope of the virtual campus tour.
3. **Given** the About dialog is open, **Then** it lists credits covering the presenting institution, tour content and narration, the technology acknowledgement, and thanks to the CIIT community.
4. **Given** the About dialog is open, **When** the visitor selects the CIIT website reference, **Then** the official CIIT website opens in a new tab.
5. **Given** the About dialog is open, **When** the visitor closes it by the close control, the Escape key, or by clicking outside the dialog, **Then** the dialog closes and the sidebar remains open.

---

### User Story 3 - Reach the official CIIT website (Priority: P2)

A visitor wants to learn more about CIIT beyond the tour. From the sidebar, the visitor selects the CIIT website action and the official CIIT website opens in a new tab.

**Why this priority**: The current website action does not work at all, so fixing it is important, but it is a single, small capability compared with sharing.

**Independent Test**: Open the sidebar and select the CIIT website action. Confirm the official CIIT website opens in a new browser tab.

**Acceptance Scenarios**:

1. **Given** the sidebar is open, **When** the visitor selects the CIIT website action, **Then** `https://www.ciit.edu.ph/` opens in a new browser tab.
2. **Given** the sidebar is open, **Then** the CIIT website action is reachable and activatable with a keyboard.
3. **Given** the visitor hovers or focuses the CIIT website action, **Then** the action shows a clear interactive state consistent with the other sidebar actions.

---

### User Story 4 - Use a tidy, stable sidebar footer and action row (Priority: P3)

A visitor opens the sidebar on a phone, tablet, or desktop. The website, share, and about actions are centered below the floor buttons instead of clinging to one edge. The copyright line stays fixed at the bottom of the sidebar even while the floor list scrolls.

**Why this priority**: These are presentation refinements that improve clarity and polish. They do not add new capabilities, but they make the new actions discoverable and the sidebar feel finished.

**Independent Test**: Scroll the floor list at desktop and mobile widths and confirm the copyright line remains visible at the bottom of the sidebar. Confirm the three actions are centered and wrap without overflow on a narrow screen.

**Acceptance Scenarios**:

1. **Given** the sidebar is open, **Then** the website, share, and about actions appear as a single centered row below the floor buttons.
2. **Given** a narrow viewport, **When** the action row cannot fit on one line, **Then** its actions wrap while remaining centered and without causing horizontal scrolling.
3. **Given** the floor list is longer than the available sidebar height, **When** the visitor scrolls the floor list, **Then** the copyright line remains visible at the bottom of the sidebar.
4. **Given** any supported viewport, **Then** the copyright line is fully visible and not clipped by the sidebar edge.
5. **Given** the visitor uses the sidebar normally, **Then** floor selection, locked-floor notices, and the open/close toggle continue to behave as before.

---

### Edge Cases

- The browser denies or does not support automatic copying; the visitor still receives a clear notice and can select the displayed link manually.
- The browser does not support the system share sheet; the More options action is hidden rather than shown as a broken control.
- The visitor opens Share or About at 320 pixels wide; the dialog stays fully within the viewport, keeps its close control visible, scrolls its content when tall, and returns the visitor to the sidebar when closed.
- The visitor opens a dialog on a short landscape viewport (for example 667×375); the dialog remains within the viewport and scrolls its content instead of clipping the close control.
- The visitor scrolls a long floor list on a narrow viewport; the sidebar close control stays visible and unobstructed while the body scrolls.
- The sidebar is closed while a dialog is open; the dialog closes with the sidebar so no dialog is left over an inactive surface.
- The page address contains query parameters or a fragment; the full current address is the link that gets shared.
- The visitor opens the share dialog repeatedly; the confirmation state resets each time rather than appearing already completed.
- The visitor uses reduced-motion preferences; dialogs and feedback do not depend on animation to be understandable.
- The visitor uses only a keyboard; every action and dialog control is reachable, dialogs keep focus inside while open, and focus returns sensibly when they close.
- The visitor opens a locked-floor notice and then opens Share or About; the locked-floor notice does not obstruct or break the dialog.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The website, share, and about actions MUST be presented as one centered row below the floor buttons.
- **FR-002**: The action row MUST wrap on narrow viewports without creating horizontal scrolling or clipping.
- **FR-003**: The CIIT website action MUST open `https://www.ciit.edu.ph/` in a new browser tab.
- **FR-004**: The CIIT website action MUST be an operable link with a clear accessible name.
- **FR-005**: Selecting Share MUST open a share dialog without closing the sidebar.
- **FR-006**: The share dialog MUST display the current tour address.
- **FR-007**: The share dialog MUST provide a Copy link action that copies the current tour address and shows a visible success confirmation.
- **FR-008**: The share dialog MUST provide Facebook sharing that opens the destination with the current tour address attached.
- **FR-009**: The share dialog MUST provide X sharing that opens the destination with the current tour address attached.
- **FR-010**: The share dialog MUST provide Messenger and Discord actions that copy the tour address, open the destination, and explain that the link should be pasted there.
- **FR-011**: The share dialog MUST provide WhatsApp and Email sharing that open the corresponding flow with the tour address and a short tour message.
- **FR-012**: The share dialog MUST offer a system share option when the device supports it, and MUST omit that option when it does not.
- **FR-013**: All sharing destinations MUST open in a new context so the tour remains available in the original tab.
- **FR-014**: Selecting About MUST open an About dialog without closing the sidebar.
- **FR-015**: The About dialog MUST describe the purpose and scope of the virtual campus tour.
- **FR-016**: The About dialog MUST include a credits section covering the presenting institution, tour content and narration, the technology acknowledgement, and thanks to the CIIT community.
- **FR-017**: The About dialog MUST include a reference to the official CIIT website that opens in a new tab.
- **FR-018**: The share and about dialogs MUST be dismissible by a visible close control, the Escape key, and a click outside the dialog on its backdrop.
- **FR-019**: Closing the sidebar MUST also close any open share or about dialog.
- **FR-020**: The copyright line MUST read "© 2026 CIIT. All rights reserved." and remain pinned to the bottom of the sidebar while the floor list scrolls independently.
- **FR-021**: The copyright line MUST remain fully visible and unclipped at every supported mobile, tablet, and desktop width.
- **FR-022**: All new actions and dialog controls MUST be keyboard operable with visible focus indication, and focus MUST return to the triggering action when a dialog closes.
- **FR-023**: Existing floor selection, locked-floor notices, scene switching, and sidebar open/close behavior MUST remain unchanged.
- **FR-024**: The share and about dialogs MUST fit fully within the viewport at 320 pixels wide and above, MUST keep the close control visible, and MUST scroll their content when it exceeds the available height.
- **FR-025**: On viewports where the sidebar shows its own close control, that control MUST remain visible and operable while the floor list and action row scroll, and MUST NOT overlap the scrolling content.

### Key Entities

- **Sidebar action row**: The centered set of website, share, and about actions below the floor buttons.
- **Share dialog**: The surface that presents the current tour link, copy action, and sharing destinations.
- **About dialog**: The surface that presents the tour overview, credits, and CIIT website reference.
- **Tour link**: The complete current page address that visitors share.
- **Credits**: The attribution entries for the institution, tour content and narration, technology, and community.
- **Sidebar footer**: The pinned area at the bottom of the sidebar that displays the copyright line.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Share activations open the share dialog with the current tour address displayed.
- **SC-002**: 100% of Copy link activations produce a visible success confirmation within 1 second when the browser permits copying.
- **SC-003**: The share dialog offers at least six sharing choices: Copy link, Facebook, X, Messenger, Discord, and one of WhatsApp or Email, with the system share option shown when supported.
- **SC-004**: 100% of CIIT website activations open the official site in a new tab.
- **SC-005**: The About dialog contains a tour description, at least four credit entries, and a working CIIT website reference.
- **SC-006**: The copyright line stays visible at the bottom of the sidebar through 100% of floor-list scroll positions on mobile, tablet, and desktop.
- **SC-007**: The sidebar produces no horizontal scrolling at widths from 320 pixels upward.
- **SC-008**: 100% of new controls are operable by keyboard alone, and every dialog can be dismissed without a pointer.
- **SC-009**: All pre-existing sidebar behavior checks continue to pass without modification to their expected outcomes.
- **SC-010**: At 320 pixels wide, tablet width, desktop width, and a short landscape viewport, 100% of Share and About dialog openings keep the dialog within the viewport, the close control visible, and all content reachable by scrolling.
- **SC-011**: At every supported viewport height, 100% of sidebar scroll positions keep the narrow-viewport close control visible and unobstructed.

## Assumptions

- The "current tour link" is the complete address of the page the visitor is currently viewing, including any query parameters or fragment.
- Website and sharing destinations open in a new tab so the tour session is preserved.
- Messenger and Discord do not offer a dependable link-only sharing entry point, so their actions copy the link, open the platform, and explain the next step; no third-party application registration is required.
- Facebook and X provide direct sharing entry points that accept the tour address.
- WhatsApp and Email are included as the additional "etc." destinations because they require no account registration or application review.
- The system share option is an enhancement available only on supporting devices.
- When automatic copying is unavailable, the dialog still displays the link so the visitor can copy it manually.
- The About credits use drafted, general wording that presents CIIT, credits the tour content and narration to CIIT, acknowledges the technology used, and thanks the CIIT community; the wording can be refined later without changing behavior.
- The footer text is standardized as "© 2026 CIIT. All rights reserved." while preserving the requested copyright meaning.
- No backend service, account, or stored data is required for this feature.
- Dialog surfaces and action icons reuse the project's existing component and icon library, so no new UI dependency is introduced.
- Dialogs use a fluid width capped at a comfortable desktop maximum rather than a fixed width, so narrow viewports keep edge margins and desktop keeps a readable card size.
- Existing sidebar floor behavior, compact/narrow layout rules, and design tokens remain the baseline.
