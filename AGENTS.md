# Agent Notes

## Commands

- Install root, backend runtime, and frontend dependencies: `npm install` then `npm run setup`
- Copy backend environment: `Copy-Item apps/backend/.env.example apps/backend/.env`
- Run both applications: `npm run dev`
- Run backend tests: `npm --prefix apps/backend run test` (Vitest + Supertest)
- Run frontend tests: `npm --prefix apps/frontend run test`
- Lint the frontend: `npm run lint`
- Build the frontend: `npm run build`
- Validate catalog content and assets: `npm run verify:content`
- Verify the ignore policy: `npm run verify:ignore`

---

## Constraints

- Do not install undeclared packages without maintainer approval.
- Do not commit secrets, `.env` files, `apps/backend/client.rest`, dependency caches, build output, or machine-local tool state.
- Fill in `MONGODB_URI`, `MONGODB_NAME`, and a non-empty `JWT_SECRET` in `apps/backend/.env` before starting the backend. A missing `JWT_SECRET` fails startup.
- Keep `apps/backend/index.js` as the single entry point: one module-scope Express app exported as default with inline middleware, routes, and error handling; do not add a `createApp` factory or restore `config/env.js`/`app.js`.
- The backend listens only when `NODE_ENV` is not `test`, and it awaits `connectDB()` before `app.listen()` so requests are never accepted before MongoDB is ready.
- Keep tour content in `apps/frontend/src/lib/catalog.json` and media under `apps/frontend/public/panoramas/`.
- Backend tests use installed Vitest and Supertest. Frontend Testing Library and jsdom remain deferred.

---

## Global Syntax Rules

- **Description**: The coding syntax of all programming language used in the project follows the "Keep It Simple Agent (KISA)" approach.
- **Purpose**: Maintain a readable, highly maintinble, and human-first codebase.
- **Core Directive:** Prioritize basic, clean syntax over clever, compact, or highly optimized "black magic" code blocks.

---

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

### TailwindCSS Simplification Rules

