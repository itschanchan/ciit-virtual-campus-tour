# Feature Specification: Marzipano Panorama Viewer Integration

**Feature Branch**: `006-marzipano-viewer-integration`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Read and analyze docs/prompts/frontend-prompts/marzipano_integration.md file, then create a spec, tasks, and implement the feature in the codebase."

## Clarifications

### Session 2026-11-06

- Q: Should the Marzipano viewer replace the existing React PanoramaViewer, or exist alongside it? → A: The Marzipano viewer becomes the primary panoramic viewer; it reuses the Marzipano.jsx logic and APP_DATA to render the 360-degree scenes and integrates with Sidebar floor navigation.

- Q: Which initial panorama displays when a visitor first opens the site? → A: The Lower Ground (LG) floor first scene, tile ID `0-lg---1`, as specified in the integration guide.

- Q: Are the vendor files (marzipano.js, bowser.min.js, screenfull.min.js) loaded globally or bundled with the app? → A: They are treated as existing vendor assets already present under `vendor/` and are referenced/global-loaded like the original HTML, not npm-installed (`reset.min.css` is intentionally not loaded; Tailwind base styles are the sole reset).
- Q: How should the Marzipano vendor library (`vendor/marzipano.js`) be loaded so `Marzipano.jsx` can access `window.Marzipano` in the Vite React app? → A: Load vendor scripts globally in `index.html` via `<script>` tags (marzipano.js, bowser.min.js, screenfull.min.js) — matches `Marzipano.jsx`'s `window.Marzipano` pattern, no changes to `Marzipano.jsx`.
- Q: How should `PanoramaViewer.jsx` handle `Marzipano.jsx`'s import-time initialization that queries DOM elements before React mounts them? → A: Render DOM skeleton first (`#pano`, `#sceneList`, `#titleBar`, toggles, view controls) in the component body, then dynamically `import()` Marzipano.jsx inside `useEffect` after mount — DOM exists when its IIFE runs.

- Q: Should `reset.min.css` continue to be loaded globally in `index.html`, or stay removed now that Tailwind's own base styles handle resets? → A: Stay removed — Tailwind base styles are the sole reset and FR-010 was updated accordingly.

- Q: Should info hotspots (markers that open a title/text popup) be required behavior, or out of scope? → A: Out of scope — all 54 scenes have empty `infoHotspots`; the entity definition stays as glossary only, with no FR/SC.

- Q: Should the ~709 MB tile image set under `public/tiles/` be committed to the repository, or kept out of git with a documented way to provision it? → A: Commit the tiles — the full tile set under `apps/frontend/public/tiles/` is version-controlled so fresh clones satisfy FR-001 with no provisioning step.

- Q: Should the spec add explicit accessibility acceptance criteria for the viewer controls, or rely on the constitution's general mandate? → A: Extend SC-005 — keyboard operability, visible focus states, and alt text become part of the measurable criterion.

- Q: When a visitor switches floors rapidly while a previous scene is still loading, which scene should the viewer end up showing? → A: Last selection wins — the most recently chosen floor/scene is always the one displayed and the Sidebar highlight matches it.
- Q: Where should the panoramic tile images (`tiles/{id}/{z}/{f}/{y}/{x}.jpg` per APP_DATA) be sourced from — should they be provided as static assets, or should placeholder/generated images be used? → A: Panoramic tile images are provided as static assets and committed under `public/tiles/` (see tile-commit answer above); no generated placeholders are used, though a visible placeholder/empty state remains the fallback when a scene's tiles are missing.

### Session 2026-11-07

