# Research: CIIT Virtual Campus Tour Foundation

**Feature**: `001-campus-tour-foundation`
**Date**: 2026-10-26

## Decision 1: Use the official Marzipano package directly in a React wrapper

**Decision**: Add the official `marzipano` package (current version 0.10.2) and wrap it in a
purpose-built `PanoramaViewer` component. Create the viewer in an effect using a React ref,
switch scenes through a small controller object, and call the viewer's teardown method in the
effect cleanup.

**Rationale**: Marzipano is a DOM- and WebGL-oriented library, so React should own the container
element while Marzipano owns its contents. Direct integration keeps control over scene loading,
cleanup, and accessibility. React StrictMode intentionally mounts and unmounts effects twice in
development, so teardown must fully destroy the viewer to avoid duplicated canvases and leaks.

**Alternatives considered**:
- `react-marzipano` and `react-marzipano-component`: community wrappers with low maintenance
  activity and incomplete coverage of the current Marzipano API.
- Copying the prototype's vendored Marzipano scripts: creates duplicate code, bypasses package
  management, and conflicts with the dependency-approval rule.

## Decision 2: Store tour content as a static frontend catalog

**Decision**: Migrate the prototype's `data.js` into `apps/frontend/src/lib/catalog.json`, load
it through `src/lib/catalog.js`, and validate it against `contracts/content-schema.json`. The
frontend bundles the catalog and media.

**Rationale**: The tour is public, read-only content. Static delivery is fast, cacheable, and
keeps the tour usable when the backend or database is unavailable, satisfying FR-019. It also
avoids duplicating the catalog between frontend and backend during the foundation phase.

**Alternatives considered**:
- MongoDB-backed location API: adds a database dependency to the critical viewing path and
  requires content duplication for fallback.
- Serving the catalog from the backend as JSON: still makes the tour dependent on the API and
  provides no benefit until content administration exists.

## Decision 3: Keep backend scaffolding separate and minimal

**Decision**: Scaffold the backend with `index.js`, environment validation, MongoDB connection,
health endpoint, centralized error handling, and the MVC folder layout. Do not expose tour
content from the backend in this foundation.

**Rationale**: The constitution requires MVC boundaries and a working MERN foundation, but the
current feature has no user-data requirements. A health endpoint and connection layer prove the
backend runs without introducing unused content APIs.

**Alternatives considered**:
- Build a full Location CRUD API: out of scope and unnecessary for public read-only tour content.
- Skip the backend entirely: violates the MERN stack foundation and leaves no place for future
  user-data features.

## Decision 4: Use React context and local state instead of a routing library

**Decision**: Manage current location, sidebar, gallery, and narration state in `TourContext`
with `useReducer`. Do not add a routing dependency in this foundation.

**Rationale**: The tour is a single-screen experience with a sidebar. Local state is sufficient
and avoids another package approval. Future deep-linking can be added when a route requirement
exists.

**Alternatives considered**:
- Add React Router: useful for deep links but not required by the spec and adds a dependency.
- Use URL hash synchronization: a possible future enhancement, not needed for the foundation.

## Decision 5: Test the wrapper and interactions without a real WebGL context

**Decision**: Use Vitest, Testing Library, jest-dom, and jsdom for frontend tests. Mock the
Marzipano module in component tests and assert lifecycle calls, scene switching, cleanup,
keyboard behavior, narration state, and gallery rendering. Use Supertest with Vitest for the
backend health endpoint and environment validation.

**Rationale**: jsdom does not provide WebGL, so tests should verify the integration contract and
user-visible behavior rather than pixel rendering. Mocking keeps tests fast and deterministic.
The quickstart covers real panorama rendering in a browser.

**Alternatives considered**:
- Browser-based end-to-end tests: valuable later, but adds a browser automation dependency and
  is outside the foundation scope.
- No component tests: violates the test-first quality gate.

## Decision 6: Serve panorama assets from the Vite public directory

**Decision**: Place migrated panorama tiles and large images under
`apps/frontend/public/panoramas/<location-slug>/`. Reference them with root-relative URLs in the
catalog. Keep small UI imagery and icons under `src/assets/`.

**Rationale**: Public assets are served without hashing, which suits Marzipano tile URL
templates and keeps large media out of the JavaScript bundle. Small UI assets can still be
hashed and optimized by Vite.

**Alternatives considered**:
- Import all panorama tiles through JavaScript: produces a large module graph and unnecessary
  build overhead.
- Keep the prototype folder structure verbatim: leaves old paths and unused prototype files in
  the repository.

## Decision 7: Document the contribution and dependency workflow

**Decision**: Add `CONTRIBUTING.md` describing short-lived branches, pull requests, required
checks, protected `main`, and the rule that undeclared packages require maintainer approval
before installation. Essential missing packages must be labeled as required downloads in the
request.

**Rationale**: The team explicitly requested a multi-branch workflow and dependency approval.
Documenting the process makes it reviewable and enforceable.

**Alternatives considered**:
- Rely on verbal team conventions: not verifiable during review.
- Automatically install missing packages: violates the approval requirement.

## Decision 8: Enforce responsive and accessible behavior through explicit contracts

**Decision**: Define keyboard, focus, transcript, alt-text, and reduced-motion expectations in
`contracts/ui-contract.md`. Verify desktop and mobile viewports in the quickstart. Lazy-load
gallery images and load Marzipano only when the viewer is needed.

**Rationale**: Accessibility and mobile support are core requirements, not polish. Contracts make
them testable and reviewable.

**Alternatives considered**:
- Treat accessibility as a later enhancement: conflicts with the constitution and the spec.
- Load all media eagerly: risks slow first paint on mobile connections.

## Resolved Unknowns

- **Marzipano version**: 0.10.2, official package.
- **Node version**: Node.js 24.x locally; minimum 22.12 for Vitest 5.
- **Content source**: static frontend catalog migrated from the prototype.
- **Backend scope**: scaffold and health endpoint only.
- **Routing**: no routing dependency in this foundation.
- **Asset location**: `public/panoramas` for large media, `src/assets` for UI imagery.
- **Testing approach**: Vitest with Testing Library and jsdom; Supertest for backend.

## Open Approval Items

The packages listed in `plan.md` under the dependency approval gate require maintainer approval
before installation. No package was installed during planning.
