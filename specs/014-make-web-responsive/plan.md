# Implementation Plan: Make Web Responsive

**Branch**: `014-make-web-responsive` | **Date**: 2026-11-09 | **Spec**: `specs/014-make-web-responsive/spec.md`

**Input**: Feature specification from `specs/014-make-web-responsive/spec.md`

## Summary

Make the CIIT Virtual Campus Tour frontend web responsive across mobile, tablet, and desktop viewports. Four components (Sidebar, Header, PanoramaViewer, ErrorBoundary) and one test file (FloatingMenu.test.jsx) are updated to use mobile-first responsive design with the project's existing Tailwind custom variants (`compact`, `narrow`, `tiny`). The sidebar is flush with the top of the screen at every width and stacks above the transparent header: on narrow phone viewports (≤43.75rem) it is a full-width, fully opaque overlay occupying the entire header strip (FR-001a); on tablet and landscape-mobile viewports (43.75rem–63.9375rem) it keeps the desktop panel width, covers only the header logo area, and leaves the location name visible to its right (FR-001b). At those tablet widths the backdrop no longer dims the page but remains a transparent, full-size tap-to-close target (FR-001c).

## Technical Context

**Language/Version**: JavaScript (ES Modules), React with Vite

**Primary Dependencies**: React, React DOM, @mui/material, @mui/icons-material

**Storage**: N/A (frontend-only feature; tour content in `apps/frontend/src/lib/catalog.json` and media under `apps/frontend/public/panoramas/`)

**Testing**: Vitest with Testing Library

**Target Platform**: Web browser (desktop, tablet, mobile)

**Project Type**: web-app (frontend)

**Performance Goals**: All four components render without horizontal overflow on a 320px-wide mobile screen; every interactive button meets a minimum tappable size on mobile; text remains readable without horizontal scrolling on mobile, tablet, and desktop

**Constraints**: MERN stack alignment per Constitution Principle I; mobile-first responsive using existing Tailwind custom variants only (`compact`, `narrow`, `tiny`); no new frontend dependencies; no JavaScript viewport detection for layout (CSS-driven); sidebar top-covering tiered by variant (`narrow` = full-width opaque overlay, `compact` = desktop-width panel flush at top); the `compact` backdrop carries no dim tint and stays a transparent tap-to-close target (FR-001c); existing component behavior (floor pairing, locked-floor popovers, scene switching, narration) preserved across all viewports

**Scale/Scope**: 4 components + 1 test file; campus tour application; viewport breakpoints defined in `apps/frontend/src/index.css`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|-----------|-------------|--------|----------|
| I. MERN Stack Alignment | Frontend uses React + Vite with JS ES Modules | PASS | `apps/frontend/` uses React + Vite, ES Modules |
| II. MVC Separation | Frontend owns UI; consumes backend APIs; no direct MongoDB access | PASS | Changes are frontend UI only; no data access |
| III. Test-First Quality Gate | Frontend components have Vitest tests; tests pass | PASS | Sidebar.test.jsx and FloatingMenu.test.jsx updated; all 68 tests pass |
| IV. Security, Secrets, Config | No secrets or config introduced | PASS | No env vars, keys, or credentials in scope |
| V. Responsive, Accessible Immersive Experience | Every user-facing feature works on desktop and mobile; keyboard operable with visible focus | PASS | Sidebar/Header/PanoramaViewer/ErrorBoundary made mobile responsive; sidebar is flush at the top on all widths — full-width opaque overlay on narrow phones (FR-001a), desktop-width panel covering only the logo area on tablets and landscape phones (FR-001b); tablet backdrop adds no dimming while remaining a transparent tap-to-close target (FR-001c); floating menu tests cover mobile viewport |

All constitution gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/014-make-web-responsive/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # N/A — frontend-only UI feature, no external interfaces
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Updated: mobile responsive; flush-top overlay (narrow) / desktop-width panel (tablet, landscape) + floor name at top
│   │   ├── Layout.jsx           # Updated: backdrop stays transparent at tablet widths (tap-to-close, no dimming)
│   │   ├── Header.jsx           # Updated: mobile responsive text/layout
│   │   ├── PanoramaViewer.jsx   # Updated: mobile responsive controls/scene list
│   │   ├── ErrorBoundary.jsx    # Updated: mobile responsive layout/tappable button
│   │   └── FloatingMenu.jsx     # Unchanged (test coverage added)
│   └── tests/
│       └── FloatingMenu.test.jsx # Updated: mobile viewport test cases
```

**Structure Decision**: Option 2 (Web application). This is a frontend-only feature within `apps/frontend/src/components/` and `apps/frontend/src/tests/`. No backend changes are required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. This section is not applicable.
