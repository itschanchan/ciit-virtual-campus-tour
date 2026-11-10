# Implementation Plan: Improve Gallery Button and Popup

**Branch**: `004-gallery-ux-improvements` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-gallery-ux-improvements/spec.md`

## Summary

The Gallery already exists as a separate `RoomGallery` component opened from an inline trigger in `Layout`. This plan keeps that structure and improves the existing feature rather than creating a new Gallery system. The main technical change is replacing the custom `div`/`section` modal surface with a native `<dialog>` opened with `showModal()`, which supplies focus containment, background inertness, and Escape handling without a new dependency. The plan also keeps the dialog mounted while closed so `aria-controls` always resolves, makes the dialog header non-scrolling, raises the trigger and close controls to at least 44 by 44 CSS pixels, adds dialog semantics and trigger metadata, relies on native focus restoration with a fallback when the invoking trigger is no longer available, adds per-image error fallback, preserves the existing catalog data and tour state model, and extends the existing Vitest/Testing Library coverage.

## Technical Context

**Language/Version**: JavaScript with ES Modules and JSX. No TypeScript configuration or `.ts`/`.tsx` source files exist. React is declared as `^19.2.8`; the installed React and React DOM versions are `19.3.0`. Vite is declared as `^8.3.0`; the installed version is `8.3.5`.

**Primary Dependencies**: React 19, React DOM 19, Tailwind CSS 4.3.3, and the existing MUI packages (`@mui/material`, `@mui/icons-material`, Emotion peers). Marzipano remains unchanged. MUI is available but is not required by this feature.

**Storage**: No application storage changes. Gallery content continues to come from the imported static catalog at `apps/frontend/src/lib/catalog.json`, with images under `apps/frontend/public/panoramas/`.

**Testing**: Vitest with Testing Library and jsdom is configured in `apps/frontend/vitest.config.js`, with setup in `apps/frontend/src/tests/setup.js`. Existing Gallery tests live in `apps/frontend/src/tests/RoomGallery.test.jsx`. **Important discrepancy:** Vitest, Testing Library, jest-dom, and jsdom are not declared in `apps/frontend/package.json` and are not installed in the current workspace, so the configured tests cannot currently be executed.

**Target Platform**: Modern desktop and mobile browsers supported by the existing Vite application, with validation from 320 CSS pixels through desktop widths and in landscape phone orientation.

**Project Type**: Web application with separate `apps/frontend` and `apps/backend`. This feature is frontend-only.

**Performance Goals**: The initial tour render must remain unaffected. The first Gallery image should load eagerly, remaining images should defer, and the Gallery must remain interactive while off-screen images load. No new performance budget is introduced.

**Constraints**: No backend modifications. No new runtime dependencies. No unnecessary architectural changes. Preserve panorama, narration, location navigation, catalog data, and existing design tokens. The existing Gallery must not be duplicated or replaced with a second Gallery system.

**Scale/Scope**: One Gallery surface in `Layout`, one reusable Gallery component, and the current catalog model. The implementation must remain valid for multiple locations and galleries much larger than the current single-image development catalog.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence / Notes |
|:---|:---|:---|
| I. MERN Stack Alignment | PASS | Changes stay within React 19 + Vite + JavaScript ES Modules. Vitest remains the intended test framework. No alternative framework or language is introduced. |
| II. MVC Separation and Application Boundaries | PASS | All planned source changes are under `apps/frontend`. No backend, model, controller, route, or database changes are planned. |
| III. Test-First Quality Gate | PASS WITH PREREQUISITE | Gallery tests exist and new behavior tests are planned. The configured test tooling is currently undeclared/uninstalled, so execution requires a separate maintainer decision to restore the already-configured dev-only test dependencies before implementation can be accepted. |
| IV. Security, Secrets, and Configuration Discipline | PASS | No secrets, environment files, credentials, or configuration changes are involved. |
| V. Responsive, Accessible Immersive Experience | PASS | The plan adds focus containment, background inertness, Escape semantics, accessible names, 44 by 44 CSS pixel targets, responsive behavior, safe-area handling, alt text preservation, and lazy image loading. |
| Technology & Dependency Constraints | PASS | No runtime dependency is added. The only dependency discrepancy is missing dev-only test tooling that the repository already configures and references. |
| Development Workflow & Quality Gates | PASS | The work continues through specification, plan, tasks, and implementation. Lint, build, content verification, and tests remain required gates. |

No constitution violation requires a complexity exception. The test-tooling discrepancy is recorded as a prerequisite and risk, not as a reason to expand scope.

## Project Structure

### Documentation (this feature)

```text
specs/004-gallery-ux-improvements/
├── plan.md              # This file
├── research.md          # Phase 0 decisions and alternatives
├── data-model.md        # Gallery entities and state transitions
├── quickstart.md        # End-to-end validation guide
├── contracts/
│   └── ui-contract.md   # Trigger, dialog, props, accessibility, and responsive contract
├── checklists/
│   └── requirements.md  # Specification quality checklist
├── spec.md              # Approved feature specification
└── tasks.md             # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Inline Gallery trigger + RoomGallery wiring
│   │   └── RoomGallery.jsx      # Existing Gallery modal component
│   ├── context/
│   │   └── TourContext.jsx      # galleryOpen state and location-change reset
│   ├── lib/
│   │   └── catalog.json         # Existing gallery content source
│   ├── tests/
│   │   ├── setup.js             # Shared test setup; dialog shim if needed
│   │   ├── RoomGallery.test.jsx # Existing Gallery tests to extend
│   │   └── Layout.test.jsx      # New integration coverage for trigger/Escape
│   └── index.css                # Existing tokens + dialog::backdrop base rule
└── package.json                 # Only conditionally changed for test tooling
```

**Structure Decision**: Retain the existing frontend structure. `RoomGallery` remains the Gallery component; the trigger remains inline in `Layout`; Gallery visibility remains in `TourContext`. No new Gallery feature component is introduced.

## Current Implementation Findings

### Framework and language

- React 19 with Vite and Tailwind CSS 4.
- JavaScript/JSX only. There is no TypeScript configuration and no `.ts` or `.tsx` source file.
- `apps/frontend/package.json` declares React `^19.2.8`; installed React is `19.3.0`.
- Tailwind custom variants are defined in `apps/frontend/src/index.css`: `compact` at 1023px, `narrow` at 700px, and `tiny` at 560px.

### Gallery trigger

- The trigger is not a separate component. It is inline JSX in `apps/frontend/src/components/Layout.jsx:166-176`.
- It calls `toggleGallery` from `useTour()`.
- `TourContext` owns `galleryOpen` and implements `TOGGLE_GALLERY` and `SET_GALLERY_OPEN` in `apps/frontend/src/context/TourContext.jsx:64-67,140-146`.
- `SELECT_LOCATION` closes the Gallery and resets narration in `TourContext.jsx:47-58`.
- The trigger has `aria-expanded` and `aria-controls="room-gallery"` but no `aria-haspopup`, and it shrinks to 36px on the `tiny` breakpoint.

### Gallery popup

- The popup is a separate custom React component, `RoomGallery`, in `apps/frontend/src/components/RoomGallery.jsx`.
- It is rendered by `Layout.jsx:190-194` with `images={currentLocation?.gallery ?? []}`, `open={galleryOpen}`, and `onClose={() => setGalleryOpen(false)}`.
- It is a custom modal built from a fixed overlay `div` and a `section` with `role="dialog"` and `aria-modal="true"`. It is not a native `<dialog>` and not an MUI dialog.
- It returns `null` when `open` is false.
- Images come from the catalog through props. The component sorts a copy by `order`, renders `figure`/`img`/`figcaption`, uses `object-cover` with a 16:10 aspect ratio, loads the first image eagerly and the rest lazily, and shows an empty state.
- Closing works through the close button, backdrop `onMouseDown`, Escape on `document`, and automatic closure when the location changes.
- Focus moves to the close button on open and is restored through `previousFocusRef` on cleanup.
- There is no focus trap and no explicit background inertness. `aria-modal="true"` is present without enforcement.
- The whole `section` scrolls, including the header and close button. On `tiny` viewports the panel becomes full-screen, so there is no visible backdrop and the close button can scroll out of view.
- `Layout.jsx:30-39` independently listens for Escape and closes the sidebar whenever it is open, so one Escape press can close both the sidebar and the Gallery.

### Data

- Gallery content is hardcoded in `apps/frontend/src/lib/catalog.json:21-28` and validated by `apps/frontend/src/lib/catalog.js:71-106`.
- Each gallery image has `src`, `alt`, optional `caption`, and a unique non-negative `order`.
- No API or backend call is involved.

### Testing

- `apps/frontend/src/tests/RoomGallery.test.jsx` covers image rendering, captions, empty state, Escape, and focus restoration.
- `TourContext.test.jsx` covers Gallery toggling and reset on location change.
- `PanoramaViewer.test.jsx`, `NarrationPlayer.test.jsx`, `Sidebar.test.jsx`, and `catalog.test.js` cover existing tour behavior.
- Test tooling is configured but not installed/declared, so tests are presently blocked.

## Assumption Validation

| Specification assumption | Source evidence | Result / adjustment |
|:---|:---|:---|
| The Gallery already exists and is not being replaced. | `RoomGallery.jsx`, inline trigger in `Layout.jsx:166-176` | Confirmed. Retain `RoomGallery`. |
| Gallery content remains sourced from the existing catalog. | `Layout.jsx:190-194`, `catalog.json:21-28`, `catalog.js:71-106` | Confirmed. No data model changes. |
| Images remain static public assets. | `catalog.json:23`, `apps/frontend/public/panoramas/placeholder/equirect.svg` | Confirmed. No asset migration. |
| The current thumbnail-grid model is retained. | `RoomGallery.jsx:75-94` | Confirmed. No lightbox, zoom, or slideshow. |
| Existing frontend architecture and styling are retained. | React/JSX components, Tailwind tokens in `index.css` | Confirmed. No new UI library required. |
| No new runtime dependencies are needed. | `apps/frontend/package.json` | Confirmed. Native dialog and existing utilities are sufficient. |
| Existing test configuration can verify the change. | `vitest.config.js`, test files, but missing dev dependencies | **Discrepancy.** Tests exist and are configured, but the tooling is absent. Smallest adjustment: restore the already-configured dev-only test dependencies with maintainer approval, or record that automated execution is blocked. Do not silently add runtime packages. |
| Close control, backdrop, and Escape already exist. | `RoomGallery.jsx:16-27,37-41,59-67` | Confirmed. Improve reliability rather than reinvent. |
| Existing tour behavior remains functional. | `TourContext`, `Sidebar`, `PanoramaViewer`, `NarrationPlayer` tests | Confirmed. Regression tests are planned. |

## Proposed Architecture

### Modal primitive

Use a native `<dialog>` inside `RoomGallery` and open it with `showModal()` when `open` becomes true. Close it with `close()` when `open` becomes false. Native modal behavior provides:

- focus containment
- background inertness
- Escape/cancel handling
- top-layer rendering above the panorama, header, sidebar, and MUI surfaces
- no new runtime dependency

The existing `role="dialog"`, `aria-modal`, and `aria-labelledby` semantics remain valid, with the accessible name still supplied by the Gallery heading.

### Dialog mounting and lifecycle

The `<dialog id="room-gallery">` must remain mounted even when the Gallery is closed. `RoomGallery` must not return `null` for the closed state.

- The component `open` prop controls the native lifecycle: call `showModal()` only when `open` becomes true and the dialog is not already open; call `close()` only when `open` becomes false and the dialog is open.
- Do not set the DOM `open` attribute directly from React. Rendering `<dialog open>` would display a non-modal dialog and would conflict with `showModal()`.
- The trigger's `aria-controls="room-gallery"` must always resolve to an element in the document, including while the Gallery is closed.
- When `open` is false, the dialog must not remain visible. The `close()` call and the native closed state must remove the visible modal surface and `::backdrop`.
- The guarded jsdom dialog shim must also remove the `open` attribute when `close()` is called so tests can assert the closed state.

### Component boundaries

- **`RoomGallery`** remains the single Gallery component. It owns dialog lifecycle, focus restoration, image ordering, empty state, and image error fallback.
- **`Layout`** keeps the inline trigger and Gallery wiring. It does not gain a new Gallery component.
- **`TourContext`** remains the owner of `galleryOpen`, `toggleGallery`, and `setGalleryOpen`. No new context state is required.
- No `GalleryButton`, `GalleryGrid`, or `GalleryItem` component is introduced. The trigger is a single-use control, and the grid is small enough to remain inline. A new component would add indirection without reuse.

### Escape precedence

`RoomGallery` handles Escape through the native dialog `cancel` event. `Layout` must guard its existing window-level Escape handler with `!galleryOpen` so the sidebar does not also close while the Gallery is open. This makes the Gallery the topmost overlay and preserves the existing sidebar behavior when the Gallery is closed.

### Focus restoration

Native `<dialog>` behavior is the primary focus-restoration mechanism. When `showModal()` is called, the browser records the focused element and restores focus to it when the dialog closes. The component must not compete with that behavior.

- Capture the invoking element in `previousFocusRef` when opening, before calling `showModal()`.
- On close, call `close()` and let the browser perform native restoration first.
- Add an idempotent post-close fallback that runs after the close event settles. It must not call `focus()` when the browser has already restored focus to the intended element.
- If the captured trigger is still connected and focus did not return to it, focus the captured trigger.
- If the captured trigger is no longer connected (for example, location content changed or the trigger unmounted), focus `#tour-main`, which has `tabIndex={-1}`, rather than leaving focus on `document.body` or inside the closed dialog.
- Apply the same restoration path for the close button, Escape/cancel, backdrop activation, and location-driven closure.
- Clear the captured reference after restoration so a later open captures a fresh invoking element.

