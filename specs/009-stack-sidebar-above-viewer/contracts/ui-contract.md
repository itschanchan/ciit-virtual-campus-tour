# UI Contract: Sidebar ↔ PanoramaViewer via Layout

**Feature**: 009-stack-sidebar-above-viewer
**Created**: 2026-11-07

## Interface Contract

This feature is a frontend web application. The contract is the UI composition contract between `Layout.jsx`, `Sidebar.jsx`, and `PanoramaViewer.jsx`.

### Layout.jsx (composition root)

Renders `Sidebar` and `PanoramaViewer` in a vertical stack. Provides shared state:

| Prop/State | Type | Direction | Description |
|------------|------|-----------|-------------|
| `sidebarOpen` | boolean | internal | Whether sidebar is expanded |
| `setSidebarOpen` | function | internal | Sets sidebar open/closed |
| `currentLocation` | object | from context | Current campus location |
| `locations` | list | from context | All campus floor locations |
| `selectLocation` | function | from context | Handles floor selection |

### Sidebar.jsx

| Prop | Type | Direction | Description |
|------|------|-----------|-------------|
| `locations` | list | in | Campus floor location entries |
| `currentLocationId` | string | in | Currently displayed floor ID |
| `open` | boolean | in | Sidebar expanded/collapsed state |
| `onSelect` | function | in | Called when a floor button is clicked |
| `onClose` | function | in | Called to close the sidebar |
| `onOpen` | function | in | Called to open the sidebar |
| `logoUrl` | string | optional | CIIT logo URL |

Sidebar behavior:
- Renders floor buttons mapped by floor label (not array index)
- Available floors (with panorama) are clickable and call `onSelect(location.id, floor)`
- Unavailable floors are visually distinct and non-clickable
- Toggle button collapses/expands the sidebar vertically

### PanoramaViewer.jsx

| Prop | Type | Direction | Description |
|------|------|-----------|-------------|
| `location` | object | in | Current campus location |
| `onReady` | function | optional | Called when viewer is ready |
| `onError` | function | optional | Called when viewer encounters an error |

PanoramaViewer behavior:
- Exposes `window.__panoramaViewer.switchToSceneId(sceneId)` for Sidebar integration
- Displays the 360-degree panoramic view of the current location
- Maintains current scene state independently of location prop changes

### Window Contract (Sidebar → PanoramaViewer)

| Property | Type | Description |
|----------|------|-------------|
| `window.__panoramaViewer.switchToSceneId(sceneId)` | function | Switches the viewer to the given panorama scene ID |
| `window.__panoramaViewer.getCurrentSceneId()` | function | Returns the currently displayed scene ID |

## Contract Notes

- No external APIs, backend endpoints, or public APIs are affected by this layout-only change
- The existing floor-to-scene switching integration is preserved unchanged
- No new contracts introduced; existing composition pattern is re-arranged vertically
