# LinguiCards Frontend

A language learning web application built with Angular 18 and Angular Material. LinguiCards helps users learn vocabulary, practice translations, and improve grammar through interactive training exercises.

## Features

- **Vocabulary Management** -- Add, edit, and delete words per language with pagination and filtering
- **Training Modes** -- Options-based, written input, and word-connection exercises
- **Translation Practice** -- AI-evaluated translation exercises at configurable language levels
- **Grammar Tasks** -- Grammar exercises with automatic evaluation
- **Progress Tracking** -- XP system with levels, daily goals, streaks, and a goal calendar
- **Multi-language Support** -- Learn multiple languages, switch between them in the header

## Tech Stack

- **Framework:** Angular 18 (standalone components, new control flow)
- **UI:** Angular Material, SCSS
- **State:** RxJS + Angular Signals
- **Build:** Angular CLI, Docker (OpenResty)
- **Testing:** Karma + Jasmine
- **Linting:** ESLint, Stylelint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5263`

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Navigate to `http://localhost:4200`. The dev server proxies `/api` requests to `http://localhost:5263`.

### Build

```bash
npm run prod
```

Build output goes to `dist/`.

### Docker

```bash
docker build -t linguicards-frontend .
docker run -p 80:80 linguicards-frontend
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Build for development |
| `npm run prod` | Build for production |
| `npm test` | Run unit tests (Karma) |
| `npm run lint` | Lint TypeScript files |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run stylelint` | Lint SCSS files |
| `npm run stylelint:fix` | Auto-fix SCSS lint issues |

## Project Structure

```
src/app/
  components/
    profile/          # Profile, goal calendar, goal streak
    language/         # Language page, overview, selected-language service
    word/             # Word page and service
    training/         # Training page, connection, utilities
    translation-practice/
    grammar-page/
    grammar-task/
    login/            # Sign-in, sign-up
  layout/
    header/           # Header with language selector
    side-nav/         # Side navigation
  shared/             # Reusable components, pipes, tokens, constants
  models/             # TypeScript interfaces and enums
  interceptors/       # Auth and error HTTP interceptors
  guards/             # Auth guard
  environments/       # Environment configuration
```

## Environment Configuration

Environment files are in `src/environments/`:
- `environment.ts` -- Development defaults
- `environment.prod.ts` -- Production overrides (swapped at build time)

The API base URL is configured via the `API_BASE_URL` injection token.
