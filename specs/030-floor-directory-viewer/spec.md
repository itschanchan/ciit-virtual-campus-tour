# Feature Specification: Floor Directory Viewer

**Feature Branch**: `[030-floor-directory-viewer]`

**Created**: 2026-11-25

**Status**: Draft

**Input**: User description: "Read and analyze docs/prompts/frontend-prompts/photo_viewer.md carefully, then apply the concepts to the floor directory button in apps/frontend/src/components/FloatingMenu.jsx which is the apps/frontend/public/img/glitch_directory.png attached in that dialog."

## Clarifications

### Session 2026-11-25

- Q: At the smallest zoom, how should the viewer handle the blank space around the fitted image and the edges when the visitor pans? → A: Letterbox at fit with the whole image centered on panel background; once zoomed in, panning clamps hard at the image edges with no blank gaps.
- Q: What should cap the maximum zoom so the directory stays legible without turning into oversized pixels? → A: Four times the fitted scale; zoom stops at that cap.
- Q: When the sidebar or the gallery takes over while the floor directory is open, what should happen to the directory? → A: The directory closes and resets its view, and focus returns to the map button.
- Q: How should the viewer tell the visitor its current zoom level? → A: A visible percentage beside the controls, 100% at fit up to 400% at the cap, with zoom buttons disabled at the limits and no live announcements during gestures.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the directory at a comfortable size (Priority: P1)

A campus visitor opens the floor directory from the floating menu, sees the whole directory image fitted inside the dialog, then zooms into the floors and rooms they care about and drags the image to reach any part of it. The image never disappears off-screen and the dialog never scrolls the page behind it.

**Why this priority**: The directory exists so visitors can read floor and room assignments. Fitting the image to the dialog makes it too small to read, so smooth, bounded zoom and pan is the core value; without it the dialog is just a picture.

**Independent Test**: Open the floor directory on any viewport, zoom in with a gesture or the zoom control, drag to a distant floor row, and confirm the row stays readable and reachable; then close the dialog and confirm the page is unchanged.

**Acceptance Scenarios**:

1. **Given** the visitor has opened the floor directory, **When** the dialog appears, **Then** the entire directory image is visible inside the dialog area and centered, with no part cropped.
2. **Given** the dialog is open at the fitted size, **When** the visitor zooms in, **Then** the image enlarges around the viewer's point of interest and the image is never dragged or zoomed completely out of the dialog.
3. **Given** the image is zoomed in, **When** the visitor drags or swipes across it, **Then** the visible region moves with the pointer and stops at the image edges instead of scrolling the page.
4. **Given** the image is zoomed in, **When** the visitor pans to an image edge, **Then** the view stops at that edge and no blank gap appears between the image and the dialog.
5. **Given** a zoomed or panned directory, **When** the visitor closes and reopens the directory, **Then** the viewer returns to the fitted, centered starting view.

---

### User Story 2 - Zoom with a mouse, trackpad, or touch screen (Priority: P1)

The same visitor uses whichever input their device offers: a scroll wheel or trackpad on a laptop, a two-finger pinch on a phone or tablet, a double click or double tap for a quick jump, or a single-finger drag to move around.

**Why this priority**: The tour is used on phones, tablets, and desktops. A viewer that only works with one input type fails a large share of visitors, so input coverage is part of the minimum viable feature rather than an enhancement.

**Independent Test**: On a desktop, zoom with the wheel over a specific room row and confirm that row stays under the cursor. On a touch device, pinch over a floor label and confirm the label stays under the fingers. Double click and double tap each toggle between the fitted view and a closer view.

**Acceptance Scenarios**:

1. **Given** a desktop viewport, **When** the visitor scrolls over the directory, **Then** the image zooms in or out around the cursor position and the page behind the dialog does not scroll.
2. **Given** a touch viewport, **When** the visitor pinches with two fingers, **Then** the image zooms continuously around the pinch point and the page does not scroll or bounce.
3. **Given** a touch viewport, **When** the visitor drags with one finger, **Then** the image pans instead of dismissing the dialog.
4. **Given** the fitted view, **When** the visitor double clicks or double taps the directory, **Then** the image zooms in toward that point; repeating the gesture returns to the fitted view.
5. **Given** a trackpad, **When** the visitor scrolls with two fingers, **Then** zoom behaves the same as a mouse wheel and does not trigger page scrolling.

---