### Dialog layout

The dialog becomes a flex column with a fixed header and a scrollable body:

- header: title, eyebrow, close button; never scrolls
- body: image grid or empty state; `overflow-y-auto` with `overscroll-contain`
- close button remains reachable for long galleries and in full-screen mobile mode
- mobile uses safe-area-aware padding and full-screen dimensions

### Image handling

- Sort images once with `useMemo`.
- Default `images` to `[]` inside the component.
- Keep alt text and captions.
- Add `decoding="async"` and keep the existing eager/lazy loading policy.
- Add a per-image error fallback keyed by the image order. The fallback preserves the image's accessible name and keeps the Gallery navigable.
- Keep `object-cover` for a consistent visual treatment; no distortion.

### Trigger

- Keep the inline trigger in `Layout`.
- Add `aria-haspopup="dialog"`.
- Keep `aria-expanded` and `aria-controls`.
- Guarantee a minimum width of 44px and a minimum height of 44px at all breakpoints, including `tiny` (for example, `min-h-11 min-w-11`).
- Add a lightweight gallery icon or equivalent visual affordance without adding a new library. Use an inline SVG if possible; otherwise use an existing MUI icon only if it is already imported or approved.
- Preserve the existing top-right placement; it remains contextual to the panorama and does not collide with the instruction or narration surfaces.

