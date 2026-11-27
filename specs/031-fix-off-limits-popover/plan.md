# Implementation Plan: Fix Off-Limits Popover Duplicate Message

**Branch**: `031-fix-off-limits-popover` | **Date**: 2026-11-26 | **Spec**: `specs/031-fix-off-limits-popover/spec.md`

**Input**: Feature specification from `/specs/031-fix-off-limits-popover/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

The off-limits floor notification briefly renders a blank, displaced copy of itself before hiding. The current implementation stores both the floor label and the anchor element in a single `notice` state object and clears that object the instant the auto-hide timer fires, while the MUI `Popover` exit transition is still running. During the exit, the popover therefore renders an empty label (only "is coming soon.") and loses its anchor element, so it detaches from the selected floor and appears again in a different position before unmounting. The fix keeps the notice content and anchor stable for the full exit transition, drives visibility with a separate boolean, and funnels every dismissal through one close path. Regression tests will assert that exactly one fully labelled message is shown for the entire lifecycle.

## Technical Context

**Language/Version**: JavaScript (ES Modules), React 19.2, Node.js LTS

**Primary Dependencies**: React 19.2, `@mui/material` 9.5 (`Popover`, `Grow` transition), Vite 8, Tailwind CSS 4, Vitest 5, `@testing-library/react` 16, jsdom

**Storage**: N/A — transient in-memory component state only

**Testing**: Vitest with `@testing-library/react` and fake timers; existing suite is `apps/frontend/src/tests/Sidebar.test.jsx`

**Target Platform**: Modern web browsers on desktop, tablet, and mobile viewports

**Project Type**: web application (frontend)

**Performance Goals**: Show the notification within the same interaction frame; auto-hide after the configured ~2 s display period; no layout jump, blank frame, or duplicate node during the exit transition

**Constraints**: No new dependencies; preserve the MERN/React/Vitest stack; keep the notification accessible (`role="status"`, `aria-live="polite"`); honor reduced-motion preferences; follow the KISA style rules (max three indent levels, small helpers, no clever one-liners); preserve the current immediate-display behavior and ~2 s display period

**Scale/Scope**: A single React component (`Sidebar`) and its test file; no backend, API, or data-model changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Assessment | Status |
|---|---|---|
| I. MERN Stack Alignment | Uses existing React 19 + MUI + Vitest frontend stack; no new framework, package, or storage. | PASS |
| II. MVC Separation | Change is confined to the frontend UI component `Sidebar`; no backend or data-access changes. | PASS |
| III. Test-First Quality Gate | A regression test that fails on the current blank/duplicate behavior will be written first; the stale 1.5 s delayed-show test will be corrected to the specified immediate-display behavior. | PASS |
| IV. Security, Secrets, Configuration | No secrets, configuration, or transport changes. | PASS |
| V. Responsive, Accessible Experience | Notification keeps `role="status"`/`aria-live="polite"` and is announced once with the full floor label; verified at desktop and mobile viewports and with reduced motion. | PASS |

**Gate result**: All constitution principles pass. No violations require justification. Proceed to Phase 0.

**Post-design re-check (after Phase 1)**: Still PASS. The design in `research.md`, `data-model.md`, and `contracts/popover-behavior.md` stays within the React frontend, adds no dependencies or secrets, requires a failing regression test first (Principle III), and preserves the accessible/responsive notice contract (Principle V).

## Project Structure

### Documentation (this feature)

```text
specs/031-fix-off-limits-popover/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── popover-behavior.md   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

The repository follows the fixed layout `root/apps/backend` and `root/apps/frontend` per constitution Principle II. This feature touches only the frontend.

```text
apps/frontend/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx        # FIX TARGET: off-limits notification lifecycle
│   └── tests/
│       └── Sidebar.test.jsx   # Regression and lifecycle tests
├── package.json
├── vite.config.js
└── vitest.config.js
```

**Structure Decision**: Web application structure per constitution Principle II, using the actual repository layout where frontend code lives under `apps/frontend/src/`. Only `apps/frontend/src/components/Sidebar.jsx` and `apps/frontend/src/tests/Sidebar.test.jsx` are expected to change.

## Phase 0: Outline & Research

Research resolves the root cause and the transition-state handling decisions. Output: `research.md`.

## Phase 1: Design & Contracts

Phase 1 produces `data-model.md`, `contracts/popover-behavior.md`, and `quickstart.md`. The notification is a transient UI state machine, so the "data model" documents its states and transitions rather than persisted entities.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Section not applicable.
