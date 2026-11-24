# Research: Make ViewGallery Modal Responsive on All Viewports

**Feature**: `026-make-viewgallery-responsive`
**Date**: 2026-11-15

## Purpose

Record the responsive-layout decisions and rejected alternatives for making the ViewGallery modal inside `FloatingMenu.jsx` fit desktop, tablet, and mobile viewports without scrolling. The feature specification has no unresolved `[NEEDS CLARIFICATION]` markers, so this document focuses on layout choices and responsive best practices.

## Findings Summary

- The ViewGallery modal currently lives in `apps/frontend/src/components/FloatingMenu.jsx` as a fixed backdrop (`fixed inset-0`) containing an inner panel (`section#room-gallery`).
- The panel uses `overflow-y-auto`, which permits scrolling and directly conflicts with the "no scrolling required" requirement (FR-002–FR-005).
- The image uses `aspect-16/10 w-full object-cover`, which can exceed the available viewport height on small screens and force vertical scrolling.
- Navigation arrows use absolute `left-3`/`right-3` positioning, which can overflow near viewport edges on narrow screens.
- Padding (`p-5`) and heading sizes are fixed across viewports and may consume too much vertical room on compact mobile viewports.
- Mobile handling already uses `tiny:`-prefixed utilities, but the panel still enables vertical scrolling via `overflow-y-auto`.
- Existing keyboard handling (Escape, ArrowLeft, ArrowRight), focus management, close button, caption, position counter, empty state, and image-load-fallback behavior are correct and are preserved.
- The project uses Tailwind CSS 4 via `@tailwindcss/vite`, so responsive utilities (`sm:`, `md:`, `lg:`) and standard tokens are available without new dependencies.
- Baseline: `npm --prefix apps/frontend run test`, `npm run lint`, and `npm run build` pass.

## Decision 1: How to eliminate scrolling from the gallery modal

**Decision**: Remove `overflow-y-auto` from the gallery panel and instead size the panel to fit within the viewport using viewport-relative constraints, scaling the image down so the full content (image, caption, counter, arrows, close button) fits without a scrollbar on any supported viewport.

**Rationale**:
- `overflow-y-auto` is the direct cause of scrolling; removing it is the minimal change that satisfies FR-002.
- Viewport-relative caps (`max-h` bounded to available `dvh`, `max-w` bounded to `dvw`) keep the panel inside the viewport without authoring fixed pixel heights.
- Scaling the image with `max-w-full` and a viewport-bounded `max-h` preserves aspect ratio while ensuring the image never forces the panel beyond the screen.
- This approach is implementation-agnostic at the spec level and uses standard responsive CSS utilities already available in the project.

**Alternatives considered**:
- *Keep `overflow-y-auto` but cap panel height below the viewport.* Rejected because a scrollbar would still appear when content exceeds the cap, violating "no scrolling required" (FR-002).
- *Use a fixed pixel max-height (e.g., `max-h-[600px]`).* Rejected because fixed values do not adapt across 320px mobile through desktop widths and can still overflow on small screens.
- *Make the panel scrollable only on mobile and fit on desktop.* Rejected because the requirement is no scrolling on all viewports, and a conditional scrollbar complicates testing and consistency.

## Decision 2: Image sizing on compact viewports

**Decision**: Constrain the gallery image with `max-w-full` and a viewport-bounded maximum height so it scales down within the available screen height while preserving its 16:10 aspect ratio.

**Rationale**:
- The current `aspect-16/10 w-full` fixes the aspect ratio but lets the height grow unbounded relative to the viewport, forcing scroll on phones.
- A viewport-bounded `max-h` (for example a fraction of `dvh` minus header/caption/controls room) keeps the image and its siblings inside the screen.
- `object-cover` is retained so the image fills its constrained box without distortion.

**Alternatives considered**:
- *Use `object-contain` to always show the whole image.* Rejected because `object-contain` can leave letterboxing and changes the current visual treatment; `object-cover` with a bounded box preserves the existing look.
- *Crop the image to a fixed height.* Rejected because fixed heights do not adapt across viewports and can still overflow on small screens.

## Decision 3: Compact-viewport spacing and arrow placement

**Decision**: Reduce padding and heading sizes on compact viewports so header, image, caption, counter, and controls all fit, and position previous/next arrows so they remain within the panel/viewport on narrow screens.

**Rationale**:
- Fixed `p-5` padding and large headings consume vertical room that is scarce on 320px-wide mobile viewports; responsive spacing (smaller on compact viewports) recovers room for content.
- Absolute arrows at `left-3`/`right-3` can sit outside the panel edge on narrow screens; insetting them or constraining them within the panel keeps them reachable (FR-004).
- Responsive prefixes (`sm:`, `md:`) apply tighter rules only below tablet breakpoints while preserving generous desktop sizing.

**Alternatives considered**:
- *Hide navigation arrows on mobile and rely only on arrow keys.* Rejected because touch users need visible previous/next controls, and FR-004 requires arrows reachable without scrolling on all viewports.
- *Stack arrows below the image.* Rejected because it adds vertical height and moves controls away from the image, increasing the chance of scrolling; insetting within the image area is more compact.

## Decision 4: No new dependencies or components

**Decision**: Implement the responsive layout using existing Tailwind CSS utilities within `FloatingMenu.jsx`; no new package, component, hook, or state container is introduced.

**Rationale**:
- Tailwind 4 is already configured and provides responsive breakpoints and standard spacing/sizing tokens.
- The gallery and narration concerns remain independent within the existing component; only layout utilities change.
- Introducing a new component or abstraction would add indirection for a single-layout adjustment.

**Alternatives considered**:
- *Extract a reusable `ResponsiveModal` component.* Rejected as unnecessary abstraction for a one-off modal layout change; adds files without removing any.
- *Add a viewport-detection hook (e.g., `useMediaQuery`).* Rejected as a new dependency/scope and because CSS media queries via Tailwind prefixes handle responsiveness without JavaScript.
