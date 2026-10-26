# Feature Specification: CIIT Virtual Campus Tour Foundation

**Feature Branch**: `001-campus-tour-foundation`

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: "This is the CIIT Virtual Campus tour setup, a web-based application that let's users explore the campus in 360 panoramic view. The GitHub repository is a multi-branch type repository that let's the team create new branches and then checking it before merging to the main branch to prevent from accidents and conflicts. For missing dependencies, ask the developer first if needed to install the missing dependency, if the missing dependency is important remind that it needs to download that dependency. For the Marzipano-to-React integration, Marzipano API uses a hardcoded JavaScript language, but its better to convert the vanilla JS into ReactJS for more modern look and UI compatibilities. In case there is a folder uploaded in the codebase like `app-files` or its subfolders: `img`, `titles`, `vendor`, `data.js`, `index.html`, `index.js`, `style.css`, migrate it to the correct folder specifically inside the `apps/frontend` folder."

## Clarifications

### Session 2026-10-26

- Q: Should `.opencode/` and `.specify/` be tracked in full, or should machine-local state and dependency caches remain ignored while shareable tool configuration is committed? → A: Track shareable tool configuration; ignore only secrets, dependency caches, and machine-local state.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explore Campus in 360 Degrees (Priority: P1)

A campus visitor opens the virtual tour and looks around a featured room by dragging with a mouse or swiping on a phone, so they can experience the Glitch Tower campus remotely.

**Why this priority**: The 360-degree panorama is the product's core value. Without it, there is no virtual campus tour.

**Independent Test**: Open the application on desktop and mobile, load the first featured location, and rotate the view in every direction. The tour delivers value even if no other feature is implemented.

**Acceptance Scenarios**:

1. **Given** the tour is open on a desktop device, **When** the visitor drags across the panorama, **Then** the view rotates smoothly and continuously in the drag direction.
2. **Given** the tour is open on a mobile device, **When** the visitor swipes across the panorama, **Then** the view rotates without the page scrolling or zooming unexpectedly.
3. **Given** a panorama is still loading, **When** the visitor attempts to interact, **Then** the application shows a clear loading state and becomes interactive when ready.
4. **Given** a panorama cannot be loaded, **When** the visitor opens that location, **Then** the application shows a clear fallback message and does not leave the visitor on a blank screen.

---

### User Story 2 - Navigate Quickly Between Locations (Priority: P2)

A visitor uses a sidebar to see every featured location and jump directly to any room without returning to a starting screen.

**Why this priority**: Visitors need to find specific rooms quickly; without navigation the tour is difficult to explore beyond the first scene.

**Independent Test**: Open the sidebar, confirm every featured location is listed, select three different locations, and verify the correct panorama appears each time.

**Acceptance Scenarios**:

1. **Given** the tour is open, **When** the visitor opens the sidebar, **Then** every featured location is listed with a recognizable name.
2. **Given** the sidebar is open, **When** the visitor selects a location, **Then** the matching panorama loads and the selected location is clearly indicated.
3. **Given** the visitor selects a location that is unavailable, **When** the selection is made, **Then** the application explains that the location is unavailable and keeps the current view usable.

---

### User Story 3 - View Room Details and Narration (Priority: P3)

A visitor views a gallery of images for the current room and plays a narrated description, with a readable transcript available.

**Why this priority**: Galleries and narration add context that a panorama alone cannot provide and make the tour useful for visitors who cannot rely on visuals or audio alone.

**Independent Test**: For any featured room, open its gallery, browse every image, play and pause the narration, and read the transcript.

**Acceptance Scenarios**:

1. **Given** a room is open, **When** the visitor opens its gallery, **Then** all supplied images for that room are shown with descriptions.
2. **Given** a room has narration, **When** the visitor starts playback, **Then** the narration plays and can be paused or resumed.
3. **Given** narration is playing, **When** the visitor opens the transcript, **Then** the full text of the narration is available.
4. **Given** audio playback is blocked by the device, **When** the visitor attempts to play narration, **Then** the application explains the issue and offers the transcript instead.

