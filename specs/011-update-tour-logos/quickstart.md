# QuickStart Validation Guide

This guide shows how to manually verify that the **sidebar and header tour logos** work as specified.

## Prerequisites

- Node.js (ES modules)
- `npm install` (React 19, Vite, Tailwind, MUI)
- Run `npm run dev` to start the dev server.

## Steps

### 1. Sidebar logo (glitch virtual tour)

1. **Open the Sidebar**
   - Expand the sidebar (click the toggle button).
   - Verify the floor list is visible.

2. **Check Sidebar Logo Presence**
   - Inspect the top of the sidebar, above the "Explore" section.
   - Confirm the **CIIT glitch virtual tour logo image** (`ciit_glitch_virtual_tour_logo.png`) is displayed, **not** a text-only "CIIT" mark.

3. **Check Subtitle Retention**
   - Confirm the "360° Virtual Campus Tour" subtitle text appears below the logo image.

4. **Check Visibility on Collapse**
   - Collapse the sidebar.
   - Confirm the sidebar logo image is hidden with the rest of the sidebar content.
   - Reopen the sidebar and confirm the logo image reappears.

5. **Check Alt Text**
   - Confirm the logo image carries descriptive alt text identifying the brand.

### 2. Header logo (CIIT Logo Inverse cropped)

1. **Close the Sidebar**
   - Ensure the sidebar is closed so the header mark/logo is visible.

2. **Check Header Logo Presence**
   - Inspect the top header of the viewer.
   - Confirm the **CIIT Logo Inverse cropped SVG image** (`CIIT_Logo_Inverse_cropped.svg`) is displayed as the header logo, **not** a text-only "CIIT" mark.

3. **Check Title and Location Retention**
   - Confirm the "Virtual Campus Tour" title text remains alongside the logo.
   - Confirm the current location name (or "Loading campus locations") remains alongside the logo.

4. **Check Visibility on Sidebar Open**
   - Open the sidebar.
   - Confirm the header logo image is hidden (consistent with existing header mark visibility behaviour).
   - Close the sidebar and confirm the logo image reappears.

5. **Check Alt Text**
   - Confirm the header logo image carries descriptive alt text identifying the brand.

### 3. Responsiveness

1. **Desktop viewport**
   - Confirm both logos render correctly without layout breakage.
   - Confirm the sidebar and header layout are unchanged apart from the logo substitution.

2. **Narrow mobile viewport (320 px minimum width)**
   - Resize the browser to 320 CSS pixels width.
   - Confirm both logos remain visible and correctly sized without horizontal scrolling or layout breakage.
   - Confirm the sidebar logo (when expanded) and header logo (when sidebar closed) both render correctly.

## Expected Outcomes

- **Sidebar logo**: 100% of expanded sidebar views display the CIIT glitch virtual tour logo image at the top, with the subtitle below; hidden when collapsed.
- **Header logo**: 100% of header views with the sidebar closed display the CIIT Logo Inverse cropped SVG image; title and current location retained; hidden when the sidebar is open.
- **Responsiveness**: Both logos render without layout breakage on desktop and narrow mobile viewports (320 px minimum); no horizontal scrolling.
- **Accessibility**: Both logo images include descriptive alt text announced by assistive technology.

If all checks pass, the feature meets the Success Criteria (SC‑001 – SC‑004).
