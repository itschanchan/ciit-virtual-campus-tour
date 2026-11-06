# Data Model

## SidebarVisibilityState
- **sidebarOpen**: `boolean` — true when Sidebar is revealed/open, false when collapsed/closed.
- Source of truth: managed in the parent component that renders both Header and Sidebar.

## HeaderLogoVisibility
- **visible**: `boolean` — derived as `!sidebarOpen`. Logo is visible only when Sidebar is closed.
- **ariaLabel**: `string` — always "CIIT", unchanged regardless of visibility state.
- **element**: Logo container in Header.jsx (image or text fallback).

## Relationships
- HeaderLogoVisibility.visible = NOT SidebarVisibilityState.sidebarOpen
- Sidebar open event → sidebarOpen = true → HeaderLogoVisibility.visible = false
- Sidebar close event → sidebarOpen = false → HeaderLogoVisibility.visible = true

## Validation Rules (derived from Requirements)
- When sidebarOpen is true: logo element must have `hidden` class or equivalent CSS `display: none`.
- When sidebarOpen is false: logo element must not have `hidden` class; logo must be visible.
- ARIA label "CIIT" must remain present on the logo element in both visible and hidden states.
- No layout shift: hiding the logo must not cause unexpected reflow of other Header elements beyond natural text wrapping.