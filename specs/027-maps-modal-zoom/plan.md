# Implementation Plan: Add Responsive Floor Directory Modal with Zoom to the Maps Button

**Branch**: `027-maps-modal-zoom` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/027-maps-modal-zoom/spec.md`

## Summary

Add a floor directory modal to the maps button in `FloatingMenu.jsx` that displays `apps/frontend/public/img/glitch_directory.png`. The modal must fit desktop, tablet, and mobile viewports without scrolling and support scroll-to-zoom on desktop and pinch-to-zoom on touch screens. The change is frontend-only, introduces no new dependency, and does not alter narration, gallery, sidebar, or panorama behavior beyond adding the new modal.

## Technical Context

**Language/Version**: JavaScript with ES Modules and JSX. React `^19.2.8` (installed 19.3.0), Vite `^8.3.0` (installed 8.3.5), Tailwind CSS `^4.3.3`. No TypeScript in the frontend.

**Primary Dependencies**: React, React DOM, Tailwind CSS 4, existing MUI packages (`@mui/icons-material` `^9.5.0`, `@mui/material` `^9.5.0`). This feature introduces no new package and changes none of the existing dependency set.

**Storage**: Static tour image at `apps/frontend/public/img/glitch_directory.png`. No database or API involvement. The image is served as a public asset and loaded on demand when the modal opens.

**Testing**: Vitest 5 with Testing Library and jsdom. Configuration is `apps/frontend/vite.config.js`; setup is `apps/frontend/src/tests/setup.js`.

**Target Platform**: Modern desktop, tablet, and mobile browsers supported by the Vite application, from 320 CSS pixels through desktop widths, in both portrait and landscape orientations. Touch-capable devices support multi-touch pinch gestures; desktop devices support scroll-wheel input.

**Project Type**: Web application with separate `apps/frontend` and `apps/backend`. This feature is frontend-only.

**Performance Goals**: No new loading budget. The floor directory image is loaded only when the modal opens and adds a single image asset.

**Constraints**: No backend changes, no new runtime dependencies, no catalog or schema changes, no change to panorama, sidebar, location-selection, or narration behavior. The modal must fit all viewports without scrolling per FR-002–FR-005. Mobile support is required per Constitution Principle V. Touch and wheel zoom must not break keyboard operability or accessible names.

**Scale/Scope**: One frontend source file changes (`FloatingMenu.jsx`), plus its test file (`FloatingMenu.test.jsx`) updated. The new modal is added alongside the existing gallery and narration surfaces within the same component.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|:---|:---|:---|:---|
| I. MERN Stack Alignment | React + Vite + JavaScript ES Modules; Vitest testing; no alternative stack | PASS | Change stays within the React frontend; Vitest remains the test framework; no backend, model, service, or route change |
| II. MVC Separation and Application Boundaries | Frontend owns UI, galleries, narration controls, and static assets; no backend involvement | PASS | All changes are under `apps/frontend/src/components/` and `apps/frontend/src/tests/`; the static image is under `apps/frontend/public/`; no backend change |
| III. Test-First Quality Gate | Tests written and observed failing before implementation; new modal behavior covered | PASS | `FloatingMenu.test.jsx` already exists; the plan adds floor-directory modal and zoom tests before implementation and keeps them passing |
| IV. Security, Secrets, and Configuration Discipline | No secrets or environment changes | PASS | No credentials, `.env` files, or configuration changes |
| V. Responsive, Accessible Immersive Experience | Works on desktop and mobile; accessible controls; layout and touch controls verified at representative viewports | PASS | The floor directory modal targets mobile (320px+) through desktop; existing accessible names, focus, keyboard shortcuts, alt text are retained; pinch and wheel zoom are verified at representative viewports |
| Technology & Dependency Constraints | Approved stack only; new dependencies need approval | PASS | No dependency is added or changed |
| Development Workflow & Quality Gates | Specification, plan, tasks, implementation; tests and lint pass | PASS | This plan continues the Spec Kit sequence; automated tests, lint, and build remain required |

No constitution violation requires a complexity exception. No complexity tracking entries are needed.

## Project Structure

### Documentation (this feature)

```text
specs/027-maps-modal-zoom/
├── plan.md              # This file
├── research.md          # Phase 0 modal-layout and zoom decisions and alternatives
├── data-model.md        # Phase 1 floor directory modal state and contract
├── quickstart.md        # Phase 1 viewport and zoom validation guide
├── contracts/
│   └── ui-contract.md   # Floor directory modal surface, aria labels, zoom behavior
├── checklists/
│   └── requirements.md  # Specification quality checklist
├── spec.md              # Feature specification
└── tasks.md             # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   └── FloatingMenu.jsx   # Updated: add floor directory modal with zoom
│   └── tests/
│       └── FloatingMenu.test.jsx   # Updated: modal open/close, zoom, viewport fit coverage
├── public/
│   └── img/
│       └── glitch_directory.png   # Existing floor directory image (unchanged)
```

**Structure Decision**: Retain the existing web-application layout. The floor directory image stays as a static public asset. The new modal is added within the existing `FloatingMenu.jsx` component alongside the gallery and narration surfaces; no new component, hook, service, or state container is introduced.

## Current Implementation Findings

- `FloatingMenu.jsx` renders a Map button (`<MapIcon />`) with `aria-label="Open map"` but no click handler, so it currently does nothing when activated.
- The component already mounts a gallery modal (fixed backdrop, `section#room-gallery`) and a narration panel, both with established open/close, focus management, Escape handling, and keyboard navigation patterns to reuse.
- The viewport helper `isCompactViewport()` (matchMedia `max-width: 1023px`) is already imported and used to hide the floating menu when the sidebar is open on compact viewports.
- Tailwind CSS 4 is configured via `@tailwindcss/vite`, providing responsive breakpoints (`sm:`, `md:`, `lg:`) and standard spacing/sizing utilities without new dependencies.
- Baseline: `npm --prefix apps/frontend run test`, `npm run lint`, and `npm run build` pass.

