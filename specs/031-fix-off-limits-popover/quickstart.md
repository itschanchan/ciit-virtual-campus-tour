# Quickstart Validation: Fix Off-Limits Popover Duplicate Message

**Feature**: 031-fix-off-limits-popover
**Created**: 2026-11-26
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Contract**: [contracts/popover-behavior.md](./contracts/popover-behavior.md)

Use this guide to prove the off-limits notice shows exactly one complete message for its entire lifecycle.

## Prerequisites

- Repository checked out at `F:\web-projects\ciit-virtual-campus-tour`.
- Node.js LTS and npm installed.
- Dependencies installed from the repository root:

```powershell
npm install
npm run setup
```

The backend does not need to be running for the notice validation, but the full tour requires `apps/backend/.env` (see `AGENTS.md`).

## Automated Validation

### 1. Run the focused Sidebar tests

```powershell
npm --prefix apps/frontend run test -- --run src/tests/Sidebar.test.jsx
```

Expected:
- All off-limits notice tests pass.
- The previous stale "waits 1.5 seconds before showing" test has been replaced by an immediate-display test that passes.
- New lifecycle assertions confirm the label is never blank and only one `role="status"` element exists.

### 2. Run the full frontend suite

```powershell
npm --prefix apps/frontend run test
```

Expected: no new failures; notice behavior covered by the Sidebar suite.

### 3. Lint and build

```powershell
npm run lint
npm run build
```

Expected: ESLint reports no errors and the production build succeeds.

## Manual Validation

Start the app:

```powershell
npm run dev
```

Open the tour in a browser and complete the welcome/instructions screens if shown.

### Scenario A — Single complete message on selection

1. Open the campus floor list.
2. Select `1F` (marked `OFF LIMITS`).
3. Watch the notice from appearance to disappearance.

Expected:
- Exactly one notice appears immediately with `1F is coming soon.`
- The text never changes to a blank or label-less message.
- The notice disappears on its own after about two seconds.

### Scenario B — No duplicate on auto-hide

1. Select a different off-limits floor (`2F`).
2. Watch closely as the notice hides.

Expected:
- Only `2F is coming soon.` is shown.
- No second or blank "coming soon." message flashes before it hides.
- The notice does not jump to a different screen position while hiding.

### Scenario C — Switch floors quickly

1. Select `1F`, then select `3F` before the first notice hides.

Expected:
- Only one notice is visible and it reads `3F is coming soon.`
- The display period restarts from the latest selection.

### Scenario D — Dismiss and sidebar close

1. Select `10F`, then press `Escape` (or click outside the notice).
2. Re-select `11F`, then close the floor list while the notice is visible.

Expected:
- The notice disappears immediately when dismissed.
- Closing the floor list removes the notice and it does not reappear.

### Scenario E — Responsive and reduced motion

1. Repeat Scenario A at desktop (1440×900), tablet (768×1024), and mobile (375×667) widths.
2. Enable the operating system's reduced-motion setting and repeat Scenario A.

Expected:
- The notice is complete, single, and readable at every size.
- Reduced motion shortens the animation but never duplicates or blanks the message.

## Troubleshooting

- If the notice appears twice, inspect that the popover is rendered once and that the notice content is cleared only after the exit transition finishes.
- If the label is blank while hiding, the notice content was cleared before the exit completed.
- If a notice appears after closing the sidebar, a pending hide timer was not cancelled.

## References

- Behavior and forbidden states: [contracts/popover-behavior.md](./contracts/popover-behavior.md)
- State machine and invariants: [data-model.md](./data-model.md)
- Root-cause analysis and decisions: [research.md](./research.md)
