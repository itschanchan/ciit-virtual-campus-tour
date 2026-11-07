# Quickstart: Validate Match Sidebar Toggle Opacity to Sidebar

## Purpose

Runnable validation scenarios that prove the sidebar toggle button background opacity matches the sidebar background opacity, so the toggle reads as one continuous piece attached to the sidebar edge.

## Prerequisites

- Repository dependencies installed (`npm install` at workspace root, then `npm run setup`)
- Frontend dev server runnable (`npm run dev` starts frontend and backend)
- The `Sidebar` component is mounted with the sidebar toggle visible

## Setup

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open the virtual campus tour in a browser at the frontend dev URL (default `http://localhost:5173`).

3. Open the sidebar (click the expand toggle) to reveal the sidebar and toggle button.

## Validation Scenarios

### Scenario 1: Toggle button opacity matches sidebar opacity when open

**Given** the sidebar is open
**When** the sidebar background opacity is inspected
**Then** the toggle button background opacity equals the sidebar background opacity
**And** the toggle reads as one continuous piece attached to the sidebar edge

### Scenario 2: Toggle and sidebar opacity remain matched during animation

**Given** the sidebar is open
**When** the visitor clicks the toggle to close the sidebar
**Then** the toggle button and sidebar maintain matching opacity for the entire closing animation duration
**And** no visual seam or separation appears between them during the transition

### Scenario 3: Toggle opacity matches on compact mobile viewport

**Given** the tour is viewed on a narrow mobile viewport (compact mode)
**When** the sidebar is open
**Then** the toggle button background opacity matches the sidebar background opacity

## Run Commands

- Lint the frontend:

  ```sh
  npm run lint
  ```

- Run frontend tests (Vitest):

  ```sh
  npm run test
  ```

  Expected: Sidebar tests pass; no test failures related to toggle opacity.

## Expected Outcomes

- 100% of sidebar-open views show the toggle button with the same background opacity as the sidebar.
- The toggle button and sidebar opacity stay matched for the entire open/close animation duration.
- No visible seam, border, or detachment between the toggle button and the sidebar edge.

## References

- Feature spec: `specs/012-match-toggle-opacity/spec.md`
- UI contract: `specs/012-match-toggle-opacity/contracts/ui-contract.md`
- Data model: `specs/012-match-toggle-opacity/data-model.md`
- Research: `specs/012-match-toggle-opacity/research.md`
