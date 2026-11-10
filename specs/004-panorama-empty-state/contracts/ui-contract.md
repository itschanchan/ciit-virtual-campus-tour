# UI Contract: Panorama Empty State Message

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data Model**: [data-model.md](../data-model.md)

This contract defines how the missing-panorama message behaves across the viewer, the campus floor list, and the surrounding layout.

## Message Contract

- The canonical text is exactly `No panorama available yet.`
- The message belongs to the panorama viewer.
- The message appears when no location is selected or the selected location has no panorama.
- The message is announced as an alert.
- The message is never rendered inside a floor-list entry.

## Viewer Contract

- The viewer renders the message in a centered panel over the viewing area.
- The panel includes a visible heading and the canonical message text.
- The panel remains visible while the floor list is open or collapsed.
- The panel remains readable at 320 CSS pixels and upward without horizontal scrolling.
- The message disappears when a location with a valid panorama is displayed.
- A scene-creation failure keeps the existing load-error feedback rather than the missing-panorama message.
- The viewer does not create a scene when the selected location has no panorama.

## Floor List Contract

- No floor entry displays "No panorama available yet."
- A locked floor remains selectable and, when activated, triggers the delayed coming-soon popover.
- A floor whose location exists without a panorama keeps the location-unavailable feedback.
- A floor with no location remains disabled and shows only its floor identity.
- Selecting a location with a panorama still switches the viewer and closes the list on compact viewports.

## Coming-Soon Popover Contract

- The popover belongs to the sidebar and anchors to the most recently activated locked-floor button.
- The popover becomes visible 1500 ms after activation, inside the required 1-2 second window, on desktop and compact viewports.
- Only one popover may be pending or visible. A new locked-floor activation before the popover appears restarts the delay and updates the floor and anchor.
- If the popover is already visible, a new locked-floor activation updates its content and anchor immediately without a new delay.
- A visible popover remains open until the visitor clicks outside it or presses Escape. It never closes on a timer.
- Closing the sidebar cancels a pending delay and closes a visible popover.
- Floors that are not locked, including floors whose location lacks a panorama, never trigger the popover.
- Every locked-floor activation acknowledges immediately before the delay: the existing shake when motion is allowed, or a border and background change when reduced motion is preferred.
- The popover copy identifies the most recently activated floor.

## Layout Contract

- The viewer is mounted whenever tour content is ready, including when no location is selected.
- Gallery and narration controls are rendered only when a location is selected.
- The message must not block the header, the floor-list toggle, or the skip link.
- The message must not introduce a new global overlay or modal.

## Accessibility Contract

- The message is exposed to assistive technology as an alert.
- The message text is available without opening the floor list.
- The message does not rely on color alone.
- The coming-soon popover keeps its polite status semantics and does not trap focus.
- Every locked-floor activation produces immediate visual acknowledgement, including for reduced-motion visitors.
- Focus order and keyboard operation of the floor list, gallery, and narration controls are unchanged.
- Reduced-motion preferences are respected: the shake is replaced by a non-motion border and background change, and the popover timing is unchanged.

## Responsive Contract

- The message is verified at 1440x900, 1024x768, 700x800, 560x800, 375x667, 320x568, and a landscape phone viewport.
- The message remains centered and readable at the minimum supported width.
- The existing `compact`, `narrow`, and `tiny` variants remain the only responsive variants used.

## Out of Scope

- Making floors without a location selectable.
- Adding a new message for missing locations.
- Changing the tour catalog or panorama assets.
- Adding or upgrading dependencies.
- Changing the backend or API.