## Proposed Changes

### 1. Add the floor directory modal to FloatingMenu.jsx

Add state for the modal open/close and zoom level, a click handler on the Map button, and a new modal surface:

- Track `mapModalOpen` (boolean) and `mapZoomLevel` (number, clamped between min and max) as component state.
- Wire the Map button's `onClick` to open the modal and set an `aria-expanded` attribute reflecting open state.
- Render a fixed-backdrop modal (`fixed inset-0`, `aria-modal="true"`, `role="dialog"`) containing the floor directory image (`glitch_directory.png`) with `alt` text and a close button.
- Scale the image by the current zoom level using a CSS transform so it can zoom in and out while staying centered.
- Cap the modal and image within the viewport on all viewports so no scrolling is required (viewport-relative height/width bounds).
- Close the modal via the close button, backdrop click, or `Escape` key; restore focus to the Map button on close.
- Preserve the existing gallery modal, narration panel, and all their behavior unchanged.

### 2. Implement scroll-to-zoom (desktop) and pinch-to-zoom (touch)

- On desktop, attach a wheel event listener to the modal image area: scroll up zooms in, scroll down zooms out, with `preventDefault()` to avoid page scrolling while the modal is open.
- On touch screens, track multi-touch distance changes (pinch) to adjust the zoom level; single-touch pans are optional but not required.
- Clamp the zoom level between a minimum (image fits the viewport) and a maximum (detail readable) so the image never zooms out below fit-to-viewport or beyond a readable maximum.
- Reset zoom to fit-to-viewport when the modal opens.
- Ensure zoom gestures do not interfere with keyboard operability (Escape still closes, focus management intact).

### 3. Update FloatingMenu.test.jsx

Add tests covering:
- Modal opens when the Map button is activated and shows the floor directory image with alt text.
- Modal closes via close button, backdrop click, and `Escape`; focus returns to the Map button.
- Modal and image fit within mobile, tablet, and desktop viewports without scrolling.
- Scroll wheel zooms the image in and out on desktop.
- Pinch gesture zooms the image in and out on touch screens.
- Zoom level is clamped between min and max; zoom resets to fit when the modal opens.
- Existing gallery and narration tests continue to pass.

## Testing Strategy

### Automated

```bash
npm --prefix apps/frontend run test
npm --prefix apps/frontend run lint
npm --prefix apps/frontend run build
```

Expected results:
- All existing test files keep passing.
- New/updated `FloatingMenu.test.jsx` tests cover modal open/close, viewport fit without scrolling, scroll-to-zoom, pinch-to-zoom, and zoom clamping.
- Lint and build succeed.

### Manual

Use `quickstart.md` for the full matrix. At minimum:
- Open the floor directory modal on a 320px-wide mobile viewport and confirm the image and close button fit without scrolling; pinch to zoom and confirm responsive zoom.
- Repeat on tablet and desktop viewports; on desktop use the scroll wheel to zoom.
- Close via the close button, backdrop click, and `Escape`; confirm focus returns to the Map button each time.
- Rotate the device between portrait and landscape with the modal open; confirm content still fits without scrolling.
- Confirm narration and gallery controls still work alongside the new modal.

## Risks and Dependencies

| Risk | Impact | Mitigation |
|:---|:---|:---|
| Wheel scroll intended for zoom also scrolls the page behind the modal | Page scrolls while user tries to zoom | Call `preventDefault()` on wheel events while the modal is open and the pointer is over the image |
| Image zooms beyond viewport bounds on small screens | Image or close button becomes unreachable | Clamp zoom between fit-to-viewport min and a readable max; center the image in the modal |
| Pinch gesture conflicts with page scroll on touch devices | Page scrolls instead of zooming | Use `touch-action: none` on the modal image area and handle touchmove with `preventDefault()` |
| Focus is not restored to the Map button after close | Keyboard users lose their place | Explicitly focus the Map button on close (mirror existing gallery focus logic) |
| Zoom state leaks between modal opens | Image opens at an unexpected zoom level | Reset zoom to fit-to-viewport whenever the modal opens |

No backend dependency, API change, storage migration, or new runtime package is introduced.

## Implementation Phases

1. **Update FloatingMenu.jsx**: Add map modal state and handlers; render the fixed-backdrop floor directory modal with the directory image, close button, scroll-to-zoom (wheel) and pinch-to-zoom (touch); clamp and reset zoom; preserve all existing gallery and narration behavior.
2. **Update FloatingMenu.test.jsx**: Add modal open/close, viewport fit, scroll-to-zoom, pinch-to-zoom, and zoom-clamping tests; keep all existing tests passing.
3. **Verification**: Run the frontend test suite, lint, and build. Manually validate modal fit and zoom at representative viewports and orientations per `quickstart.md`.

## Post-Design Constitution Re-Check

After generating `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md`, the design still satisfies the constitution:

- **Stack and boundaries**: All changes stay in the React frontend, with the static image asset unchanged. No backend, model, service, or route change.
- **Test-first**: The updated `FloatingMenu.test.jsx` covers the spec's success criteria (SC-001–SC-004) before implementation.
- **Accessibility and responsiveness**: Existing accessible names, visible focus, keyboard shortcuts, alternative text are retained; the responsive modal adds verified fit on mobile/tablet/desktop without scrolling and verified pinch/wheel zoom.
- **Dependency discipline**: No dependency changes.
- **Complexity**: No new component, hook, or abstraction is needed; only state and layout utilities are adjusted within the existing modal pattern.
