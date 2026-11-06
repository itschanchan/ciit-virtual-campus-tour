# Research: Marzipano Panorama Viewer Integration

**Feature**: Marzipano Panorama Viewer Integration
**Branch**: `006-marzipano-viewer-integration`
**Date**: 2026-11-06

## Research Item 1: Marzipano vendor library integration with React

**Decision**: Load the Marzipano vendor library (`vendor/marzipano.js`) as a global script and expose it on `window.Marzipano`; `Marzipano.jsx` imports it via the global and initializes the viewer inside a React `useEffect` with a ref'd DOM container. `PanoramaViewer.jsx` imports `Marzipano.jsx` and passes scene data from `APP_DATA` (`src/lib/data.js`).

**Rationale**: The original HTML loads `vendor/marzipano.js` as a `<script>` tag and references `window.Marzipano`. The existing `Marzipano.jsx` already follows this pattern (`var Marzipano = window.Marzipano`). The existing `lib/marzipano.js` already imports the `marzipano` npm package, but the spec's `Marzipano.jsx` uses the vendor global. Using the vendor global avoids adding a new npm dependency (constitution requires maintainer approval for new packages; spec assumptions state no new packages are needed). `Marzipano.jsx` remains unchanged per migration rule ("Do not change anything inside the Marzipano.jsx file").

**Alternatives considered**:
- Install `marzipano` from npm: Rejected — adds an unapproved dependency; `Marzipano.jsx` must remain unchanged and already uses `window.Marzipano`.
- Bundle vendor files with Vite: Rejected — vendor files already exist under `vendor/` and are referenced like the original HTML; bundling changes the asset delivery model unnecessarily.

## Research Item 2: Lazy-loading panoramic tile assets on mobile

**Decision**: Panoramic tile slices are served statically from `public/tiles/` (one directory per scene id, e.g. `tiles/0-lg---1/{z}/{f}/{y}/{x}.jpg`); control/hotspot icons come from `public/img/`; Marzipano's `ImageUrlSource` loads tiles on demand by zoom/face level as the user looks around. No upfront download of all tiles. The initial scene loads only its visible tiles; adjacent floors' tiles are not preloaded. The full ~709 MB tile set is committed to git (clarification 2026-11-06) so fresh clones satisfy FR-001 without provisioning; `public/panoramas/` holds only `placeholder/equirect.svg`.

**Rationale**: Constitution Principle V requires the initial view to remain interactive on constrained mobile connections and assets to be lazy-loaded or deferred. Marzipano's cube-image source inherently loads tiles per level on demand, satisfying lazy-loading without custom code. Vite serves `public/` at the web root, so URLs built at runtime as `tiles/{id}/...` resolve only for assets under `public/` — `src/assets/**` is never statically reachable (that misplacement was the original "panoramas not rendering" bug).

**Alternatives considered**:
- Preload all tiles for all scenes: Rejected — violates lazy-loading requirement; wastes bandwidth on mobile.
- Equirectangular single-image fallback: Rejected — the asset structure is cube-map tiles (`{z}/{f}/{y}/{x}.jpg`); Marzipano is designed for cube geometry.

## Research Item 3: Keyboard-accessible 360-degree viewer controls

**Decision**: `PanoramaViewer.jsx` provides a focusable container (`tabIndex={0}`) with an `onKeyDown` handler mapping arrow keys to yaw/pitch and +/- to zoom, matching the existing implementation. View control buttons (up/down/left/right/in/out) are focusable `<button>` elements with visible focus states. The Sidebar floor buttons are already keyboard-operable with focus styles.

**Rationale**: Constitution Principle V requires interactive controls to be keyboard operable with visible focus states. The existing `PanoramaViewer.jsx` already implements arrow-key navigation (`handleKeyDown`) and has `tabIndex={0}` on the container. View control buttons in the original HTML are `<a>` elements; migrating them to `<button>` elements improves native keyboard support.

**Alternatives considered**:
- Rely only on mouse drag: Rejected — not keyboard operable; violates Principle V.
- Custom key handling without visible focus: Rejected — violates visible focus state requirement.

## Research Item 4: Global CSS strategy (Tailwind + legacy Marzipano styles)

**Decision**: Drop `reset.min.css` entirely (FR-010); Tailwind's base/preflight is the sole reset. The Marzipano viewer globals (`#pano`, title bar, hotspots) live in `@layer base` and the hotspot classes (`.link-hotspot*`, `.link-hotspot-tooltip`) in `@layer components` inside `src/index.css`. The legacy `html, body { overflow: hidden; background: #000; color: #fff }` overrides are dropped — `Layout.jsx` owns sizing, background, and overflow.

**Rationale**: Unlayered CSS outranks every `@layer` in the cascade, so the previously appended unlayered Marzipano block overrode every Tailwind utility/base rule — the root cause of the "styles not rendering properly" bug. `reset.min.css` additionally clobbered heading/list typography that the app depends on.

**Alternatives considered**:
- Keep `reset.min.css` and adapt Tailwind around it: Rejected (clarified 2026-11-06) — reintroduces the typography regression and keeps two competing resets.
- Move Marzipano globals into Tailwind `@utilities`: Rejected — they are element/ID selectors, which belong in base/components layers.

## Consolidated Decisions

| Item | Decision |
|------|----------|
| Marzipano library loading | Global vendor script (`window.Marzipano`), `Marzipano.jsx` unchanged; DOM skeleton rendered first, then dynamic `import()` in `useEffect` |
| Asset delivery | Static tiles under `public/tiles/` (committed to git), icons under `public/img/`, lazy-loaded by Marzipano on demand |
| Keyboard interaction | Focusable container + arrow keys + +/- zoom; focusable control buttons with visible focus |
| New npm packages | None required |
| CSS migration | `reset.min.css` removed; Marzipano CSS → `@layer base` / `@layer components` in `src/index.css` |
| Info hotspots | Out of scope — all 54 scenes have empty `infoHotspots` |
| Rapid floor switching | Last selection wins (FR-013) |

All `NEEDS CLARIFICATION` items from the spec are resolved. Research complete.
