# Research: Responsive Floor Directory Modal with Zoom

**Feature**: `027-maps-modal-zoom`
**Date**: 2026-11-15

## Purpose

Record the modal-layout and zoom decisions for adding a floor directory modal to the maps button in `FloatingMenu.jsx`. The feature specification has no unresolved `[NEEDS CLARIFICATION]` markers, so this document focuses on layout, zoom interaction, and responsive best practices.

## Findings Summary

- The maps button in `apps/frontend/src/components/FloatingMenu.jsx` currently renders `<MapIcon />` with `aria-label="Open map"` but has no click handler, so it does nothing when activated.
- The component already mounts a gallery modal (fixed backdrop, `section#room-gallery`, `aria-modal="true"`, `role="dialog"`) and a narration panel, both with established open/close, focus management, Escape handling, and keyboard navigation patterns to reuse.
- The viewport helper `isCompactViewport()` (matchMedia `max-width: 1023px`) is already imported and used to hide the floating menu when the sidebar is open on compact viewports.
- The floor directory image already exists at `apps/frontend/public/img/glitch_directory.png` and is unchanged by this feature.
- Tailwind CSS 4 is configured via `@tailwindcss/vite`, providing responsive breakpoints (`sm:`, `md:`, `lg:`) and standard spacing/sizing utilities without new dependencies.
- Baseline: `npm --prefix apps/frontend run test`, `npm run lint`, and `npm run build` pass.

## Decision 1: How to present the floor directory modal

**Decision**: Add a new fixed-backdrop modal within `FloatingMenu.jsx` reusing the existing gallery-modal pattern (fixed inset-0 backdrop, centered panel, `role="dialog"`, `aria-modal="true"`, close button, Escape to close, focus restore on close).

**Rationale**:
- Reusing the established gallery-modal pattern keeps interaction consistent (Escape closes, backdrop click closes, focus returns to the trigger) and requires no new component or abstraction.
- The modal is scoped to `FloatingMenu.jsx`, consistent with the existing gallery and narration surfaces.
- A dedicated full-page route or separate component would add indirection for a single image display.

**Alternatives considered**:
- *Navigate to a separate floor-directory page.* Rejected because it breaks the immersive tour flow and requires routing changes beyond the floating menu.
- *Open the image in the browser's default image viewer.* Rejected because it leaves the tour context and loses responsive fit and zoom control.
- *Overlay the image inline in the floating menu.* Rejected because the floating menu is small and fixed at the bottom center; there is no room for a full directory image.

## Decision 2: Zoom implementation approach

**Decision**: Implement zoom with a CSS transform `scale()` on the directory image, driven by component state (`mapZoomLevel`), clamped between a fit-to-viewport minimum and a readable maximum. Reset zoom to fit when the modal opens.

**Rationale**:
- CSS `transform: scale()` is GPU-accelerated, does not trigger layout reflow, and keeps the image centered in the modal.
- Driving zoom from React state makes the zoom level testable and easy to clamp/reset.
- Fit-to-viewport minimum ensures the image never zooms out so far it becomes unusable; a maximum keeps detail readable without exceeding the viewport.

**Alternatives considered**:
- *Use a dedicated image-zoom library.* Rejected because it adds a new runtime dependency requiring maintainer approval (constitution Technology & Dependency Constraints) and is overkill for a single static image.
- *Change the image's `width`/`height` attributes instead of transform.* Rejected because layout changes trigger reflow and can shift surrounding controls; transform keeps the modal stable.
- *Use CSS `zoom` property.* Rejected because it is non-standard and inconsistently supported across browsers.

## Decision 3: Scroll-to-zoom on desktop and pinch-to-zoom on touch

**Decision**: Handle wheel events on the modal image area for desktop scroll-to-zoom (`preventDefault()` to stop page scrolling), and track multi-touch distance changes for touch pinch-to-zoom (`touch-action: none`, `preventDefault()` on touchmove while two touches are active). Single-touch pan is out of scope.

