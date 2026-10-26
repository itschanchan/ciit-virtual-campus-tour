# Implementation Plan: Tailwind CSS Integration

**Branch**: `feature/tailwindcss` (spec directory `002-tailwind-css-integration`) | **Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-tailwind-css-integration/spec.md`

## Summary

Adopt Tailwind CSS 4.3.3 as the frontend's primary styling system. Add `tailwindcss` and `@tailwindcss/vite` as frontend development dependencies, register the first-party Vite plugin, replace the current global stylesheet with Tailwind's theme and utility layers plus a curated base layer, migrate every existing component style to utility classes in JSX, and delete the five component stylesheets and `App.css`. Preserve the current dark visual design, all responsive breakpoints, keyboard behavior, accessible names, reduced-motion handling, and Marzipano viewer behavior.

Implementation is gated by a verifiable definition of done: both packages declared; the Vite plugin registered; Tailwind imported in the single global stylesheet; all component CSS removed; `docs/tech_stack.md` updated; `docs/styling.md` written; lint and production build passing; the visual/accessibility matrix complete; and the production CSS budget checked. Two pre-existing feasibility issues are documented below rather than hidden.

## Technical Context

**Language/Version**: JavaScript (ES2022+) with JSX and ES Modules on Node.js LTS, per the constitution.

**Primary Dependencies**: Existing React 19.2.8, React DOM 19.2.8, and Marzipano 0.10.2. Add `tailwindcss@4.3.3` and `@tailwindcss/vite@4.3.3` as frontend development dependencies.

**Storage**: N/A. The tour catalog is static frontend content. MongoDB, Mongoose, and the backend are untouched.

**Testing**: Vitest is required by the constitution. The frontend currently has a `vitest.config.js` and test files, but Vitest, jsdom, and Testing Library packages are not declared or installed; `npm --prefix apps/frontend run test` fails with `'vitest' is not recognized`. Lint and production build both pass on the baseline. No deferred test packages will be installed without separate maintainer approval.

**Target Platform**: Modern evergreen desktop and mobile browsers rendering the Vite 8.3 production bundle.

**Project Type**: Web application monorepo (`apps/frontend` plus `apps/backend`); this feature is frontend-only.

**Performance Goals**: No unstyled first paint; production styling payload kept as small as possible; no unused Tailwind rules; no regression to panorama interaction responsiveness; styles available without the backend.

**Constraints**: Full migration from the six existing CSS files; preserve the approved visual baseline; no redesign; 320-pixel through desktop viewports; portrait and landscape; keyboard and screen-reader behavior; visible focus; reduced motion; 200 percent zoom; forced-colors mode; no backend or API changes; dependency approval and documentation before installation; no secrets.

**Scale/Scope**: One frontend application, six existing CSS files (`index.css`, `App.css`, and four component stylesheets), eight visitor-facing surfaces (shell/header, sidebar, panorama, toolbar/buttons, narration, gallery, loading/error states, fatal error boundary), and no new data entities.

### Baseline Measurements

- `npm run lint`: passes.
- `npm run build`: passes; production CSS is 8,170 bytes gzip 2,558 plus 954 bytes gzip 481, for 3,039 bytes gzip total.
- `npm run test`: blocked by undeclared/deferred Vitest tooling.
- Representative Tailwind 4.3.3 output for the migration surface, using theme and utilities without Preflight: 19,262 bytes raw, 4,210 bytes gzip. This is a 38.5 percent increase over the 3,039-byte baseline, which conflicts with SC-009's 10 percent cap (see Feasibility Gates).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| I. MERN stack alignment | PASS | React 19 + Vite 8 + JavaScript ES Modules remain unchanged. Tailwind is the styling technology already named in `docs/tech_stack.md`; no alternative framework, database, or test runner is introduced. |
| II. MVC separation and boundaries | PASS | All source changes are inside `apps/frontend`. The backend, database, and API contracts are untouched. Static tour content and media stay in their documented locations. |
| III. Test-first quality gate | PASS WITH PRE-EXISTING RISK | No visitor behavior changes, so existing component tests remain the regression gate and must not be rewritten for styling. The repository's test runner is currently unavailable; this is a pre-existing tooling gap, not caused by this feature. Lint, build, and manual behavior checks remain mandatory. |
| IV. Security, secrets, and configuration | PASS | No secrets, `.env` values, credentials, or backend configuration are added. Dependencies are development-only. |
| V. Responsive, accessible immersive experience | PASS | The plan preserves all existing breakpoints and accessibility behavior, and adds explicit keyboard, focus, contrast, reduced-motion, zoom, and forced-colors validation. |
| Technology and dependency constraints | PASS | The two packages are the documented Tailwind toolchain. They will be recorded in `docs/tech_stack.md` and declared in `apps/frontend/package.json` before installation. No runtime dependency is added. |
| Development workflow and quality gates | PASS | Work follows specification, plan, tasks, implementation. Styling guidance and the dependency record are updated in the same change. |

**Post-Phase 1 re-check**: PASS. The design keeps the existing MVC boundaries, adds no backend surface, and preserves accessibility and responsive commitments.

## Feasibility Gates

These are explicit blockers to full acceptance; they do not block producing the plan or the Tailwind design.

| Gate | Finding | Required resolution |
|------|---------|---------------------|
| SC-009 compressed CSS budget | The baseline is 3,039 bytes gzip. A representative Tailwind build is 4,210 bytes gzip (+38.5 percent), so the 10 percent cap cannot be met with a utility-first migration even without Preflight. | Approve a revised budget, recommended at 6,000 bytes gzip maximum with an implementation target of 5,000 bytes, or accept an explicit SC-009 deviation. The plan will not silently claim SC-009 is met. |
| FR-013 / SC-003 test execution | Vitest, jsdom, and Testing Library are deferred and not installed, so `npm run test` cannot run on the baseline. | Approve installation of the deferred test tooling in a separate decision, or document that automated test verification is unavailable and rely on lint, build, and manual acceptance checks for this feature. |

## Project Structure

### Documentation (this feature)

```text
specs/002-tailwind-css-integration/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- ui-contract.md
|-- checklists/
|   `-- requirements.md
`-- tasks.md              # Created by /speckit.tasks, not by this command
```

### Source Code (repository root)

```text
apps/frontend/
|-- package.json                    # Add tailwindcss and @tailwindcss/vite devDependencies
|-- package-lock.json               # Updated by npm install
|-- vite.config.js                  # Register @tailwindcss/vite
|-- src/
|   |-- index.css                   # Tailwind imports, @theme tokens, curated base layer
|   |-- App.jsx                     # Remove App.css import
|   |-- App.css                     # Delete after migration
|   |-- components/
|   |   |-- Layout.jsx              # Migrate shell, header, toolbar, states to utilities
|   |   |-- Sidebar.jsx             # Migrate sidebar and location list to utilities
|   |   |-- Sidebar.css             # Delete after migration
|   |   |-- RoomGallery.jsx         # Migrate modal and gallery grid to utilities
|   |   |-- RoomGallery.css         # Delete after migration
|   |   |-- PanoramaViewer.jsx      # Migrate overlay and loading/error states to utilities
|   |   |-- PanoramaViewer.css      # Delete after migration
|   |   |-- NarrationPlayer.jsx     # Migrate narration controls and transcript to utilities
|   |   |-- NarrationPlayer.css     # Delete after migration
|   |   `-- ErrorBoundary.jsx       # Migrate fatal error surface to utilities
|   |-- tests/                      # Existing tests remain unchanged
|   `-- lib/                        # Unchanged
`-- public/                         # Unchanged tour assets

docs/
|-- tech_stack.md                   # Add the two approved devDependencies
`-- styling.md                      # New contributor styling guide
```

**Structure Decision**: Keep the fixed `apps/frontend` and `apps/backend` layout. The frontend owns all UI and styling. No new component stylesheets are introduced; the only global stylesheet is `src/index.css`.

## Phase 0 and Phase 1 Artifacts

- **Phase 0 research**: [research.md](./research.md) records the Tailwind 4.3.3 toolchain choice, CSS-first theme strategy, no-Preflight reset decision, class-scanning rules, responsive breakpoints, accessibility approach, test-tooling finding, and CSS payload measurement.
- **Phase 1 data model**: [data-model.md](./data-model.md) defines the design tokens, breakpoints, UI surface inventory, styling conventions, and validation rules.
- **Phase 1 UI contract**: [contracts/ui-contract.md](./contracts/ui-contract.md) defines the observable build, token, surface, responsive, accessibility, visual-baseline, and verification contracts.
- **Phase 1 quickstart**: [quickstart.md](./quickstart.md) provides the end-to-end validation guide, including baseline capture, installation, commands, viewport matrix, and known blockers.

## Implementation Strategy

### Phase A - Baseline and approval

1. Capture visual baselines at 1440x900, 1024x768, 700x800, 560x800, 375x667, and 320x568, including the sidebar open/closed, gallery open, narration collapsed/expanded, loading, error, and fatal-error states.
2. Record the 3,039-byte gzip production CSS baseline and the current lint/build/test status.
3. Add `tailwindcss` and `@tailwindcss/vite` to the approved frontend development dependency table in `docs/tech_stack.md`.
4. Install the two packages in `apps/frontend` and commit `package.json` plus `package-lock.json` together.

### Phase B - Build integration and design values

1. Register the Tailwind Vite plugin alongside the React plugin in `apps/frontend/vite.config.js`.
2. Replace `src/index.css` with Tailwind's theme and utility layers plus a curated base layer. Do not import full Preflight; keep a minimal reset that preserves the existing visual baseline and avoids changing Marzipano-generated DOM.
3. Define semantic `@theme` tokens for colors, typography, radii, shadows, and breakpoints. Map every existing CSS custom property to a semantic token.
4. Keep the existing body gradients, base typography, focus-visible outline, skip-link behavior, and reduced-motion rule in the base layer.

### Phase C - Surface migration

1. Migrate `App.jsx`, `Layout.jsx`, and `ErrorBoundary.jsx`; remove the `App.css` import and delete `App.css`.
2. Migrate `Sidebar.jsx`, `RoomGallery.jsx`, `PanoramaViewer.jsx`, and `NarrationPlayer.jsx`; remove each stylesheet import and delete the file.
3. Use complete utility class strings, `aria-*` variants, or explicit conditional strings. Never assemble class names from fragments that Tailwind's scanner cannot see.
4. Keep the same accessible names, roles, ARIA state, focus order, and component behavior. Styling changes must not alter state transitions or event handling.
5. Verify that the Marzipano canvas remains absolutely positioned, fills its container, receives pointer and touch input, and is not clipped by the base reset.

### Phase D - Documentation and conventions

1. Add `docs/styling.md` covering token usage, utility-first conventions, responsive variants, dynamic class rules, accessibility requirements, global stylesheet boundaries, and the process for adding a new UI surface.
2. Update `docs/tech_stack.md` with the two dependencies, approval status, and a note that Tailwind is the primary styling approach.
3. Update `AGENTS.md` only if the styling commands or constraints change; do not add redundant instructions.

### Phase E - Verification

1. Run `npm run lint` and `npm run build`.
2. Run `npm run test`; if the pre-existing tooling gap remains, record the exact failure and do not install deferred packages.
3. Re-run the visual and accessibility matrix against the captured baselines.
4. Inspect the production build: confirm one global stylesheet, no component CSS chunks, no unused surface classes, and no stale stylesheet imports.
5. Measure compressed CSS against the approved budget; if SC-009 has not been revised and the result exceeds 3,339 bytes gzip, stop and request the budget decision rather than declaring success.
6. Run `npm run verify:content` and `npm run verify:ignore`.

## Definition of Done (Implementation Guarantee)

Tailwind CSS implementation is complete only when all of the following are true:

- `apps/frontend/package.json` declares `tailwindcss` and `@tailwindcss/vite` in `devDependencies`.
- `apps/frontend/vite.config.js` registers the Tailwind Vite plugin.
- `apps/frontend/src/index.css` imports Tailwind's theme and utilities layers and defines the approved `@theme` tokens.
- Every visitor-facing component uses Tailwind utilities; no component stylesheet remains; `App.css` is deleted.
- `docs/tech_stack.md` records both packages and `docs/styling.md` documents the conventions.
- `npm run lint` and `npm run build` pass.
- Existing component tests remain unchanged and pass when the approved test tooling is available; otherwise the pre-existing blocker is recorded.
- The desktop/mobile visual matrix, keyboard checks, focus checks, reduced-motion check, 200 percent zoom check, forced-colors check, and backend-offline check pass.
- The Marzipano viewer remains interactive and correctly sized.
- The production CSS budget decision is resolved and the measured payload is within the approved target.
- `npm run verify:content` and `npm run verify:ignore` pass.

## Complexity Tracking

No constitution violations. No additional projects, services, data stores, or architectural layers are introduced.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Risks

| Risk | Mitigation |
|------|------------|
| SC-009's 10 percent CSS cap is not achievable. | Resolve the budget before implementation; measure with the documented gzip check; do not claim SC-009 is met without approval. |
| Tailwind's reset changes Marzipano canvas or generated controls. | Omit full Preflight, keep a curated base reset, scope third-party overrides, and verify the live viewer on desktop and touch. |
| Dynamically assembled classes are purged from production. | Use complete class literals, `aria-*` variants, or explicit conditional strings; inspect the production CSS. |
| Visual drift during CSS removal. | Capture baselines first; migrate surface by surface; compare at all documented viewports. |
| Existing test tooling cannot run. | Treat it as a pre-existing blocker; do not install deferred packages without approval; rely on lint, build, and manual checks in the interim. |
| Stale dev or build output misleads verification. | Restart the dev server after integration and inspect a fresh production build. |
| CSS size grows beyond the approved target. | Prefer fewer unique utilities, avoid Preflight, remove dead styles, and measure compressed output after every migration phase. |
