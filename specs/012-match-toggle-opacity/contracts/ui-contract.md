# UI Contract: Sidebar Toggle Button ↔ Sidebar Background Opacity

## Purpose

Defines the visual contract between the sidebar toggle button and the sidebar background: the toggle button MUST use the same background opacity as the sidebar so it reads as one continuous piece attached to the sidebar edge.

## Contract Parties

- **Sidebar** (`apps/frontend/src/components/Sidebar.jsx` `<aside>`): renders the campus floor sidebar with semi-transparent background (`bg-surface/86`, 86% opacity).
- **Sidebar Toggle Button** (`apps/frontend/src/components/Sidebar.jsx` `<button>`): renders the circular open/close toggle at the sidebar's right edge; MUST match the sidebar's background opacity.

## Sidebar Responsibilities

1. Render with semi-transparent background opacity (`bg-surface/86`, i.e. 86%).
2. Render one toggle button at its right edge.
3. Maintain consistent background opacity throughout open/close animations.

## Toggle Button Responsibilities

1. Use the same background opacity as the sidebar (`bg-surface/86`, i.e. 86%) when the sidebar is open.
2. Keep borders only on top/right/bottom (`border border-l-0 border-line`); no left border where it meets the sidebar.
3. Keep height unchanged (`h-45`).
4. Maintain matching opacity with the sidebar throughout the open/close animation duration.

## Visual Contract

| Sidebar State | Sidebar Opacity | Toggle Opacity | Expected Appearance |
|---------------|-----------------|----------------|---------------------|
| Open | 86% (`bg-surface/86`) | 86% (`bg-surface/86`) | Toggle blends with sidebar edge; reads as one attached surface |
| Closed | Hidden (off-screen) | 86% (`bg-surface/86`) | Toggle is standalone button; consistent styling |

## Animation Contract

| Phase | Sidebar Behavior | Toggle Behavior | Opacity Relationship |
|-------|-----------------|-----------------|---------------------|
| Opening | Slides in from left; opacity transitions | Slides into position at right edge | Match throughout transition |
| Open | Static at right edge | Static at right edge | Match |
| Closing | Slides out to left; opacity transitions | Slides out of view at right edge | Match throughout transition |
| Closed | Hidden off-screen | Standalone at left edge | N/A (sidebar not visible) |

## Failure Modes

- If toggle opacity differs from sidebar opacity: toggle reads as detached from sidebar edge; visual contract violated.
- If toggle height is changed: attachment geometry breaks; height MUST remain `h-45`.
- If a left border is added to the toggle: double-border seam appears at the sidebar junction; `border-l-0` MUST be preserved.

## Version

v1.0 — aligned with spec `specs/012-match-toggle-opacity/spec.md` (FR-001 to FR-002).