- **Use Standard Utility Classes**: Stick to standard Tailwind design tokens. Avoid custom arbitrary values (e.g., use p-4 instead of p-[17px], bg-blue-600 instead of bg-[#2563eb]) unless strictly required by design specs.

- **Avoid Over-Complicated Utility Chains**: Keep class lists simple, readable, and non-repetitive. Do not stack redundant or conflicting utilities (e.g., block flex or p-4 px-2).

- **Clean Dynamic Classes**: Avoid complex string interpolation or deeply nested ternary logic inside className. Use clear boolean flags with simple helper functions like clsx or cn().

- **Prefer Component Abstraction**: For complex or recurring UI elements, extract clean, reusable components instead of relying on long, unreadable utility class strings or heavy custom CSS overrides. Use a global theme file for easier class values management.

- **Avoid Tailwind Display Conflicts**: Never apply `flex` and `hidden` to the same element simultaneously, as they conflict for the `display` property.
  - **Bad**: `<div class="flex hidden">`
  - **Good (Responsive)**: `<div class="hidden md:flex">`
  - **Good (Conditional)**: Use state to swap classes entirely (`isOpen ? 'flex' : 'hidden'`) or toggle `hidden` on a parent wrapper.

### Preferred Clean Syntax Patterns

- **Explicit over Implicit:** Write clear, self-explanatory variable and function names. Do not prioritize saving keystrokes over clarity.
- **Early Returns:** Use guard clauses and early returns to keep the happy path flat and readable.
- **Functional & Pure:** Prefer flat, predictable functional patterns (e.g., `map`, `filter`) or simple imperative loops. Avoid complex stateful abstractions.

---

## Responsive Web Design Rules

### Core Responsive Design Principles

- **Mobile-First Approach:** Always follow a mobile-first development approach. Write the default layout and styles for mobile devices first, then progressively adjust the layout for tablets and desktop devices using Tailwind CSS responsive utilities.

- **Device Compatibility:** Every frontend page and component must support the following device categories:
  - **Mobile:** Small-screen smartphones.
  - **Tablet:** Medium-screen tablets and similar devices.
  - **Desktop:** Large-screen laptops and desktop monitors.

- **Consistent User Experience:** Ensure that content remains readable, accessible, properly aligned, and usable across different screen sizes. Avoid layouts that break, overlap, or produce unnecessary horizontal scrolling.

### TailwindCSS Responsive Implementation

- **Use Built-in Responsive Utilities:** Prefer Tailwind CSS responsive prefixes (e.g., `sm:`, `md:`, `lg:`, `xl:`) for handling layout changes across different screen sizes.

- **Mobile-First Utility Structure:** Define mobile styles using standard utility classes first. Apply responsive prefixes only when a layout or component needs to change at larger screen sizes.

- **Follow Existing Breakpoints:** Use the breakpoints configured in the project's Tailwind CSS configuration. Do not introduce unnecessary custom breakpoints or arbitrary screen-size values.

- **Prefer Flexible Layouts:** Use standard CSS Flexbox, Grid, width, max-width, spacing, and wrapping utilities to create adaptable layouts.

- **Avoid Fixed Dimensions:** Avoid unnecessary fixed widths and heights that could cause content overflow on smaller screens. Prefer responsive sizing utilities and flexible containers.

- **Prevent Display Conflicts:** Do not apply conflicting display utilities to the same element. Use clear responsive class combinations such as `hidden md:flex` when an element needs to change its display behavior.

### Code Simplicity and Maintainability

- **Keep Responsive Code Simple:** Follow the existing Keep It Simple Agent (KISA) approach. Responsive implementations must remain readable, predictable, and easy to maintain.

- **Avoid Over-Engineered CSS:** Do not introduce complicated media queries, excessive CSS overrides, deeply nested responsive selectors, or unnecessary custom styling when standard Tailwind utilities can achieve the same result.

- **Avoid Redundant Utilities:** Do not repeat responsive classes or introduce conflicting utility combinations. Keep component class lists short and understandable.

- **Prefer Existing Components:** Reuse existing layout components and styling patterns when appropriate. Extract a reusable component only when the same responsive structure is needed in multiple places or when it improves code readability.

- **Avoid Unnecessary Dependencies:** Do not install additional responsive design libraries or packages. Use the existing React and Tailwind CSS setup.

### Global Styles and Component-Level Responsibilities

- **Global Responsive Standards:** These responsive design rules apply to all frontend pages, layouts, and components throughout the project.

- **Global CSS Responsibilities:** Keep global styles limited to shared design tokens, base styles, theme configurations, and genuinely reusable layout rules.

- **Component-Level Responsibilities:** Implement most responsive layouts and adjustments directly within their respective components using Tailwind CSS utility classes.

- **Avoid Global Style Overuse:** Do not place component-specific responsive rules in the global stylesheet unless the styling is genuinely shared across multiple components.

- **Maintain Existing Architecture:** Follow the project's existing frontend directory structure and styling conventions. Do not introduce unnecessary files or reorganize components solely to implement responsive behavior.

### JavaScript and React Restrictions

- **CSS-First Responsiveness:** Use CSS and Tailwind CSS responsive utilities to handle viewport-dependent layout and styling changes.

- **Avoid React Hooks for Responsiveness:** Do not use React hooks such as `useState`, `useEffect`, or custom hooks solely to detect screen sizes, monitor viewport dimensions, or dynamically change responsive styles.

- **Avoid JavaScript Viewport Detection:** Do not use JavaScript-based viewport detection, resize event listeners, or `window.innerWidth` calculations when CSS media queries or Tailwind responsive utilities can handle the requirement.

- **Separate Responsiveness from Interactivity:** Responsive styling must remain CSS-driven. React state and hooks may still be used for actual interactive functionality, such as opening a mobile navigation menu, when necessary.

### Responsive Design Verification

- **Check Multiple Screen Sizes:** Review every modified page and component at mobile, tablet, and desktop viewport sizes.

- **Prevent Layout Overflow:** Ensure that text, images, cards, navigation elements, forms, and other interface components fit within their available containers.

- **Preserve Content Hierarchy:** Maintain a logical content order, readable typography, appropriate spacing, and consistent alignment across screen sizes.

- **Verify Existing Functionality:** Responsive changes must not break existing component behavior, navigation, forms, or other application features.

---

## Workflow Rules

1. **Analyze:** Before modifying or adding code, check if the solution can be written using native, elementary language APIs.
2. **Draft:** Present the simplest architectural approach first.
3. **Verify:** Review your generated code block against the "Prohibited Over-Complications" section before applying changes.
