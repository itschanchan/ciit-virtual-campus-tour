# UI Contract: Header Logo Visibility with Sidebar State

## Overview
The Header component must conditionally hide the CIIT logo when the Sidebar is in the revealed (open) state, and show it when the Sidebar is closed. This contract defines the interaction between Header and Sidebar for logo visibility.

## Contract Sections

### 1. State Interface
- **Sidebar `open`**: Boolean state indicating whether the Sidebar panel is revealed.
- **Header `sidebarOpen`**: Prop received by Header, mirroring Sidebar's `open` state.
- **Header logo visibility**: Derived as `!sidebarOpen`.

### 2. Header Component Contract
- **Prop**: `sidebarOpen` (boolean) — controls logo visibility.
- **Logo element**: Contains `aria-label="CIIT"` and must remain accessible regardless of visibility.
- **Visibility logic**:
  - `sidebarOpen === true` → logo element has `hidden` class (not rendered visually).
  - `sidebarOpen === false` → logo element is visible without `hidden` class.
- **ARIA compliance**: `aria-label` and all accessibility attributes remain on the logo element in both states.
- **Layout**: Hiding the logo removes its space; title and location name reflow naturally. No forced layout shift.

### 3. Sidebar Component Contract
- **State**: `open` (boolean) — managed internally or by parent.
- **Event**: `onToggleSidebar` — toggles `open` state; Header receives updated `sidebarOpen` prop.
- **No changes needed**: Sidebar already exposes `open` and `onToggleSidebar`.

### 4. Accessibility
- Screen readers must still announce the logo when visible; when hidden, the logo is not announced (consistent with visual hiding).
- Keyboard navigation through the Sidebar toggle button remains unaffected.
- Focus management on Sidebar toggle remains unchanged.

### 5. Responsiveness
- Logo hide/show behavior applies at all viewport sizes (desktop, compact, mobile).
- No layout shift beyond natural text reflow when logo is hidden.

### 6. Testability
- **Test 1**: Sidebar closed → logo visible → Sidebar opened → logo hidden.
- **Test 2**: Sidebar open → logo hidden → Sidebar closed → logo visible.
- **Test 3**: ARIA label "CIIT" present on logo element in both states.
- **Test 4**: Layout remains stable (no unexpected reflow) when logo is hidden.

## Acceptance Criteria (derived from Requirements)
- **FR-001**: Header logo hidden when Sidebar is open — verified by Test 1.
- **FR-002**: Header logo visible when Sidebar is closed — verified by Test 2.
- **FR-003**: Visibility triggered automatically by Sidebar open/close — verified by Tests 1 and 2.
- **FR-004**: ARIA label unchanged regardless of visibility — verified by Test 3.

*All items must be satisfied for the contract to be considered fulfilled.*