# Implementation Plan: Make ViewGallery Modal Responsive on All Viewports

**Branch**: `026-make-viewgallery-responsive` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/026-make-viewgallery-responsive/spec.md`

## Summary

Make the ViewGallery modal inside `FloatingMenu.jsx` fit desktop, tablet, and mobile viewports without requiring any vertical or horizontal scrolling. The gallery image, caption, image counter, previous/next navigation arrows, and close button must all remain within the viewport bounds at every supported size and orientation. The change is frontend-only, introduces no new dependency, and does not alter narration, panorama, sidebar, or location-selection behavior beyond the gallery modal's responsive layout.

## Technical Context

**Language/Version**: JavaScript with ES Modules and JSX. React `^19.2.8` (installed 19.3.0), Vite `^8.3.0` (installed 8.3.5), Tailwind CSS `^4.3.3`. No TypeScript in the frontend.

**Primary Dependencies**: React, React DOM, Tailwind CSS 4, existing MUI packages (`@mui/icons-material` `^9.5.0`, `@mui/material` `^9.5.0`), and Marzipano `^0.10.2`. This feature introduces no new package and changes none of the existing dependency set.

**Storage**: Static tour content in `apps/frontend/src/lib/catalog.json`. Per-floor gallery images are lazy-loaded under `apps/frontend/src/assets/gallery/` via `apps/frontend/src/lib/floorGallery.js`. No database or API involvement.

**Testing**: Vitest 5 with Testing Library and jsdom. Configuration is `apps/frontend/vite.config.js`; setup is `apps/frontend/src/tests/setup.js`.

**Target Platform**: Modern desktop, tablet, and mobile browsers supported by the Vite application, from 320 CSS pixels through desktop widths, in both portrait and landscape orientations.

**Project Type**: Web application with separate `apps/frontend` and `apps/backend`. This feature is frontend-only.

**Performance Goals**: No new loading budget. Responsive layout changes add no assets and do not change how gallery images (one at a time) are loaded.

**Constraints**: No backend changes, no new runtime dependencies, no catalog or schema changes, no change to panorama, sidebar, location-selection, or narration behavior. The gallery modal must fit all viewports without scrolling per FR-002–FR-005. Mobile support is required per Constitution Principle V.

**Scale/Scope**: One frontend source file changes (`FloatingMenu.jsx`), plus its test file (`FloatingMenu.test.jsx`) updated. The gallery serves all accessible tour locations with their existing floor-image data.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|:---|:---|:---|:---|
| I. MERN Stack Alignment | React + Vite + JavaScript ES Modules; Vitest testing; no alternative stack | PASS | Change stays within the React frontend; Vitest remains the test framework; no backend, model, service, or route change |
| II. MVC Separation and Application Boundaries | Frontend owns UI, galleries, narration controls, and static assets; no backend involvement | PASS | All changes are under `apps/frontend/src/components/` and `apps/frontend/src/tests/`; no backend change |
| III. Test-First Quality Gate | Tests written and observed failing before implementation; gallery responsiveness covered | PASS | `FloatingMenu.test.jsx` already covers gallery behavior; the plan adds responsive-viewport tests before implementation and keeps them passing |
| IV. Security, Secrets, and Configuration Discipline | No secrets or environment changes | PASS | No credentials, `.env` files, or configuration changes |
| V. Responsive, Accessible Immersive Experience | Works on desktop and mobile; accessible controls; layout and touch controls verified at representative viewports | PASS | The responsive gallery modal targets mobile (320px+) through desktop; existing accessible names, focus, keyboard shortcuts, alt text, and captions are retained |
| Technology & Dependency Constraints | Approved stack only; new dependencies need approval | PASS | No dependency is added or changed |
| Development Workflow & Quality Gates | Specification, plan, tasks, implementation; tests and lint pass | PASS | This plan continues the Spec Kit sequence; automated tests, lint, and build remain required |

No constitution violation requires a complexity exception. No complexity tracking entries are needed.

## Project Structure

### Documentation (this feature)

```text
specs/026-make-viewgallery-responsive/
├── plan.md              # This file
├── research.md          # Phase 0 responsive-layout decisions and alternatives
├── data-model.md        # Phase 1 responsive gallery state and contract
├── quickstart.md        # Phase 1 viewport validation guide
├── contracts/
│   └── ui-contract.md   # Responsive gallery modal surface, aria labels, keyboard shortcuts
├── checklists/
│   └── requirements.md  # Specification quality checklist
├── spec.md              # Feature specification
└── tasks.md             # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   └── FloatingMenu.jsx   # Updated: responsive ViewGallery modal layout
│   └── tests/
│       └── FloatingMenu.test.jsx   # Updated: responsive-viewport gallery coverage
├── public/
│   └── panoramas/             # Unchanged: narration audio assets
├── lib/
│   ├── catalog.json           # Unchanged: location gallery data source
│   └── floorGallery.js        # Unchanged: per-floor image lookup
```

**Structure Decision**: Retain the existing web-application layout. Gallery content stays in `catalog.json` and per-floor assets under `assets/gallery/`. The responsive layout change is confined to `FloatingMenu.jsx`; no new component, hook, service, or state container is introduced.

## Current Implementation Findings

- `FloatingMenu.jsx` renders the ViewGallery modal as a fixed backdrop (`fixed inset-0`) containing an inner panel (`section#room-gallery`).
- The panel currently uses `overflow-y-auto`, which permits scrolling — this directly conflicts with the "no scrolling required" requirement (FR-002).
- The panel height is capped by `max-h-[min(88dvh,52rem)]` and width by `w-[min(68rem,100%)]`, but the image aspect box (`aspect-16/10 w-full`) can still exceed the available viewport on small screens, forcing a scroll.
- Mobile handling uses `tiny:`-prefixed utilities (`tiny:p-0 tiny:w-full tiny:max-h-dvh tiny:rounded-none`), but the panel still enables vertical scrolling via `overflow-y-auto`.
- Navigation arrows are positioned absolutely with `left-3`/`right-3`, which can overflow near the viewport edges on narrow screens.
- Padding (`p-5`) and heading sizes are fixed across viewports and may consume too much vertical room on compact mobile viewports.
- Existing keyboard handling (Escape, ArrowLeft, ArrowRight), focus management (close-button autofocus, focus return on close), and the `sidebarOpen && isCompactViewport()` hide rule are already correct and are preserved.

