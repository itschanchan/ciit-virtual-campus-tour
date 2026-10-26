# Agent Notes

## Commands

- Install root, backend runtime, and frontend dependencies: `npm install` then `npm run setup`
- Copy backend environment: `Copy-Item apps/backend/.env.example apps/backend/.env`
- Run both applications: `npm run dev`
- Run tests: `npm run test` (requires approved test tooling)
- Lint the frontend: `npm run lint`
- Build the frontend: `npm run build`
- Validate catalog content and assets: `npm run verify:content`
- Verify the ignore policy: `npm run verify:ignore`

## Constraints

- Do not install undeclared packages without maintainer approval.
- Do not commit secrets, `.env` files, `apps/backend/client.rest`, dependency caches, build output, or machine-local tool state.
- Keep tour content in `apps/frontend/src/lib/catalog.json` and media under `apps/frontend/public/panoramas/`.
- Backend tests are currently blocked because Vitest, Supertest, Testing Library, and jsdom are deferred.
