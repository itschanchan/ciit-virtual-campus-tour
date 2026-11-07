# Implementation Plan: Update Sidebar and Header Tour Logos

**Branch**: `011-update-tour-logos` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-update-tour-logos/spec.md`

## Summary

Display the CIIT glitch virtual tour logo image at the top of the campus floor sidebar (replacing the current text-only "CIIT" mark) and the CIIT Logo Inverse cropped SVG image in the tour header (replacing the current text-only header mark). Both logos keep their accompanying text (the "360° Virtual Campus Tour" subtitle in the sidebar; the "Virtual Campus Tour" title and current location name in the header), follow the existing visibility behaviour (sidebar logo hidden when collapsed, header logo hidden when the sidebar is open), render correctly on desktop and narrow mobile viewports, and include descriptive alt text for assistive technology. The work stays inside `Sidebar.jsx`, `Header.jsx`, and `Layout.jsx`, adds no dependencies or tour content, and reuses existing Tailwind tokens and component styling.

## Technical Context

**Language/Version**: JavaScript ES modules on Node.js (Vite frontend)

**Primary Dependencies**: React 19.2.8, React DOM 19.2.8, Vite 8.3.0, Tailwind CSS 4.3.3, `@mui/material` ^9.5.0, `@mui/icons-material` ^9.5.0

**Storage**: N/A - both logo images are static assets already present under `apps/frontend/public/img/`; no data persistence or catalog changes are required

**Testing**: Vitest 5.1.0 configured in `apps/frontend/vitest.config.js`. Testing Library and jsdom remain deferred by the maintainer, so component tests can be authored now but cannot execute until that tooling is restored. Lint, production build, and manual desktop/mobile checks provide interim evidence.

**Target Platform**: Modern desktop and mobile browsers with JavaScript enabled; minimum supported width 320 CSS pixels

**Project Type**: Web application (React + Vite frontend, Express backend) following MVC

**Performance Goals**: No new runtime dependencies. Both logo images are existing static assets served from `public/img/`; the sidebar image is already imported in `Sidebar.jsx` but unused, and the header SVG is already present under `public/img/`. Initial render performance is unchanged.

**Constraints**: Sidebar logo hidden when the sidebar is collapsed and shown when expanded (existing collapse behaviour); header logo hidden when the sidebar is open and shown when closed (existing header mark visibility behaviour); both logos render without layout breakage at desktop and narrow mobile viewports (minimum 320 CSS pixels); both images include descriptive alt text; no new dependencies; reuse existing component styling and Tailwind tokens.

**Scale/Scope**: Two frontend components (`Sidebar.jsx`, `Header.jsx`) plus wiring in `Layout.jsx` to supply the sidebar `logoUrl` prop. No backend, catalog schema, routing, dependency, or content changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Status | Evidence |
| :--- | :--- | :--- |
| I. MERN Stack Alignment | PASS | The change uses the existing React 19 and Vite frontend with JavaScript ES modules. No framework, test-runner, or language change is proposed. |
| II. MVC Separation | PASS | All work stays in `apps/frontend/src/components` and `apps/frontend/src/tests`. No backend, database, or route changes occur. |
| III. Test-First Quality Gate | PASS WITH JUSTIFICATION | Logo rendering changes visible UI behaviour, so test cases for `Sidebar.jsx` and `Header.jsx` logo display (image present, alt text, visibility rules) are authored. Vitest/Testing Library/jsdom are not installed because the maintainer deferred that tooling; the tests cannot execute until it is restored. Lint, production build, and manual desktop/mobile checks provide interim evidence. |
| IV. Security, Secrets, and Configuration | PASS | No secrets, environment values, APIs, or authentication paths change. The logos are static public assets; no data is persisted or transmitted. |
| V. Responsive, Accessible Immersive Experience | PASS | Both logos render on desktop and narrow mobile viewports; both include descriptive alt text; layout is verified at representative viewports; keyboard operability of surrounding controls is unchanged. |
| Dependency governance | PASS | No package is added, removed, or upgraded. Existing React, Vite, Tailwind, and MUI usage is reused. |
| Workflow gate | PASS | The feature follows the Spec Kit sequence: specification, plan, tasks, then implementation. |

No violations require the Complexity Tracking table.

## Project Structure

### Documentation (this feature)

```text
specs/011-update-tour-logos/
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
│   │   ├── Sidebar.jsx    # SidebarLogo renders the glitch virtual tour logo image via the existing logoUrl prop
│   │   └── Header.jsx     # Header logo replaced with the CIIT Logo Inverse cropped SVG image
│   └── tests/
│       ├── Sidebar.test.jsx # Add logo-render regression cases (image, alt text, visibility)
│       └── Header.test.jsx  # Add header logo-render regression cases (image, alt text, visibility)
├── public/
│   └── img/
│       ├── ciit_glitch_virtual_tour_logo.png   # Existing static asset (already imported, unused)
│       └── CIIT_Logo_Inverse_cropped.svg       # Existing static asset
├── vitest.config.js     # Unchanged
└── package.json         # Unchanged
```

**Structure Decision**: The feature stays inside the existing frontend workspace and reuses the established component and test layout. No new source directories, backend modules, content files, or dependencies are introduced.

## Phase 0: Research Summary

See [research.md](./research.md). Key decisions:

- No `[NEEDS CLARIFICATION]` markers remain in the specification; both image files and both components were explicitly identified by the user.
- Sidebar: `Layout.jsx` supplies the `logoUrl` prop to `<Sidebar>`, pointing at the existing `ciit_glitch_virtual_tour_logo.png` static asset; `Sidebar.jsx`'s `SidebarLogo` component already accepts `logoUrl` and renders an ``, so only the prop wiring is needed.
- Header: `Header.jsx` replaces the text-only "CIIT" mark with the `CIIT_Logo_Inverse_cropped.svg` image while retaining the "Virtual Campus Tour" title and current location name.
- Visibility: sidebar logo follows existing collapse behaviour (hidden when collapsed); header logo follows existing mark visibility (hidden when the sidebar is open).
- Alt text: both images carry descriptive alt text so the brand remains identifiable when an image fails to load or is announced by assistive technology.
- Responsiveness: both logos are checked at desktop and narrow mobile viewports (minimum 320 CSS pixels) without horizontal scrolling or layout breakage.
- Testing: regression cases for logo presence, alt text, and visibility rules are authored for `Sidebar.jsx` and `Header.jsx`; execution awaits restoration of Vitest/Testing Library tooling.
- Dependency impact: no new dependencies; existing component styling and Tailwind tokens are reused.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines the `SidebarLogo` and `HeaderLogo` UI asset entities with their fields (image path, alt text, visibility condition, viewport behaviour) and validation rules derived from the requirements.
- [contracts/ui-contract.md](./contracts/ui-contract.md) defines the logo interfaces the sidebar and header must expose (image source, alt text, visibility rules, responsive behaviour, accessibility).
- [quickstart.md](./quickstart.md) defines manual and automated validation scenarios for logo presence, alt text, visibility, responsiveness, and accessibility end-to-end.

## Post-Design Constitution Check

| Gate | Status | Notes |
| :--- | :--- | :--- |
| Stack alignment | PASS | React, Vite, Tailwind, and ES modules are unchanged. |
| MVC boundaries | PASS | Only frontend components (`Sidebar.jsx`, `Header.jsx`, `Layout.jsx`) are touched. |
| Quality gate | PASS WITH JUSTIFICATION | Regression tests cover logo presence, alt text, and visibility rules; execution awaits deferred tooling, with lint, build, and manual verification as interim evidence. |
| Security | PASS | No secrets or external services are introduced; logos are static public assets. |
| Accessibility and responsiveness | PASS | Both logos include descriptive alt text; layout checked at 320 px and desktop widths; surrounding controls remain keyboard-operable. |
| Dependency governance | PASS | No dependency changes. |

## Complexity Tracking

No constitution violations require justification.
