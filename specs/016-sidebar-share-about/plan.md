# Implementation Plan: Sidebar Share, About, Website Link, and Footer Layout

**Branch**: `016-sidebar-share-about` | **Date**: 2026-11-10 | **Spec**: `specs/016-sidebar-share-about/spec.md`

**Input**: Feature specification from `specs/016-sidebar-share-about/spec.md`

## Summary

The sidebar's miscellaneous action row below the floor buttons becomes a centered group of three actions: a working CIIT website link, a Share action that opens a dialog for copying the tour link and sharing it to Facebook, X, Messenger, Discord, WhatsApp, Email, and the system share sheet, and an About action that opens a dialog with a tour overview, credits, and a CIIT website reference. The sidebar is restructured into a scrollable body and a pinned footer so the copyright line stays visible at the bottom, while the narrow-viewport close control stays in the non-scrolling shell. Dialogs use the project's existing Material components and icons, use fluid full-width sizing capped at a comfortable desktop maximum, scroll their content on short viewports, close on close control, Escape, and outside/backdrop click, and preserve the sidebar open state.

## Technical Context

**Language/Version**: JavaScript (ES Modules), React 19 with Vite 8

**Primary Dependencies**: React, React DOM, `@mui/material` 9.5, `@mui/icons-material` 9.5, Tailwind CSS 4 (all already declared in `apps/frontend/package.json`)

**Storage**: N/A — frontend-only UI feature; no new persistence, no backend changes

**Testing**: Vitest 5 with Testing Library (React, DOM, jest-dom) and jsdom; existing tests use `fireEvent`

**Target Platform**: Web browsers on desktop, tablet, and mobile; supported widths from 320px upward

**Project Type**: Web application (frontend only)

**Performance Goals**: Share and About dialogs open immediately (no perceptible delay, target under 100ms); copy confirmation appears within 1 second when the browser permits copying; no layout shift when a dialog opens or when the sidebar footer is pinned; no horizontal overflow at any supported width; dialogs fit fully within 320px-wide and short-landscape viewports with the close control visible

**Constraints**: Use existing `@mui/material` dialogs, buttons, inputs, and `@mui/icons-material` icons; dialogs use `fullWidth` with `maxWidth="sm"`, scrollable content, and a close control outside the scrollable region; no new dependencies; preserve the dark theme through existing CSS variables; use existing Tailwind custom variants (`compact`, `narrow`, `tiny`) with a mobile-first approach; no JavaScript viewport detection for layout; preserve existing floor selection, locked-floor popover, scene switching, and sidebar open/close behavior; the narrow-viewport sidebar close control stays absolutely positioned in the non-scrolling shell with body padding beneath it; sidebar content must stay keyboard accessible

**Scale/Scope**: One sidebar component (`Sidebar.jsx`), two new dialog components (`ShareDialog.jsx`, `AboutDialog.jsx`), one small pure helper module (`shareLinks.js`), and sidebar test coverage. No backend, API, database, or content-catalog changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|-----------|-------------|--------|----------|
| I. MERN Stack Alignment | React with Vite, JavaScript ES Modules, Vitest | PASS | Feature stays inside the existing React/Vite frontend and Vitest suite; no alternative framework or test runner |
| I. MERN Stack Alignment | New runtime dependencies require approval and documentation | PASS | No new packages; uses already-declared MUI packages and existing React/Tailwind |
| II. MVC Separation and Application Boundaries | Frontend owns UI; organize under `components/`, `lib/`, `tests/` | PASS | New dialogs go in `components/`, pure share-link helpers in `lib/`, tests in `tests/`; no backend or database access |
| III. Test-First Quality Gate | Navigation and interaction behavior must have Vitest coverage; tests observed failing first | PASS | Plan adds failing-first tests for the website link, action row, dialog opening/dismissal, copy behavior, share destinations, About content, and footer position |
| IV. Security, Secrets, and Configuration Discipline | No secrets or configuration leakage | PASS | No credentials, environment values, or backend configuration involved; share links are built from the public page address |
| V. Responsive, Accessible Immersive Experience | Desktop and mobile support; keyboard operable; visible focus; text alternatives | PASS | Dialogs use `fullWidth` with `maxWidth="sm"` and scrollable content; the narrow-viewport sidebar close control stays in the non-scrolling shell; all controls are keyboard operable; MUI Dialog provides focus trapping/restoration; icons carry accessible names via button labels; existing focus styles retained |
| V. Responsive, Accessible Immersive Experience | Layout verified at representative viewports | PASS | Quickstart covers 320px mobile, tablet, desktop, and short-landscape widths; plans to run lint, tests, and build |
| Technology & Dependency Constraints | Approved stack and dependency discipline | PASS | No new dependencies; no stack change; no `docs/tech_stack.md` update required |
| Development Workflow & Quality Gates | Spec Kit sequence and quality gates | PASS | Spec exists and is clarified; this plan precedes tasks and implementation; lint/build/test gates included |

No constitution violations. Complexity Tracking is not required.

## Project Structure

### Documentation (this feature)

```text
specs/016-sidebar-share-about/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # N/A — frontend UI feature with no external interfaces
└── tasks.md             # Phase 2 output (/speckit.tasks command — NOT created here)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Updated: centered action row, dialog state, pinned footer
│   │   ├── ShareDialog.jsx      # New: copy link and sharing destinations
│   │   └── AboutDialog.jsx      # New: tour overview, credits, CIIT website link
│   ├── lib/
│   │   ├── shareLinks.js        # New: pure helpers for tour URL and share destinations
│   │   └── viewport.js          # Unchanged: existing responsive utility
│   ├── context/
│   │   └── tourContextValue.js  # Unchanged: existing sidebar state
│   └── index.css                # Unchanged: existing design tokens and custom variants
└── tests/
    ├── Sidebar.test.jsx         # Updated: action row, dialogs, footer, link behavior
    └── shareLinks.test.js       # New: pure URL-builder coverage
```

**Structure Decision**: Web application structure (Option 2), frontend-only. All changes stay under `apps/frontend/src/` with tests under `apps/frontend/src/tests/`. No external API or CLI contract is exposed, so `contracts/` is not applicable.

## Phase 0: Research

See `research.md`. Key decisions cover the Material dialog foundation, dialog sizing and scrolling, outside-click and Escape dismissal, share-link construction, Messenger and Discord behavior, clipboard fallback, icon mapping, pinned footer layout, non-scrolling close-control placement, theming, and test strategy. No `NEEDS CLARIFICATION` markers remain.

## Phase 1: Design & Contracts

See `data-model.md` and `quickstart.md`. No contracts are required because this is a frontend-only UI feature with no external interfaces. The UI behavior contract is captured through the spec acceptance scenarios, the component state model, and the quickstart validation scenarios.

**Post-design constitution re-check**: All gates still pass. The design adds no backend, persistence, external service, or new dependency, and keeps the interaction, keyboard, and responsive requirements inside the existing React/Vite/MUI/Tailwind/Vitest stack.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. This section is not applicable.
