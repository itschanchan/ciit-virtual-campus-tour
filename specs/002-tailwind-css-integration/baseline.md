# Baseline and Implementation Decisions: Tailwind CSS Integration

**Date**: 2026-10-26
**Branch**: `feature/tailwindcss`
**Feature directory**: `specs/002-tailwind-css-integration/`

## Baseline Command Results

| Command | Result |
|---------|--------|
| `npm run lint` | PASS; zero reported errors |
| `npm run build` | PASS; Vite 8.3.1 built the frontend |
| `npm run test` | FAIL; `'vitest' is not recognized as an internal or external command` |

### Baseline production CSS

| Asset | Raw bytes | Gzip bytes |
|-------|-----------|------------|
| `dist/assets/index-*.css` | 8,170 | 2,558 |
| `dist/assets/PanoramaViewer-*.css` | 954 | 481 |
| **Total** | **9,124** | **3,039** |

## Visual Baseline

Headless Chrome screenshots were captured from the running frontend at:

- 1440x900
- 1024x768
- 700x800
- 560x800
- 375x667
- 320x568

Location: `C:\Users\Takumi\AppData\Local\Temp\opencode\tailwind-baseline\`

The initial-load screenshots cover the shell, header, sidebar, panorama area, instructions, narration panel, and dialogs available without interaction. Interactive states are validated manually against `quickstart.md` and recorded in `validation.md`.

## Representative Tailwind Measurement

A representative migration surface was compiled with Tailwind 4.3.3 using the theme and utilities layers without Preflight:

- Raw: 19,262 bytes
- Gzip: 4,210 bytes

This is a 38.5 percent increase over the 3,039-byte baseline and exceeds the original SC-009 limit of 3,339 bytes gzip.

## Final Implementation Measurement

| Asset | Raw bytes | Gzip bytes |
|-------|-----------|------------|
| `dist/assets/index-DfflUgoU.css` | 20,901 | 4,671 |

- Only one CSS asset is emitted; no component CSS chunk remains.
- The result is within the recommended 5,000-byte target and 6,000-byte maximum.
- The result exceeds the original 3,339-byte SC-009 cap, which remains pending approval.
- Final builds use Vite 8.3.5 after patch-level security updates in the lockfile.

## Decisions and Open Items

| Item | Status | Record |
|------|--------|--------|
| SC-009 compressed CSS budget | PENDING APPROVAL | The original 10 percent cap is infeasible. This implementation targets the plan's recommended maximum of 6,000 bytes gzip and will report the measured result. The specification is not silently changed. |
| Deferred frontend test tooling | RETAIN DEFERRAL | No approval to install Vitest, jsdom, or Testing Library was provided. The implementation will not install them and will record the pre-existing test-command failure. Automated test execution remains a documented gap. |
| Tailwind dependency approval | APPROVED FOR THIS FEATURE | The maintainer's request to implement Tailwind authorizes `tailwindcss` and `@tailwindcss/vite` only. They are recorded in `docs/tech_stack.md` before installation. |

## Implementation Target

- Lint: zero errors.
- Production build: successful.
- No component stylesheet imports or files.
- Visual baseline preserved at all six captured viewports.
- Accessibility, reduced motion, 200 percent zoom, forced colors, offline frontend, and Marzipano interactivity verified.
- Compressed production CSS measured and reported against the approved or recommended budget.
