# Phase 0 Research: Add MUI React Dependencies

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All unknowns from the Technical Context are resolved below.

## Decision 1: Package Set

**Decision**: Add these four packages to `apps/frontend/package.json` as runtime dependencies:

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `@mui/material` | `^9.5.0` | Core component library |
| `@mui/icons-material` | `^9.5.0` | Material icon components |
| `@emotion/react` | `^11.14.0` | Required style engine peer |
| `@emotion/styled` | `^11.14.1` | Required styled-component peer |

**Rationale**: MUI's core package requires the two Emotion packages, and the icon package is part of the common MUI surface for buttons, navigation, and toolbars. This matches the request for "MUI react dependencies" without adding optional packages that the project does not need yet.

**Alternatives considered**:

- `@mui/material` only, with no icons: rejected because a component library adoption without its official icon set leaves common UI work incomplete and invites ad hoc icon dependencies.
- `@mui/material-pigment-css`: rejected because it is an optional peer for a different styling engine. The project will use the default Emotion path.
- `@mui/lab` or `@mui/x-*`: rejected as out of scope; they require separate approval and are not needed for the initial adoption.

## Decision 2: Version Selection

**Decision**: Use MUI `^9.5.0` and Emotion `^11.14.x`.

**Rationale**: The registry's current stable release is `@mui/material` 9.5.0. Its peer range is React `^17.0.0 || ^18.0.0 || ^19.0.0`, which covers the installed React 19.2.8 and React DOM 19.2.8. `@mui/icons-material` 9.5.0 peers on `@mui/material` `^9.5.0`. Emotion 11.14.x peers on React `>=16.8.0`, so it also resolves cleanly.

**Alternatives considered**:

- MUI 7.3.11 (`latest-v7`): rejected because the current stable line is 9.x and the project is starting fresh with no legacy MUI code to stay compatible with.
- MUI 5.18.0 (`latest-v5`): rejected as an older major line with a shorter support horizon.
- Pinning exact versions with no caret: rejected because the project manifest uses caret ranges for existing dependencies and npm uses the lockfile for reproducibility.

## Decision 3: Tailwind CSS Coexistence

**Decision**: Keep Tailwind CSS 4 as the primary styling system. MUI is additive and will be used for new surfaces only. Do not enable Tailwind Preflight and do not add MUI `CssBaseline` globally.

**Rationale**: The project deliberately imports only the Tailwind theme and utilities layers and maintains a curated base layer in `apps/frontend/src/index.css` so the Marzipano canvas and existing layout keep their baseline. Enabling Preflight or a global MUI reset would re-style existing elements and violate the styling guide. MUI with Emotion injects component-scoped styles at runtime, so it can coexist with utility classes.

**Alternatives considered**:

- Replace Tailwind with MUI's styling engine: rejected because it is a much larger migration and outside the requested scope.
- Enable both resets: rejected because it creates specificity and base-style conflicts with the existing tour layout.
- Use MUI's Pigment CSS path: rejected because it requires additional tooling and is unnecessary for this adoption.

## Decision 4: Installation and Lockfile

**Decision**: Install with npm inside `apps/frontend` and commit the regenerated `package-lock.json`. Run the install through the existing frontend setup flow.

**Rationale**: The repository standardizes on npm and already tracks the frontend lockfile. Regenerating the lockfile makes repeat installs deterministic and exposes peer conflicts during implementation.

**Alternatives considered**:

- Hand-editing `package.json` without installing: rejected because it leaves the lockfile stale and does not prove peer compatibility.
- Committing only `package.json`: rejected because it breaks reproducible installs and contradicts the existing lockfile policy.

## Decision 5: Documentation Governance

**Decision**: Update both requested documents in the same change:

- `docs/tech_stack.md`: add the four packages to the frontend runtime dependency table with approval and purpose, add MUI to the frontend stack summary, and note the coexistence rule.
- `docs/project_setup.md`: document installation, the Tailwind coexistence rule, version compatibility, and where future MUI surfaces belong.

**Rationale**: The constitution requires new runtime dependencies to be justified and recorded in `docs/tech_stack.md`, and the spec separately requires setup guidance. Documenting both keeps the dependency manifest, architecture summary, and contributor onboarding consistent.

**Alternatives considered**:

- Only update `docs/tech_stack.md`: rejected because the spec and request explicitly require the setup document.
- Amend the constitution in this feature: deferred. A component library is not an alternative frontend framework, so the amendment rule is not triggered. The constitution's static approved-list paragraph should still be reconciled in a later governance update.
- Add a separate dependency document: rejected because the project already centralizes dependency approvals in `docs/tech_stack.md`.

## Decision 6: Verification Without New Test Tooling

**Decision**: Verify with the dependency install, production build, ESLint, existing content verification, a dependency-tree check, a security audit, and a manual tour smoke test.

**Rationale**: No application behavior changes, and the maintainer has deferred the frontend test tooling packages. These checks prove the packages resolve, compile, and do not break the existing tour.

**Alternatives considered**:

- Add component tests now: rejected because test tooling is deferred and the feature has no runtime UI to assert.
- Add a temporary MUI demo component: rejected because it would add unrequested UI and test code.

## Open Unknowns

None. All Technical Context unknowns are resolved.