### Styling

- Continue using the existing Tailwind tokens and custom breakpoints.
- Add a small element-level `dialog::backdrop` rule in `index.css` for the canvas tint and blur, because the backdrop pseudo-element cannot be expressed with inline utilities reliably.
- Do not add component selectors, CSS modules, or new global component classes.

## Files to Modify

| File | Change | Reason |
|:---|:---|:---|
| `apps/frontend/src/components/RoomGallery.jsx` | Convert the custom overlay to native `<dialog>` while keeping it mounted; add open-prop lifecycle, native focus restoration with fallback, fixed header, scrollable body, image error state, memoized sorting, default `images`, safe-area and overscroll handling | Core accessibility, layout, and image robustness work |
| `apps/frontend/src/components/Layout.jsx` | Add `aria-haspopup`; guarantee a 44 by 44 trigger target; guard sidebar Escape handler with `!galleryOpen`; optionally stabilize the close callback | Trigger usability and single-overlay Escape behavior |
| `apps/frontend/src/index.css` | Add `dialog::backdrop` base styling using existing canvas/blur tokens | Native dialog backdrop consistency |
| `apps/frontend/src/tests/RoomGallery.test.jsx` | Extend tests for the mounted-closed dialog, close button, backdrop, cancel/Escape, focus restoration after each close path, fallback when the trigger is gone, image error fallback, default images, and sorted order | Verify changed Gallery behavior |
| `apps/frontend/src/tests/setup.js` | Add a guarded `HTMLDialogElement.showModal`/`close` shim if the installed jsdom version does not provide them; `close()` must remove the `open` attribute | Keep unit tests runnable without a new dependency |
| `apps/frontend/src/tests/Layout.test.jsx` | Add integration coverage for the trigger `aria-controls` target, dialog opening, Escape precedence with the sidebar, and focus fallback after a location change | Verify cross-component behavior |
| `apps/frontend/package.json` | **Conditional only:** declare the already-configured dev test tooling (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) after maintainer approval | Resolve the test-tooling discrepancy; no runtime dependency |
| `apps/frontend/src/context/TourContext.jsx` | No change planned | Existing state and location-reset behavior are sufficient |
| `apps/frontend/src/lib/catalog.json` | No change planned | Existing data model is sufficient |
| `apps/backend/**` | No change | Feature is frontend-only |

