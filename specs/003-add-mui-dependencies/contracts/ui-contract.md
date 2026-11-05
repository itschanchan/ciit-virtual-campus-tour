# UI Contract: MUI and Tailwind Coexistence

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data Model**: [data-model.md](../data-model.md)

This contract defines the approved surface for using MUI in `apps/frontend`. It applies to all future UI work; this feature does not change any existing component.

## Approved Packages

Only these packages may be imported:

- `@mui/material`
- `@mui/icons-material`
- `@emotion/react` (indirect peer; import only when MUI requires it)
- `@emotion/styled` (indirect peer; import only when MUI requires it)

`@mui/material-pigment-css`, `@mui/lab`, and MUI X packages are not approved. Adding them requires a separate dependency approval and documentation update.

## Styling Ownership

- Tailwind CSS remains the primary styling system for the existing tour.
- Existing components continue to use Tailwind utilities and the design tokens in `apps/frontend/src/index.css`.
- MUI is additive and is used for new interface surfaces only.
- MUI `CssBaseline` must not be mounted globally.
- Tailwind Preflight must not be enabled.
- Do not mix Tailwind and MUI styling within the same element when a single system can express the state. Prefer a clear boundary: MUI component with MUI props and `sx`, or a plain element with Tailwind utilities.

## Theme and Tokens

- When a new MUI surface is introduced, map the existing design intent to an MUI theme instead of scattering raw colors and spacing across components.
- Keep the color, radius, shadow, blur, and type decisions aligned with the Tailwind token names in `apps/frontend/src/index.css`.
- Do not duplicate the entire Tailwind token set into an MUI theme. Add only the tokens the MUI surface actually consumes.
- The theme must respect the existing dark, high-contrast tour aesthetic.

## Accessibility

- Interactive MUI controls must remain keyboard operable with a visible focus state.
- Icon-only controls must have an accessible name.
- MUI dialogs and menus must preserve focus trapping and return focus to the trigger.
- Respect `prefers-reduced-motion`; do not override the existing reduced-motion base rule.
- Text must meet contrast requirements on `bg-canvas`, `bg-surface`, and accent surfaces.
- Do not rely on color alone to communicate state.

## Responsiveness

- New MUI surfaces must work from 320 CSS pixels upward.
- Validate against the project breakpoints documented in `docs/styling.md`.
- MUI's default breakpoints may not match the project's `compact`, `narrow`, and `tiny` variants. Use explicit responsive props or wrappers so behavior matches the existing layout.

## Import and Bundle Discipline

- Import components from their package root, for example `import Button from '@mui/material/Button'`.
- Prefer named component imports supported by the package to keep tree-shaking effective.
- Do not import the entire MUI namespace.
- Avoid adding global side-effect imports from MUI.
- A new MUI surface must not block the initial panorama render. If a surface is heavy, load it on demand.

## Documentation Contract

After this feature:

- `docs/tech_stack.md` lists all four packages with layer, approval, and purpose.
- `docs/tech_stack.md` states that MUI is additive to Tailwind.
- `docs/project_setup.md` explains installation, coexistence, supported React version, and where new MUI surfaces belong.
- The documented package set matches `apps/frontend/package.json` exactly.

## Out of Scope

- Migrating existing components from Tailwind to MUI.
- Replacing Tailwind with MUI.
- Adding a global MUI provider or wrapping `App` in a theme provider before a feature needs it.
- Adding new tests or test tooling; those remain deferred.
