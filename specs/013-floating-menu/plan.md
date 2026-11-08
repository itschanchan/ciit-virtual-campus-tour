# Implementation Plan: Floating Menu Button

**Branch**: `013-floating-menu` | **Date**: 2026-11-08 | **Spec**: `/specs/013-floating-menu/spec.md`

**Input**: Feature specification from `/specs/013-floating-menu/spec.md`

## Summary

A floating menu (`FloatingMenu.jsx`) at the center bottom of the Virtual Campus Tour that controls campus tour narration: play/pause, an oscillation audio visualization shown left of the Play button while narration plays, and mute/unmute. All controls are keyboard operable with visible focus states and accessible names per Constitution Principle V.

## Technical Context

**Language/Version**: JavaScript (ES Modules)

**Primary Dependencies**: react, react-dom (approved); oscillation via CSS animation (no new dependency per research.md)

**Storage**: N/A (client-side audio playback state only)

**Testing**: Vitest

**Target Platform**: Desktop and mobile web browsers

**Project Type**: web application (frontend component)

**Performance Goals**: Under 300ms from Play click to audible narration; at least 95% of Play actions begin audible narration within 300ms across Chrome/Firefox/Safari on desktop and mobile.

**Constraints**: MERN stack alignment (Constitution Principle I); frontend must not access MongoDB directly (Principle II); new frontend dependencies require maintainer approval and entry in docs/tech_stack.md (Constitution §Technology & Dependency Constraints)

**Scale/Scope**: Single campus tour application; one floating menu instance

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Principle I MERN Stack: React + Vite frontend — satisfied.
- Principle II MVC: frontend owns UI; component does not access MongoDB — satisfied.
- Principle III Test-first: narration control behavior must have Vitest tests — satisfied (to be added in implementation).
- Principle IV Security/secrets: no secrets or credentials involved — satisfied.
- Principle V Responsive/Accessible: keyboard operable, visible focus, text alternative — satisfied via spec FR-005/FR-006.

GATE RESULT: PASS — no constitution violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/013-floating-menu/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (not created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   └── components/
│       └── FloatingMenu.jsx
└── tests/
    └── FloatingMenu.test.jsx
```

**Structure Decision**: Web application structure — a single React component under `apps/frontend/src/components/` with a co-located Vitest test. No new backend, database, or mobile project needed.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
