# Implementation Plan: Sidebar 5F and 5M Paired Row

**Branch**: `005-sidebar-floor-pair-row` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-sidebar-floor-pair-row/spec.md`

## Summary

Place the existing 5F and 5M floor entries side by side in one row of the campus floor list, while every other floor keeps its own row, and center every floor button horizontally in the sidebar column. The change derives display rows from the already-ordered floor list, renders a centered group of two content-sized buttons for the fifth-floor pair, and leaves each floor as an independent control with its own label, selection, locked, and unavailable behaviour. The work stays inside `Sidebar.jsx` and its existing test file, adds no dependencies or tour content, and reuses the current Tailwind tokens and floor-button styling. Verification covers row grouping, ordering, centering, independent activation, keyboard reachability, and readability at the minimum supported viewport width.

## Technical Context

**Language/Version**: JavaScript ES modules on Node.js 24.x (minimum 22.12)

**Primary Dependencies**: React 19.2.8, React DOM 19.2.8, Vite 8.3.0, Tailwind CSS 4.3.3, `@mui/material` ^9.5.0, `@mui/icons-material` ^9.5.0

**Storage**: N/A - tour content is static in `apps/frontend/src/lib/catalog.json` and is unchanged

**Testing**: Vitest with Testing Library and jsdom is configured in `apps/frontend/vitest.config.js`. The tooling packages remain deferred by the maintainer, so `Sidebar.test.jsx` is extended now and can run once the tooling is restored. Lint, production build, and manual checks at desktop and narrow viewports provide interim evidence.

**Target Platform**: Modern desktop and mobile browsers with JavaScript enabled; minimum supported width 320 CSS pixels

**Project Type**: Web application (React + Vite frontend, Express backend) following MVC

**Performance Goals**: No new network requests. Row grouping is computed during render from the existing floor list, so the initial render and the existing 300 ms sidebar toggle animation keep their current responsiveness.

**Constraints**: Only 5F and 5M share a row; all other floors keep one row each; every floor button is horizontally centered in the sidebar column rather than left-aligned; the pair preserves the list's descending order with each button sized to its own content and the two centered together; each floor remains a separate button with its own state; labels wrap to stay in one row and remain readable at 320 CSS pixels; no new dependencies; reuse the existing floor-button and layout styling; collapsed-sidebar behaviour is unchanged.

**Scale/Scope**: One frontend component (`Sidebar.jsx`), one test file (`Sidebar.test.jsx`), and the feature documentation. No backend, catalog schema, routing, or dependency changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Status | Evidence |
| :--- | :--- | :--- |
| I. MERN Stack Alignment | PASS | The change uses the existing React 19 and Vite frontend with JavaScript ES modules. No framework, test-runner, or language change is proposed. |
| II. MVC Separation | PASS | All work stays in `apps/frontend/src/components` and `apps/frontend/src/tests`. No backend, database, or route changes occur. |
| III. Test-First Quality Gate | PASS WITH JUSTIFICATION | Pairing changes visible navigation layout, so `Sidebar.test.jsx` gains regression cases for row grouping, ordering, and independent activation before implementation. Vitest/Testing Library/jsdom are not installed because the maintainer deferred that tooling; the tests cannot execute until it is restored. Lint, production build, and manual desktop/mobile checks provide interim evidence. |
| IV. Security, Secrets, and Configuration | PASS | No secrets, environment values, APIs, or authentication paths change. |
| V. Responsive, Accessible Immersive Experience | PASS | Both floors remain separate, keyboard-operable controls with visible focus states. The pair is checked at desktop and 320-pixel-wide viewports, and the collapsed sidebar behaviour is unchanged. |
| Dependency governance | PASS | No package is added, removed, or upgraded. Existing MUI and Tailwind usage is reused. |
| Workflow gate | PASS | The feature follows the Spec Kit sequence: specification, plan, tasks, then implementation. |

No violations require the Complexity Tracking table.

## Project Structure

### Documentation (this feature)

```text
specs/005-sidebar-floor-pair-row/
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
│   │   └── Sidebar.jsx          # Derive display rows; render the 5F/5M pair
│   ├── lib/
│   │   └── catalog.json         # Unchanged tour content
│   └── tests/
│       └── Sidebar.test.jsx     # Add row grouping and activation regression tests
├── vitest.config.js             # Unchanged
└── package.json                 # Unchanged
```

**Structure Decision**: The feature stays inside the existing frontend workspace and reuses the established component and test layout. No new source directories, backend modules, or content files are introduced.

## Phase 0: Research Summary

See [research.md](./research.md). Key decisions:

- Derive display rows from the already-ordered floor entries instead of duplicating floor markup.
- Group only the fifth-floor pair; a single declared pairing keeps the rule explicit and easy to extend.
- Order the pair left to right as 5M then 5F so reading order matches the list's existing descending order.
- Render the pair as a centered group of two content-sized buttons using standard Tailwind utilities, with each floor keeping the current button component and styling.
- Center every floor button horizontally in the sidebar column, including each button in the pair, instead of aligning to the left edge.
- Let labels wrap inside each button so the pair stays in one row and remains readable at 320 CSS pixels.
- Preserve per-floor state: current, locked, unavailable, and disabled styling remain attached to individual buttons.
- Keep the pair as two independent, keyboard-reachable controls inside a labelled group.
- Verify readability at 320 CSS pixels without horizontal scrolling.
- Extend `Sidebar.test.jsx` with grouping, ordering, centering, and independent activation cases; execution waits on the deferred tooling.
- Keep the change limited to the sidebar; no other floor pairings or content changes are added.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines floor entries, display rows, the paired row, and the layout states that determine what the visitor sees, with validation rules for ordering, centering, and independence.
- [contracts/ui-contract.md](./contracts/ui-contract.md) defines the row, button, state, accessibility, centering, and responsive behaviour the sidebar must expose.
- [quickstart.md](./quickstart.md) defines manual and automated validation scenarios for grouping, ordering, centering, independent activation, responsiveness, and accessibility.

## Post-Design Constitution Check

| Gate | Status | Notes |
| :--- | :--- | :--- |
| Stack alignment | PASS | React, Vite, Tailwind, and ES modules are unchanged. |
| MVC boundaries | PASS | Only the frontend sidebar component and its test file are touched. |
| Quality gate | PASS WITH JUSTIFICATION | Regression tests cover grouping, ordering, and independent activation; execution waits on deferred tooling, with lint, build, and manual verification as interim evidence. |
| Security | PASS | No secrets or external services are introduced. |
| Accessibility and responsiveness | PASS | Both floors remain separate keyboard-operable controls, the pair carries a group label, every button stays centered, and the layout is checked at 320 pixels and desktop widths. |
| Dependency governance | PASS | No dependency changes. |

## Complexity Tracking

No constitution violations require justification.
