# Research: Make Web Responsive

**Feature**: `014-make-web-responsive` | **Date**: 2026-11-09

## Decisions

### Decision 1: Use `compact` variant (not `narrow`) for sidebar floor name on mobile

**Decision**: The current floor/location name displayed at the top of the mobile sidebar uses the `compact` custom variant (`@media (max-width: 63.9375rem)` / ~1023px) rather than `narrow` (`@media (max-width: 43.75rem)` / ~700px).

**Rationale**: The `narrow` breakpoint at 700px does not cover landscape mode on many phones (e.g., iPhone Plus/Max landscape is ~736–812px wide). Using `compact` ensures the floor name occupies the transparent space above the sidebar in both portrait and landscape orientations on all mobile devices.

**Alternatives considered**:
- `narrow` variant: Rejected because landscape mode on wider phones exceeds 43.75rem, hiding the floor name and leaving transparent space unoccupied.
- Custom breakpoint: Rejected per AGENTS.md rule to follow existing Tailwind custom variants and avoid introducing arbitrary breakpoints.

### Decision 2: Mobile-first responsive using existing Tailwind custom variants only

**Decision**: All responsive changes use the project's existing custom variants (`compact`, `narrow`, `tiny`) defined in `apps/frontend/src/index.css`, along with standard Tailwind utilities.

**Rationale**: AGENTS.md prohibits custom arbitrary values and new breakpoints. The existing variants already map to the project's device categories (mobile, tablet, desktop).

**Alternatives considered**:
- New custom breakpoints: Rejected per AGENTS.md ("Do not introduce unnecessary custom breakpoints").
- CSS media queries in global stylesheet: Rejected per AGENTS.md ("Do not place component-specific responsive rules in the global stylesheet").
- New responsive design libraries: Rejected per AGENTS.md ("Do not install additional responsive design libraries").

### Decision 3: Replace arbitrary spacing/size values with standard Tailwind utilities

**Decision**: Arbitrary values like `px-[0.9rem]`, `py-[0.8rem]`, `text-[0.95rem]`, `gap-[0.6rem]`, `ml-[-145px]`, and `max-w-[38vw]` are replaced with standard Tailwind utilities (`px-3`, `py-2`, `text-sm`, `gap-1.5`, etc.).

**Rationale**: AGENTS.md requires standard utility classes over custom arbitrary values unless strictly required by design specs. Standard utilities ensure Tailwind scans and generates CSS correctly at build time.

**Alternatives considered**:
- Keep arbitrary values: Rejected per AGENTS.md Tailwind simplification rules.
- Runtime-computed values: Rejected because Tailwind cannot scan dynamically constructed class names.

### Decision 4: Two-tier sidebar top positioning and stacking

**Decision**: The sidebar is flush with the top of the screen (`top-0`) at every viewport width, with two responsive tiers:

- **Narrow phone viewports** (`narrow`, max-width 43.75rem / 700px): full width, fully opaque surface, stacked above the header (`z-50` against the header's `z-40`) — a full-screen overlay occupying the entire transparent header strip.
- **Tablet and landscape-mobile viewports** (`compact`, max-width 63.9375rem / 1023px, above `narrow`): desktop panel width (`min(20rem, 86vw)` = 20rem), 86% surface, stacked below the transparent header (`z-30`, matching desktop) — the panel covers only the header logo area while the location name stays visible to its right.
- **Desktop** (above 63.9375rem): unchanged (`top-0`, `w-80`, `z-30`, 86% surface).

**Rationale**: Landscape phones (approximately 736–915px wide) overlap tablet portrait widths and cannot be distinguished by width alone, so one width-based rule must serve 700–1023px. The clarified requirement (Session 2026-11-09) keeps the desktop panel identity at those widths while removing the 64px top offset that left the transparent header visible above the sidebar. Earlier code kept the tablet offset (`compact:top-16`) active on phone widths because `narrow` is a subset of `compact` — the cause of the reported defect.

**Alternatives considered**:
- Full-width opaque overlay at all compact widths: Rejected by the user — tablets and landscape-mobile viewports keep the desktop-width panel (FR-001b).
- Keep the panel below the header at tablet widths (`compact:top-16`): Rejected because it leaves a transparent strip above the sidebar, the reported visual defect.
- Orientation detection in JavaScript: Rejected per AGENTS.md (responsive behavior must be CSS-driven).

### Decision 5: Custom-variant cascade order makes `narrow` override `compact`

**Decision**: Conflicting utilities across the `compact` and `narrow` variants are resolved by stylesheet order: `compact` is declared before `narrow` in `apps/frontend/src/index.css`, so the built stylesheet emits the `compact` media block first and the `narrow` block later. When both media queries match (phone widths), the later `narrow:*` declaration wins at equal specificity.

**Rationale**: Verified against the production build: `@media (width<=63.9375rem)` precedes `@media (width<=43.75rem)`, so `narrow:w-full`, `narrow:z-50`, and `narrow:bg-surface` override their base and compact counterparts without `!important`. This keeps the two-tier behavior declarative and testable.

**Alternatives considered**:
- `!important` overrides: Rejected — unnecessary and harmful to maintainability (AGENTS.md).
- JavaScript viewport checks: Rejected per AGENTS.md.
- Reordering the variant definitions: Rejected — the current broad-to-narrow order (`compact`, `narrow`, `tiny`) is the intended cascade.

### Decision 6: Tablet backdrop is transparent but stays a tap target

**Decision**: At tablet and landscape-mobile widths (701–1023px) the Layout backdrop (`apps/frontend/src/components/Layout.jsx`) carries no dim tint. It remains a full-size, clickable button so tapping outside the sidebar still closes it. Implementation: replace the backdrop's `bg-canvas/70` with `bg-transparent`; the button is only rendered at `compact` widths (`hidden compact:block`), so the transparent background applies exactly to the mobile/tablet range and desktop never shows it.

**Rationale**: The user reported a dark semi-transparent overlay across 700–1000px whenever the sidebar opens, and chose to remove the tint while preserving tap-to-close (spec Clarifications, Session 2026-11-09; FR-001c). A transparent button keeps the `aria-label="Close location menu"` affordance and acceptance scenario 3 without visual dimming. Reusing `compact` (≤1023px) rather than a new 1000px breakpoint keeps the existing breakpoint set per AGENTS.md; at narrow widths (≤700px) the opaque full-width sidebar already covers the backdrop, so the removal has no visible effect there.

**Alternatives considered**:
- Remove the backdrop button entirely at tablet widths: Rejected — loses tap-outside-to-close (acceptance scenario 3).
- Add a dedicated 700–1000px custom variant: Rejected — introduces a new breakpoint for a 23px band with no real device class.
- Keep a lighter tint (e.g., 20%): Rejected — the requirement is no visible dimming.

## No NEEDS CLARIFICATION Items

All clarifications from the specification phase are resolved:
- Sidebar floor name content: current floor/location name at top left (spec Clarifications, Session 2026-11-08).
- Sidebar floor name visibility: both portrait and landscape mobile (uses `compact` variant).
- Sidebar top positioning: no top offset — flush with the top of the screen (spec Clarifications, Session 2026-11-09).
- Sidebar tablet/landscape-mobile layout: desktop panel width, flush at top, covering only the header logo area with the location name visible to the right (spec Clarifications, Session 2026-11-09; FR-001b).
- Tablet backdrop: no dim tint; stays a fully transparent, full-size tap-to-close target across the full 701–1023px range using the existing breakpoints (spec Clarifications, Session 2026-11-09; FR-001c, SC-006).