- Q: When the displayed panorama scene changes, should the active sidebar button be resolved from the floor code embedded in any scene ID, or only by matching the nine designated first-scene IDs? → A: Parse the floor code from any scene ID — every scene whose ID contains `-lg-` activates the LG button, `-5m-` activates 5M, and so on, so all 54 scenes sync the sidebar (Integration Rule #1), instead of matching only the nine first-scene IDs.

- Q: If a scene's ID contains a floor code that has no sidebar button (an unknown or future floor), what should the sidebar highlight do? → A: Keep the previous floor button active — the highlight does not clear and no fallback floor is forced, so a valid active state is never lost.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View the campus panorama by floor (Priority: P1)

A visitor opens the virtual campus tour and sees a 360-degree panoramic viewer. The first floor shown is Lower Ground (LG), scene `0-lg---1`. From the Sidebar, the visitor can switch floors (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F), and each floor shows its own first scene and interconnected scenes.

**Why this priority**: This is the core value of the feature — delivering the panoramic campus tour experience.

**Independent Test**: Open the tour and confirm the panorama viewer loads the LG first scene; open the Sidebar and select each floor; confirm each floor loads its designated first scene.

**Acceptance Scenarios**:

1. **Given** no floor is selected, **When** the tour loads, **Then** the viewer displays the LG first scene `0-lg---1`.
2. **Given** the Sidebar is open, **When** the visitor selects a floor button, **Then** the viewer switches to that floor's first scene.
3. **Given** a floor is selected, **When** the visitor clicks an interconnected scene link inside the panorama, **Then** the viewer switches to that connected scene.

---

### User Story 2 - Navigate between interconnected scenes within a floor (Priority: P2)

Within any floor, the panoramic scenes are linked to one another (for example LG scenes `x-lg---x`). A visitor can walk through the floor by clicking link hotspots in the panorama.

**Why this priority**: Interconnected navigation is what makes each floor explorable rather than a single static viewpoint.

**Independent Test**: Within one floor, follow link hotspots across scenes and confirm the viewer transitions between them without reloading the page.

**Acceptance Scenarios**:

1. **Given** a floor's first scene is displayed, **When** the visitor clicks a link hotspot, **Then** the viewer switches to the target scene of that floor.
2. **Given** the visitor moves between scenes, **Then** the current scene is highlighted in the Sidebar floor list.

---

### User Story 3 - Viewer controls and UI (Priority: P3)

The panorama viewer includes standard controls: autorotate toggle, fullscreen toggle, scene list toggle, and directional view controls (up/down/left/right/in/out). The current scene name shows in the title bar.

**Why this priority**: Visitors expect familiar 360-viewer controls to look around and explore comfortably.

**Independent Test**: Confirm each control button is present and produces its expected effect on the view.

**Acceptance Scenarios**:

1. **Given** the viewer is open, **When** the visitor clicks autorotate, **Then** the panorama begins or stops rotating.
2. **Given** the viewer is open, **When** the visitor clicks fullscreen, **Then** the viewer expands to fullscreen.
3. **Given** the viewer is open, **When** the visitor uses directional controls, **Then** the view pans or zooms accordingly.

---

### Edge Cases

- A floor button is selected but that floor has no panorama data.
- The viewer loads on a narrow mobile viewport.
- The visitor switches floors rapidly while a previous scene is still loading → **resolved**: last selection wins; the most recently chosen scene is the one displayed and the Sidebar highlight matches it (see FR-013).
- The Sidebar is collapsed while the panorama is displayed.
- A scene has link hotspots pointing to scenes on other floors → **resolved**: the Sidebar highlight follows the floor parsed from the newly displayed scene's ID (for example `2-lg---3` → `5-ug---1` activates the UG button).
- A displayed scene's ID contains a floor code with no sidebar button (unknown or future floor) → **resolved**: the previously highlighted floor button stays active; the highlight is not cleared and no fallback floor is forced.
- Marzipano.jsx IIFE queries DOM elements at import time before React mounts them, causing TypeError caught by ErrorBoundary; PanoramaViewer.jsx must render DOM skeleton first, then dynamic-import Marzipano.jsx after mount.
- A scene's panorama tile images are missing from `public/tiles/`; the viewer displays a visible placeholder/empty state instead of failing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The panorama viewer MUST load and display the 360-degree scene for the Lower Ground first tile `0-lg---1` when the tour first opens, provided panoramic tile images exist under `public/tiles/`; otherwise it MUST display a visible placeholder/empty state.
- **FR-002**: Each Sidebar floor button (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F) MUST switch the viewer to that floor's designated first scene.
- **FR-003**: Interconnected scenes within a floor MUST be reachable by clicking link hotspots in the panorama.
- **FR-004**: The current scene name MUST be displayed in the viewer title bar.
- **FR-005**: The viewer MUST include an autorotate toggle, fullscreen toggle, scene list toggle, and directional view controls.
- **FR-006**: The current floor selection in the Sidebar MUST be highlighted whenever the visitor switches scenes. The floor is resolved by parsing the floor code from the displayed scene's ID (for example any `*-lg-*` scene → LG, any `*-5m-*` scene → 5M), so every one of the 54 scenes — including those reached by link hotspots — syncs its floor button. If the floor code cannot be resolved to a sidebar button, the previously highlighted floor stays active.
- **FR-007**: The viewer MUST work on desktop and narrow mobile viewports.
- **FR-008**: Marzipano.jsx MUST contain the complete Marzipano viewer logic (scene creation, hotspots, controls, autorotate, fullscreen) and be usable by PanoramaViewer.jsx via dynamic `import()` after DOM mount so its IIFE queries rendered elements.
- **FR-009**: APP_DATA (scene data: ids, names, tile sizes, levels, link hotspots, info hotspots, initial view parameters) MUST drive the scenes shown in the viewer.
- **FR-010**: Vendor assets MUST be available to the viewer: `marzipano.js`, `bowser.min.js`, and `screenfull.min.js` are loaded globally via `<script>` tags in `index.html` as in the original HTML structure, alongside navigation images served from `public/img/`. `reset.min.css` MUST NOT be loaded; Tailwind's base styles in `index.css` are the sole CSS reset.
- **FR-011**: Global styles (box-sizing, body overflow, font, colors) from the original CSS MUST be migrated to Tailwind CSS within PanoramaViewer.jsx or index.css.
- **FR-012**: PanoramaViewer.jsx MUST integrate with Sidebar.jsx navigation buttons so selecting a floor changes the displayed scene.
- **FR-013**: When floors or scenes are switched rapidly while a previous scene is still loading, the most recently selected scene MUST be the one ultimately displayed, and the Sidebar highlight MUST match it (last selection wins).

### Key Entities

- **Scene**: One 360-degree viewpoint. It has a tile id (for example `0-lg---1`), a display name, tile sizes/levels, face size, initial view parameters, link hotspots, and info hotspots.
- **Floor**: A campus level (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F) represented by a Sidebar button and a set of interconnected scenes.
- **APP_DATA**: The data source (originally `lib/data.js`) holding all scene definitions and settings needed by the Marzipano API.
- **Panorama viewer**: The React component (PanoramaViewer.jsx) that renders the Marzipano 360-degree view and its controls.
- **Link hotspot**: An interactive marker in the panorama that switches to another scene when clicked.
- **Info hotspot**: An interactive marker in the panorama that shows title and text content when opened. Out of scope for this feature — every scene in `APP_DATA` defines an empty `infoHotspots` list, so no requirement or acceptance criterion applies.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of floor selections in the Sidebar load the correct floor's first scene without a page reload.
- **SC-002**: The initial tour load displays scene `0-lg---1` (LG first tile).
- **SC-003**: 100% of link hotspot clicks within a floor switch to the target scene of the same floor.
- **SC-004**: The current scene name is visible in the title bar for 100% of displayed scenes.
- **SC-005**: All viewer controls (autorotate, fullscreen, scene list, directional) respond to interaction on both desktop and mobile viewports; every control is operable by keyboard with a visible focus state, and panorama/control images expose meaningful alt text.
- **SC-006**: No page reload occurs when switching between floors or scenes.
- **SC-007**: The current floor in the Sidebar is highlighted for 100% of scene switches, where the floor is derived from the floor code in the displayed scene's ID (all 54 scenes covered, not just the nine first scenes).
- **SC-008**: Vendor assets load successfully and the viewer initializes without JavaScript errors in the browser console.

## Assumptions

- The Marzipano vendor library and supporting vendor files already exist under `vendor/` and are loadable by the app.
- The complete panorama tile set (~709 MB under `apps/frontend/public/tiles/`, referenced as `tiles/{id}/{z}/{f}/{y}/{x}.jpg` by `APP_DATA`) is committed to version control so a fresh clone satisfies FR-001 without a separate provisioning step; it is not gitignored.
- APP_DATA already exists under `src/lib/data.js` and contains all 54 scenes with ids, names, levels, link hotspots, info hotspots, and initial view parameters.
- Marzipano.jsx already contains the full vanilla Marzipano viewer logic and is intended to be imported/used by PanoramaViewer.jsx.
- PanoramaViewer.jsx already exists as a React viewer component and will be extended to integrate Marzipano.jsx and Sidebar navigation.
- Sidebar.jsx already contains floor buttons for LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F.
- No new npm packages are required beyond what the project already declares.
- The integration follows the sequential prerequisite order: assets → APP_DATA → HTML structure → JavaScript structure → CSS structure → Sidebar integration.
- No user accounts, authentication, or persistence of the viewed scene is required.
- Scene switching does not require server round-trips; all tile data is served statically.