## Proposed Changes per File

### `apps/frontend/src/components/RoomGallery.jsx`

1. Change the signature to `RoomGallery({ images = [], open, onClose })`.
2. Keep the `<dialog id="room-gallery">` mounted at all times. Do not return `null` when `open` is false.
3. Add `dialogRef`, `closeButtonRef`, and `previousFocusRef`.
4. Add `useMemo` for `sortedImages` instead of sorting on every render.
5. Add `failedImages` state keyed by image order.
6. Add an effect on `open` that:
   - captures `document.activeElement` before opening
   - calls `showModal()` only when opening and the dialog is not already open
   - focuses the close button after opening
   - calls `close()` only when closing and the dialog is already open
   - lets native dialog behavior perform focus restoration before any fallback runs
   - never sets the DOM `open` attribute directly
7. Add an idempotent post-close focus fallback that:
   - does nothing when focus is already on the captured trigger
   - focuses the captured trigger when it is still connected
   - focuses `#tour-main` when the captured trigger is no longer connected
   - clears `previousFocusRef` after handling the close
8. Replace the outer `div`/`section` with a `<dialog>` that keeps `id="room-gallery"`, `aria-labelledby`, and dialog semantics.
9. Handle `onCancel` by preventing the native close and calling `onClose`, so React state remains the source of truth.
10. Handle backdrop activation by comparing the event target with the dialog element.
11. Restructure the dialog into:
    - a non-scrolling header containing the eyebrow, heading, and a closing control with minimum width and height of 44px
    - a scrollable body containing the grid or empty state
