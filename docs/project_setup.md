# Project Setup

define the foundation feature scope, including repository setup, missing dependency approval, and Marzipano-to-React integration.

This is the CIIT Virtual Campus tour setup, a web-based application that let's users explore the campus in 360 panoramic view. The GitHub repository is a multi-branch type repository that let's the team create new branches and then checking it before merging to the main branch to prevent from accidents and conflicts. For missing dependencies, ask the developer first if needed to install the missing dependency, if the missing dependency is important remind that it needs to download that dependency. For the Marzipano-to-React integration, Marzipano API uses a hardcoded JavaScript language, but its better to convert the vanilla JS into ReactJS for more modern look and UI compatibilities. In case there is a folder uploaded in the codebase like `app-files` or its subfolders: `img`, `titles`, `vendor`, `data.js`, `index.html`, `index.js`, `style.css`, migrate it to the correct folder specifically inside the `apps/frontend` folder.

Use WebGL for a fast performance and smoother animations across the web-application.

---

4 prioritized user stories (panorama exploration, sidebar navigation, gallery/narration, safe team workflow), 20 functional requirements, 10 measurable success criteria, and edge cases. No clarification markers remain.

---

## .opencode and .specify

does the foundation plan have gitignoring of the files and folders? I wanted to add that .opencode and .specify should committed to the github repo, but it should only ignore files with sensitive keys.

Track .opencode/commands, .opencode/skills, .opencode/package.json, .opencode/package-lock.json, and .specify/{memory,scripts,templates,workflows,integrations}, .specify/init-options.json, .specify/integration.json. Ignore .opencode/node_modules/, .specify/feature.json, .specify/extensions/\*/local-config.yml, and sensitive env/key/secret files including client.rest.
