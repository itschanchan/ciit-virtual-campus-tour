# Data Model: Match Sidebar Toggle Opacity to Sidebar

## Overview

This feature is a frontend visual fix with no database or persistent storage. The data model describes the visual state entities involved in the sidebar toggle and sidebar background opacity matching.

## Entities

### Sidebar Background

Represents the background surface of the campus floor sidebar.

| Field | Type | Description |
|-------|------|-------------|
| backgroundOpacity | number | Opacity of the sidebar background, expressed as a percentage (e.g. 86 for 86%) |
| backgroundColor | string | Base color token applied to the sidebar background |

### Sidebar Toggle Button

Represents the circular toggle button at the right edge of the campus floor sidebar used to open and close the sidebar.

| Field | Type | Description |
|-------|------|-------------|
| backgroundOpacity | number | Opacity of the toggle button background; MUST match sidebar.backgroundOpacity when sidebar is open |
| isOpen | boolean | Whether the sidebar is expanded (true) or collapsed (false) |
| borderStyle | string | Border styling applied to the toggle's outer edges (top/right/bottom) |
| height | string | Toggle button height (unchanged from existing `h-45`) |

## Relationships

- A **Sidebar Toggle Button** is visually attached to the right edge of the **Sidebar Background** when the sidebar is open.
- `SidebarToggleButton.backgroundOpacity` MUST equal `SidebarBackground.backgroundOpacity` whenever `isOpen` is true, so the toggle and sidebar read as one continuous surface.
- The relationship holds throughout the open/close animation; both surfaces transition together.

## Validation Rules

- When the sidebar is open, toggle button background opacity MUST equal sidebar background opacity (currently 86%).
- When the sidebar is closed, the toggle operates as a standalone button with its own background opacity matching the sidebar (for visual consistency).
- Toggle button height MUST remain unchanged (`h-45`).
- Toggle button borders MUST remain on top/right/bottom only (`border border-l-0 border-line`), with no left border where it meets the sidebar.

## State Transitions

| From | Trigger | To | Condition |
|------|---------|-----|-----------|
| sidebar-closed | Visitor clicks toggle to expand | sidebar-open | Toggle click detected; sidebar expands; toggle background opacity matches sidebar |
| sidebar-open | Visitor clicks toggle to collapse | sidebar-closed | Toggle click detected; sidebar collapses off-screen |
| sidebar-open | Animation in progress | sidebar-open | Open/close transition running; both surfaces maintain matching opacity throughout |

## Notes

- No persistence layer; all visual state lives in the React component during a session.
- The sidebar background opacity (`bg-surface/86`, i.e. 86%) is applied via Tailwind class on the `<aside>` element.
- The toggle button background opacity is applied via Tailwind class on the `<button>` element; both must be kept in sync if either changes in the future.