12. Add mobile full-screen classes, safe-area padding, and `overscroll-contain`.
13. Keep the responsive grid, caption markup, and empty state.
14. Add `decoding="async"` to images.
15. On image error, render a fallback panel that preserves the image's accessible name and does not break the grid.
16. Keep the close button accessible name as "Close gallery".

### `apps/frontend/src/components/Layout.jsx`

1. Add `aria-haspopup="dialog"` to the Gallery trigger.
2. Change the trigger from `min-h-10`/`tiny:min-h-9` to a minimum width and minimum height of 44px at all breakpoints, including `tiny`.
3. Add a decorative gallery icon or affordance with `aria-hidden="true"` if it does not complicate the component; the text label remains.
4. Change the sidebar Escape effect condition to require `!galleryOpen`.
5. Add `galleryOpen` to that effect's dependency array.
6. Optionally replace the inline `onClose` arrow with a `useCallback` callback for stable identity. This is not required for correctness once the dialog effect no longer depends on `onClose`, but it avoids unnecessary render churn.
7. Keep the Gallery trigger placement, but remove redundant `compact` positioning classes if they no longer add value.

### `apps/frontend/src/index.css`

1. Add an element-level `dialog::backdrop` rule using `--color-canvas` and `--blur-gallery`.
2. Do not add component-specific selectors or a new stylesheet.
3. Add a token only if a repeated dialog value emerges; otherwise use existing tokens.

### `apps/frontend/src/tests/RoomGallery.test.jsx`

