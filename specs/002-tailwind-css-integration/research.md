# Research: Tailwind CSS Integration

**Feature**: Tailwind CSS integration for the CIIT Virtual Campus Tour
**Date**: 2026-10-26
**Spec**: [spec.md](./spec.md)

## Decisions

### D1. Use Tailwind CSS 4.3.3 with the first-party Vite plugin

**Decision**: Add `tailwindcss@4.3.3` and `@tailwindcss/vite@4.3.3` as frontend development dependencies and register the Vite plugin.

**Rationale**:

- 4.3.3 is the current stable release checked against the npm registry on 2026-10-26.
- `@tailwindcss/vite` declares `vite: ^5.2.0 || ^6 || ^7 || ^8` as a peer dependency, so it supports the project's Vite 8.3.1.
- The Vite plugin is the first-party integration for Vite projects and avoids a separate PostCSS pipeline.
- Both packages are build-time tooling, so they belong in `devDependencies`, not runtime dependencies.

**Alternatives considered**:

- **Tailwind CSS 3 with PostCSS and Autoprefixer**: rejected because it requires more tooling, an older major, and a JavaScript configuration file. It would also add two more packages to a project that values a small dependency surface.
- **Tailwind CLI as a separate build step**: rejected because it duplicates Vite's build and watcher behavior and adds a second process to maintain.
- **CDN-hosted Tailwind**: rejected because it would add a runtime network dependency, conflict with the offline-capable frontend goal, and cannot purge unused styles for production.

### D2. Use the CSS-first `@theme` configuration

**Decision**: Define design tokens in `src/index.css` with `@theme`. Do not create `tailwind.config.js` unless a later requirement cannot be expressed in CSS.

**Rationale**:

- Tailwind 4 treats CSS as the configuration source. The existing design already uses CSS custom properties, so a direct migration is possible.
- A single source of truth in `index.css` is easier for the CIIT Glitch Devs to inspect than a second JavaScript configuration file.
- CSS-first configuration keeps the toolchain minimal and aligns with the existing `index.css` ownership of global design values.

**Alternatives considered**:

- **`tailwind.config.js` with theme extension**: rejected because it duplicates the token source and adds a file that is unnecessary for this scope.
- **Arbitrary values everywhere**: rejected because it would make the visual language inconsistent and hard to change.

### D3. Import theme and utilities layers without full Preflight

**Decision**: In `src/index.css`, import `tailwindcss/theme.css` and `tailwindcss/utilities.css` in their layers, and keep a small curated base layer instead of importing full Preflight.

**Rationale**:

- The current application already has a reset in `index.css`, and the tour contains a Marzipano-generated canvas. Full Preflight changes margins, borders, form controls, and media defaults that could affect the panorama area.
- Skipping Preflight reduces the payload and keeps the existing visual baseline within closer reach.
- A curated base layer preserves the current body background gradients, typography, `box-sizing`, margin reset, `:focus-visible` outline, and reduced-motion behavior.

**Alternatives considered**:

- **Full `@import "tailwindcss"` with Preflight**: simpler, but larger and more likely to disturb the Marzipano viewer. It would require more override CSS and risk visual drift.
- **No reset at all**: rejected because browser defaults would break the established layout and spacing.

### D4. Use semantic design tokens mapped from the existing variables

**Decision**: Replace the current `--bg`, `--surface`, `--surface-strong`, `--surface-soft`, `--text`, `--muted`, `--border`, `--accent`, `--accent-strong`, `--accent-ink`, `--danger`, and `--focus` variables with `@theme` tokens named for their role.

**Rationale**:

- Utility classes such as `bg-canvas`, `text-ink`, and `border-line` communicate intent better than `bg-[var(--bg)]`.
- Tailwind emits only the theme variables that are used, keeping the payload small.
- A semantic mapping gives contributors a stable vocabulary for new UI.

**Alternatives considered**:

- **Keep the old variable names and use arbitrary values**: rejected because the JSX would be noisy and contributors would be less likely to reuse tokens.
- **Use Tailwind's default color palette directly**: rejected because it would change the approved dark campus palette and make future brand changes harder.