### User Story 3 - Control the viewer without gestures (Priority: P1)

A visitor who prefers buttons, cannot perform precise gestures, or uses a keyboard can zoom in, zoom out, fit the image to the dialog, and reset the view using visible on-screen controls and standard keys.

**Why this priority**: The project's accessibility principle requires interactive controls to be keyboard operable and to show visible focus, so this cannot be deferred behind gesture support. Buttons and keyboard access also give every visitor a predictable way to recover when they are lost in a zoomed view.

**Independent Test**: Using only the keyboard, tab to the viewer controls, zoom in, pan with the arrow keys, reset, and close the dialog. Confirm every action is reachable, announced, and visually indicated.

**Acceptance Scenarios**:

1. **Given** the dialog is open, **When** the visitor activates zoom in or zoom out, **Then** the image scales in or out by a consistent step with a short animated transition and the visible zoom percentage updates.
2. **Given** a zoomed or panned image, **When** the visitor activates reset or fit, **Then** the image returns to the fitted, centered view.
3. **Given** keyboard focus is inside the dialog, **When** the visitor presses the arrow keys, **Then** the view pans in that direction; **When** they press plus or minus, **Then** the image zooms in or out; **When** they press zero, **Then** the view returns to the fitted state.
4. **Given** the zoom limits, **When** the visitor reaches the smallest or largest allowed scale, **Then** the corresponding control is visibly unavailable and further attempts do not change the view.
5. **Given** a keyboard user, **When** they tab through the dialog, **Then** focus stays inside the dialog, every control shows a visible focus indicator, and focus returns to the map button when the dialog closes.

---

### User Story 4 - Polished, comfortable movement (Priority: P3)

A visitor flicking the image on a phone or releasing a fast drag on a desktop sees the view glide briefly and settle smoothly instead of stopping abruptly. The same visitor with reduced-motion preferences sees instant, non-animated changes.

**Why this priority**: Inertia, eased transitions, and reduced-motion handling make the viewer feel like a photo viewer rather than a static image. They improve comfort and perceived quality but do not block reading the directory.

**Independent Test**: Flick the image on a touch device and confirm it glides and settles within the bounds; enable reduced-motion in the operating system and confirm zoom, pan, and reset changes happen without animation.

**Acceptance Scenarios**:

1. **Given** a fast drag or flick, **When** the pointer is released, **Then** the view continues briefly with decreasing speed and settles inside the image bounds.
2. **Given** reduced-motion is enabled, **When** the visitor zooms, resets, or fits the image, **Then** the change applies immediately with no animated transition.
3. **Given** the dialog is closing, **When** the close animation runs, **Then** any in-progress glide or zoom settles without leaving the dialog in a stuck state.

---

### Edge Cases

