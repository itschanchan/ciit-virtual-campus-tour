# Implementation Plan: Panorama Empty State Message

**Branch**: `004-panorama-empty-state` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-panorama-empty-state/spec.md`

## Summary

Move the "No panorama available yet." feedback out of the campus floor list and into the panorama viewer. The viewer shows a centered, accessible alert whenever no location is selected or the selected location has no panorama. The floor list keeps only its existing locked/coming-soon and location-unavailable feedback. Locked floors now defer their coming-soon popover by a fixed 1.5 seconds (inside the required 1-2 second window), restart the delay when reactivated, keep the popover open until dismissed, and acknowledge the activation immediately with a shake or a non-motion fallback for reduced motion. The viewer is mounted whenever tour content is ready so the empty state is reachable without a selected location. The change stays inside the React frontend, adds no dependencies, and is covered by updated component tests plus responsive, timing, and accessibility smoke checks.

## Technical Context

**Language/Version**: JavaScript ES modules on Node.js 24.x (minimum 22.12)

**Primary Dependencies**: React 19.2.8, React DOM 19.2.8, Vite 8.3.0, Tailwind CSS 4.3.3, Marzipano 0.10.2, `@mui/material` ^9.5.0, `@mui/icons-material` ^9.5.0

**Storage**: N/A - tour content is static in `apps/frontend/src/lib/catalog.json`

**Testing**: Vitest with Testing Library and jsdom is configured in `apps/frontend/vitest.config.js`. The required tooling packages remain deferred by the maintainer, so component tests are authored and updated in this feature but may only run once the tooling is restored. Lint, build, and manual checks cover the gap meanwhile. Popover timing tests use fake timers and must advance 1500 ms to observe the popover.

**Target Platform**: Modern desktop and mobile browsers with JavaScript and WebGL enabled; minimum supported width 320 CSS pixels.

**Project Type**: Web application (React + Vite frontend, Express backend) following MVC.

**Performance Goals**: The empty-state message appears within 1 second of the unavailable state; the coming-soon popover appears 1.5 seconds after the latest locked-floor activation, inside the required 1-2 second window; no new network requests are introduced; panorama interaction remains at the current 60 fps target.

**Constraints**: Exact message text "No panorama available yet."; no new dependencies; reuse the existing Tailwind tokens and centered panel styles; keep the existing locked-floor and location-unavailable feedback in the sidebar; present the message as an accessible alert; keep the message readable from 320 CSS pixels upward; use a fixed 1500 ms popover delay; allow only one pending popover where the latest activation wins; keep a visible popover open until an outside click or Escape; clear timers on unmount and sidebar close; preserve the shake acknowledgement and add a non-motion fallback when reduced motion is preferred.

**Scale/Scope**: Three frontend components (`PanoramaViewer.jsx`, `Sidebar.jsx`, `Layout.jsx`), two test files, and the feature documentation. `Sidebar.jsx` gains the timed popover state, repeat-activation handling, dismissal cleanup, and reduced-motion acknowledgement. No backend, catalog schema, or dependency changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Status | Evidence |
| :--- | :--- | :--- |
| I. MERN Stack Alignment | PASS | The change uses the existing React 19 and Vite frontend with JavaScript ES modules. No framework or test-runner change is proposed. |
| II. MVC Separation | PASS | All work stays in `apps/frontend/src/components` and `apps/frontend/src/tests`. No backend, database, or route changes occur. |
| III. Test-First Quality Gate | PASS WITH JUSTIFICATION | The feature changes visible navigation and panorama behavior, so `PanoramaViewer.test.jsx` and `Sidebar.test.jsx` are extended with regression cases, including fake-timer coverage for the popover delay, repeat activation, dismissal, and reduced-motion acknowledgement. Vitest/Testing Library/jsdom are not installed because the maintainer deferred that tooling; the tests cannot be executed in this environment until it is restored. Lint, production build, and manual desktop/mobile checks provide interim evidence. |
| IV. Security, Secrets, and Configuration | PASS | No secrets, environment values, APIs, or authentication paths change. |
| V. Responsive, Accessible Immersive Experience | PASS | The message uses the viewer's existing alert semantics, remains visible with the floor list collapsed, and is checked at desktop and narrow viewports. The popover keeps its polite status announcement, and reduced-motion preferences replace the shake with a non-motion acknowledgement. The 1-2 second timing is checked at desktop and compact viewports. |
| Dependency governance | PASS | No package is added, removed, or upgraded. Existing MUI and Tailwind usage is untouched. |
| Workflow gate | PASS | The feature follows the Spec Kit sequence: specification, plan, tasks, then implementation. |

No violations require the Complexity Tracking table.

## Project Structure

### Documentation (this feature)

```text
specs/004-panorama-empty-state/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks, refreshed after this plan)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Mount the viewer when content is ready
│   │   ├── PanoramaViewer.jsx   # Own the missing-panorama alert
│   │   └── Sidebar.jsx          # Delay the coming-soon popover; keep immediate acknowledgement
│   ├── lib/
│   │   └── catalog.json         # Unchanged tour content
│   └── tests/
│       ├── PanoramaViewer.test.jsx
│       └── Sidebar.test.jsx     # Include popover timing, repeat activation, dismissal, reduced motion
├── vitest.config.js             # Unchanged
└── package.json                 # Unchanged
```

**Structure Decision**: The feature stays inside the existing frontend workspace and reuses the established component and test layout. No new source directories, backend modules, or content files are introduced.

## Phase 0: Research Summary

See [research.md](./research.md). Key decisions:

- The panorama viewer owns the canonical "No panorama available yet." message; the sidebar never renders it.
- The viewer shows the message both when no location is selected and when the selected location has no panorama.
- The sidebar keeps its existing locked/coming-soon feedback and its location-unavailable feedback for locations that exist without a panorama.
- The coming-soon popover uses a fixed 1500 ms delay, restarted by the latest locked-floor activation.
- The popover stays open until an outside click or Escape; an already-visible popover updates its content immediately for a new locked floor.
- Activation acknowledgement stays immediate: the existing shake when motion is allowed, and a non-motion border or colour change when reduced motion is preferred.
- The viewer mounts whenever tour content is ready; gallery and narration controls stay scoped to a selected location.
- The message reuses the existing alert pattern, responsive panel styles, and accessibility semantics.
- Component tests are updated for the viewer, sidebar, and popover timing; tooling availability is documented rather than silently ignored.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines locations, panorama availability, floor entries, viewer display states, the message record, and the pending/visible/dismissed coming-soon notice with validation rules.
- [contracts/ui-contract.md](./contracts/ui-contract.md) defines message ownership and behavior across the viewer, sidebar, and layout, plus popover timing, repeat activation, dismissal, and reduced-motion acknowledgement.
- [quickstart.md](./quickstart.md) defines runnable and manual validation scenarios for the empty state, sidebar statuses, popover timing, responsiveness, and accessibility.

## Post-Design Constitution Check

| Gate | Status | Notes |
| :--- | :--- | :--- |
| Stack alignment | PASS | React, Vite, and ES modules are unchanged. |
| MVC boundaries | PASS | Only frontend components and tests are touched. |
| Quality gate | PASS WITH JUSTIFICATION | Regression tests cover the viewer, sidebar, and timed popover; execution waits on deferred tooling, with lint, build, and manual verification as interim evidence. |
| Security | PASS | No secrets or external services are introduced. |
| Accessibility and responsiveness | PASS | Alert and status semantics are preserved, reduced motion uses a non-motion acknowledgement, and timing checks cover the 1-2 second window at desktop and compact viewports. |
| Dependency governance | PASS | No dependency changes. |

## Complexity Tracking

No constitution violations require justification.
