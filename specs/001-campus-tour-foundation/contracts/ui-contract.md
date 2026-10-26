# UI Contract: CIIT Virtual Campus Tour Foundation

**Feature**: `001-campus-tour-foundation`
**Date**: 2026-10-26

This contract defines the frontend component boundaries, interaction behavior, and accessibility
expectations. Implementation may change internals, but these behaviors are required.

## TourContext

Provides tour state and actions to the component tree.

| Value | Type | Description |
| --- | --- | --- |
| `catalog` | TourCatalog | Validated catalog loaded at startup. |
| `currentLocation` | Location | Location currently shown in the viewer. |
| `contentStatus` | `loading` \| `ready` \| `error` | Catalog availability. |
| `sidebarOpen` | boolean | Sidebar visibility. |
| `galleryOpen` | boolean | Gallery visibility. |
| `narrationStatus` | `idle` \| `loading` \| `playing` \| `paused` \| `ended` \| `blocked` \| `error` | Narration playback state. |
| `selectLocation(id)` | function | Switches to a location and resets narration and gallery state. |
| `toggleSidebar()` | function | Opens or closes the sidebar. |
| `toggleGallery()` | function | Opens or closes the gallery. |
| `playNarration()` | function | Starts or resumes narration. |
| `pauseNarration()` | function | Pauses narration. |

## PanoramaViewer

Renders the 360-degree scene for the current location.

**Props**

| Prop | Type | Required | Contract |
| --- | --- | --- | --- |
| `location` | Location | Yes | Location whose panorama should be displayed. |
| `onReady` | function | No | Called when the scene is interactive. |
| `onError` | function | No | Called with a visitor-safe message when the scene fails. |

**Behavior**
- Creates exactly one viewer instance per mounted location and destroys it on unmount or when
  the location changes.
- Fully cleans up on React StrictMode's development remount without leaving duplicate canvases.
- Supports mouse drag and touch drag to rotate the view.
- Does not trap page scrolling outside the viewer; touch gestures inside the viewer rotate the
  scene instead of scrolling the page.
- Shows a loading indicator until the scene is ready.
- Shows a fallback message when the scene cannot load and keeps navigation usable.
- Respects `prefers-reduced-motion` by avoiding non-essential animated transitions.
- Exposes an accessible label describing the current location.

## Sidebar

Lists every location and indicates the current one.

**Props**

| Prop | Type | Required | Contract |
| --- | --- | --- | --- |
| `locations` | Location[] | Yes | Locations sorted by `order`. |
| `currentLocationId` | string | Yes | Currently selected location. |
| `open` | boolean | Yes | Whether the list is visible. |
| `onSelect` | function | Yes | Receives a location id. |
| `onClose` | function | No | Called after selection on mobile. |

**Behavior**
- Renders a button for each location with its name and description.
- Marks the current location with `aria-current="true"`.
- Is fully keyboard operable with Tab, Enter, and Space.
- Closes after selection on small screens.
- Shows an unavailable message if a location cannot be displayed.

## RoomGallery

Displays still images for the current location.

**Props**

| Prop | Type | Required | Contract |
| --- | --- | --- | --- |
| `images` | GalleryImage[] | Yes | Images sorted by `order`. |
| `open` | boolean | Yes | Whether the gallery is visible. |
| `onClose` | function | Yes | Closes the gallery. |

**Behavior**
- Renders every image with its required alt text and optional caption.
- Lazy-loads images below the first viewport.
- Moves focus into the gallery when opened and returns focus to the trigger when closed.
- Closes with the Escape key.
- Shows a friendly empty state when no images are supplied.

## NarrationPlayer

Plays the narration for the current location and exposes the transcript.

**Props**

| Prop | Type | Required | Contract |
| --- | --- | --- | --- |
| `narration` | Narration or null | Yes | Narration for the current location. |
| `status` | string | Yes | Playback state from `TourContext`. |
| `onPlay` | function | Yes | Starts or resumes playback. |
| `onPause` | function | Yes | Pauses playback. |

**Behavior**
- Renders nothing when narration is absent.
- Provides play, pause, and resume controls with accessible names.
- Provides a visible transcript toggle that is keyboard operable.
- Shows a friendly message when playback is blocked and points the visitor to the transcript.
- Announces state changes through an appropriate live region without being disruptive.

## ErrorBoundary

Catches unexpected rendering failures in the tour tree.

**Behavior**
- Shows a visitor-friendly message and a retry action.
- Does not expose stack traces or internal details.
- Keeps the page usable rather than rendering a blank screen.

## Responsive Contract

| Viewport | Required Behavior |
| --- | --- |
| Mobile portrait (360 px width and above) | Sidebar collapses behind a menu button; panorama fills the viewport; controls remain reachable without horizontal scrolling. |
| Mobile landscape | Panorama and controls remain usable; gallery does not cover the close control. |
| Tablet | Sidebar may be visible alongside the panorama or collapsible. |
| Desktop (1024 px width and above) | Sidebar is visible by default; panorama occupies the remaining space; gallery opens without hiding navigation permanently. |

## Accessibility Contract

- All interactive controls MUST be reachable by keyboard.
- Focus MUST be visible on every interactive element.
- The current location MUST be announced when it changes.
- Narration MUST have a transcript.
- Gallery images MUST have meaningful alt text.
- Icon-only buttons MUST have accessible names.
- Color contrast MUST meet WCAG 2.1 AA for text and controls.
- Motion MUST respect `prefers-reduced-motion`.
- Error and loading states MUST be communicated as text, not color alone.

## Testing Contract

- Component tests mock the Marzipano module and assert viewer creation, scene switching, and
  cleanup.
- Sidebar tests assert selection, current-location indication, and keyboard activation.
- Gallery tests assert image rendering, alt text, focus movement, and Escape handling.
- Narration tests assert play, pause, blocked playback messaging, and transcript access.
- Tests MUST fail before the corresponding implementation is written.
