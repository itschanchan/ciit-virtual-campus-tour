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

## Dependencies

These are the core dependencies needed in the CIIT Virtual Campus Tour web-application. Look at the `package.json` file in each folder and check if there are missed dependencies in the codebase and ask before installing:

| Layer    | Dependency   | Description                                                                   |
| :------- | :----------- | :---------------------------------------------------------------------------- |
| Backend  | cors         | Cross-Origin Resource Sharing, a security feature for web access and request. |
| Backend  | dotenv       | Manages API keys and other environment variables `.env` file of the project.  |
| Backend  | express      | Handles the server-side logic.                                                |
| Backend  | jsonwebtoken | Handles web token access, for state authentication and authorization.         |
| Backend  | mongoose     | For storing and managing database schemas.                                    |
| Frontend | react        | ReactJS components.                                                           |
| Frontend | react-dom    | The Document Object Model of React.                                           |

| Layer       | DevDependency | Description                                                              |
| :---------- | :------------ | :----------------------------------------------------------------------- |
| Backend     | nodemon       | NodeJS dependency.                                                       |
| Backend     | supertest     | For testing HTTP APIs and application endpoints.                         |
| Backend     | vitest        | For unit and intergration testing.                                       |
| Frontend    | eslint        | For linting (checking) of programming syntax.                            |
| Frontend    | vite          | A fast frontend managing framework for fast deployment.                  |
| Root folder | concurrently  | Running `npm run dev` for both frontend and backend in a single command. |

**OPTIONAL DEPENDENCIES**:

- **Python**: for data analysis and description (future use).

## MVC Architecture

The CIIT Virtual Campus Tour follows the MVC Architecture: Model-View-Controller. It separates the UI (frontend) from business data logic (backend) and data logic (database) of an application, with controller for the user and server response and requests.

**Sample Folder Structure**:

- Inside the root project folder, the `apps\` is the parent folder of `backend\` and `frontend\` folders.
- The `backend\` folder contains all of the business logic and database management. The `.env` file and `.rest` file also in this folder and should excluded in the GitHub repository (`.gitignore`).
- The `frontend\` folder contains all of the UI design and assets in the project.
- Marzipano API Integration: If there is a `app-files` folder, then move the Marzipano API sub-folders and files inside the `frontend\` folder. Convert it from JavaScript (`.js`) to ReactJS (`.jsx`) compatible.

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
