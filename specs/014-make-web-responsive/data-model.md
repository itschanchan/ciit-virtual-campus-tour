# Data Model: Make Web Responsive

**Feature**: `014-make-web-responsive` | **Date**: 2026-11-09

## Overview

This feature is UI-only and introduces no new data entities, persistence, or schema changes. All responsive behavior is achieved through CSS class updates on existing React components. Tour content (locations, panoramas, scenes) remains unchanged in `apps/frontend/src/lib/catalog.json`.

## Component State

| Component | State | Purpose |
|-----------|-------|---------|
| Sidebar | `notice` (object) | Locked-floor popover notice with floor name and anchor element |
| Sidebar | `popoverTimerRef` | Timeout ref for delayed popover display |
| Sidebar | `acknowledgementTimerRef` | Timeout ref for reduced-motion acknowledgement |
| Sidebar | `acknowledgedElementRef` | DOM element ref for reduced-motion acknowledgement |
| PanoramaViewer | `viewerStatus` ("loading" \| "ready") | Viewer initialization status |
| PanoramaViewer | `currentSceneId` (string \| null) | Currently displayed panorama scene ID |
| PanoramaViewer | `viewerStartedRef` | Boolean ref preventing re-initialization |
| FloatingMenu | `transcriptOpen` (boolean) | Whether transcript panel is expanded |

## Responsive Layout Rules (UI contract, no data impact)

Sidebar layout is a function of viewport width only — no orientation detection and no data changes:

| Width tier | Media query | Position | Width | Stacking | Background | Backdrop |
|------------|-------------|----------|-------|----------|------------|----------|
| Narrow phone | max-width: 43.75rem (700px) | top-0, full height | 100% | Above header (z-50 > z-40) | Fully opaque | Transparent (hidden behind the opaque sidebar) |
| Tablet / landscape mobile | max-width: 63.9375rem (1023px), above narrow | top-0, full height | min(20rem, 86vw) = 20rem | Below transparent header (z-30, desktop parity) | Surface at 86% | Transparent but clickable (tap to close) |
| Desktop | above 63.9375rem | top-0, full height | 20rem (w-80) | Below transparent header (z-30) | Surface at 86% | None (sidebar closed via toggle) |

Invariants:

- The sidebar never has a top offset, so no transparent header strip appears above it at any width.
- On narrow phone widths the sidebar covers the entire header strip; on tablet and landscape-mobile widths it covers only the header logo area while the location name stays visible to the right.
- The backdrop never dims or tints the page at tablet and landscape-mobile widths; it remains a full-size, fully transparent click target that closes the sidebar (FR-001c).
- Auto-close after floor selection uses `isCompactViewport()` (max-width: 1023px), covering both tiers.

## No Data Entities

No new entities are introduced. The following existing data shapes are referenced but not modified:

- **Location** (from `catalog.json`): `id`, `name`, `order`, `panorama`, `narration`, `gallery` — used by Sidebar to render floor buttons and by Header to display current location name.
- **Scene** (from `data.js`): `id`, `name` — used by PanoramaViewer scene list.

## State Transitions

No state machine changes. Existing component behavior (floor pairing, locked-floor popovers, scene switching, narration) is preserved across all viewports.
