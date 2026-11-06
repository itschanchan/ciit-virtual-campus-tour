# Implementation Plan: Hide Header Logo When Sidebar Open

**Branch**: `001-hide-logo-on-reveal` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-hide-logo-on-reveal/spec.md`

## Summary

Hide the CIIT school logo in the Header component when the Sidebar component is in the revealed (open) state, and show it again when the Sidebar is collapsed (closed). The change is purely UI/UX within the frontend React application, coordinating Header visibility with Sidebar open/close state. No backend, database, or new dependencies are required.

## Technical Context

**Language/Version**: JavaScript ES modules on Node.js 24.x (minimum 22.12)

**Primary Dependencies**: React 19.2.8, React DOM 19.2.8, Vite 8.3.0, Tailwind CSS 4.3.3, `@mui/material` ^9.5.0, `@mui/icons-material` ^9.5.0

**Storage**: N/A - tour content is static in `apps/frontend/src/lib/catalog.json` and is unchanged

**Testing**: Vitest with Testing Library and jsdom is configured in `apps/frontend/vitest.config.js`. The tooling packages remain deferred by the maintainer, so tests cannot execute until restored. Lint, production build, and manual checks provide interim evidence.

**Target Platform**: Modern desktop and mobile browsers with JavaScript enabled; minimum supported width 320 CSS pixels

**Project Type**: Web application (React + Vite frontend, Express backend) following MVC

**Performance Goals**: No new network requests. Logo visibility toggle is a local state change tied to existing Sidebar toggle animation (300 ms).

**Constraints**: Only Header.jsx and Sidebar.jsx are modified; no backend, catalog schema, routing, or dependency changes. Logo visibility must be automatic based on Sidebar open/close state. ARIA label and accessibility attributes on the logo must remain unchanged regardless of visibility. No layout shift should occur when the logo is hidden.

**Scale/Scope**: Two frontend components (`Header.jsx`, `Sidebar.jsx`), feature documentation. No backend, catalog schema, routing, or dependency changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Status | Evidence |
| :--- | :--- | :--- |
| I. MERN Stack Alignment | PASS | The change uses the existing React 19 and Vite frontend with JavaScript ES modules. No framework, test-runner, or language change is proposed. |
| II. MVC Separation | PASS | All work stays in `apps/frontend/src/components`. No backend, database, or route changes occur. |
| III. Test-First Quality Gate | PASS WITH JUSTIFICATION | Header logo visibility behavior is testable via Vitest/Testing Library/jsdom. Tests cannot execute until deferred tooling is restored; lint, production build, and manual desktop/mobile checks provide interim evidence. |
| IV. Security, Secrets, and Configuration | PASS | No secrets, environment values, APIs, or authentication paths change. |
| V. Responsive, Accessible Immersive Experience | PASS | The logo toggle affects visibility only; keyboard navigation, ARIA labels, and focus states remain unchanged. Layout stability is verified at desktop and 320-pixel viewports. |
| Dependency governance | PASS | No package is added, removed, or upgraded. Existing React and Tailwind usage is reused. |
| Workflow gate | PASS | The feature follows the Spec Kit sequence: specification, plan, tasks, then implementation. |

No violations require the Complexity Tracking table.

## Project Structure

### Documentation (this feature)

```text
specs/001-hide-logo-on-reveal/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks, not created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Toggle logo visibility based on Sidebar state
│   │   └── Sidebar.jsx         # Exposes open/close state to Header (already has open prop)
│   ├── lib/
│   │   └── catalog.json        # Unchanged tour content
│   └── tests/
│       └── Header.test.jsx     # Add logo visibility regression tests
├── vitest.config.js             # Unchanged
└── package.json                 # Unchanged
```

**Structure Decision**: The feature stays inside the existing frontend workspace. Header.jsx and Sidebar.jsx already pass `sidebarOpen`/`open` state; no new directories, backend modules, or content files are introduced.

## Phase 0: Research Summary

See [research.md](./research.md). Key decisions:

- Header.jsx receives `sidebarOpen` prop; Sidebar.jsx already exposes `open` state.
- Logo visibility in Header.jsx will be controlled by `sidebarOpen` state: hidden when true, visible when false.
- No new props or events needed beyond existing `sidebarOpen` prop flow.
- Tailwind `hidden` class used to conditionally hide the logo element.
- ARIA label preserved on the logo container regardless of visibility state.
- Layout stability maintained: hiding the logo removes its space; the title text and location name reflow naturally.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines UI state entities and visibility rules.
- [contracts/ui-contract.md](./contracts/ui-contract.md) defines the Header-Sidebar interaction contract for logo visibility.
- [quickstart.md](./quickstart.md) defines manual validation scenarios for logo show/hide behavior.

## Post-Design Constitution Check

| Gate | Status | Notes |
| :--- | :--- | :--- |
| Stack alignment | PASS | React, Vite, Tailwind, and ES modules unchanged. |
| MVC boundaries | PASS | Only frontend Header.jsx and Sidebar.jsx are touched. |
| Quality gate | PASS WITH JUSTIFICATION | Regression tests cover logo visibility; execution waits on deferred tooling, with lint, build, and manual verification as interim evidence. |
| Security | PASS | No secrets or external services introduced. |
| Accessibility and responsiveness | PASS | ARIA labels unchanged; layout stability checked at 320 pixels and desktop widths. |
| Dependency governance | PASS | No dependency changes. |

## Complexity Tracking

No constitution violations require justification.