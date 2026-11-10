# Implementation Plan: Floor Gallery Placeholder Images

**Branch**: `016-gallery-placeholder-images` | **Date**: 2026-11-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/016-gallery-placeholder-images/spec.md`

## Summary

Give every available floor a three-image gallery by expanding each location's gallery content in `catalog.json` to three entries that point at three shared, visually distinct placeholder SVGs. The existing Gallery component already renders one image at a time with left and right controls, arrow-key navigation, wrap-around, a position counter, and accessible labels; this feature verifies and covers that behavior rather than rebuilding it. The work is frontend-only, data-and-assets focused, and adds no runtime dependency.

## Technical Context

**Language/Version**: JavaScript with ES Modules and JSX. React `^19.2.8` (installed 19.3.0) and Vite `^8.3.0` (installed 8.3.5). No TypeScript in the frontend.

**Primary Dependencies**: React, React DOM, Tailwind CSS 4, existing MUI packages, and Marzipano. This feature requires none of the MUI or Marzipano APIs and introduces no package.

**Storage**: Static tour content in `apps/frontend/src/lib/catalog.json`. Placeholder media lives under `apps/frontend/public/panoramas/placeholder/`. No database or API involvement.

**Testing**: Vitest 5 with Testing Library and jsdom. Configuration is `apps/frontend/vitest.config.js`; setup is `apps/frontend/src/tests/setup.js`. Baseline verified during planning: 8 test files and 85 tests pass.

**Target Platform**: Modern desktop, tablet, and mobile browsers supported by the Vite application, from 320 CSS pixels through desktop widths.

**Project Type**: Web application with separate `apps/frontend` and `apps/backend`. This feature is frontend-only.

**Performance Goals**: Adding three small inline SVGs must not measurably change first render. Gallery images already render one at a time, and the assets are vector files, so no new loading budget is required.

**Constraints**: No backend changes, no new runtime dependencies, no catalog schema changes, no second Gallery experience, and no change to panorama, sidebar, narration, or location-selection behavior. Placeholder content must be clearly labeled as temporary and replaceable.

**Scale/Scope**: Nine accessible locations, three placeholder images each, three shared SVG assets, and one catalog file. Locked floors have no location and remain out of scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|:---|:---|:---|:---|
| I. MERN Stack Alignment | React + Vite + JavaScript ES Modules; Vitest testing; no alternative stack | PASS | Data and static asset changes only; React component behavior is retained; Vitest remains the test framework |
| II. MVC Separation and Application Boundaries | Frontend owns UI, galleries, and static assets; no backend involvement | PASS | All changes are under `apps/frontend`; no backend, service, model, or API change |
| III. Test-First Quality Gate | Tests written and observed failing before implementation; gallery behavior covered | PASS | Plan adds a catalog content test and a Gallery integration test before the catalog and assets change; existing RoomGallery tests already cover the controls |
| IV. Security, Secrets, and Configuration Discipline | No secrets or environment changes | PASS | No credentials, `.env` files, or configuration changes |
| V. Responsive, Accessible Immersive Experience | Works on desktop and mobile; accessible controls; meaningful alternative text; keyboard operable; lazy/deferred media | PASS | Gallery placeholders include unique alternative text and captions; existing controls meet 44px targets and have accessible names; SVG assets are small and only the active image renders |
| Technology & Dependency Constraints | Approved stack only; new dependencies need approval | PASS | No dependency is added or changed |
| Development Workflow & Quality Gates | Specification, plan, tasks, implementation; tests and lint pass | PASS | This plan continues the Spec Kit sequence; automated tests, lint, and build remain required |

No constitution violation requires a complexity exception. The pre-existing `verify:content` failure is recorded as a risk, not as scope for this feature.

## Project Structure

### Documentation (this feature)

```text
specs/016-gallery-placeholder-images/
├── plan.md              # This file
├── research.md          # Phase 0 decisions and alternatives
├── data-model.md        # Gallery content, assets, and viewing state
├── quickstart.md        # End-to-end validation guide
├── contracts/
│   └── ui-contract.md   # Content, navigation, and accessibility contract
├── checklists/
│   └── requirements.md  # Specification quality checklist
├── spec.md              # Feature specification
└── tasks.md             # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
apps/frontend/
├── public/
│   └── panoramas/
│       └── placeholder/
│           ├── equirect.svg                 # Existing panorama placeholder
│           ├── gallery-1.svg                # New placeholder image 1
│           ├── gallery-2.svg                # New placeholder image 2
│           └── gallery-3.svg                # New placeholder image 3
├── src/
│   ├── components/
│   │   └── RoomGallery.jsx                  # Unchanged: controls already exist
│   ├── pages/
│   │   └── Panorama.jsx                     # Unchanged: already wires gallery data
│   ├── lib/
│   │   └── catalog.json                     # Updated: three gallery entries per location
│   └── tests/
│       ├── catalog.test.js                  # Updated: three images per location
│       └── Layout.test.jsx                  # Updated: three-image swap integration
```

**Structure Decision**: Retain the existing web-application layout and the existing Gallery component. Content stays in `catalog.json`, and media stays under `public/panoramas/`, matching the project's documented content and asset conventions. No new component, hook, service, or state container is introduced.

## Current Implementation Findings

- The Gallery trigger is inline in `apps/frontend/src/pages/Panorama.jsx:154-165` and calls `toggleGallery` from the tour context.
- Gallery content resolution is in `apps/frontend/src/pages/Panorama.jsx:26-34`. It first asks `getFloorGalleryImages(currentFloor, currentLocation?.name)` and falls back to `currentLocation.gallery`. The per-floor asset folders under `apps/frontend/src/assets/gallery/` are currently empty, so the catalog gallery is the effective source today.
- The left and right controls already exist in `apps/frontend/src/components/RoomGallery.jsx:158-177`. Both are rendered only when `hasMultipleImages` is true.
- Wrap-around behavior is already implemented in `showPreviousImage` and `showNextImage` at `apps/frontend/src/components/RoomGallery.jsx:95-101`.
- Keyboard navigation is already implemented for ArrowLeft and ArrowRight at `apps/frontend/src/components/RoomGallery.jsx:63-69`.
- The position counter is already implemented at `apps/frontend/src/components/RoomGallery.jsx:184-189`.
- Existing coverage in `apps/frontend/src/tests/RoomGallery.test.jsx` verifies button navigation, wrap-around, arrow-key navigation, single-image hiding, the empty state, ordering, and focus behavior.
- Each catalog location currently has exactly one gallery image (`apps/frontend/src/lib/catalog.json`), so the swap controls are hidden in the real tour even though the component supports them.

Because the controls are already implemented, the feature should not add a second set of controls or replace the existing component.

## Proposed Changes

### 1. Placeholder assets

Add three SVG placeholders under `apps/frontend/public/panoramas/placeholder/`:

| File | Visual treatment | Text |
|:---|:---|:---|
| `gallery-1.svg` | Blue/teal gradient | Large "1", "Gallery placeholder" |
| `gallery-2.svg` | Amber/orange gradient | Large "2", "Gallery placeholder" |
| `gallery-3.svg` | Violet/pink gradient | Large "3", "Gallery placeholder" |

Requirements for each asset:

- 16:10 aspect ratio to match the Gallery's existing `aspect-16/10` presentation.
- An SVG `<title>` and `<desc>` for a meaningful accessible description.
- Large numeral and color difference so swapping is obvious without reading the caption.
- No external fonts, scripts, or network references.
- Small file size; inline vector shapes and text only.

### 2. Catalog content

For each of the nine accessible locations in `apps/frontend/src/lib/catalog.json`, replace the single gallery entry with three entries:

```json
"gallery": [
  {
    "src": "/panoramas/placeholder/gallery-1.svg",
    "alt": "<Location name> gallery placeholder 1 of 3.",
    "caption": "Gallery placeholder 1 of 3",
    "order": 0
  },
  {
    "src": "/panoramas/placeholder/gallery-2.svg",
    "alt": "<Location name> gallery placeholder 2 of 3.",
    "caption": "Gallery placeholder 2 of 3",
    "order": 1
  },
  {
    "src": "/panoramas/placeholder/gallery-3.svg",
    "alt": "<Location name> gallery placeholder 3 of 3.",
    "caption": "Gallery placeholder 3 of 3",
    "order": 2
  }
]
```

The alternative text and captions differ per location so a screen-reader user and a sighted tester can tell which floor is being viewed. `order` remains unique and contiguous within each gallery, satisfying the existing catalog validation in `apps/frontend/src/lib/catalog.js:71-106`.

### 3. Components

No component change is expected.

- `RoomGallery.jsx` already provides both controls, wrap-around, arrow keys, the counter, accessible names, and the single-image hidden state.
- `Panorama.jsx` already passes the location's gallery content and remounts the Gallery per location with `key={currentLocation?.id ?? "empty"}`.

If the tests reveal a real gap (for example, a control is missing at a supported viewport), fix only that gap and keep the existing component structure.

### 4. Tests

- `apps/frontend/src/tests/catalog.test.js`: add a test that every location has exactly three gallery images with orders `0, 1, 2`, non-empty alternative text and captions, and known placeholder sources.
- `apps/frontend/src/tests/Layout.test.jsx`: add a test that opens the Gallery for the default location, confirms the counter starts at `1 / 3`, advances to `2 / 3` with "Next image", returns to `1 / 3` with "Previous image", and wraps from the first image to the third with "Previous image".
- Existing `RoomGallery.test.jsx` tests remain unchanged and continue to cover component-level navigation and accessibility.

### 5. Files to modify

| File | Change | Reason |
|:---|:---|:---|
| `apps/frontend/public/panoramas/placeholder/gallery-1.svg` | New | First distinguishable placeholder |
| `apps/frontend/public/panoramas/placeholder/gallery-2.svg` | New | Second distinguishable placeholder |
| `apps/frontend/public/panoramas/placeholder/gallery-3.svg` | New | Third distinguishable placeholder |
| `apps/frontend/src/lib/catalog.json` | Update all nine location galleries | Give every accessible floor three images |
| `apps/frontend/src/tests/catalog.test.js` | Add content test | Lock the three-image contract |
| `apps/frontend/src/tests/Layout.test.jsx` | Add swap integration test | Prove the real tour data works with the controls |
| `apps/frontend/src/components/RoomGallery.jsx` | No change expected | Controls already implemented and tested |
| `apps/frontend/src/pages/Panorama.jsx` | No change expected | Content wiring already correct |
| `apps/backend/**` | No change | Frontend-only feature |

## Testing Strategy

### Automated

```bash
npm --prefix apps/frontend run test
npm run lint
npm run build
```

Expected results:

- All existing test files and tests keep passing, including the 85-test baseline.
- The new catalog test asserts nine locations each with three images.
- The new integration test proves real catalog data drives the three-image swap.
- Lint and build succeed.

`npm run verify:content` is currently blocked by a pre-existing missing schema file at `specs/001-campus-tour-foundation/contracts/content-schema.json`. That is not caused by this feature and must be reported honestly rather than silently worked around. The new placeholder assets and catalog references can be checked manually and by the catalog test in the meantime.

### Manual

Use `quickstart.md` for the full matrix. At minimum:

- Open the Gallery from LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, and 9F and confirm three distinct images each.
- Confirm the counter starts at `1 / 3`.
- Use "Next image" and "Previous image" through all three images and confirm wrap-around at both ends.
- Confirm ArrowLeft and ArrowRight produce the same changes.
- Confirm the Gallery closes and location navigation still works.
- Spot-check desktop, tablet, and 320px-wide phone layouts.

## Risks and Dependencies

| Risk | Impact | Mitigation |
|:---|:---|:---|
| Per-floor gallery folders override catalog content | A floor with real files would no longer use catalog placeholders | Intended replacement behavior; documented in data model. Placeholders are temporary. |
| Nine repetitive catalog edits | A floor could miss an image or duplicate an order | Add the catalog test before editing; verify every location has exactly three ordered entries |
| Shared placeholders across floors | Two floors show the same images | Distinguishability within a floor is what matters for swap testing; captions and alt text remain floor-specific |
| `verify:content` is already broken | Cannot use it as a gate for the new asset paths | Record as pre-existing; validate asset paths manually and through the catalog test |
| SVG rendering differences | Placeholder text may render inconsistently | Use system font families and standard SVG text/shape features only |
| Existing single-image tests could accidentally break | Regression in hidden-control behavior | Do not change `RoomGallery`; keep fixtures with one image unchanged |

No backend dependency, API change, storage migration, or new runtime package is introduced.

## Implementation Phases

1. **Test-first coverage**: Add the catalog three-image test and the Layout swap integration test; run them and confirm they fail for the current single-image catalog.
2. **Assets**: Add the three distinguishable SVG placeholders under `public/panoramas/placeholder/`.
3. **Content**: Update all nine location galleries in `catalog.json` to reference the three assets with floor-specific alt text and captions.
4. **Verification**: Run the frontend test suite, lint, and build. Manually validate the swap behavior on every floor and at representative viewports.
5. **Documentation**: Record the `verify:content` pre-existing blocker in the completion notes; do not claim it passed.

## Post-Design Constitution Re-Check

After generating `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md`, the design still satisfies the constitution:

- **Stack and boundaries**: All changes stay in the React frontend, with static content and SVG assets. No backend, model, service, or route change.
- **Test-first**: The new catalog and integration tests are written before the content change and cover the spec's core success criteria.
- **Accessibility and responsiveness**: Placeholders carry alternative text and captions; existing controls already have accessible names, visible focus, 44px targets, and keyboard support.
- **Dependency discipline**: No dependency changes.
- **Complexity**: No new component, hook, or abstraction is needed. The change reuses the existing Gallery and extends its content.