---

### User Story 4 - Contribute Safely to the Project Foundation (Priority: P4)

A team member clones the repository, follows the setup instructions, runs the application, and submits changes through a reviewed branch instead of committing directly to the main branch.

**Why this priority**: A reliable foundation and safe collaboration process prevent lost work and broken builds as the tour grows.

**Independent Test**: On a clean machine, follow the documented setup, start the application, create a branch, make a small change, and open a pull request for review.

**Acceptance Scenarios**:

1. **Given** a clean development machine, **When** the team member follows the setup guide, **Then** the complete application starts with the documented command.
2. **Given** a dependency is not already declared, **When** the team member needs it, **Then** they request approval before installing it, and essential dependencies are identified as required downloads.
3. **Given** a team member has a change to submit, **When** they follow the contribution guide, **Then** the change is made on a separate branch and reviewed through a pull request before merging.
4. **Given** an existing panorama prototype folder has been uploaded, **When** the foundation work is complete, **Then** all of its images, titles, vendor files, location data, markup, scripts, and styles are incorporated into the application's frontend and the old location is no longer referenced.
5. **Given** a team member clones the repository, **When** they inspect the shareable tool configuration, **Then** the approved `.opencode/` and `.specify/` configuration is present while secrets, dependency caches, and machine-local state are absent.

---

### Edge Cases

- A panorama image is missing, corrupted, or unsupported by the visitor's browser.
- The visitor's connection is slow and panorama or gallery assets take a long time to appear.
- The visitor uses touch gestures on a small screen and the browser interprets the gesture as a page scroll.
- The visitor has reduced motion preferences enabled.
- Narration autoplay is blocked, the audio file is missing, or the visitor is deaf or hard of hearing.
- A location is listed in navigation but its content has not been supplied.
- A gallery contains no images or images without descriptions.
- An uploaded prototype folder contains unexpected subfolders, duplicate filenames, or files that do not match the expected set.
- A required dependency is missing, fails to install, or conflicts with an existing dependency.
- A team member attempts to merge an out-of-date branch or a branch with failing checks.
- Local environment configuration or secrets are accidentally staged for commit.
- A shareable `.opencode/` or `.specify/` configuration file is accidentally ignored and missing from a fresh clone.
- Machine-local tool state, dependency caches, or sensitive key files are accidentally staged for commit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST display a draggable 360-degree panoramic view for each featured location.
- **FR-002**: The application MUST support both mouse and touch interaction for rotating panoramas.
- **FR-003**: The application MUST provide a sidebar listing every featured location.
- **FR-004**: Selecting a location in the sidebar MUST load the matching panorama and visibly indicate the current location.
- **FR-005**: The application MUST display a gallery of supplied images for each featured room, with a description for each image.
- **FR-006**: The application MUST provide narration for locations that have audio, with play, pause, and resume controls.
- **FR-007**: Every narration MUST have a text transcript available to the visitor.
- **FR-008**: The application MUST remain usable on desktop and mobile screen sizes, including portrait and landscape orientations.
- **FR-009**: All supplied panorama prototype files and assets MUST be migrated into the application's frontend structure, and no references to the original prototype location may remain.
- **FR-010**: The repository MUST separate user interface assets from server-side business logic, with all tour content and interface assets residing with the frontend application.
- **FR-011**: Team members MUST be able to start the complete application with one documented command after setup.
- **FR-012**: Before installing a package that is not already declared in the project, the team member MUST ask the developer or maintainer for approval; essential missing packages MUST be clearly identified as required downloads.
- **FR-013**: The repository MUST document and support a workflow in which every change is made on a separate branch and reviewed through a pull request before merging to the main branch.
- **FR-014**: The main branch MUST remain in a runnable state after every merge.
- **FR-015**: Local environment files, credentials, private keys, certificates, and other secrets MUST NOT be committed to the repository; `client.rest` MUST remain ignored because it may contain authentication tokens.
- **FR-016**: When content fails to load, the application MUST show a visitor-friendly message and keep the rest of the tour usable.
- **FR-017**: Sidebar navigation, panorama controls, gallery controls, and narration controls MUST be operable by keyboard.
- **FR-018**: The application MUST provide text alternatives for meaningful images and MUST respect reduced-motion preferences where animation is used.
- **FR-019**: The application MUST prevent a missing or failed backend dependency from leaving visitors on a blank page while viewing tour content that is already available.
- **FR-020**: The setup documentation MUST explain how to install dependencies, configure local environment values, start the application, run checks, and submit a reviewed change.
- **FR-021**: Shareable tool configuration under `.opencode/` and `.specify/` MUST be tracked, including commands, skills, package manifests, memory, scripts, templates, workflows, integrations, and initialization or integration settings.
- **FR-022**: Repository ignore rules MUST be limited to sensitive files, dependency caches, build output, logs, editor state, coverage, and machine-local tool state; sensitive patterns MUST include `.env`, `.env.*` except `.env.example`, `*.key`, `*.pem`, `*.p12`, `*.pfx`, `secrets.*`, `credentials.*`, and `client.rest`.

