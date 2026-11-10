# Phase 1 Data Model: Improve Gallery Button and Popup

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **UI Contract**: [contracts/ui-contract.md](./contracts/ui-contract.md)

This feature does not add persistence, API resources, or a new content schema. The data model remains the existing catalog-based Gallery content, plus transient view state used by the Gallery surface.

## Existing Content Entity: Gallery Image

A Gallery Image is a still image associated with a tour location.

| Field | Type | Required | Description | Validation |
|:---|:---|:---|:---|:---|
| `src` | string | Yes | Public asset path for the image | Non-empty string; resolved from the frontend public assets |
| `alt` | string | Yes | Meaningful alternative text | Non-empty string |
| `caption` | string | No | Visible caption shown beneath the image | Optional; must wrap safely when long |
| `order` | integer | Yes | Display order within the location's Gallery | Non-negative integer; unique within the Gallery |

**Source**: `apps/frontend/src/lib/catalog.json:21-28`  
**Validation**: `apps/frontend/src/lib/catalog.js:71-106`

No fields are added, removed, or renamed by this feature.

## Existing Content Entity: Tour Location Gallery

A location may own zero or more Gallery Images.

| Field | Type | Required | Description | Validation |
|:---|:---|:---|:---|:---|
| `gallery` | Gallery Image[] | No | Optional list of still images for the location | Must be an array when present; each image follows the Gallery Image rules |
| `gallery[].order` | integer | Yes | Ordering key | Unique within the location's Gallery |

**Relationship**: One Tour Location has zero or more Gallery Images. The current development catalog contains one location and one Gallery Image; the implementation must remain valid for multiple locations and larger galleries.

## Transient UI Entity: Gallery Session

A Gallery Session represents the open or closed Gallery surface for the currently selected location. It is not persisted.

| Field | Type | Required | Description | Validation |
|:---|:---|:---|:---|:---|
| `open` | boolean | Yes | Whether the Gallery dialog is open | Controlled by `galleryOpen` in `TourContext` |
| `currentLocationId` | string | Yes when open | Location whose Gallery is displayed | Must match an existing location in the catalog |
| `previousFocus` | element reference | No | Element focused before the Gallery opened | Captured on open; used only for the idempotent fallback when native restoration does not land on it |
| `failedImageOrders` | set of integers | No | Image orders whose assets failed to load | Used only for local fallback rendering; resets when the location or image list changes |

**Source of truth**: `apps/frontend/src/context/TourContext.jsx` owns `galleryOpen` and the selected location. `apps/frontend/src/components/RoomGallery.jsx` owns focus capture and image failure state.

## Transient UI Entity: Gallery Trigger

The visible control that opens the Gallery.

| Field | Type | Required | Description | Validation |
|:---|:---|:---|:---|:---|
| `expanded` | boolean | Yes | Whether the Gallery is currently open | Mirrors `galleryOpen` |
| `controls` | string | Yes | Identifier of the Gallery dialog | Must reference a dialog element mounted in the DOM, including while closed |
| `haspopup` | string | Yes | Indicates that the trigger opens a dialog | Must be `dialog` |
| `minimumTarget` | number | Yes | Minimum activation area | At least 44 CSS pixels wide and 44 CSS pixels tall at all supported viewports, including `tiny` |

## State Transitions

### Gallery visibility

1. **Closed**: The trigger is available, `aria-expanded` is false, the dialog remains mounted but is not open or visible, and `aria-controls` still resolves.
2. **Opening**: The visitor activates the trigger; `galleryOpen` becomes true; `showModal()` opens the dialog modally; focus moves into the dialog.
3. **Open**: The dialog is visible, background content is inert, and the image list or empty state is displayed.
4. **Closing**: The visitor activates the close control, a visible backdrop, or Escape; or the selected location changes. `close()` is called when the `open` prop becomes false.
5. **Closed after close**: `galleryOpen` becomes false; native dialog restoration runs; if the trigger is connected but focus did not return to it, the trigger is focused; if the trigger is gone, `#tour-main` is focused.

### Overlay precedence

- If the location menu is open and the Gallery is not open, Escape may close the location menu.
- If the Gallery is open, Escape closes the Gallery only; the location menu state is unchanged.
- If the selected location changes while the Gallery is open, the Gallery closes and the new location is shown.

### Image loading

1. **Loading**: The image element is rendered with its alt text and reserved layout space.
2. **Loaded**: The image displays normally with its caption if present.
3. **Failed**: The image is replaced by a fallback that preserves the image's accessible name and keeps the grid navigable.

### Focus

1. **Before open**: The trigger, or whatever control invoked the Gallery, holds focus and is captured in `previousFocus`.
2. **On open**: Focus moves to the Gallery close control.
3. **While open**: Focus remains within the dialog.
4. **On close**: Native dialog restoration runs first. An idempotent fallback focuses the captured trigger only when focus did not already return to it and the trigger is connected. If the trigger is no longer connected, focus moves to `#tour-main`.

## Validation Rules

- Gallery images must have non-empty `src` and `alt` values.
- `order` must be a non-negative integer and unique within the location's Gallery.
- Captions are optional and must not break the grid when long.
- Gallery images are displayed in ascending `order`.
- An empty or missing Gallery must render the empty state, not a blank surface.
- A failed image must not prevent the rest of the Gallery from rendering.
- No Gallery state is persisted across sessions or written to the backend.

## Persistence and API Boundaries

- No database, API, or backend changes.
- No new local storage, session storage, cookies, or URL state.
- The existing static catalog remains the source of truth.
- The Gallery Session and Trigger state are transient and exist only for the current page session.
