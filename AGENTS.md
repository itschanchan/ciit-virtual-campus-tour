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

## Global Syntax Rules

- **Description**: The coding syntax of all programming language used in the project follows the "Keep It Simple Agent (KISA)" approach.
- **Purpose**: Maintain a readable, highly maintinble, and human-first codebase.
- **Core Directive:** Prioritize basic, clean syntax over clever, compact, or highly optimized "black magic" code blocks.

## Code Style & Syntax Constraints

### Prohibited Over-Complications

- **No Deep Nesting:** Maximum indent level is 3. Refactor anything deeper into small, isolated functions.
- **No Clever One-Liners:** Avoid overly complex method chaining, dense ternary statements, or obscure logical short-circuiting. If it takes a human more than 2 seconds to skim, break it down.
- **No Monolithic Blocks:** Code blocks/methods must not exceed 25–30 lines of active logic. Break tasks into individual helper steps.
- **No Obscure Language Features:** Avoid highly advanced syntax structures (e.g., heavily nested TypeScript generic wizardry, dynamic variable variable names, or complex regex) unless explicitly asked.

### JavaScript Destructuring Rules

- **Allow Shallow Destructuring:** Use destructuring only for top-level object or array properties (e.g., `const { name, age } = user;`).
- **No Deeply Nested Destructuring:** Avoid nesting objects inside destructuring assignments (e.g., **DO NOT DO THIS:** `const { user: { profile: { name } } } = response;`). Extract nested layers on separate lines if necessary.
- **Limit Property Renaming:** Do not aggressively rename variables while destructuring unless it is absolutely necessary to avoid naming collisions (e.g., avoid `const { user_id: id } = data;` if `user_id` works fine).
- **No Complex Default Value Chains:** Avoid heavy fallback configurations inside the destructuring block (e.g., `const { tags = ['general'], theme: { color = 'blue' } = {} } = config;`). Use explicit nullish coalescing (`??`) or guard clauses on subsequent lines instead.

### Preferred Clean Syntax Patterns

- **Explicit over Implicit:** Write clear, self-explanatory variable and function names. Do not prioritize saving keystrokes over clarity.
- **Early Returns:** Use guard clauses and early returns to keep the happy path flat and readable.
- **Functional & Pure:** Prefer flat, predictable functional patterns (e.g., `map`, `filter`) or simple imperative loops. Avoid complex stateful abstractions.

## Workflow Rules

1. **Analyze:** Before modifying or adding code, check if the solution can be written using native, elementary language APIs.
2. **Draft:** Present the simplest architectural approach first.
3. **Verify:** Review your generated code block against the "Prohibited Over-Complications" section before applying changes.