- The directory image fails to load or loads slowly: the dialog shows a clear unavailable message or a loading state and remains closable.
- The visitor rotates the device or resizes the window while zoomed: the viewer keeps the current region in view, re-applies bounds, and never strands the image off-screen.
- The visitor reaches the minimum scale (fitted view): further zoom-out is blocked, the image stays fitted and centered, and panning has no effect until the visitor zooms in.
- The visitor reaches the maximum scale: further zoom-in is blocked at four times the fitted view and the viewer stays stable at that limit.
- The visitor zooms while the open or close transition is running, or rapidly toggles the map button: the dialog ends in a consistent, interactive state.
- The visitor presses Escape, the close button, or the backdrop while zoomed or mid-glide: the dialog closes and focus returns to the map button.
- The sidebar or the gallery takes over while the directory is open: the directory closes, its view resets, focus returns to the map button, and only one overlay remains interactive.
- The visitor uses a screen reader: the viewer, zoom level, and controls expose meaningful names, roles, and state.
- JavaScript-driven page scroll must not occur while interacting with the viewer on any device.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present the floor directory image inside a modal dialog opened from the map button in the floating menu.
- **FR-002**: System MUST fit the whole directory image inside the dialog when it opens and center it, without cropping.
- **FR-003**: Users MUST be able to zoom the image in and out continuously between the fitted view and four times that scale.
- **FR-004**: Users MUST be able to pan the image by mouse drag, single-finger drag, or trackpad when zoomed in.
- **FR-005**: System MUST anchor wheel, trackpad, and pinch zoom on the pointer or pinch point so the content under the gesture stays in place.
- **FR-006**: System MUST show the whole image centered with panel background around it at the fitted scale, and once the visitor zooms beyond fit, MUST clamp panning exactly at the image edges so no blank gap appears; the image MUST NOT be lost off-screen at any zoom level.
- **FR-007**: System MUST provide visible zoom-in, zoom-out, reset, and fit-to-view controls with accessible names and visible focus states.
- **FR-008**: System MUST support keyboard interaction inside the dialog: arrow keys pan, the plus and minus keys zoom, and the zero key restores the fitted view.
- **FR-009**: System MUST support double click and double tap as a zoom toggle between the fitted view and a closer view.
- **FR-010**: System MUST apply eased animated transitions to programmatic zoom, pan, reset, and fit actions, and MUST suppress those animations when the visitor prefers reduced motion.
- **FR-011**: System MUST apply a short deceleration glide after a fast drag or flick and settle inside the image bounds.
- **FR-012**: System MUST show a visible zoom percentage beside the controls, reading 100% at the fitted view and 400% at the maximum, MUST disable zoom-in or zoom-out when that limit is reached, and MUST expose the percentage to assistive technology without live announcements during gestures.
- **FR-013**: System MUST close the dialog on the close control, Escape, or backdrop activation, return focus to the map button, and restore the fitted view on the next open.
- **FR-014**: System MUST prevent page scrolling, zooming, or pull-to-refresh while the visitor interacts with the viewer.
- **FR-015**: System MUST keep the dialog, image, and controls within the viewport on mobile, tablet, and desktop sizes and orientations without page scrolling.
- **FR-016**: System MUST show a clear unavailable or loading state when the directory image cannot be shown, and the dialog MUST remain closable.
- **FR-017**: System MUST keep focus inside the dialog while it is open and MUST NOT leave interactive elements of other overlays reachable.
- **FR-018**: System MUST expose the image with meaningful alternative text describing it as the campus floor directory.
- **FR-019**: System MUST close and reset the directory viewer when the sidebar or the gallery takes over, returning focus to the map button.

### Key Entities *(include if feature involves data)*

- **Floor directory image**: The campus directory graphic listing floors, room numbers, and destinations; the only content the viewer presents.
- **Viewer state**: The current zoom level, pan position, and whether a gesture, glide, or programmatic animation is in progress.
- **Viewer controls**: The set of on-screen and keyboard actions that change the viewer state (zoom in, zoom out, reset, fit, close).
- **Dialog**: The overlay that hosts the viewer, its controls, and its focus behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of visitors can locate a named room or floor in the directory within 20 seconds of opening the dialog.
- **SC-002**: Zoom and pan respond to input within 100 ms, and programmatic transitions settle within 600 ms.
- **SC-003**: In 100% of zoom, pan, resize, and rotate interactions the image remains inside the dialog, with blank space appearing only as expected letterboxing at the fitted scale.
- **SC-004**: 100% of viewer actions are reachable with a keyboard alone, with visible focus and controls whose names and disabled state are exposed to assistive technology.
- **SC-005**: The dialog, image, and controls fit without page scrolling at mobile, tablet, and desktop sizes in both portrait and landscape.
- **SC-006**: Visitors with reduced-motion enabled experience no animated zoom, pan, or reset transitions.
- **SC-007**: Interaction with the viewer never scrolls, zooms, or refreshes the page behind the dialog on any supported device.

## Assumptions

- The directory image at `apps/frontend/public/img/glitch_directory.png` remains the single content source for this viewer.
- The existing map button in the floating menu remains the entry point; the button's icon, label, and position are unchanged.
- The viewer replaces the current hand-rolled zoom and pan behavior in the directory dialog rather than adding a second, parallel implementation.
- The fitted view (the whole image visible in the dialog) is the minimum zoom level and the starting state on every open.
- The maximum zoom is four times the fitted view; this keeps the smallest room labels comfortably legible without turning the image into oversized pixels.
- Double click and double tap toggle between the fitted view and a moderate close-up rather than stepping indefinitely.
- The floating menu's narration controls, the gallery dialog, and the sidebar are separate features and are out of scope except where they interact with the directory dialog.
- Responsive breakpoints and reduced-motion preferences already exist in the application and are reused rather than redefined.
- The project already declares the zoom and pan viewer capability it needs; no new dependency is required for this feature. If planning concludes otherwise, maintainer approval is required before installation.
- Portrait and landscape orientations are both supported, and touch devices support multi-touch gestures.
