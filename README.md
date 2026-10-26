# CIIT Virtual Campus Tour

A web-based virtual campus where CIITzens can explore the newly built Glitch Tower virtually.

## Core MVP Features

- A 360-degree draggable panoramic view of featured locations in the CIIT Glitch Tower campus.
- A sidebar for quick navigation across campus locations.
- Room galleries and narrated descriptions with transcripts.
- Responsive, keyboard-accessible controls for desktop and mobile.

## Tech Stack

- MongoDB, Mongoose, Express 5, and Node.js on the backend.
- React 19, Vite 8, and Marzipano on the frontend.
- Vitest for automated tests.
- JavaScript ES modules throughout.

## Prerequisites

- Node.js 24.x (minimum 22.12) and npm.
- Git.
- A modern browser with JavaScript and WebGL enabled.
- MongoDB is optional for viewing the tour. The backend health check reports unavailable when
  MongoDB is not connected.

## Install

From the repository root:

```powershell
npm install
npm run setup
Copy-Item apps/backend/.env.example apps/backend/.env
```

On macOS or Linux, use:

```bash
npm install
npm run setup
cp apps/backend/.env.example apps/backend/.env
```

`npm run setup` installs backend runtime dependencies and frontend dependencies. Backend test
tooling and `cookie-parser` are intentionally deferred until the maintainer approves them.

## Run

```powershell
npm run dev
```

This starts the Express API and the Vite frontend together. Open the Vite URL shown in the
terminal. The tour content is bundled with the frontend, so a backend outage does not block the
panorama, sidebar, gallery, or narration.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run setup` | Install backend runtime and frontend dependencies. |
| `npm run dev` | Run the backend and frontend together. |
| `npm run test` | Run backend and frontend tests. Requires approved test tooling. |
| `npm run lint` | Run ESLint for the frontend. |
| `npm run build` | Build the frontend for production. |
| `npm run verify:content` | Validate the catalog against its schema and check referenced assets. |
| `npm run verify:ignore` | Verify the repository ignore policy. |

## Project Structure

```text
apps/
  backend/
    config/        Environment and MongoDB configuration
    controllers/   HTTP controllers
    models/        Reserved for future user-data models
    routes/        Express routes
    services/      Business logic
    tests/         Backend tests
    utils/         Shared error and async helpers
  frontend/
    public/
      panoramas/   Panorama tiles, gallery images, and narration audio
    src/
      api/         Optional backend status client
      components/  Tour UI components
      context/     Tour state and provider
      lib/         Catalog validation and Marzipano integration
      tests/       Frontend tests
```

## Content

Tour content lives in `apps/frontend/src/lib/catalog.json`. Media lives under
`apps/frontend/public/panoramas/<location-slug>/`. When an `app-files` prototype folder is
available, migrate its images and titles into those locations and update the catalog. Run
`npm run verify:content` after every content change.

The current catalog contains one development placeholder location. Replace it with real Glitch
Tower content when available.

## Dependencies

Every package must be approved before installation. See `CONTRIBUTING.md` for the approval table
and the current deferrals. Do not install a package that is not declared in the relevant
`package.json`.

## Git Workflow

1. Create a short-lived branch from `main`.
2. Keep tests and documentation in the same branch as the change.
3. Open a pull request using the template in `.github/pull_request_template.md`.
4. Wait for review and passing checks before merging.
5. Never commit directly to `main`.

## Tool Configuration Tracking

Shareable `.opencode/` and `.specify/` configuration is committed. Only secrets, dependency
caches, build output, logs, editor state, coverage, and machine-local state are ignored. The
authoritative policy is documented in `CONTRIBUTING.md`; run `npm run verify:ignore` after changing
ignore rules.
