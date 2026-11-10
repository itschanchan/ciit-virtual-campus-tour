# Data Model: Hide Gallery and Floating Nav When Sidebar Opens on Mobile

**Feature**: `015-hide-gallery-nav-mobile` | **Date**: 2026-11-09

## Overview

This feature is UI-only and introduces no new data entities, persistence, or schema changes. It adds a visibility rule to existing components: the room gallery (`RoomGallery`), the gallery button ("View gallery" in `Panorama.jsx`), and the floating navigation bar (`FloatingMenu`) are not rendered when the sidebar is open on a mobile viewport. Tour content (locations, panoramas, scenes, galleries) remains unchanged in `apps/frontend/src/lib/catalog.json`.

## Component State

| Component | State | Source | Purpose |
|-----------|-------|--------|---------|
| Layout | `sidebarOpen` (boolean) | `useTour` context | Whether the campus floor sidebar is open; shared with FloatingMenu, Panorama (gallery button), and RoomGallery |
| FloatingMenu | `sidebarOpen` (boolean) | Prop from Layout | Determines whether to render the floating nav bar |
| Panorama | `sidebarOpen` (boolean) | Prop from Layout | Determines whether to render the gallery button and passes to RoomGallery |
| RoomGallery | `sidebarOpen` (boolean) | Prop from Panorama | Determines whether to render the room gallery |

No new component-local state is introduced. Visibility is a pure function of the existing `sidebarOpen` prop and the existing `isCompactViewport()` viewport check.

## Responsive Visibility Rule (UI contract, no data impact)

| Viewport | Sidebar state | RoomGallery rendered | Gallery button rendered | FloatingMenu rendered |
|----------|--------------|----------------------|------------------------|-----------------------|
| Mobile / tablet (max-width 1023px) | Open | No | No | No |
| Mobile / tablet (max-width 1023px) | Closed | Yes (if gallery open) | Yes | Yes |
| Desktop (above 1023px) | Open | Yes (if gallery open) | Yes | Yes |
| Desktop (above 1023px) | Closed | Yes (if gallery open) | Yes | Yes |

Invariants:

- When hidden, the component returns `null` (not rendered); nothing is visible through the sidebar's tinted background.
- Gallery open state (user tapped "View gallery") is independent of sidebar state; hiding is purely sidebar-driven.
- When the sidebar closes on mobile, all three components re-render immediately with their previous content.
- No data entities are created, modified, or deleted.

## No Data Entities

No new entities are introduced. The following existing data shapes are referenced but not modified:

- **Location** (from `catalog.json`): `id`, `name`, `order`, `panorama`, `narration`, `gallery` — `gallery` drives RoomGallery image content.
- **Sidebar open state** (tour context): `sidebarOpen` boolean — already exists; reused for visibility coordination.

## State Transitions

| Trigger | Before | After |
|---------|--------|-------|
| Sidebar opens on mobile | Gallery/gallery button/floating nav visible | Gallery/gallery button/floating nav not rendered |
| Sidebar closes on mobile | Gallery/gallery button/floating nav not rendered | Gallery/gallery button/floating nav visible |
| Sidebar opens on desktop | Gallery/gallery button/floating nav visible | Gallery/gallery button/floating nav visible (unchanged) |
| User taps "View gallery" while sidebar closed on mobile | Gallery not rendered | Gallery rendered (sidebar closed) |
| User opens sidebar while gallery open on mobile | Gallery rendered | Gallery not rendered |

## Validation

The visibility rule can be validated by checking:
- On mobile with sidebar open: `RoomGallery`, the gallery button, and `FloatingMenu` are absent from the DOM.
- On mobile with sidebar closed: `RoomGallery`, the gallery button, and `FloatingMenu` are present (subject to their own open conditions).
- On desktop with sidebar open: `RoomGallery`, the gallery button, and `FloatingMenu` are present.
