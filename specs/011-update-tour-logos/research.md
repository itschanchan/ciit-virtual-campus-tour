# Research Summary

## Clarifications Resolved

No `[NEEDS CLARIFICATION]` markers remain in the specification. Both image files and both target components were explicitly identified by the user, so all technical context values are known from the existing project setup.

## Key Decisions

- **Sidebar logo source**: The existing `SidebarLogo` component in `Sidebar.jsx` already accepts a `logoUrl` prop and renders an `` when a URL is supplied (falling back to a text "CIIT" mark otherwise). The glitch virtual tour PNG is already imported in `Sidebar.jsx` (currently unused). `Layout.jsx` supplies the `logoUrl` prop to `<Sidebar>`, pointing at the existing `ciit_glitch_virtual_tour_logo.png` static asset.
- **Header logo source**: `Header.jsx` currently renders a text-only "CIIT" mark. It is replaced with the `CIIT_Logo_Inverse_cropped.svg` image while retaining the "Virtual Campus Tour" title text and the current location name alongside it.
- **Visibility behaviour**: The sidebar logo follows existing collapse behaviour (hidden when the sidebar is collapsed, shown when expanded). The header logo follows existing header mark visibility behaviour (hidden when the sidebar is open, shown when closed).
- **Alt text**: Both images carry descriptive alt text ("CIIT glitch virtual tour logo" for the sidebar, "CIIT logo" for the header) so the brand remains identifiable when an image fails to load or is announced by assistive technology.
- **Responsiveness**: Both logos render without layout breakage at desktop and narrow mobile viewports (minimum 320 CSS pixels); no horizontal scrolling is introduced.
- **Testing**: Regression cases for logo presence, alt text, and visibility rules are authored for `Sidebar.jsx` and `Header.jsx`. Vitest/Testing Library/jsdom tooling is deferred by the maintainer, so tests cannot execute until restored; lint, production build, and manual checks provide interim evidence.
- **Dependency impact**: No new dependencies; existing component styling and Tailwind tokens are reused.

No additional clarifications were required; all unknowns from the Technical Context are resolved.
