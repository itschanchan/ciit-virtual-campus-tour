# UI Contract for Sidebar and Header Tour Logos

## Overview

The sidebar and header must expose a **logo** UI contract that guarantees:
- The CIIT glitch virtual tour logo image appears at the top of the campus floor sidebar, replacing the text-only mark.
- The CIIT Logo Inverse cropped SVG image appears in the tour header, replacing the text-only mark.
- Both logos keep their accompanying text (sidebar subtitle; header title and current location).
- Both logos follow existing visibility behaviour (sidebar hidden when collapsed; header hidden when the sidebar is open).
- Both logos render correctly on desktop and narrow mobile viewports.
- Both images include descriptive alt text for assistive technology.

## Contract Sections

### 1. Sidebar Logo

- **Source**: `public/img/ciit_glitch_virtual_tour_logo.png` (static asset).
- **Placement**: Top of the campus floor sidebar, above the "Explore" section and "Campus Floors" heading.
- **Accompanying text**: The "360° Virtual Campus Tour" subtitle remains below the logo.
- **Visibility**: Shown when the sidebar is expanded; hidden when the sidebar is collapsed (existing collapse behaviour preserved).
- **Alt text**: Descriptive alt text identifying the brand (e.g., "CIIT glitch virtual tour logo").
- **Replaces**: The text-only "CIIT" mark fallback when no image loads is replaced by the logo image with descriptive alt text.

### 2. Header Logo

- **Source**: `public/img/CIIT_Logo_Inverse_cropped.svg` (static asset).
- **Placement**: Top header of the virtual campus tour viewer, alongside the title and current location name.
- **Accompanying text**: The "Virtual Campus Tour" title text and the current location name remain alongside the logo.
- **Visibility**: Shown when the sidebar is closed; hidden when the sidebar is open (existing header mark visibility behaviour preserved).
- **Alt text**: Descriptive alt text identifying the brand (e.g., "CIIT logo").
- **Replaces**: The text-only "CIIT" mark is replaced by the logo image.

### 3. Responsiveness

- **320 px minimum**: Both logos render without layout breakage at the minimum supported viewport width; no horizontal scrolling is introduced.
- **Narrow viewports**: Logos remain visible and correctly sized; sidebar and header layout are unchanged apart from the logo substitution.
- **Desktop viewports**: Logos render at their natural size within the existing component styling.

### 4. Accessibility

- **Alt text**: Both logo images include descriptive alt text announced by assistive technology when the image is present or fails to load.
- **Keyboard**: Logo substitution does not affect keyboard operability of surrounding controls (sidebar toggle, floor buttons, header controls).
- **Screen reader**: The brand is announced via alt text; the subtitle, title, and current location name remain available as text.

### 5. Testability

- **Regression tests**: Verify sidebar logo presence (image, not text mark) when sidebar expanded; sidebar logo absence when collapsed; header logo presence (image, not text mark) when sidebar closed; header logo absence when sidebar open; alt text presence on both images; correct subtitle/title/location retention; rendering at desktop and narrow viewports.
- **Manual checks**: Open sidebar and confirm the glitch virtual tour logo image appears at the top; close sidebar and confirm the CIIT SVG logo appears in the header; resize to 320 px width; confirm no layout breakage; verify alt text is announced.

## Acceptance Criteria (derived from Requirements)

- **FR-001**: The sidebar displays the CIIT glitch virtual tour logo image at the top, in place of any text-only mark.
- **FR-002**: The sidebar logo is accompanied by the "360° Virtual Campus Tour" subtitle below it.
- **FR-003**: The header displays the CIIT Logo Inverse cropped SVG image as the header logo, in place of the text-only mark.
- **FR-004**: The header retains the "Virtual Campus Tour" title text and the current location name alongside the logo.
- **FR-005**: The sidebar logo is hidden when collapsed and shown when expanded.
- **FR-006**: The header logo is hidden when the sidebar is open and shown when closed.
- **FR-007**: Both logos render correctly on desktop and narrow mobile viewports without layout breakage.
- **FR-008**: Both logo images include descriptive alt text announced by assistive technology.

*All items must be satisfied for the contract to be considered fulfilled.*
