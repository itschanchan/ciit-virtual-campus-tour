# UI Contract: Floor Gallery Placeholder Images

**Feature**: `016-gallery-placeholder-images`
**Date**: 2026-11-10

## Scope

This contract covers the user-facing Gallery content and navigation behavior for every accessible floor. It describes observable behavior only; implementation details remain in `plan.md` and `tasks.md`.

## 1. Content Contract

For every accessible location in the tour catalog:

- `gallery` contains exactly three entries.
- The entries have `order` values `0`, `1`, and `2`.
- Each entry has a non-empty `src`, `alt`, and `caption`.
- Each `src` resolves to one of the three placeholder assets.
- The three entries within a floor use three different sources.
- Each `alt` and `caption` identifies the floor and the placeholder position.
- The content is clearly labeled as a placeholder.

Observable result: opening the Gallery from any accessible floor shows three distinct placeholder images in a stable order.

## 2. Gallery Trigger Contract

The existing "View gallery" control is unchanged.

- Visible whenever an accessible location is selected.
- Opens the Gallery for the currently selected floor.
- Exposes `aria-expanded`, `aria-controls="room-gallery"`, and `aria-haspopup="dialog"`.
- Remains keyboard operable with a visible focus indicator.

## 3. Navigation Contract

When the Gallery is open and the current floor has more than one image:

- A "Previous image" control appears on the left side of the active image.
- A "Next image" control appears on the right side of the active image.
- Activating "Next image" displays the next image in `order`.
- Activating "Previous image" displays the previous image in `order`.
- Activating "Next image" on the last image displays the first image.
- Activating "Previous image" on the first image displays the last image.
- The active image, its caption, and the position counter update together.
- The position counter has the form `current / total`, starting at `1 / 3`.
- Pressing ArrowRight has the same effect as "Next image".
- Pressing ArrowLeft has the same effect as "Previous image".

When the current floor has exactly one image:

- Neither navigation control appears.
- Arrow-key navigation does not change the image.

When the current floor has no images:

- The Gallery shows the existing empty-state message.
- No navigation controls appear.

When the Gallery is reopened or the location changes:

- The active image resets to the first image because the Gallery remounts per location.

## 4. Accessibility Contract

- "Previous image" and "Next image" expose clear accessible names.
- All Gallery controls are reachable by keyboard and show a visible focus indicator.
- The active image's `alt` text and caption are announced and associated with the displayed image.
- The position counter is exposed with `aria-live="polite"` so changes are announced.
- No state is communicated by color alone; the counter and caption carry the same information.
- Focus remains inside the open Gallery while navigating.

## 5. Responsive Contract

- The navigation controls are visible on mobile, tablet, and desktop.
- Controls remain reachable and do not obscure the image's identifying content at 320 CSS pixels and above.
- No horizontal scrolling is introduced.
- Existing behavior that hides the Gallery when the sidebar is open on a mobile viewport is preserved.

## 6. Preserved Behavior

The following existing behavior must remain unchanged:

- Opening the Gallery from the trigger.
- Closing through the close control, backdrop, and Escape.
- Closing automatically when the location changes.
- Focus return to the triggering element or the `#tour-main` fallback.
- Panorama, sidebar, narration, and location-selection behavior.

## 7. Non-Goals

- No new carousel library, component, or state architecture.
- No backend or API contract.
- No catalog schema change.
- No real campus photography.
- No thumbnail strip, zoom, slideshow, or autoplay.
- No change to locked floors.
