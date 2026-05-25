# Next Hire

A modern job board application built with React, TypeScript, Vite, and a mock REST API using API using `json-server` and Tailwind for styling. The app focuses on fast job discovery, intelligent search, and smooth application handling.

## Features

- Job listings from mock API (JSON Server)
- Job detail pages
- Advanced search system:
  - Fuse.js fuzzy search
  - Autocomplete suggestions
- Recent search history
- Real-time filtering of job results
- Job application form with validation
- React Hook Form integration
- Toast notifications (Sonner)
- Loading and error states
- Fully responsive UI with Tailwind CSS
- Client-side routing with React Router

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Query (TanStack Query)
- Axios
- React Hook Form
- Fuse.js (fuzzy search)
- Sonner (notifications)
- Lucide React (icons)

## Project Structure

```txt
src/
  api/
  components/
  data/
  hooks/
  pages/
  providers/
 types/
  utils/
db.json   # mock API data
```

## Setup, Installation & Running the Project

**Prerequisites**

- Node.js (v18+ recommended)
- npm (or yarn / pnpm)

**Install**

Clone Repository:

```bash
git clone <repo-url>
cd job-board-app
```

Install dependencies:

```bash
npm install
```

**Development**

- Start the frontend dev server (Vite):

```bash
npm run dev
```

- Start the fake JSON API (serves `db.json` on port 3001):

```bash
npm run api
```

- Run the server directly:

```bash
json-server --watch db.json --port 3001
```

- Run both frontend and API together:

```bash
npm run dev:all
```

Open the app at http://localhost:5173 and the API at http://localhost:3001

## Ports & conflicts

If port 5173 (Vite) or 3001 (json-server) are already in use you can run the servers on different ports.

- Run the fake API on a different port (one-off):

```bash
npx json-server --watch db.json --port 4000
```

Note: Vite will detect when the requested port is unavailable and will report the actual URL it is serving on in the terminal — check the terminal output if the app doesn't appear on the expected port.

**Build / Preview**

- Create a production build:

```bash
npm run build
```

- Preview the production build locally:

```bash
npm run preview
```

**Linting**

- Run ESLint across the project:

```bash
npm run lint
```

**Notes**

- Fake API data is stored in `db.json` at the project root.
- The main scripts are defined in `package.json` (`dev`, `api`, `dev:all`, `build`, `preview`, `lint`).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
