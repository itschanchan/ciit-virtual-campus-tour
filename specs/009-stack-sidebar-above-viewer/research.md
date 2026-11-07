# Research: Stack Sidebar Above Panorama Viewer

**Feature**: 009-stack-sidebar-above-viewer
**Created**: 2026-11-07

## Decisions

### Decision: Stack Sidebar directly above PanoramaViewer using CSS flex column layout

**What was chosen**: Modify `Layout.jsx` to render `Sidebar` and `PanoramaViewer` in a vertical stack (flex column) instead of the current side-by-side (flex row) arrangement. The Sidebar occupies the top portion and the PanoramaViewer occupies the bottom portion, filling available height.

**Rationale**: Directly satisfies the user requirement ("sidebar placed on top of the panorama viewer like a stack"). A vertical stack gives the panorama viewer maximum horizontal width while keeping floor navigation immediately accessible above it. Using flex column with appropriate `min-h-0` constraints prevents overflow and keeps both sections visible.

**Alternatives considered**:

| Alternative | Why Rejected |
|-------------|--------------|
| Keep side-by-side layout (current) | Does not satisfy the user requirement to stack sidebar above viewer |
| Sidebar overlaying viewer (absolute position) | Would occlude the panorama canvas, violating FR-002 (no overlap) and hiding content |
| Sidebar below viewer | Does not match user requirement ("sidebar on top") |

### Decision: Sidebar toggle behavior adapts to stacked layout

**What was chosen**: The Sidebar's existing toggle button (chevron) remains but its positioning and behavior are adapted so the sidebar collapses/expands vertically above the viewer rather than sliding from the side.

**Rationale**: FR-005 requires the sidebar toggle to remain operable in the stacked layout. Adapting the existing toggle avoids introducing new interaction patterns while keeping floor navigation accessible.

**Alternatives considered**:

| Alternative | Why Rejected |
|-------------|--------------|
| Remove toggle entirely, sidebar always visible | Removes user control over screen real estate; viewer loses vertical space when sidebar not needed |
| Keep side-slide toggle behavior | In a vertical stack, side-sliding is visually inconsistent and may cause layout shift |

### Decision: No changes to floor-to-scene switching behavior

**What was chosen**: The existing `window.__panoramaViewer.switchToSceneId` integration between Sidebar and PanoramaViewer remains unchanged.

**Rationale**: The spec assumption states existing floor-to-scene switching behavior remains unchanged; only the layout arrangement changes. This minimizes regression risk.

**Alternatives considered**: None needed — the integration already works and is out of scope for this layout-only feature.

## Open Questions

None. All requirements from the feature spec are clear and have reasonable defaults. No `[NEEDS CLARIFICATION]` markers remain.

## Dependencies

- Existing Sidebar component (`apps/frontend/src/components/Sidebar.jsx`) — provides floor buttons and toggle
- Existing PanoramaViewer component (`apps/frontend/src/components/PanoramaViewer.jsx`) — provides 360-degree view
- Existing Layout.jsx composition — the file to modify for the stacked arrangement
- TailwindCSS utility classes — used for flex layout and responsive utilities