## Proposed Changes

### 1. Make the ViewGallery modal responsive without scrolling

Update the gallery modal layout inside `FloatingMenu.jsx` so the entire modal fits within the viewport on mobile, tablet, and desktop with no scrolling:

- Remove `overflow-y-auto` from the gallery panel so no scrollbar appears.
- Cap the panel within the viewport using viewport-relative constraints (e.g., fit to available height/width without exceeding `dvh`/`dvw`).
- Scale the gallery image so it never exceeds the available viewport height or width (`max-w-full`, bounded `max-h` relative to viewport) while preserving its aspect ratio.
- Reduce padding and heading sizes on compact viewports so header, image, caption, counter, and controls all fit.
- Reposition previous/next arrows so they remain within the panel/viewport on narrow screens (e.g., inset from edges or stacked within the image area).
- Keep `max-w-[min(68rem,100%)]` style width cap but ensure it does not force horizontal scrolling on small viewports.
- Preserve the existing open/close animation, Escape/arrow-key navigation, focus management, close button, caption, position counter, empty state, and image-load-fallback behavior unchanged.

### 2. Update `FloatingMenu.test.jsx`

Add responsive-viewport gallery tests covering:
- Modal and all content fit within a 320px-wide mobile viewport without scrolling.
- Modal and all content fit within tablet and desktop viewports without scrolling.
- Gallery image scales down on narrow viewports without overflowing.
- Previous/next arrows remain reachable and within bounds on compact viewports.
- Caption, position counter, close button, and navigation all visible without scroll at representative viewports.
- Existing narration and gallery tests continue to pass.

## Testing Strategy

### Automated

```bash
npm --prefix apps/frontend run test
npm --prefix apps/frontend run lint
npm --prefix apps/frontend run build
```

Expected results:
- All existing test files keep passing.
- New/updated `FloatingMenu.test.jsx` responsive-viewport tests cover modal fit on mobile/tablet/desktop without scrolling, image scaling, and arrow reachability.
- Lint and build succeed.

### Manual

Use `quickstart.md` for the full matrix. At minimum:
- Open the gallery on a 320px-wide mobile viewport and confirm image, caption, counter, arrows, and close button all fit without scrolling.
- Repeat on tablet and desktop viewports.
- Navigate between images at each viewport and confirm no scrolling is triggered.
- Rotate the device between portrait and landscape with the modal open; confirm content still fits without scrolling.
- Confirm narration controls still work alongside the responsive gallery.

## Risks and Dependencies

| Risk | Impact | Mitigation |
|:---|:---|:---|
| Removing `overflow-y-auto` causes content to be clipped on very small viewports | Some gallery content becomes unreachable | Cap image height to viewport and reduce padding/heading sizes so all content fits within `dvh`; verify at 320px |
| Image aspect box overflows viewport on mobile | Image or arrows clipped | Apply `max-h` bounded to available viewport height and `object-contain`/constrained sizing while preserving aspect ratio |
| Absolute arrow positioning overflows panel edges on narrow screens | Arrows unreachable or off-screen | Position arrows inset safely or constrain within panel bounds on compact viewports |
| Responsive change affects desktop layout undesirably | Desktop gallery looks cramped | Use responsive prefixes so desktop keeps generous sizing; only compact viewports get tighter constraints |
| Focus management breaks after layout change | Focus not restored on close | Carry over existing focus logic unchanged; verify close-button autofocus and focus return |

No backend dependency, API change, storage migration, or new runtime package is introduced.

## Implementation Phases

1. **Update FloatingMenu.jsx**: Replace `overflow-y-auto` with viewport-capped sizing; scale the gallery image to viewport; tighten padding/headings on compact viewports; reposition arrows safely; preserve all existing gallery behavior and narration controls.
2. **Update FloatingMenu.test.jsx**: Add responsive-viewport tests for mobile/tablet/desktop fit without scrolling, image scaling, and arrow reachability; keep all existing tests passing.
3. **Verification**: Run the frontend test suite, lint, and build. Manually validate gallery fit at representative viewports and orientations per `quickstart.md`.

## Post-Design Constitution Re-Check

After generating `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md`, the design still satisfies the constitution:

- **Stack and boundaries**: All changes stay in the React frontend, with static content and assets unchanged. No backend, model, service, or route change.
- **Test-first**: The updated `FloatingMenu.test.jsx` covers the spec's success criteria (SC-001–SC-003) before implementation.
- **Accessibility and responsiveness**: Existing accessible names, visible focus, keyboard shortcuts, alternative text, captions, and the mobile hide rule are retained; the responsive modal adds verified fit on mobile/tablet/desktop without scrolling.
- **Dependency discipline**: No dependency changes.
- **Complexity**: No new component, hook, or abstraction is needed; only CSS/layout utilities are adjusted within the existing modal.
