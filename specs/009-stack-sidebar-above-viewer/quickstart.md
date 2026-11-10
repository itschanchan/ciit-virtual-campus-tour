# Quickstart: Validate Stacked Sidebar Above Panorama Viewer

**Feature**: 009-stack-sidebar-above-viewer
**Created**: 2026-11-07

## Purpose

Document runnable validation scenarios that prove the stacked sidebar-above-viewer layout works end-to-end on both desktop and mobile viewports.

## Prerequisites

- Repository cloned and dependencies installed (`npm install` at workspace root, then `npm run setup`)
- Frontend dev server runnable (`npm run dev` at workspace root, or frontend independently)
- A browser for manual verification (desktop and mobile viewport)

## Validation Scenarios

### Scenario 1: Sidebar is stacked above viewer on page load

1. Start the frontend dev server.
2. Open the virtual campus tour in a desktop browser.
3. Observe the page layout: the campus floor sidebar should appear directly above the 360-degree panorama viewer in a vertical stack.
4. Confirm the sidebar and viewer do not overlap each other.

**Expected outcome**: Sidebar is positioned above the viewer; both are fully visible without overlap.

### Scenario 2: Floor button click switches viewer scene

1. With the tour loaded and sidebar open, identify a floor button with an available panorama tile.
2. Click the floor button.
3. Confirm the panorama viewer switches to that floor's designated scene.

**Expected outcome**: Viewer displays the selected floor's panorama scene; button is not disabled.

### Scenario 3: Unavailable floor button is non-clickable

1. Identify a floor button without an available panorama tile (visually marked unavailable).
2. Click the floor button.
3. Confirm the viewer does not switch scenes.

**Expected outcome**: Button is visually distinct and non-clickable; viewer scene unchanged.

### Scenario 4: Stacked layout works on mobile viewport

1. Open the tour in a mobile browser or use browser device emulation (mobile viewport).
2. Confirm the sidebar remains above the viewer in a vertical stack.
3. Confirm floor buttons remain tappable and switch the viewer scene.

**Expected outcome**: Stacked layout is usable on mobile; floor navigation accessible.

### Scenario 5: Sidebar toggle remains operable

1. Click the sidebar toggle button (chevron) to collapse the sidebar.
2. Confirm the sidebar collapses vertically, giving more space to the viewer.
3. Click the toggle again to expand the sidebar.
4. Confirm the sidebar re-appears above the viewer.

**Expected outcome**: Toggle collapses and expands the sidebar without breaking the stacked layout.

## Test Commands

- Run frontend lint: `npm run lint` (workspace root)
- Run frontend tests: `npm run test` (workspace root; note backend tests are deferred per AGENTS.md)

## References

- Feature specification: `specs/009-stack-sidebar-above-viewer/spec.md`
- UI contract: `specs/009-stack-sidebar-above-viewer/contracts/ui-contract.md`
- Data model: `specs/009-stack-sidebar-above-viewer/data-model.md`
