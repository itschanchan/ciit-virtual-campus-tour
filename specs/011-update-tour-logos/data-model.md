# Data Model

## SidebarLogo

- **imagePath**: path to the sidebar logo image (`public/img/ciit_glitch_virtual_tour_logo.png`).
- **altText**: descriptive alt text announcing the brand (e.g., "CIIT glitch virtual tour logo").
- **subtitle**: accompanying text below the logo ("360° Virtual Campus Tour").
- **visible**: `true` when the sidebar is expanded; `false` when the sidebar is collapsed (follows existing sidebar collapse behaviour).
- **viewportBehaviour**: renders correctly at desktop and narrow mobile viewports without layout breakage; minimum supported width 320 CSS pixels.

## HeaderLogo

- **imagePath**: path to the header logo image (`public/img/CIIT_Logo_Inverse_cropped.svg`).
- **altText**: descriptive alt text announcing the brand (e.g., "CIIT logo").
- **title**: accompanying "Virtual Campus Tour" title text retained alongside the logo.
- **currentLocationName**: current location name retained alongside the logo (falls back to "Loading campus locations").
- **visible**: `true` when the sidebar is closed; `false` when the sidebar is open (follows existing header mark visibility behaviour).
- **viewportBehaviour**: renders correctly at desktop and narrow mobile viewports without layout breakage; minimum supported width 320 CSS pixels.

### Validation Rules (derived from Requirements)

- **VR-001**: The sidebar displays exactly one logo image at the top; no text-only logo mark is shown when the image loads.
- **VR-002**: The sidebar logo is accompanied by the "360° Virtual Campus Tour" subtitle text below it.
- **VR-003**: The header displays exactly one logo image; no text-only "CIIT" mark is shown when the image loads.
- **VR-004**: The header retains the "Virtual Campus Tour" title text and the current location name alongside the logo.
- **VR-005**: The sidebar logo is hidden when the sidebar is collapsed and shown when expanded.
- **VR-006**: The header logo is hidden when the sidebar is open and shown when closed.
- **VR-007**: Both logos render without layout breakage at desktop and narrow mobile viewports (minimum 320 CSS pixels).
- **VR-008**: Both logo images include descriptive alt text announced by assistive technology when the image is present or fails to load.
- **VR-009**: No new dependencies, tour content, or data persistence are introduced.
