# Research: Hide Gallery and Floating Nav When Sidebar Opens on Mobile

**Feature**: `015-hide-gallery-nav-mobile` | **Date**: 2026-11-09

## Decisions

### Decision 1: Coordinate sidebar open state with gallery and floating nav visibility through the existing tour context

**Decision**: The sidebar `open` state already lives in the tour context (`useTour`, provided by Layout) and is passed to `Sidebar`. The same `sidebarOpen` value will be passed to `FloatingMenu` (in Layout) and to `RoomGallery` (via `Panorama`), so both can hide themselves when the sidebar is open on a mobile viewport.

**Rationale**: The sidebar open state is a single source of truth already available at the Layout level where FloatingMenu is rendered and where Panorama (which renders RoomGallery) is mounted. No new state management or context is needed. This keeps the change minimal and consistent with the existing architecture (per AGENTS.md KISA principle).

**Alternatives considered**:
- Local state in each component: Rejected — would require each component to independently detect sidebar state, causing inconsistency and duplication.
- New context provider: Rejected — the tour context already exposes `sidebarOpen`; a new provider adds unnecessary abstraction.

### Decision 2: Mobile-only hiding using the existing `isCompactViewport()` utility

**Decision**: The gallery and floating nav hide only when `sidebarOpen` is true AND `isCompactViewport()` returns true (max-width 1023px). On desktop viewports they remain visible regardless of sidebar state.

**Rationale**: The spec requires hiding on mobile only. The project already defines `isCompactViewport()` in `apps/frontend/src/lib/viewport.js` using `window.matchMedia('(max-width: 1023px)')`, which matches the project's mobile/tablet breakpoint (`compact`). Reusing it avoids introducing a new breakpoint or JavaScript viewport detection (per AGENTS.md responsive rules).

**Alternatives considered**:
- New `isMobileViewport()` utility: Rejected — duplicates `isCompactViewport()` with a narrower definition; the sidebar overlays the screen across the full compact range.
- CSS-only media query hiding: Rejected — the decision to hide depends on both sidebar state (React state) and viewport (media query), requiring component-level coordination.

### Decision 3: "Hidden" means not rendered, not visually hidden

**Decision**: When the conditions are met, `RoomGallery` and `FloatingMenu` return `null` (not rendered) rather than using CSS `visibility: hidden` or `opacity: 0`.

**Rationale**: Returning `null` fully removes the components from the DOM, guaranteeing nothing is visible through the sidebar's tinted background and eliminating any chance of interaction or focus on hidden controls. This matches FR-005 ("no part ... is visible through the sidebar's tinted background").

**Alternatives considered**:
- CSS `visibility: hidden`: Rejected — the component remains in the DOM and could still receive focus or be announced by screen readers.
- CSS `opacity: 0`: Rejected — the component remains present and could overlap the sidebar content.

### Decision 4: Use the `compact` breakpoint (max-width 1023px) as the mobile boundary

**Decision**: The mobile/tablet boundary uses the existing `compact` custom variant (max-width 63.9375rem / ~1023px), consistent with `isCompactViewport()` and the project's existing responsive conventions.

**Rationale**: AGENTS.md prohibits custom arbitrary breakpoints. The `compact` variant already covers the device category where the sidebar overlays the screen as a tinted panel. Desktop widths (above 1023px) are unaffected.

**Alternatives considered**:
- `narrow` breakpoint (max-width 43.75rem / ~700px): Rejected — would exclude landscape phones and tablets between 700–1023px where the sidebar still overlays as a tinted panel.
- Custom breakpoint: Rejected per AGENTS.md ("Do not introduce unnecessary custom breakpoints").

## No NEEDS CLARIFICATION Items

All clarifications from the specification phase are resolved; the spec contains no `[NEEDS CLARIFICATION]` markers.