### D5. Migrate fully to utilities; keep one global stylesheet

**Decision**: Move all layout, spacing, color, typography, border, shadow, and responsive styling into utility classes in JSX. Delete `App.css` and the four component stylesheets. Keep only `src/index.css` for Tailwind imports, `@theme` tokens, base reset, and unavoidable third-party or canvas-specific rules.

**Rationale**:

- The specification requires one styling approach and no competing or dead CSS.
- One global stylesheet is easier to audit than six files with overlapping selectors.
- Utilities in JSX keep styles next to the markup they affect and eliminate stale selectors.

**Alternatives considered**:

- **Keep component stylesheets and add Tailwind alongside them**: rejected because it violates the full-migration assumption and creates specificity conflicts.
- **Use `@apply` for most styles**: rejected because it recreates component CSS inside the global stylesheet and makes the JSX less self-describing. `@apply` remains an option only for a repeated primitive if evidence shows it is necessary.
- **CSS Modules**: rejected because it is a second styling system and was not requested.

### D6. Use complete class strings and ARIA or data-state variants

**Decision**: Conditional styling uses complete class literals, for example `open ? 'block' : 'hidden'`, or variants driven by existing `aria-*` attributes such as `aria-[current=true]:border-accent`. Never build class names from fragments.

**Rationale**:

- Tailwind scans source text. Dynamically assembled fragments such as `bg-${color}-500` are invisible to the scanner and disappear from production.
- Existing ARIA state already describes the interface, so variants based on `aria-current`, `aria-expanded`, and `aria-hidden` reduce duplicate state props.
- Complete literals keep behavior explicit and reviewable.

**Alternatives considered**:

- **Runtime class concatenation helper**: rejected because it does not solve statically missing classes.
- **Safelist configuration**: unnecessary and harder to maintain for this small application.

### D7. Preserve the existing responsive thresholds

**Decision**: Keep the current behavior at the same effective widths:

- Desktop navigation remains visible from 1024 pixels upward (`lg`).
- The compact sidebar and backdrop apply below 1024 pixels (`max-lg`).
- The panorama instruction and narration layout change below 700 pixels (`max-narrow`, 43.75rem).
- Header brand hiding, mobile toolbar sizing, gallery full-screen mode, and narration edge-to-edge mode apply below 560 pixels (`max-tiny`, 35rem).

**Rationale**: The current CSS uses 1023, 700, and 560 pixel breakpoints. Named Tailwind breakpoints preserve those outcomes while making the intent readable. A probe build confirmed that custom `--breakpoint-*` values generate the expected `max-*` variants.

**Alternatives considered**:

- **Use default Tailwind breakpoints only**: 640, 768, and 1024 pixels would change the existing behavior at 700 and 560 pixels.
- **Arbitrary variants everywhere (`max-[700px]:`)**: works, but named breakpoints are easier to reuse and review.

### D8. Preserve accessibility in the base layer and JSX

**Decision**: Keep the global `:focus-visible` outline and reduced-motion rule in the base layer. Keep all existing roles, labels, `aria-live`, `aria-current`, `aria-expanded`, `aria-hidden`, and focus-management behavior. Use Tailwind's `sr-only`, `focus-visible`, and `forced-colors` capabilities where needed.

**Rationale**:

- The tour already meets keyboard and assistive-technology requirements; a styling migration must not regress them.
- A global focus and reduced-motion rule prevents individual components from forgetting these behaviors.
- Existing tests assert accessible names and focus behavior, so the migration must not change the DOM semantics.

**Alternatives considered**:

- **Per-component focus styling only**: rejected because it is easier to miss a control.
- **Removing reduced-motion handling because utilities are fast**: rejected because the spec and constitution require it.

### D9. Verify with lint, build, manual matrix, and CSS inspection

**Decision**: Use the existing lint and production build as automated gates, run the existing tests when their tooling is available, and add a manual desktop/mobile/accessibility matrix plus production CSS inspection.

**Rationale**:

