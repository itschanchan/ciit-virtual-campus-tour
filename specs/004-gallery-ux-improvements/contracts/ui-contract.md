# UI Contract: Gallery Trigger and Room Gallery Dialog

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data Model**: [data-model.md](../data-model.md)

This contract defines the user-facing behavior of the existing Gallery trigger and `RoomGallery` dialog. It preserves the current component ownership and content model while tightening accessibility, closing behavior, and responsive presentation.

## Component Ownership

| Surface | Owner | Contract |
|:---|:---|:---|
| Gallery trigger | Inline JSX in `apps/frontend/src/components/Layout.jsx` | Opens and closes the Gallery through existing `TourContext` actions |
| Gallery dialog | `apps/frontend/src/components/RoomGallery.jsx` | Renders the current location's Gallery images in a modal dialog |
| Gallery visibility | `apps/frontend/src/context/TourContext.jsx` | Owns `galleryOpen`, `toggleGallery`, and `setGalleryOpen`; closes the Gallery on location change |
| Gallery content | `apps/frontend/src/lib/catalog.json` | Provides the per-location Gallery Image list |
| Gallery validation | `apps/frontend/src/lib/catalog.js` | Validates Gallery Image fields and ordering |

No new Gallery component or duplicate Gallery state is permitted.

## Trigger Contract

The Gallery trigger must:

- render as a button with the visible label "View gallery"
- invoke the existing `toggleGallery` action when activated
- expose `aria-expanded` reflecting `galleryOpen`
- expose `aria-controls="room-gallery"` referencing a Gallery dialog that is mounted in the DOM at all times, including while closed
- expose `aria-haspopup="dialog"`
- provide a minimum activation area of 44 CSS pixels wide and 44 CSS pixels tall at all supported viewports, including the `tiny` breakpoint
- retain a visible focus indicator from the base `:focus-visible` rule
- remain reachable without overlapping essential panorama, instruction, narration, or sidebar controls
- keep its current top-right contextual placement over the panorama

The trigger must not introduce a second Gallery entry point or a separate visibility state.

## Dialog Contract

The Gallery dialog must:

- use a native `<dialog id="room-gallery">` opened with `showModal()` when `galleryOpen` becomes true
- close with `close()` when `galleryOpen` becomes false
- remain mounted in the document at all times, including while closed; the component must not return `null` or unmount the dialog when closed
- use the component `open` prop to drive the `showModal()`/`close()` lifecycle and must not set the DOM `open` attribute directly
- not remain visible or retain the native open state when the component `open` prop is false
- expose an accessible name from the visible "Gallery" heading
- retain modal dialog semantics and expose the Gallery as the active modal surface
- make the background tour content non-interactive while open
- render the Gallery header and close control in a non-scrolling region
- render the image grid or empty state in a scrollable region
- keep the close control visible for long galleries and in full-screen mobile mode
- preserve the existing eyebrow and heading visual hierarchy
- remain within the existing dark tour visual language and design tokens

### Close Control Contract

The close control must:

- be a button with the accessible name "Close gallery"
- have a minimum activation area of 44 CSS pixels wide and 44 CSS pixels tall at all supported viewports, including the `tiny` breakpoint
- call the Gallery close behavior exactly once
- remain visible without scrolling while the Gallery content scrolls
- show a visible focus indicator
- retain the existing circular, theme-consistent appearance

## `RoomGallery` Props Contract

```text
RoomGallery({
  images?: GalleryImage[],
  open: boolean,
  onClose: () => void
})
```

| Prop | Required | Default | Contract |
|:---|:---|:---|:---|
| `images` | No | `[]` | Gallery Images for the current location; remains safe when omitted |
| `open` | Yes | None | Controls whether the dialog is open |
| `onClose` | Yes | None | Requests that the parent close the Gallery; must not be called more than once for a single close action |

No new props are required for this feature.

## Interaction Contract

