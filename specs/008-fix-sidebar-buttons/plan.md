# Implementation Plan: Fix Sidebar Buttons

**Branch**: `008-fix-sidebar-buttons` | **Date**: 2026-11-06 | **Spec**: `specs/008-fix-sidebar-buttons/spec.md`

**Input**: Feature specification from `specs/008-fix-sidebar-buttons/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Fix the sidebar floor buttons so that buttons for floors with available panorama tiles are clickable and switch the viewer to the correct scene. The root cause is a position-based floor-to-location mapping in `buildFloorItems` that misaligns floors with their location data when the locations list does not contain every floor in sequence order. The fix matches floor buttons to location data by floor label instead of array index.

## Technical Context

**Language/Version**: JavaScript (ES Module)

**Primary Dependencies**: React, ReactDOM, @mui/material, @mui/icons-material, marzipano (frontend); Vitest for testing

**Storage**: N/A (frontend UI fix; no database or persistence)

**Testing**: Vitest

**Target Platform**: Web (desktop and mobile viewports)

**Project Type**: Web application (frontend)

**Performance Goals**: Click-to-scene-switch completes instantly; no perceptible delay between button click and panorama display

**Constraints**: MERN stack alignment; MVC separation (frontend owns UI only); no new npm packages; must not modify frozen Marzipano.jsx

**Scale/Scope**: Single feature fix affecting sidebar floor buttons only; all floors in the sequence (LG through 11F)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Status | Assessment |
|------------------------|--------|------------|
| I. MERN Stack Alignment (NON-NEGOTIABLE) | PASS | Fix is frontend-only, using JavaScript ES Modules with React + Vite; no new stack or dependencies introduced. |
| II. MVC Separation (Application Boundaries) | PASS | Change is confined to `apps/frontend/src/components/Sidebar.jsx`; frontend owns UI and panorama navigation; backend untouched. |
| III. Test-First Quality Gate (NON-NEGOTIABLE) | PASS | Vitest tests for sidebar button click behavior will be added; behavior affecting navigation/panorama controls is covered. |
| IV. Security, Secrets, Configuration Discipline | N/A | No secrets, authentication, or configuration involved in this UI fix. |
| V. Responsive, Accessible Immersive Experience | PASS | Sidebar buttons must remain operable on desktop and mobile; keyboard operable with visible focus states preserved. |

**Gate result**: All applicable gates pass. No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/008-fix-sidebar-buttons/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── ui-contract.md   # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx      # Modified: floor-to-location mapping fix
│   ├── tests/
│   │   └── Sidebar.test.jsx # New: Vitest tests for click behavior
│   └── lib/
└── public/
    └── panoramas/           # Unchanged: panorama tiles
```

**Structure Decision**: Single frontend project (default Option 1 pattern adapted to the repo's `apps/frontend` layout). The fix touches one existing component (`Sidebar.jsx`) and adds one test file. No new directories or projects are needed.

## Complexity Tracking

> Not applicable — Constitution Check has no violations requiring justification.
