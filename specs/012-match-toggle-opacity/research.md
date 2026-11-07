# Research: Match Sidebar Toggle Opacity to Sidebar

## Context

The sidebar toggle button at the right edge of the campus floor sidebar currently uses full opacity (`bg-surface`, i.e. 100% opaque) while the sidebar background uses a semi-transparent opacity (`bg-surface/86`, i.e. 86% opaque). This mismatch makes the toggle look detached from the sidebar — even after border fixes — because the toggle appears more solid than the surface it sits on. When the sidebar animates open and closed, the differing opacities reinforce the impression of two separate elements rather than one attached piece.

## Decision: Match toggle background opacity to sidebar background opacity

**Decision**: Apply the same background opacity to the toggle button as the sidebar uses, so the toggle reads as visually continuous with the sidebar edge.

**Rationale**: The sidebar's background is `bg-surface/86` (86% opacity). Setting the toggle's background to `bg-surface/86` ensures both surfaces have identical opacity, completing the "attached" look. The toggle keeps its `border border-l-0 border-line` borders on top/right/bottom so it still defines its own edge externally, but its fill matches the sidebar.

**Alternatives considered**:
- Keep toggle fully opaque (`bg-surface`) and rely only on border removal. Rejected: the toggle still reads as more solid than the sidebar behind it, breaking the attached look at the junction.
- Make sidebar fully opaque (`bg-surface`) to match the toggle. Rejected: changes the sidebar's established visual style (86% opacity is intentional for the backdrop effect); the toggle should adapt to the sidebar, not vice versa.
- Use a different opacity value between 86% and 100%. Rejected: arbitrary; matching exactly is the only choice that guarantees visual continuity.

## Decision: No new dependencies

**Decision**: No new npm packages are introduced. The change is a single Tailwind class swap on the existing toggle button in `Sidebar.jsx`.

**Rationale**: Constitution prohibits new dependencies without maintainer approval; the existing component already uses Tailwind classes including `bg-surface/86` on the sidebar itself.

## Related specs

- `specs/008-fix-sidebar-buttons` — sidebar floor button clickability (adjacent concern; borders/opacity all relate to toggle attachment)
- `specs/010-switch-5m-5f-buttons` — sidebar floor pairing layout (adjacent concern)
