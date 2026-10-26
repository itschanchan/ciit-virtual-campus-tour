# CIIT Virtual Campus Tour Tech Stack

This document is used for establishing the tech stack, foundational tools, core system architeccture, and checking for dependencies in the project.

**Description**: A web-based application virtual campus tour equipped with a 360° panoramic view of the rooms, a quick-navigation sidebar, narrated descriptions for the locations, and a gallery for each room. Additionally, the website is compatible with desktop and mobile devices, making it accessible across platforms.

## Tech Stack: MERN Stack

**MERN Stack**: The core tech stack to be used in the codebase. Check if the programming languages, applications, and tools are aligned in the project.

| Domain   | Technology            | Reason                                                        |
| :------- | :-------------------- | :------------------------------------------------------------ |
| Database | MongoDB               | Used for storing and managing user data. Use mongoose for ORM |
| Backend  | Express.js            | Handles the server-side logic and for API development.        |
| Frontend | React + Vite          | For building the modern User Interface (UI).                  |
| Language | JavaScript (ESModule) | The main core language for frontend and backend.              |
| Testing  | Vitest                | For units and integration testing.                            |
| Frontend | CSS (custom)          | Responsive, accessible tour styling without another dependency. |

## Dependencies

These are the core dependencies needed in the CIIT Virtual Campus Tour web-application. Look at the `package.json` file in each folder and check if there are missed dependencies in the codebase and ask before installing:

| Layer    | Dependency   | Approval | Description                                                                   |
| :------- | :----------- | :------- | :---------------------------------------------------------------------------- |
| Backend  | cookie-parser | Deferred | For managing web cookies. Install when authentication work begins. |
| Backend  | cors         | Approved | Cross-Origin Resource Sharing with an explicit origin allowlist. |
| Backend  | dotenv       | Approved | Manages API keys and other environment variables in `.env`. |
| Backend  | express      | Approved | Handles the server-side logic. |
| Backend  | jsonwebtoken | Approved | Handles web token access for future authentication and authorization. |
| Backend  | mongoose     | Approved | Stores and manages database schemas. |
| Frontend | marzipano    | Approved | Renders the 360-degree panorama viewer. |
| Frontend | react        | Approved | ReactJS components. |
| Frontend | react-dom    | Approved | The Document Object Model of React. |

| Layer       | DevDependency | Approval | Description                                                              |
| :---------- | :------------ | :------- | :----------------------------------------------------------------------- |
| Backend     | nodemon       | Deferred | NodeJS development reloader. `node --watch` is used until approved. |
| Backend     | supertest     | Deferred | For testing HTTP APIs and application endpoints. |
| Backend     | vitest        | Deferred | For unit and integration testing. |
| Frontend    | @testing-library/react | Deferred | Component behavior tests. |
| Frontend    | @testing-library/jest-dom | Deferred | Accessible DOM assertions. |
| Frontend    | @testing-library/user-event | Deferred | Keyboard and pointer interaction tests. |
| Frontend    | jsdom         | Deferred | Browser environment for Vitest. |
| Frontend    | eslint        | Approved | For linting programming syntax. |
| Frontend    | vite          | Approved | Frontend build and development server. |
| Root folder | concurrently  | Approved | Runs `npm run dev` for both frontend and backend in one command. |

**OPTIONAL DEPENDENCIES**:

- **Python**: for data analysis and description (future use).

## MVC Architecture

The CIIT Virtual Campus Tour follows the MVC Architecture: Model-View-Controller. It separates the UI (frontend) from business data logic (backend) and data logic (database) of an application, with controller for the user and server response and requests.

**Sample Folder Structure**:

- Inside the root project folder, the `apps\` is the parent folder of `backend\` and `frontend\` folders.
- The `backend\` folder contains all of the business logic and database management. The `.env` file and `.rest` file also in this folder and should excluded in the GitHub repository (`.gitignore`).
- The `frontend\` folder contains all of the UI design and assets in the project.
- Marzipano API Integration: If there is an `app-files` folder, then move the Marzipano API sub-folders and files inside the `frontend\` folder. Convert it from JavaScript (`.js`) to **ReactJS (`.jsx`)** compatible.
- Tour content lives in `apps/frontend/src/lib/catalog.json`; panorama tiles, gallery images, and narration audio live under `apps/frontend/public/panoramas/<location-slug>/`.
- Shareable `.opencode/` and `.specify/` configuration is tracked. Only secrets, dependency caches, build output, logs, editor state, coverage, and machine-local state are ignored.

```

root/
|--- apps/
|     |---- backend/
|     |       |---- config/
|     |       |
|     |       |---- controllers/
|     |       |
|     |       |---- models/
|     |       |
|     |       |---- routes/
|     |       |
|     |       |---- services/
|     |       |
|     |       |---- tests/
|     |       |
|     |       |---- utils/
|     |       |
|     |       |---- .env
|     |       |
|     |       |---- client.rest
|     |       |
|     |       |---- index.js
|     |       |
|     |       |---- vitest.config.js
|     |
|     |---- frontend/
|     |       |
|     |       |---- public/
|     |       |
|     |       |---- src/
|     |       |
|     |       |---- tests/
|     |       |
|     |       |---- context/
|     |       |
|     |       |---- lib/
|     |       |
|     |       |---- api/
|     |       |
|     |       |---- assets/
|     |       |
...

```

## Foundation Implementation Notes

- The frontend owns the static tour catalog and all media so the tour remains usable without the backend.
- The backend exposes `GET /api/health`, validates environment configuration, and connects to MongoDB through Mongoose.
- CORS uses an explicit origin allowlist from `CORS_ORIGIN`.
- Run `npm install`, `npm run setup`, and copy `apps/backend/.env.example` to `apps/backend/.env` before development.
- Use `npm run dev`, `npm run test`, `npm run lint`, `npm run build`, `npm run verify:content`, and `npm run verify:ignore` from the repository root.
- Backend test tooling and `cookie-parser` remain deferred until the maintainer approves them.