- The repository has no approved visual-regression tool, and adding one would require a new dependency approval.
- The six existing CSS files and eight UI surfaces are small enough for a structured manual matrix.
- Inspecting the production CSS catches purged dynamic classes and unused rules.

**Alternatives considered**:

- **Add Playwright or another visual tool**: rejected for this feature because it would introduce an unapproved dependency and expand scope.
- **Rely only on the dev server**: rejected because production purging and chunking behave differently from development.

### D10. Do not install deferred test tooling

**Decision**: Do not add Vitest, jsdom, Testing Library, or any other deferred test package as part of this feature. Record the current test-command failure and use lint, build, and manual checks until separate approval is given.

**Rationale**:

- The constitution and `docs/tech_stack.md` mark this tooling as deferred.
- The feature changes styling, not behavior, so the existing component tests remain the intended regression gate once tooling is available.
- Installing unapproved packages would violate the dependency rule and expand scope.

**Alternatives considered**:

- **Install the test stack to satisfy FR-013 in this change**: rejected because it is outside the approved dependency scope and would mix two features.

### D11. Update the dependency record before installation

**Decision**: Add both Tailwind packages to the frontend development dependency table in `docs/tech_stack.md` and declare them in `apps/frontend/package.json` before running the install.

**Rationale**: The constitution requires dependency approval and a technology-documentation update in the same change. The maintainer's request for Tailwind is treated as approval for this minimal toolchain, not for unrelated packages.

**Alternatives considered**:

- **Install first and document later**: rejected because it breaks the project's approval workflow.
- **Treat Tailwind as an implicit Vite plugin**: rejected because `tailwindcss` is a distinct package and must be recorded.

## CSS Payload Research

### Measurement method

A representative migration surface was compiled with Tailwind 4.3.3 using the theme and utilities layers without Preflight. The output was minified and measured with Node's `zlib.gzipSync` at level 9.

| Build | Raw bytes | Gzip bytes |
|-------|-----------|------------|
| Existing production CSS (two files) | 9,124 | 3,039 |
| Representative Tailwind output | 19,262 | 4,210 |

### Finding

The representative Tailwind output is approximately 38.5 percent larger by gzip than the existing CSS. Even without Preflight, it cannot satisfy SC-009's requirement of no more than a 10 percent increase (maximum 3,339 bytes gzip).

The gap comes from Tailwind's fixed theme and utility infrastructure plus the number of unique utilities needed for eight surfaces. Repetition of the same utility in multiple components does not change the payload; the number of distinct utilities does.

### Recommendation

Revise SC-009 to an absolute compressed budget. A maximum of 6,000 bytes gzip with an implementation target of 5,000 bytes gzip is realistic for this feature and still keeps the styling payload small. If the spec is not revised, implementation must stop before claiming SC-009 is satisfied and request a decision.

### Alternatives rejected

- **Keep the 10 percent cap and add a large block of component CSS**: would reduce Tailwind utility usage and undermine the purpose of the feature.
- **Drop Tailwind to avoid CSS growth**: contradicts the requested feature and `docs/tech_stack.md`.
- **Use a CDN build**: would add runtime network cost and prevent production purging.

## Test Tooling Research

The baseline commands were run on 2026-10-26:

- `npm run lint`: passes with zero reported errors.
- `npm run build`: passes; Vite 8.3.1 produces the baseline CSS sizes above.
- `npm --prefix apps/frontend run test -- --passWithNoTests`: fails with `'vitest' is not recognized as an internal or external command`.

`apps/frontend/package.json` does not declare `vitest`, `jsdom`, or the Testing Library packages, while test files and `vitest.config.js` exist. The technology document marks these as deferred. This is a pre-existing repository condition. This feature will not resolve it without a separate approval decision.

## Open Decisions for the Maintainer

1. **SC-009**: approve the recommended 6,000-byte gzip maximum (5,000-byte target) or provide another budget. Until then, SC-009 is infeasible as written.
2. **Test tooling**: approve the deferred frontend test stack separately if automated test execution is required for this feature; otherwise accept lint, build, and manual verification for the styling change.