**Rationale**:
- Wheel events are the desktop convention for zoom; `preventDefault()` keeps the page from scrolling behind the modal while the user zooms.
- Touch pinch (two-finger distance) is the touch convention for zoom; `touch-action: none` prevents the browser from scroll-pinning during the gesture.
- Both input paths write to the same `mapZoomLevel` state, so zoom behavior is consistent across input types.
- Single-touch pan is deferred to keep the initial scope bounded and testable; the spec requires zoom, not pan.

**Alternatives considered**:
- *Use pointer events to unify mouse, touch, and pen.* Rejected because it adds complexity for this single gesture and browser support for pointer-event pinch handling still requires manual distance tracking; separate wheel and touch handlers are clearer and simpler.
- *Allow single-touch drag to pan the zoomed image.* Rejected as out of scope; the spec names scroll-to-zoom and pinch-to-zoom only.
- *Use the browser's built-in page zoom (Ctrl/+).*- Rejected because it zooms the entire page, not just the directory image, and breaks the modal's responsive fit.

## Decision 4: Responsive sizing so no scrolling is required

**Decision**: Cap the modal panel and image within the viewport using viewport-relative constraints (bounded `max-h`/`max-w` relative to `dvh`/`dvw`), with responsive padding and heading sizes on compact viewports, so the image, close button, and modal fit on mobile, tablet, and desktop without scrolling.

**Rationale**:
- Viewport-relative caps adapt from 320px mobile through desktop without fixed pixel heights that could overflow on small screens.
- Reducing padding/heading sizes on compact viewports recovers vertical room for the image and controls (Constitution Principle V).
- The image scales with `max-w-full` and a viewport-bounded `max-h` while preserving aspect ratio via `object-cover`.

**Alternatives considered**:
- *Keep scrolling enabled but cap panel height below the viewport.* Rejected because a scrollbar would still appear when content exceeds the cap, violating "no scrolling required" (FR-002).
- *Use fixed pixel max-height (e.g., `max-h-[600px]`).* Rejected because fixed values do not adapt across 320px mobile through desktop widths and can still overflow on small screens.
- *Fit only on mobile, scroll on desktop.* Rejected because the requirement is no scrolling on all viewports.

## Decision 5: No new dependencies or components

**Decision**: Implement the modal, zoom, and responsive layout using existing Tailwind CSS utilities and React state within `FloatingMenu.jsx`; no new package, component, hook, or state container is introduced.

**Rationale**:
- Tailwind 4 is already configured and provides responsive breakpoints and standard tokens.
- The modal, gallery, and narration concerns remain independent within the existing component; only state and layout utilities are added.
- Introducing a new component or abstraction would add indirection for a single modal layout change.

**Alternatives considered**:
- *Extract a reusable `ZoomableImage` or `ResponsiveModal` component.* Rejected as unnecessary abstraction for a one-off modal; adds files without removing any.
- *Add a viewport-detection hook (e.g., `useMediaQuery`).* Rejected as a new dependency/scope; CSS media queries via Tailwind prefixes handle responsiveness without JavaScript.

## Decision 6: Accessibility and keyboard operability

**Decision**: The modal carries `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, the close button has `aria-label`, the image has meaningful `alt` text, Escape closes the modal, focus moves to the close button on open and returns to the Map button on close, and zoom controls are keyboard-visible (the close button remains reachable at all zoom levels).

**Rationale**:
- Mirrors the existing gallery modal's accessibility contract so screen-reader and keyboard users have a consistent experience.
- Zoom via wheel/pinch is pointer-based; no keyboard zoom shortcut is added because the spec does not require one and the close button must remain reachable at every zoom level.

**Alternatives considered**:
- *Add keyboard shortcuts for zoom in/out (e.g., `+`/`-`).* Rejected because the spec does not require keyboard zoom and adding undocumented shortcuts increases surface area without a requirement.