| Action | Expected result |
|:---|:---|
| Activate the trigger | Gallery opens for the current location |
| Activate the close control | Gallery closes; focus returns to the invoking trigger or the `#tour-main` fallback |
| Activate a visible backdrop | Gallery closes; focus returns to the invoking trigger or the `#tour-main` fallback |
| Press Escape while the Gallery is open | Gallery closes; focus returns to the invoking trigger or the `#tour-main` fallback |
| Change location while the Gallery is open | Gallery closes, the new location is shown, and focus moves to a connected control or the `#tour-main` fallback |
| Press Escape with the location menu and Gallery open | Only the Gallery closes; the location menu state is unchanged |
| Press Tab or Shift+Tab while open | Focus remains within the Gallery |
| Open the Gallery repeatedly | Each open/close cycle restores focus correctly and does not leave a stale dialog state |

## Focus Restoration Contract

- The browser's native dialog focus restoration is the primary mechanism.
- The component must capture the invoking element when opening, but must not unconditionally focus it on close before native restoration runs.
- If native restoration leaves focus on the invoking trigger, the component must not issue a duplicate focus call.
- If the invoking trigger is still connected but focus did not return to it, focus must return to the trigger.
- If the invoking trigger is no longer connected, focus must move to `#tour-main` (which has `tabIndex={-1}`) rather than `document.body` or the closed dialog.
- The same behavior applies when closing through the close control, Escape/cancel, the backdrop, or a location change.
- The captured focus reference must be cleared after restoration so the next open captures a fresh invoking element.

## Escape Precedence Contract

- The Gallery is the topmost overlay while open.
- The location menu Escape handler must not close the menu while `galleryOpen` is true.
- The Gallery close behavior must run only once per Escape press.
- When the Gallery is closed, existing location-menu Escape behavior remains unchanged.

## Image Content Contract

Each Gallery Image must:

- render in ascending `order`
- provide meaningful `alt` text from the catalog
- render its optional caption beneath the image
- preserve a consistent image aspect treatment without distortion
- load the first image eagerly and defer later images
- render a meaningful fallback if the image fails to load
- continue to allow the rest of the Gallery to render when one image fails
- avoid introducing horizontal overflow with long captions

An empty or missing Gallery must show the existing friendly empty state.

## Responsive Contract

At supported viewport widths from 320 CSS pixels upward:

- the Gallery must not introduce horizontal page scrolling
- the grid must adapt from a single column to multiple columns as space allows
- the close control must remain reachable while content scrolls
- the dialog must account for safe-area insets on notched or rounded displays
- the dialog must remain usable in landscape phone orientation
- the dialog must remain usable at 200 percent zoom

At the `tiny` breakpoint, the existing full-screen presentation may be retained, provided the header and close control remain visible and the body scrolls independently.

## Accessibility Contract

- The Gallery must be announced as a modal dialog with the accessible name "Gallery".
- The dialog must remain in the document while closed but must not be visible or exposed as an open dialog.
- Background content must not be keyboard interactive or exposed as active content while the Gallery is open.
- Focus must move into the Gallery on open and return to the invoking control on close; if that control is no longer available, focus must move to the `#tour-main` fallback.
- Focus must remain within the Gallery during keyboard navigation.
- The close control must have a visible focus indicator.
- Images must retain meaningful alternative text.
- Reduced-motion preferences must be respected.
- The Gallery must remain usable in forced-colors mode.
- The Gallery must not rely on color alone to communicate state.

## Data Contract

- Gallery content continues to come from `apps/frontend/src/lib/catalog.json`.
- Gallery Image fields remain `src`, `alt`, optional `caption`, and `order`.
- No backend, API, storage, or schema change is permitted.
- No new runtime dependency is permitted.

## Out of Scope

- A new full-screen image viewer, lightbox, zoom, slideshow, or previous/next browsing mode.
- A new Gallery content editor, upload flow, or database model.
- Migrating the Gallery to MUI or another component library.
- Changing the existing panorama viewer, narration player, or location navigation behavior.
- Adding new Gallery entry points or a second Gallery surface.
