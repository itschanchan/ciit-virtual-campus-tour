# Phase 0 Research: Improve Gallery Button and Popup

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Source Validation Summary

The specification was checked against the current frontend source before selecting the design.

- The Gallery trigger is inline JSX in `apps/frontend/src/components/Layout.jsx:166-176`; it is not a separate component.
- The Gallery surface is a separate custom React component, `apps/frontend/src/components/RoomGallery.jsx`, rendered by `Layout.jsx:190-194`.
- Visibility is owned by `TourContext` through `galleryOpen` and the `TOGGLE_GALLERY` / `SET_GALLERY_OPEN` actions.
- Selected-location data is resolved from the catalog in `TourContext`; Gallery images are passed from `currentLocation.gallery`.
- The modal is a custom `div`/`section` implementation with `role="dialog"` and `aria-modal="true"`, not a native `<dialog>` and not MUI.
- Images are sourced from `apps/frontend/src/lib/catalog.json:21-28` and static files under `apps/frontend/public/panoramas/`.
- The current close paths are the close button, backdrop `onMouseDown`, and a document-level Escape listener.
- There is no focus trap or explicit background inertness.
- `Layout.jsx:30-39` also handles Escape for the sidebar, so both overlays can close on one key press.
- The whole Gallery panel scrolls, including the close button. Below the `tiny` breakpoint the panel fills the viewport and has no visible backdrop.
- The frontend is React 19 JavaScript/JSX with Tailwind CSS 4. There is no TypeScript.
- Vitest and Testing Library are configured and test files exist, but the dev dependencies are not declared or installed.

No specification assumption requires a scope expansion. The only discrepancy is test-tooling availability, documented below.

## Decisions

### D1. Use a native `<dialog>` for the Gallery modal

**Decision**: Convert the custom overlay and `section` in `RoomGallery` to a native `<dialog>` opened with `showModal()` and closed with `close()`.

**Rationale**:
- Built-in focus containment and background inertness directly address the largest accessibility gap.
- Native Escape/cancel behavior removes custom document-level key handling.
- The top layer renders above the panorama, header, sidebar, and MUI surfaces without z-index coordination.
- The browser provides this behavior without a new runtime dependency, matching the project’s KISA guideline.
- The existing dialog semantics, heading, close button, and Tailwind visual language can be retained.

**Alternatives considered**:
- **MUI `Dialog`**: Already installed and provides focus trapping, but it introduces MUI-specific surface behavior and styling into a component that currently follows the Tailwind convention. It would also require mapping the existing tokens into MUI props or `sx`, adding unnecessary architectural surface for one dialog.
- **Custom focus trap and `inert`**: Possible without a dependency, but duplicates platform behavior, requires manual Tab-cycle handling, and is harder to keep correct across browsers.
- **Keep the current modal and add only a keydown handler**: Does not make the background inert and leaves screen-reader interaction with obscured content unresolved.

### D1a. Keep the native dialog mounted while closed

**Decision**: Always render the `<dialog id="room-gallery">` inside `RoomGallery`, including when the `open` prop is false. The component `open` prop drives `showModal()` and `close()`; the DOM `open` attribute is never set directly by React.

**Rationale**:
- The trigger's `aria-controls="room-gallery"` always resolves to an existing DOM element, including while the Gallery is closed.
- Keeping the element mounted avoids unnecessary remounts and preserves a stable dialog node across open/close cycles.
- Calling `showModal()` when the prop becomes true and `close()` when it becomes false keeps the native modal state synchronized with React state.
- Rendering `<dialog open>` would display a non-modal dialog and would conflict with `showModal()`.
- The guarded jsdom shim can remove the `open` attribute on `close()`, so tests can assert the dialog is not visibly open when the prop is false.

**Alternatives considered**:
- **Return `null` when closed**: Matches the current implementation but leaves `aria-controls` pointing at no element and forces a new dialog node on each open.
- **Render the dialog only while open but keep a hidden placeholder with the same ID**: Adds two nodes and makes the ID ownership ambiguous.
- **Control visibility only with CSS**: Leaves a focusable, potentially announced dialog in the document and risks a visible surface when the prop is false.

