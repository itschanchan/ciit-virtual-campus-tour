# Quickstart Validation: Add MUI React Dependencies

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **UI Contract**: [contracts/ui-contract.md](./contracts/ui-contract.md)

Use this guide after implementation to prove the dependency change and documentation are complete. All commands run from the repository root.

## Prerequisites

- Node.js 24.x (minimum 22.12) and npm.
- Network access to the npm registry for the first install.
- Git checkout on the feature branch.
- No `.env` file is required for these checks.

## Scenario 1: Install Resolves All Packages

**Command**:

```bash
npm --prefix apps/frontend install
```

**Expected outcome**:

- Installation completes with exit code 0.
- No `ERESOLVE` peer-dependency errors.
- The command reports the four added packages.
- `apps/frontend/package-lock.json` is updated and contains the resolved versions.

**Verify**:

```bash
npm --prefix apps/frontend ls @mui/material @mui/icons-material @emotion/react @emotion/styled
```

- All four packages appear in the dependency tree.
- No `UNMET PEER DEPENDENCY` or `invalid` markers appear.

## Scenario 2: Manifest and Lockfile Agree

**Command**:

```bash
npm --prefix apps/frontend ci --dry-run
```

**Expected outcome**:

- The dry run reports that the lockfile is consistent with `apps/frontend/package.json`.
- No package is reported as missing from the lockfile.

## Scenario 3: Lint Still Passes

**Command**:

```bash
npm run lint
```

**Expected outcome**:

- ESLint exits with code 0.
- No new errors appear in the unchanged source files.

## Scenario 4: Production Build Still Passes

**Command**:

```bash
npm run build
```

**Expected outcome**:

- Vite exits with code 0.
- `apps/frontend/dist/` is produced.
- No build error references the new packages.

## Scenario 5: Content Verification Still Passes

**Command**:

```bash
npm run verify:content
```

**Expected outcome**:

- The catalog and referenced assets validate with no new failures.

## Scenario 6: No New High or Critical Security Advisories

**Command**:

```bash
npm --prefix apps/frontend audit --omit=dev
```

**Expected outcome**:

- No high or critical advisories are reported for the added packages.
- Existing advisories, if any, are unrelated to this change and documented in the pull request.

## Scenario 7: Existing Tour Still Works

**Command**:

```bash
npm run dev
```

Then open the Vite URL.

**Expected outcome**:

- The panorama loads and can be dragged.
- Sidebar navigation switches locations.
- The room gallery opens and closes.
- Narration controls play, pause, and show the transcript.
- The layout works at a desktop viewport and at 375x667.

## Scenario 8: Documentation Is Complete

Review these files after implementation:

- `docs/tech_stack.md`
  - All four packages appear in the frontend runtime dependency table.
  - Each row shows layer, approval, and purpose.
  - The frontend stack summary acknowledges MUI.
  - The coexistence rule states Tailwind remains primary.
- `docs/project_setup.md`
  - Installation steps mention the frontend dependencies.
  - The supported React version and conflict behavior are stated.
  - New MUI surfaces are directed to `apps/frontend/src/components/`.
- The package names and versions in the docs match `apps/frontend/package.json`.

## Failure Handling

- **Peer dependency error**: check the installed React version against the package peer range and adjust the version range, then reinstall.
- **Lockfile drift**: rerun the install and confirm the lockfile changes are committed with the manifest.
- **Build error**: confirm the import path uses the package subpath and that no server-only module is imported.
- **Lint error**: confirm the new files use the existing semicolon-free style and React hooks rules.
- **Visual regression**: confirm no global MUI baseline was mounted and Tailwind Preflight was not enabled.
