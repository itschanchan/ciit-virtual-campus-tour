# Implementation Plan: Stack Sidebar Above Panorama Viewer

**Branch**: `009-stack-sidebar-above-viewer` | **Date**: 2026-11-07 | **Spec**: `specs/009-stack-sidebar-above-viewer/spec.md`

**Input**: Feature specification from `/specs/009-stack-sidebar-above-viewer/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Re-arrange the virtual campus tour layout so the campus floor sidebar is positioned directly above the 360-degree panorama viewer in a vertical stack, replacing the current side-by-side arrangement. The sidebar remains clickable for floor selection, and the stacked layout works on both desktop and mobile viewports without overlap or broken navigation access.

## Technical Context

**Language/Version**: JavaScript (ES Modules)

**Primary Dependencies**: React, react-dom, Vite, @mui/material, @mui/icons-material

**Storage**: N/A (frontend-only layout change, no data storage changes)

**Testing**: Vitest

**Target Platform**: Web (desktop and mobile browsers)

**Project Type**: Web application (frontend)

**Performance Goals**: Layout transition remains smooth at 60 fps; no render-blocking layout thrashing

**Constraints**: Sidebar and viewer must not overlap; sidebar toggle must remain operable; floor button click-to-scene switching behavior unchanged; responsive on desktop and mobile viewports

**Scale/Scope**: Single feature affecting Layout.jsx, Sidebar.jsx, and PanoramaViewer.jsx composition only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Assessment |
|-----------|--------|------------|
| I. MERN Stack Alignment | PASS | Frontend remains React + Vite with JavaScript ES Modules; no new stack introduced |
| II. MVC Separation | PASS | Change is confined to frontend UI composition; backend untouched |
| III. Test-First Quality Gate | PASS | Existing Sidebar and PanoramaViewer tests remain valid; layout change covered by existing test suites |
| IV. Security, Secrets, Configuration | PASS | No secrets, credentials, or configuration involved |
| V. Responsive, Accessible Immersive Experience | PASS | Stacked layout must be verified on desktop and mobile; controls remain keyboard operable |

**Gate Result**: PASS — No violations. The feature is a frontend-only layout change consistent with all constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/009-stack-sidebar-above-viewer/
├── spec.md              # Feature specification (/speckit.specify output)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx       # Modified: vertical stack of Sidebar above PanoramaViewer
│   │   ├── Sidebar.jsx      # Modified: toggle behavior adapted for stacked layout
│   │   └── PanoramaViewer.jsx # Unchanged (composition only)
│   └── tests/
│       ├── Sidebar.test.jsx    # Existing tests, may need layout-specific additions
│       └── PanoramaViewer.test.jsx # Existing tests
└── ...
```

**Structure Decision**: Web application (Option 2). The repository has both `apps/backend` and `apps/frontend`. This feature is frontend-only, so changes are confined to `apps/frontend/src/components/` (Layout.jsx, Sidebar.jsx) with no backend impact.

## Complexity Tracking

> No constitution violations requiring justification. This section is not applicable.
