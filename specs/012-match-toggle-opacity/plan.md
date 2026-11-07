# Implementation Plan: Match Sidebar Toggle Opacity to Sidebar

**Branch**: `012-match-toggle-opacity` | **Date**: 2026-11-08 | **Spec**: `specs/012-match-toggle-opacity/spec.md`

**Input**: Feature specification from `specs/012-match-toggle-opacity/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Make the sidebar toggle button background opacity match the sidebar background opacity so the toggle reads as one continuous piece attached to the sidebar edge rather than a separate element with different solidity. The sidebar uses `bg-surface/86` (86% opacity); the toggle currently uses `bg-surface` (100% opacity). The fix changes the toggle's background class to match the sidebar's opacity, completing the attached look established by prior border fixes.

## Technical Context

**Language/Version**: JavaScript (ES Module)

**Primary Dependencies**: React, ReactDOM, @mui/material (frontend); Vitest for testing

**Storage**: N/A (frontend UI-only change; no database or persistence)

**Testing**: Vitest

**Target Platform**: Web (desktop and mobile viewports)

**Project Type**: Web application (frontend)

**Performance Goals**: Opacity change is purely visual; no runtime cost; toggle remains responsive during open/close animation

**Constraints**: MERN stack alignment; MVC separation (frontend owns UI only); no new npm packages; must not change toggle height; must not change sidebar opacity

**Scale/Scope**: Single visual fix affecting the sidebar toggle button in `Sidebar.jsx` only; applies to all viewport states (desktop, compact mobile)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Status | Assessment |
|------------------------|--------|------------|
| I. MERN Stack Alignment (NON-NEGOTIABLE) | PASS | Frontend-only change using JavaScript ES Modules with React + Vite; no new stack or dependencies introduced. |
| II. MVC Separation (Application Boundaries) | PASS | Change is confined to `apps/frontend/src/components/Sidebar.jsx` toggle styling; frontend owns UI; backend untouched. |
| III. Test-First Quality Gate (NON-NEGOTIABLE) | PASS | Vitest test can verify toggle button background opacity matches sidebar; visual regression check for attached look. |
| IV. Security, Secrets, Configuration Discipline | N/A | No secrets, authentication, or configuration involved in this visual fix. |
| V. Responsive, Accessible Immersive Experience | PASS | Opacity match applies consistently across desktop and compact mobile viewports; keyboard operability and focus states of the toggle button are unchanged. |

**Gate result**: All applicable gates pass. No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/012-match-toggle-opacity/
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
│   │   └── Sidebar.jsx      # Modified: toggle background opacity matches sidebar
│   └── tests/
│       └── Sidebar.test.jsx # Existing/extended: Vitest test for toggle opacity
└── public/
    └── panoramas/           # Unchanged: panorama tiles
```

**Structure Decision**: Single frontend project. The fix touches one existing component (`Sidebar.jsx`) — only the toggle button's background Tailwind class changes from `bg-surface` to `bg-surface/86`. No new directories, projects, or dependencies are needed.

## Complexity Tracking

> Not applicable — Constitution Check has no violations requiring justification.
