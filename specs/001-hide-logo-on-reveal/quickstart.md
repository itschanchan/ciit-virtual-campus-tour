# QuickStart Validation Guide

This guide shows how to manually verify that **Header logo hides when Sidebar is open** works as specified.

## Prerequisites
- Node.js 22.12+ (ES modules)
- npm install (React 19, Vite, Tailwind, MUI)
- Run `npm run dev` to start the dev server.

## Steps

1. **Open the application**
   - Navigate to the campus tour homepage in a browser.
   - Verify the Header is visible at the top with the CIIT logo and "Virtual Campus Tour" title.

2. **Verify logo is visible when Sidebar is closed**
   - Confirm the CIIT logo appears in the Header bar.
   - Confirm the Sidebar toggle button shows the hamburger menu icon (☰).

3. **Open the Sidebar**
   - Click the Sidebar toggle button (hamburger icon) in the Header.
   - Verify the Sidebar panel slides out from the left.
   - Verify the toggle button changes to the close icon (×).
   - **Verify the CIIT logo in the Header is hidden** (not visible, no space reserved).

4. **Verify logo reappears when Sidebar is closed**
   - Click the Sidebar toggle button again (close icon).
   - Verify the Sidebar panel slides back and is hidden.
   - Verify the toggle button changes back to the hamburger icon (☰).
   - **Verify the CIIT logo in the Header is visible again**.

5. **Test at multiple viewport widths**
   - Repeat steps 3–4 at desktop width (e.g., 1280 px).
   - Repeat steps 3–4 at narrow mobile width (320 px).
   - Confirm logo hide/show behavior is consistent across viewports.
   - Confirm no layout shift beyond natural text reflow occurs.

6. **Keyboard navigation**
   - Use `Tab` to reach the Sidebar toggle button.
   - Press `Enter` or `Space` to open the Sidebar.
   - Verify the logo is hidden.
   - Press `Enter` or `Space` again to close the Sidebar.
   - Verify the logo is visible again.

7. **Accessibility check**
   - When logo is visible, confirm screen reader announces "CIIT" from the logo element.
   - When logo is hidden, confirm screen reader does not announce the logo.
   - Confirm ARIA label "CIIT" remains on the logo element in both states.

## Expected Outcomes
- **Visibility**: Logo hidden when Sidebar open, visible when Sidebar closed (100% of toggle actions).
- **Automatic**: No manual refresh or additional action needed; visibility changes immediately with Sidebar state.
- **Accessibility**: ARIA label preserved; keyboard operable.
- **Responsive**: Consistent behavior at desktop and 320-pixel mobile widths.
- **Layout**: No unexpected layout shift when logo is hidden.

If all checks pass, the feature meets the Success Criteria (SC-001 through SC-004).