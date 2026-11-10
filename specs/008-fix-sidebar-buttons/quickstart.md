# Quickstart: Validate Fix Sidebar Buttons

## Purpose

Runnable validation scenarios that prove the sidebar floor button fix works end-to-end. Confirms that buttons for floors with available panorama tiles are clickable and switch the viewer to the correct scene.

## Prerequisites

- Repository dependencies installed (`npm install` at workspace root, then `npm run setup`)
- Frontend dev server runnable (`npm run dev` starts frontend and backend)
- The `Sidebar` component receives a `locations` prop with at least one location that has a `panorama` field

## Setup

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open the virtual campus tour in a browser at the frontend dev URL (default `http://localhost:5173`).

3. Open the sidebar (expand toggle) to reveal the floor buttons.

## Validation Scenarios

### Scenario 1: Available floor button is clickable and switches the scene

**Given** the tour loads with floor buttons displayed in the sidebar
**When** the visitor clicks a floor button whose floor has an available panorama tile (e.g. LG, UG, 4F–9F)
**Then** the button is not disabled
**And** the panorama viewer switches to that floor's designated scene
**And** the button reflects the current/selected state

### Scenario 2: Unavailable floor button is not clickable

**Given** a floor button corresponds to a floor without an available panorama tile (e.g. 1F, 2F, 3F, 10F, 11F)
**When** the visitor views the sidebar
**Then** the button is visually marked as unavailable
**And** the button is disabled
**When** the visitor clicks it
**Then** the viewer does not switch to a different scene

### Scenario 3: Locked floor button shows notice, does not switch scene

**Given** a floor button is locked
**When** the visitor clicks it
**Then** a "coming soon" notice appears
**And** the viewer does not switch scenes

### Scenario 4: Rapid successive clicks on available buttons

**Given** multiple floor buttons have available tiles
**When** the visitor clicks them in rapid succession
**Then** each click switches the viewer to the corresponding floor's scene without errors

## Run Commands

- Lint the frontend:

  ```sh
  npm run lint
  ```

- Run frontend tests (Vitest):

  ```sh
  npm run test
  ```

  Expected: Sidebar tests pass; no test failures related to button click behavior.

## Expected Outcomes

- 100% of sidebar floor buttons with available panorama tiles are clickable and switch the viewer to the correct scene.
- 0% of sidebar floor buttons without available panorama tiles are clickable.
- Visitors can distinguish clickable from unavailable buttons at a glance.
- Floor-to-scene switching completes without errors for every clickable floor button.

## References

- Feature spec: `specs/008-fix-sidebar-buttons/spec.md`
- UI contract: `specs/008-fix-sidebar-buttons/contracts/ui-contract.md`
- Data model: `specs/008-fix-sidebar-buttons/data-model.md`