1. Keep the existing rendering, caption, empty-state, Escape, and focus-restoration tests.
2. Add a test that the dialog remains in the document when `open` is false, is not in the native open state, and can be reopened.
3. Add a test that the close button calls `onClose` exactly once.
4. Add a test that activating the backdrop calls `onClose`.
5. Add a test for the dialog `cancel` event calling `onClose`.
6. Add a test that images are rendered in `order`, not input order.
7. Add a test that `images={undefined}` does not throw and shows the empty state.
8. Add a test that a failing image produces the fallback and keeps the Gallery content present.
9. Add focus-restoration tests for closing through the close button, Escape/cancel, and the backdrop; each must return focus to the invoking trigger.
10. Add a test where the invoking trigger is removed before close; focus must fall back to `#tour-main`.
11. Where jsdom cannot simulate native focus containment, keep the structural assertions and rely on the manual focus-trap validation in `quickstart.md`.

### `apps/frontend/src/tests/setup.js`

1. Add a feature-detected shim for `HTMLDialogElement.prototype.showModal` and `close` only if the installed jsdom does not implement them.
2. The shim should set/remove the `open` attribute and dispatch the appropriate events without changing application behavior. It does not need to emulate native focus restoration because the component's post-close fallback covers jsdom.
3. Keep the existing Marzipano mock and jest-dom import unchanged.

### `apps/frontend/src/tests/Layout.test.jsx` (new)

1. Render `TourProvider` with the catalog and `Layout`.
2. Confirm the Gallery trigger exposes `aria-haspopup="dialog"` and `aria-expanded`, and that `aria-controls` resolves to the mounted dialog even while closed.
3. Open the Gallery and confirm the dialog appears.
4. Press Escape with the Gallery open and confirm the Gallery closes.
5. Confirm the sidebar does not also close on that Escape press.
6. Change location while the Gallery is open and confirm focus lands on a connected control or the `#tour-main` fallback.
7. Keep the test focused on cross-component behavior, not image styling.

### `apps/frontend/package.json` (conditional)

1. If maintainer approval is granted, add the dev-only test dependencies that the existing config already requires.
2. Do not add any runtime dependency.
3. If approval is not granted, document that automated test execution remains blocked and do not silently install packages.

## Testing Strategy

### Framework

Vitest + Testing Library + jsdom, as already configured in `apps/frontend/vitest.config.js` and `apps/frontend/src/tests/setup.js`. The planned tests follow the existing React Testing Library style in `RoomGallery.test.jsx`.

### Automated coverage

| Behavior | Test location | Assertion |
|:---|:---|:---|
| Dialog renders images with alt text and captions | `RoomGallery.test.jsx` | Existing assertions continue to pass |
| Empty gallery | `RoomGallery.test.jsx` | Existing empty-state assertion continues to pass |
| Images render in catalog order | `RoomGallery.test.jsx` | DOM order matches `order` |
| Close button closes | `RoomGallery.test.jsx` | `onClose` called exactly once |
| Backdrop closes | `RoomGallery.test.jsx` | `onClose` called when the dialog backdrop is activated |
| Escape/cancel closes | `RoomGallery.test.jsx` | `onClose` called on `cancel` |
| Dialog remains mounted while closed | `RoomGallery.test.jsx` | Dialog stays in the document and is not open when `open` is false |
| Focus enters on open | `RoomGallery.test.jsx` | Close control receives focus after opening |
| Close button, backdrop, and Escape restore focus | `RoomGallery.test.jsx` | Focus returns to the invoking trigger after each close path |
| Removed trigger fallback | `RoomGallery.test.jsx` | Focus moves to `#tour-main` when the invoking trigger is gone |
| Missing `images` prop is safe | `RoomGallery.test.jsx` | Empty state renders without throwing |
| Image failure fallback | `RoomGallery.test.jsx` | Fallback appears and Gallery remains navigable |
| Trigger attributes and controls target | `Layout.test.jsx` | `aria-haspopup`, `aria-expanded`, accessible label, and an existing `aria-controls` target are present |
| Focus after location change | `Layout.test.jsx` | Gallery closes and focus moves to a connected control or `#tour-main` |
| Escape precedence | `Layout.test.jsx` | Gallery closes; sidebar state is unchanged |
| Existing Gallery state reset | `TourContext.test.jsx` | Existing test continues to pass |
| Panorama, sidebar, narration regressions | Existing test suites | All existing tests continue to pass |

### Manual and visual verification