### D2. Retain `RoomGallery` and avoid new Gallery components

**Decision**: Keep `RoomGallery` as the only Gallery component. Do not introduce `GalleryButton`, `GalleryGrid`, `GalleryItem`, or a second Gallery system.

**Rationale**:
- `RoomGallery` is already separate from `Layout`, so there is no inline popup to extract.
- The trigger is a single-use control; extracting it would add indirection without reuse.
- The grid and caption markup are small and are not reused elsewhere.
- Image error handling can be implemented inside `RoomGallery` with a small failed-image state set keyed by image order.
- Limiting component count follows the project’s simple-code guideline and the user’s instruction not to create unnecessary components.

**Alternatives considered**:
- **Extract `GalleryButton`**: Not justified for one trigger.
- **Extract `GalleryImage`**: Could isolate error state, but a local state set is simpler and keeps the component tree flat.
- **Extract a generic `Dialog` primitive**: Not justified for one dialog. Revisit only if another modal is added later.

### D3. Keep the Gallery trigger inline in `Layout`

**Decision**: Keep the existing trigger markup in `Layout` and improve it in place.

**Rationale**:
- Preserves the current architecture and avoids a new component.
- The trigger is already conditioned on ready tour content and a current location.
- The existing placement is contextual and does not overlap the instruction or narration surfaces.
- Changes can be limited to `aria-haspopup`, a minimum width and height of 44px at every breakpoint, and optional visual affordance.

**Alternatives considered**:
- **Move the trigger into the header**: Changes the existing visual hierarchy and is not required for usability.
- **Build a separate control cluster**: No other room actions currently exist, so a cluster would be premature.

### D4. Guard the sidebar Escape handler instead of building an overlay stack

**Decision**: Change the `Layout` sidebar Escape handler to require `!galleryOpen`. Let the native dialog handle Escape while it is open.

**Rationale**:
- This is the smallest change that satisfies “Escape closes only the topmost overlay.”
- The Gallery is the only overlay above the sidebar that participates in this interaction.
- It avoids introducing a global overlay manager for two surfaces.

**Alternatives considered**:
- **Central overlay stack in `TourContext`**: More flexible but unnecessary for the current two-overlay case.
- **Stop propagation in the dialog**: Native `cancel` is not a simple bubbling keydown event and does not provide a reliable cross-browser propagation guarantee for this purpose.

### D4a. Rely on native focus restoration with an idempotent fallback

**Decision**: Capture the invoking element when opening, let the native `<dialog>` restore focus when it closes, and add a post-close fallback only when native restoration did not land on the intended element.

**Rationale**:
- Native `showModal()` already restores focus to the element that was focused before the dialog opened. A second unconditional `focus()` call would compete with that behavior.
- The fallback remains necessary when the invoking trigger has been removed or replaced, such as during a location-driven close.
- The fallback is idempotent: it checks whether focus is already on the captured trigger, focuses that trigger only when it is still connected, and otherwise focuses `#tour-main`.
- The same path applies to closing through the close button, Escape/cancel, the backdrop, and a location change.
- Testing can assert deterministic focus behavior in jsdom without requiring the shim to emulate native focus restoration.

**Alternatives considered**:
- **Always restore focus manually**: Duplicates native behavior and can cause competing focus calls in browsers.
- **Rely only on native restoration**: Loses focus when the original trigger is no longer connected.
- **Focus `document.body` as the fallback**: Leaves keyboard users without a meaningful position in the tour.

### D5. Use a fixed header and scrollable body

**Decision**: Restructure the dialog as a flex column with a non-scrolling header and an `overflow-y-auto` body.

**Rationale**:
- Keeps the close control visible for long galleries.
- Solves the mobile full-screen case where the backdrop is not available.
- Preserves the current heading, eyebrow, and grid content.
- Allows safe-area padding to be applied to the header and body without moving the close control.

