# Quickstart: Floating Menu Button

Validation guide for the Floating Menu narration control surface. Proves the feature works end-to-end.

## Prerequisites

- Node.js LTS (via nvm) and npm installed.
- Repository dependencies installed (`npm install` at workspace root).
- The feature branch `013-floating-menu` is checked out and `.specify/feature.json` points to `specs/013-floating-menu`.
- Placeholder narration audio present at `apps/frontend/public/panoramas/<location-slug>/narration.wav` (or `public/narration.wav`).

## Setup Commands

```bash
# From repo root
npm install
npm run dev        # starts frontend (Vite) and backend (Express) together
```

The frontend serves at the Vite dev server URL (default `http://localhost:5173`).

## Test / Run Commands

```bash
# Run frontend unit tests (Vitest)
cd apps/frontend && npx vitest run

# Run frontend lint (ESLint)
cd apps/frontend && npx eslint src

# Verify catalog content and assets
npm run verify:content
```

## Validation Scenarios

Run these end-to-end against the running dev server at a desktop viewport and a mobile viewport (375x667).

### Scenario 1: Play / pause narration

**Given** the tour is running and a location with narration is selected.  
**When** the visitor clicks the Play button on the floating menu.  
**Then** narration begins, the button visually switches to Pause, and the oscillation audio visualization appears to the left of the Play button.  
**When** the visitor clicks Pause.  
**Then** narration stops, the button switches back to Play, and the oscillation disappears.

### Scenario 2: Mute / unmute narration

**Given** narration is playing with sound.  
**When** the visitor clicks Mute.  
**Then** narration continues but no audio is heard; the button shows Unmute.  
**When** the visitor clicks Unmute.  
**Then** narration audio is audible again; the button shows Mute.

### Scenario 3: Keyboard operability (Constitution Principle V)

**Given** the floating menu is visible.  
**When** the visitor tabs to each control.  
**Then** each control shows a visible focus state and an accessible name/label.  
**When** the visitor presses the documented hint key (e.g., "p" for play/pause) on a focused control.  
**Then** the corresponding action (play/pause or mute/unmute) activates.

### Scenario 4: Reduced motion

**Given** the visitor has `prefers-reduced-motion: reduce` enabled.  
**When** narration is playing.  
**Then** the oscillation audio visualization is not animated (static or absent).

## Expected Outcomes

- All four scenarios pass at both desktop and mobile viewports.
- `npx vitest run` passes for `FloatingMenu.test.jsx` (see `apps/frontend/src/tests/FloatingMenu.test.jsx`).
- `npx eslint src` reports no errors.
- `npm run verify:content` passes without new content gaps.

## References

- Feature spec: [spec.md](../spec.md)
- Implementation plan: [plan.md](../plan.md)
- Data model: [data-model.md](../data-model.md)
- UI contract: [contracts/ui-contract.md](../contracts/ui-contract.md)