- Desktop: 1440x900 and 1024x768.
- Mobile: 700x800, 560x800, 375x667, 320x568, and landscape phone.
- Verify native focus containment with Tab and Shift+Tab.
- Verify focus returns to the trigger after the close button, Escape, and backdrop, and falls back to `#tour-main` when a location change removes the trigger.
- Verify the background is inert while the dialog is open.
- Verify the close button remains visible while a long image list scrolls.
- Verify safe-area behavior in a notched-device simulation.
- Verify 200 percent zoom, forced-colors mode, reduced motion, and a screen reader.
- Verify panorama drag, sidebar navigation, and narration still work after closing the Gallery.

### Commands

```bash
npm --prefix apps/frontend run test
npm run lint
npm run build
npm run verify:content
```

If the frontend test tooling has not been approved/restored, record that `npm --prefix apps/frontend run test` is blocked and do not claim automated verification passed.

## Risks and Dependencies

| Risk | Impact | Mitigation |
|:---|:---|:---|
| Test tooling is configured but not installed/declared | Automated tests cannot run; test-first gate cannot be demonstrated | Resolve as a separate dev-dependency approval before implementation; do not add runtime packages |
| jsdom does not implement native dialog methods | Unit tests fail on `showModal`/`close` | Add a guarded shim in `src/tests/setup.js`; verify real dialog behavior manually in a browser |
| Native `::backdrop` styling differs across browsers | Backdrop visual inconsistency | Use a small element-level CSS rule with existing tokens and validate in target browsers |
| Escape triggers both native `cancel` and the Layout window handler | Sidebar could close with the Gallery | Guard the sidebar handler with `!galleryOpen`; call `onClose` once from the dialog |
| Native focus restoration competes with manual restoration | Focus may jump or be focused twice | Let native dialog restoration run first; add only an idempotent fallback when the trigger is connected or focus is lost |
| The invoking trigger is removed during a location change | Focus could be lost on `document.body` | Fall back to `#tour-main` and test closure driven by a location change |
| Long galleries on full-screen mobile | Close button could become unreachable | Use a fixed header plus scrollable body; verify with a multi-image fixture |
| Safe-area utilities use arbitrary values | Style-guide drift | Use them only where the environment value is required; prefer existing tokens elsewhere |
| Current catalog contains only one image | Long-list behavior is not exercised by default content | Cover long lists in tests with a fixture; manually verify with a temporary local fixture and revert it |
| MUI surface stacking | Sidebar Popover might visually conflict | Native modal dialog renders in the top layer above MUI content; no MUI changes are planned |

No backend dependency, API change, storage migration, or new runtime package is introduced.

## Implementation Phases

1. **Test readiness**: Confirm test-tooling approval and restore the already-configured dev dependencies if approved. Add/extend failing tests for the planned Gallery behavior.
2. **Modal foundation**: Convert `RoomGallery` to a native dialog that stays mounted, add open-prop lifecycle without setting the DOM `open` attribute, add native focus restoration with an idempotent fallback, add Escape/backdrop handling, and add the dialog shim if needed.
3. **Layout and Escape coordination**: Update the trigger metadata and touch target; guard the sidebar Escape handler.
4. **Content and responsive polish**: Add fixed-header/scroll-body layout, image error fallback, safe-area and overscroll handling, and dialog backdrop styling.
5. **Verification**: Run unit/integration tests, lint, build, content verification, and the manual quickstart matrix. Confirm existing panorama, sidebar, and narration behavior is unchanged.

## Post-Design Constitution Re-Check

After generating `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md`, the design still satisfies the constitution:

- **MERN and MVC boundaries**: All changes remain in the React frontend. No backend, database, route, controller, or service change is planned.
- **Test-first gate**: The design defines the required automated tests and existing regression suites. The only remaining condition is restoring the already-configured dev-only test tooling with maintainer approval. No source implementation should be accepted without test execution.
- **Accessibility and responsiveness**: The always-mounted native dialog, 44 by 44 CSS pixel targets, fixed header, native focus restoration with fallback, image fallbacks, safe-area handling, and manual viewport matrix directly satisfy the responsive and accessible experience principle.
- **Dependency discipline**: No runtime dependency is added. The conditional `package.json` change is limited to dev-only tooling already assumed by the repository and requires approval.
- **Complexity**: No constitution exception or complexity-tracking entry is required. The design retains existing components and avoids new abstractions.