**Alternatives considered**:
- **Sticky header inside the existing scroll container**: Workable, but a flex column is simpler and avoids sticky-positioning edge cases.
- **Keep the entire panel scrolling**: Fails the requirement that the close control remain reachable.

### D6. Keep the existing image grid and add local error fallback

**Decision**: Retain the responsive `auto-fit` grid, 16:10 aspect ratio, `object-cover`, captions, and eager/lazy loading policy. Add `decoding="async"` and a per-image error fallback keyed by image order.

**Rationale**:
- Preserves the existing visual language and avoids a redesign.
- The current grid already adapts from one to multiple columns.
- A local failed-image set is sufficient and does not require a new component.
- The fallback can preserve the image’s accessible name so screen-reader users still receive meaningful content.

**Alternatives considered**:
- **Add a lightbox or slideshow**: Explicitly out of scope; the specification retains thumbnail-grid browsing.
- **Switch from `object-cover` to `object-contain`**: Would change the established presentation; not required for consistency.
- **Use the browser’s broken-image display**: Not a meaningful user-facing fallback.

### D7. Style the native backdrop with a base element rule

**Decision**: Add an element-level `dialog::backdrop` rule to `apps/frontend/src/index.css` using the existing canvas and gallery blur tokens.

**Rationale**:
- The backdrop pseudo-element cannot be styled reliably with inline utilities.
- The rule is element-level, matching the allowed base-layer content in `docs/styling.md`.
- It keeps the existing dark, blurred visual treatment without adding a component selector or a new stylesheet.

**Alternatives considered**:
- **Keep the custom overlay div for backdrop styling**: Would prevent using the native modal top layer and its focus/inert behavior.
- **Rely on the browser default backdrop**: Would not match the existing design.

### D8. Test with the existing Vitest setup and document the tooling discrepancy

**Decision**: Keep the existing Vitest + Testing Library + jsdom test approach, extend the Gallery tests, add a guarded dialog shim if required by jsdom, and record the missing dev-tooling declaration as a prerequisite.

**Rationale**:
- The repository already contains a Vitest configuration, a setup file, and Gallery tests.
- The project constitution requires Vitest and test-first quality gates.
- The smallest correction is to restore the already-configured dev-only dependencies with maintainer approval. This is not a new runtime dependency.
- Native focus trapping is best validated in a real browser; jsdom can verify dialog semantics, the mounted-closed state, `aria-controls` resolution, open/close behavior, and the focus-restoration fallback, but not full native modal focus containment.

**Alternatives considered**:
- **Add a different test runner or browser automation library**: Not allowed and unnecessary.
- **Skip automated tests**: Conflicts with the constitution and the approved specification.
- **Install test packages without approval**: Conflicts with `AGENTS.md` and the constitution’s dependency rules.

### D9. Preserve the existing state and data model

**Decision**: Keep `galleryOpen`, `toggleGallery`, `setGalleryOpen`, `currentLocation`, and `currentLocationId` in `TourContext`. Keep `catalog.json` and the static asset paths unchanged.

**Rationale**:
- Location changes already close the Gallery and reset narration.
- No additional data is required for the improvements.
- Moving Gallery visibility to local state would break existing state-reset behavior and tests without a usability benefit.

**Alternatives considered**:
- **Local `useState` in `Layout`**: Simpler for one dialog, but would duplicate or relocate the location-reset behavior already handled in the reducer.
- **Add a `closeGallery` context action**: Not required; `setGalleryOpen(false)` and the existing reducer are sufficient.

## Resolved Unknowns

There are no remaining `NEEDS CLARIFICATION` items in the specification.

The only unresolved external dependency is test-tooling availability:

- `apps/frontend/vitest.config.js` and the test files already assume Vitest, Testing Library, jest-dom, and jsdom.
- Those packages are not declared in `apps/frontend/package.json` and are not installed.
- Recommended smallest adjustment: obtain maintainer approval to declare/install the already-configured dev-only test tooling before implementation. No runtime dependency is added and no feature scope changes.
