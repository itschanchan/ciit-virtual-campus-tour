# Implementation Plan: first-visit-persistence

**Branch**: `[028-first-visit-persistence]` | **Date**: 2026-11-18 | **Spec**: `specs/028-first-visit-persistence/spec.md`

**Input**: Feature specification from `/specs/028-first-visit-persistence/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Welcome and instructions introduction screens appear only on a visitor's first visit to the webpage and are skipped on subsequent visits until browser cache or site data is cleared. Both screens are responsive on mobile, tablet, and desktop viewports without requiring scrolling. Persistence is handled client-side using browser storage; screen flow is controlled in `TourExperience` within `App.jsx`.

## Technical Context

**Language/Version**: JavaScript (ESModule)

**Primary Dependencies**: React, react-dom (Vite frontend)

**Storage**: browser localStorage (client-side first-visit flag, cleared with site data)

**Testing**: Vitest

**Target Platform**: web browsers (desktop, tablet, mobile)

**Project Type**: web application (React + Vite frontend, MERN stack alignment)

**Performance Goals**: introduction screens render without layout shift; no scrolling required to view content or reach buttons

**Constraints**: mobile-first responsive design; CSS-driven responsiveness (no JS viewport detection); no fixed dimensions causing overflow; screens fit within viewport on mobile, tablet, and desktop

**Scale/Scope**: 2 introduction screens (welcome, instructions); single-page application screen flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Status | Assessment |
|---|---|---|
| I. MERN Stack Alignment | PASS | Frontend uses React + Vite with ES Modules; no alternative frameworks introduced |
| II. MVC Separation | PASS | Frontend owns all UI; no direct database access from frontend |
| III. Test-First Quality Gate | PASS | Component behavior will have Vitest coverage; tests must pass before merge |
| IV. Security, Secrets, Configuration | PASS | No secrets, credentials, or environment configuration involved |
| V. Responsive, Accessible Immersive Experience | PASS | Mobile-first responsive screens; keyboard operable controls; verified at desktop and mobile viewports |

No violations detected. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/028-first-visit-persistence/
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
│   │   ├── WelcomeScreen.jsx     # modified: responsive, conditionally rendered
│   │   └── InstructionsScreen.jsx # modified: responsive, conditionally rendered
│   ├── App.jsx                   # modified: first-visit persistence gate + screen flow
│   ├── lib/
│   │   └── introduction.js       # new: browser storage helpers for first-visit state
│   └── context/
│       └── useTour.js            # unchanged (no modification needed)
└── tests/
    └── (Vitest tests for introduction persistence behavior)
```

**Structure Decision**: Option 2 (Web application). The feature lives entirely in the frontend (`apps/frontend/`), consistent with the MERN stack separation where the frontend owns all UI. Real paths captured above under `apps/frontend/src/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Not applicable — no constitution violations.

---

## Phase 0: Outline & Research

**Prerequisites:** Constitution Check passed.

### Unknowns and Dependencies

No [NEEDS CLARIFICATION] markers remain in the feature spec. All technical decisions were resolved with informed guesses documented as assumptions:

1. **Browser storage mechanism**: localStorage chosen as the persistence store because it survives tab/session closes and is cleared when the user clears browser cache or site data — matching the user's requirement that screens reappear only after data is cleared.
   - Alternatives considered: sessionStorage (cleared on tab close — rejected, does not match requirement), IndexedDB (overkill for a single boolean flag — rejected), cookies (sent with every request, unnecessary overhead — rejected).
2. **Persistence check location**: `App.jsx` `TourExperience` component, since it already controls the `screen` state flow (`welcome` → `instructions` → `tour`).
3. **Manual re-show mechanism**: None — screens reappear only after browser data is cleared, per the user's explicit requirement.

### Research Decisions

| Decision | Rationale | Alternatives Considered |
|---|---|---|
| localStorage for first-visit flag | Persists across sessions; cleared with site data; simple key-value API | sessionStorage (cleared on tab close), IndexedDB (overkill), cookies (unnecessary overhead) |
| Gate screen flow in App.jsx | Centralizes the `screen` state machine; minimal component changes | Per-component storage checks (duplicated logic) |
| CSS-driven responsiveness (Tailwind) | Aligns with AGENTS.md and Constitution Principle V; no JS viewport detection | JS resize listeners (prohibited by AGENTS.md) |

**Output**: research.md with all decisions documented (see below).

## Phase 1: Design & Contracts

**Prerequisites:** research.md complete.

### Data Model

See `data-model.md` — defines the `VisitorIntroductionState` entity stored in browser localStorage.

### Interface Contracts

See `contracts/ui-contract.md` — documents the screen flow states (`welcome`, `instructions`, `tour`) and the storage contract (key, value shape, clearing behavior).

### Quickstart Validation Guide

See `quickstart.md` — runnable scenarios to prove first-visit persistence and responsive behavior end-to-end.
