# Contributing

## Branch and review workflow

1. Create a short-lived branch from `main` for every change.
2. Keep the change focused and update tests and documentation in the same branch.
3. Open a pull request and complete the checklist in `.github/pull_request_template.md`.
4. Wait for review and passing checks before merging.
5. Never commit directly to `main`. The main branch must remain runnable after every merge.

## Dependency approval

Do not install a package that is not already declared in the relevant `package.json`.

- Ask a maintainer for approval before installing a new package.
- State whether the package is essential to run the application.
- Record the approval and the package purpose in this file.
- Essential missing packages must be downloaded before the application can run.

Approved packages for the foundation:

| Package | Layer | Approval status |
| --- | --- | --- |
| `marzipano` | Frontend runtime | Approved |
| `express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken` | Backend runtime | Approved |
| `concurrently` | Root development | Approved |
| `cookie-parser` | Backend runtime | Deferred until authentication work |
| `vitest`, `supertest`, `nodemon` | Backend development | Deferred until test tooling approval |
| `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom` | Frontend development | Deferred until test tooling approval |

## Repository tracking policy

Shareable tool configuration must be committed:

- `.opencode/commands/`, `.opencode/skills/`, `.opencode/package.json`, and `.opencode/package-lock.json`.
- `.specify/memory/`, `.specify/scripts/`, `.specify/templates/`, `.specify/workflows/`, `.specify/integrations/`, `.specify/init-options.json`, and `.specify/integration.json`.

Only these may remain ignored:

- Secrets and credentials: `.env`, `.env.*` except `.env.example`, `*.key`, `*.pem`, `*.p12`, `*.pfx`, `secrets.*`, `credentials.*`, and `apps/backend/client.rest`.
- Dependency caches: `node_modules/`.
- Build output, logs, editor state, coverage, and Vitest cache.
- Machine-local state: `.specify/feature.json` and `.specify/extensions/*/local-config.yml`.

Run `npm run verify:ignore` before opening a pull request that changes ignore rules.

## Verification record

Recorded on 2026-10-26:

| Check | Result |
| --- | --- |
| Dependency approval decision | Runtime dependencies and Marzipano approved. Backend test tooling and `cookie-parser` deferred. |
| `npm run verify:ignore` | Passed. |
| `npm run verify:content` | Passed for 1 placeholder location and 9 public files. |
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| `npm run test` | Blocked because Vitest, Supertest, Testing Library, and jsdom are not approved or installed. |
| `git ls-files .opencode .specify` | Shareable `.specify` configuration is tracked. `.opencode` is no longer ignored but remains untracked until the next commit. |

## Audit record

`npm audit` was run on 2026-10-26:

- Backend: 5 advisories, including 3 high severity. The high-severity `body-parser` advisory is in the Express runtime dependency tree; the remaining findings are development tooling or transitive packages.
- Frontend: 3 high severity advisories in Vite, `source-map-js`, and `zod`, all in the development toolchain.

No automatic audit fix was applied because it could install or upgrade packages that have not been approved. Revisit these advisories when the maintainer approves dependency updates.

## Constitution review

Reviewed against `.specify/memory/constitution.md` version 1.0.0 on 2026-10-26.

Justified deviations and remaining gates:

- The test-first gate is not satisfied yet. Tests were written, but Vitest, Supertest, Testing Library, and jsdom remain deferred, so the tests have not been run or observed failing. The implementation tasks that depend on passing tests remain incomplete until the maintainer approves the test tooling and the suite runs.
- `marzipano` was approved as a frontend runtime dependency by the maintainer and is recorded in `docs/tech_stack.md`; the constitution's approved dependency list has not been amended.
- Marzipano is consumed as the published npm package instead of copied prototype source folders converted from `.js` to `.jsx`. This keeps the viewer maintainable and avoids vendoring prototype code.
- `cookie-parser` remains deferred because no cookie-based authentication exists yet. It must be declared before that work ships.
- `npm audit fix` was not run because it could install or upgrade unapproved packages. The advisories are recorded above and must be revisited with maintainer approval.
- Browser, mobile, keyboard, failure, and performance scenarios in `quickstart.md` have not been run, so Principle V is not fully verified.
- Backend development uses `node --watch` because `nodemon` remains deferred.

## Required checks

- Backend and frontend tests pass.
- Frontend ESLint passes.
- Production build succeeds.
- No secrets or machine-local state are staged.
- New packages are approved and recorded above.
