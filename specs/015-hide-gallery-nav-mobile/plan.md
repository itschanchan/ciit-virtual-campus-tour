# Implementation Plan: Hide Gallery and Floating Nav When Sidebar Opens on Mobile

**Branch**: `015-hide-gallery-nav-mobile` | **Date**: 2026-11-09 | **Spec**: `specs/015-hide-gallery-nav-mobile/spec.md`

**Input**: Feature specification from `specs/015-hide-gallery-nav-mobile/spec.md`

## Summary

When the campus floor sidebar is revealed on a mobile viewport, the room gallery and floating navigation bar are hidden so the sidebar's tinted background is the sole focus. When the sidebar closes, both reappear. On desktop viewports, both remain visible regardless of sidebar state. The sidebar open/close state lives in the tour context (Layout) and is shared with the gallery (RoomGallery in Panorama) and floating nav (FloatingMenu in Layout) so both can respond to sidebar visibility on mobile only.

## Technical Context

**Language/Version**: JavaScript (ES Modules), React with Vite

**Primary Dependencies**: React, React DOM, @mui/material, @mui/icons-material

**Storage**: N/A (frontend-only feature; tour content in `apps/frontend/src/lib/catalog.json` and media under `apps/frontend/public/panoramas/`)

**Testing**: Vitest with Testing Library

**Target Platform**: Web browser (desktop, tablet, mobile)

**Project Type**: web-app (frontend)

**Performance Goals**: Gallery and floating nav hide/show instantly (no perceptible delay) when the sidebar toggles on mobile; no layout shift or horizontal overflow on a 320px-wide mobile screen

**Constraints**: Mobile-first responsive using existing Tailwind custom variants only (`compact`, `narrow`, `tiny`); no new frontend dependencies; CSS-driven responsiveness — no JavaScript viewport detection or resize listeners for layout decisions; sidebar open state sourced from the existing tour context; existing sidebar behavior (floor pairing, locked-floor popovers, scene switching) preserved across all viewports

**Scale/Scope**: Sidebar.jsx, Layout.jsx, Panorama.jsx (RoomGallery), FloatingMenu.jsx; campus tour application; mobile viewport = max-width 1023px per existing `isCompactViewport()` utility

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No `.specify/memory/constitution.md` exists; AGENTS.md serves as the project's governing principles.

| Principle | Requirement | Status | Evidence |
|-----------|-------------|--------|----------|
| KISA — Keep It Simple Agent | Basic, clean syntax over clever/compact code; functions under 25–30 lines; max indent 3 | PASS | Feature is a visibility toggle coordinated through existing state; no complex abstractions |
| Responsive — Mobile-first | Default styles for mobile first, progressive enhancement for tablet/desktop via Tailwind variants | PASS | Hide/show behavior keyed on mobile viewport (`compact`/`narrow` ≤1023px); desktop unaffected |
| Responsive — Device compatibility | Supports mobile, tablet, desktop; no horizontal overflow or overlapping controls | PASS | Hiding applies only to mobile where sidebar overlays; desktop keeps both surfaces visible |
| Responsive — CSS-first, no JS viewport detection | Layout changes via Tailwind media queries, not `useState`/`useEffect`/resize listeners for sizing | PASS | Visibility driven by existing `isCompactViewport()` check tied to sidebar open state; no new JS viewport detection |
| Workflow — Analyze, Draft, Verify | Simplest approach first; verify against prohibited over-complications | PASS | Single visibility toggle across three components; minimal state coordination |
| Constraints — No undeclared packages | No new dependencies installed | PASS | Uses existing React, MUI, Tailwind, and Vitest only |
| Constraints — Tour content location | Catalog in `catalog.json`, media under `public/panoramas/` | PASS | No tour content changes |

All constitution gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/015-hide-gallery-nav-mobile/
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
│   │   ├── Sidebar.jsx          # Already emits open/close via parent; no change needed for visibility logic
│   │   ├── Layout.jsx           # Updated: passes sidebarOpen to FloatingMenu and RoomGallery (via Panorama)
│   │   ├── FloatingMenu.jsx     # Updated: hides when sidebarOpen && mobile viewport
│   │   └── RoomGallery.jsx      # Updated: hides when sidebarOpen && mobile viewport (via Panorama)
│   └── pages/
│       └── Panorama.jsx         # Updated: receives sidebarOpen, passes to RoomGallery
│   └── lib/
│       └── viewport.js          # Unchanged: isCompactViewport() already available
│   └── context/
│       └── tourContextValue.js  # Unchanged: sidebarOpen already in context
```

**Structure Decision**: Option 2 (Web application). This is a frontend-only feature within `apps/frontend/src/`. No backend changes are required. No external interfaces (APIs, CLI, etc.) are exposed by this feature, so `contracts/` is not applicable.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. This section is not applicable.

## Phase 0: Research

See `research.md`. All specification clarifications are resolved; no NEEDS CLARIFICATION markers remain.

## Phase 1: Design & Contracts

See `data-model.md` and `quickstart.md`. No contracts are required (frontend-only UI feature with no external interfaces).
