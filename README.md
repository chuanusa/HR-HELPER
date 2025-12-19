# HR Helper

HR Helper is a modern tool designed to assist with human resources tasks, including lucky draws and group management.

## Project Setup

### Prerequisites

- Node.js (Version 20 or higher recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd HR-HELPER
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

### Development

To start the local development server:

```sh
npm run dev
```

The application will be available at `http://localhost:3000` (or similar).

### Production Build

To build the application for production:

```sh
npm run build
```

The build artifacts will be located in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```sh
npm run preview
```

## Deployment

The project is configured to deploy automatically to GitHub Pages using GitHub Actions.

- **Trigger**: Pushing to the `main` branch.
- **Workflow File**: `.github/workflows/deploy.yml`

Ensure that GitHub Pages is configured to serve from the `gh-pages` branch in your repository settings after the first successful deployment.

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