### Key Entities *(include if feature involves data)*

- **Location**: A featured place in the campus tour. It has a display name, a description, an order in the sidebar, and references to its panorama, gallery, and narration.
- **Panorama Scene**: The 360-degree view for a location, including its image content and the visitor's initial viewing direction.
- **Gallery Image**: A still image belonging to a location, with a caption or description and display order.
- **Narration**: An audio description for a location, with its audio content, duration, and matching transcript.
- **Contribution Change**: A proposed repository change made on a separate branch, reviewed before it becomes part of the main branch.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of first-time visitors can open the tour and rotate the first panorama within 30 seconds without assistance.
- **SC-002**: The first panorama becomes visible within 5 seconds on a typical broadband connection and within 8 seconds on a typical mobile connection.
- **SC-003**: 90% of visitors can reach a specific featured room in three interactions or fewer.
- **SC-004**: Visitors perceive panorama rotation as smooth, with no noticeable lag between their gesture and the view moving on representative desktop and mobile devices.
- **SC-005**: 100% of featured rooms have a panorama, a gallery, and a narration with a transcript before the foundation is considered complete.
- **SC-006**: A new team member can set up the project and run the complete application in under 15 minutes by following the documentation.
- **SC-007**: 100% of required packages are identified before installation, and zero essential packages are missing when a new team member first runs the application.
- **SC-008**: Zero secrets, local environment files, dependency caches, or machine-local tool state are present in the repository, and 100% of shareable `.opencode/` and `.specify/` configuration is tracked after the foundation is complete.
- **SC-009**: 100% of supplied prototype assets are migrated, and zero references to the original prototype location remain.
- **SC-010**: 100% of changes reach the main branch through a reviewed branch, and the main branch remains runnable after every merge.

## Assumptions

- The team will provide the existing panorama prototype folder, room images, location names, narration audio, and transcripts.
- Featured locations and their content are curated by the project team; visitors do not upload content.
- Visitors use a modern browser with JavaScript enabled and have an internet connection.
- The initial tour content is presented in English unless the team supplies additional languages.
- The team uses GitHub branches and pull requests as the standard contribution workflow, and the main branch is protected.
- Shareable AI and Spec Kit tool configuration is committed so every contributor uses the same commands, skills, templates, and workflows.
- Machine-local tool state and dependency caches remain unshared to avoid per-machine churn and repository bloat.
- A local database and server environment are available for backend-dependent features, but viewing already-available tour content does not depend on unrelated backend features.
- Missing packages require maintainer approval, and essential missing packages are treated as blockers that must be downloaded before the application can run.
- User accounts, administrative content editing, analytics, and multilingual narration are outside the scope of this foundation feature.
