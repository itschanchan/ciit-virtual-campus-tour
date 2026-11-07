# Implementation Plan: Switch 5M and 5F Floor Order

**Branch**: `010-switch-5m-5f-buttons` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-switch-5m-5f-buttons/spec.md`

## Summary

Keep 5M and 5F side by side in one row of the campus floor list while every other floor keeps its own row, and add a clearly labelled control that lets a visitor switch which of the two fifth-floor levels appears first at any time. The switch takes effect immediately in the sidebar without a page reload and is retained across collapse/expand cycles. Each floor remains an independent control with its own label, selection, locked, and unavailable state. The work stays inside `Sidebar.jsx` and its existing test file, adds no dependencies or tour content, and reuses the current Tailwind tokens and floor-button styling. Verification covers row grouping, order switching, centering, independent activation, keyboard reachability, readability at the minimum supported viewport width, and retention across collapse/expand.

## Technical Context

**Language/Version**: JavaScript ES modules on Node.js 24.x (v24.21.0)

**Primary Dependencies**: React 19.2.8, React DOM 19.2.8, Vite 8.3.0, Tailwind CSS 4.3.3, `@mui/material` ^9.5.0, `@mui/icons-material` ^9.5.0

**Storage**: N/A - tour content is static in `apps/frontend/src/lib/catalog.json` and is unchanged; the switched order is retained in component state for the session only

**Testing**: Vitest 5.1.0 configured in `apps/frontend/vitest.config.js`. Testing Library and jsdom remain deferred by the maintainer, so `Sidebar.test.jsx` is extended now and can run once the tooling is restored. Lint, production build, and manual checks at desktop and narrow viewports provide interim evidence.

**Target Platform**: Modern desktop and mobile browsers with JavaScript enabled; minimum supported width 320 CSS pixels

**Project Type**: Web application (React + Vite frontend, Express backend) following MVC

**Performance Goals**: No new network requests. Row grouping and order switching are computed during render from the existing floor list, so the initial render and the existing sidebar toggle animation keep their current responsiveness.

**Constraints**: Only 5M and 5F share a row; all other floors keep one row each; every floor button is horizontally centered in the sidebar column rather than left-aligned; the pair order is switchable at any time via a clearly labelled control; each button sizes to its own content and the pair stays centered together; each floor remains a separate button with its own state; labels wrap to stay in one row and remain readable at 320 CSS pixels; the switched order takes effect immediately with no page reload and is retained across collapse/expand; no new dependencies; reuse the existing floor-button and layout styling; collapsed-sidebar behaviour is unchanged.

**Scale/Scope**: One frontend component (`Sidebar.jsx`), one test file (`Sidebar.test.jsx`), and the feature documentation. No backend, catalog schema, routing, or dependency changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Status | Evidence |
| :--- | :--- | :--- |
| I. MERN Stack Alignment | PASS | The change uses the existing React 19 and Vite frontend with JavaScript ES modules. No framework, test-runner, or language change is proposed. |
| II. MVC Separation | PASS | All work stays in `apps/frontend/src/components` and `apps/frontend/src/tests`. No backend, database, or route changes occur. |
| III. Test-First Quality Gate | PASS WITH JUSTIFICATION | Order-switching changes visible navigation behaviour, so `Sidebar.test.jsx` gains regression cases for row grouping, order switching, centering, independent activation, and retention before implementation. Vitest/Testing Library/jsdom are not installed because the maintainer deferred that tooling; the tests cannot execute until it is restored. Lint, production build, and manual desktop/mobile checks provide interim evidence. |
| IV. Security, Secrets, and Configuration | PASS | No secrets, environment values, APIs, or authentication paths change. The switched order is held in transient UI state only, not persisted or transmitted. |
| V. Responsive, Accessible Immersive Experience | PASS | Both floors remain separate, keyboard-operable controls with visible focus states in either order. The pair and the order switch control are checked at desktop and 320-pixel-wide viewports, and the collapsed sidebar behaviour is unchanged. |
| Dependency governance | PASS | No package is added, removed, or upgraded. Existing MUI and Tailwind usage is reused. |
| Workflow gate | PASS | The feature follows the Spec Kit sequence: specification, plan, tasks, then implementation. |

No violations require the Complexity Tracking table.

## Project Structure

### Documentation (this feature)

```text
specs/010-switch-5m-5f-buttons/
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
│   │   └── Sidebar.jsx          # Add order-switch control; derive switchable display rows
│   ├── lib/
│   │   └── catalog.json         # Unchanged tour content
│   └── tests/
│       └── Sidebar.test.jsx     # Add order-switch and retention regression tests
├── vitest.config.js             # Unchanged
└── package.json                 # Unchanged
```

**Structure Decision**: The feature stays inside the existing frontend workspace and reuses the established component and test layout. No new source directories, backend modules, or content files are introduced.

## Phase 0: Research Summary

See [research.md](./research.md). Key decisions:

- Derive display rows from the already-ordered floor entries and an in-memory floor-order flag instead of duplicating floor markup.
- Add a clearly labelled order-switch control next to the floor list that toggles which of 5M/5F appears first.
- Compute the switch during render so it takes effect immediately with no page reload.
- Retain the switched order in component state while the sidebar is open; reset to default when the sidebar is unmounted (session scope).
- Group only the fifth-floor pair; a single declared pairing keeps the rule explicit and easy to extend.
- Order the pair left to right per the active flag (default matches descending order; switched reverses it).
- Render the pair as a centered group of two content-sized buttons using standard Tailwind utilities, with each floor keeping the current button component and styling.
- Center every floor button horizontally in the sidebar column, including each button in the pair, instead of aligning to the left edge.
- Let labels wrap inside each button so the pair stays in one row and remains readable at 320 CSS pixels.
- Preserve per-floor state: current, locked, unavailable, and disabled styling remain attached to individual buttons after any switch.
- Keep the pair as two independent, keyboard-reachable controls inside a labelled group; the order switch control is keyboard-reachable and focus is preserved.
- Verify readability at 320 CSS pixels without horizontal scrolling before and after a switch.
- Extend `Sidebar.test.jsx` with grouping, order switching, centering, independent activation, and retention cases; execution waits on deferred tooling.
- Keep the change limited to the sidebar; no other floor pairings or content changes are added.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines floor entries, display rows, the switchable paired row, the floor-order flag, and the layout states that determine what the visitor sees, with validation rules for ordering, centering, independence, and switching.
- [contracts/ui-contract.md](./contracts/ui-contract.md) defines the row, button, state, order-switch control, accessibility, centering, and responsive behaviour the sidebar must expose.
- [quickstart.md](./quickstart.md) defines manual and automated validation scenarios for grouping, order switching, centering, independent activation, responsiveness, accessibility, and retention across collapse/expand.

## Post-Design Constitution Check

| Gate | Status | Notes |
| :--- | :--- | :--- |
| Stack alignment | PASS | React, Vite, Tailwind, and ES modules are unchanged. |
| MVC boundaries | PASS | Only the frontend sidebar component and its test file are touched. |
| Quality gate | PASS WITH JUSTIFICATION | Regression tests cover grouping, order switching, centering, independent activation, and retention; execution waits on deferred tooling, with lint, build, and manual verification as interim evidence. |
| Security | PASS | No secrets or external services are introduced; order state is transient UI state only. |
| Accessibility and responsiveness | PASS | Both floors remain separate keyboard-operable controls in either order; the pair carries a group label; every button stays centered; the order switch control is keyboard-reachable; layout is checked at 320 pixels and desktop widths. |
| Dependency governance | PASS | No dependency changes. |

## Complexity Tracking

No constitution violations require justification.
