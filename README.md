# Coding Challenge: Map Marker Performance Refactor

This project is a solution to a coding challenge focused on optimizing the performance of rendering delivery order markers on a MapLibre map. The refactoring moves from a per-marker React component approach to a more scalable solution using a single GeoJSON source and symbol layer, leveraging MapLibre's WebGL capabilities.

## Project Description

The application renders delivery order markers on a map. The original approach used individual React components for each marker, which became a performance bottleneck at high marker counts. This refactoring replaces that by utilizing a GeoJSON source and a MapLibre symbol layer for efficient rendering.

## Requirements Fulfilled

*   Markers are rendered using a single GeoJSON source and symbol layer.
*   All marker types and colors are preserved using the provided `markerTypeToSvg` and `markerImageKey` utilities.
*   Hover tooltips display marker labels.
*   Clicking on `homePoint` markers toggles their selected state, visually updating the icon.
*   The solution adheres to TypeScript best practices without suppressing errors.
*   External utilities (`src/utils/markers.ts` and `src/types/index.ts`, which are `index.ts` in this project structure) were not modified.

## Getting Started

To run this project locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Files Included

*   `.gitignore`: Configures ignored files (e.g., `node_modules`, `dist`).
*   `App.tsx`: Contains the main application logic and the refactored GeoJSON layer implementation.
*   `CHALLENGE.md`: The description of the coding challenge.
*   `index.html`: The HTML entry point for the application.
*   `index.ts`: Core type definitions for the project.
*   `main.tsx`: The main entry point that renders the `App` component.
*   `markers.ts`: Utility functions for marker icons and SVGs.
*   `mockMarkers.ts`: Mock data for the markers displayed on the map.
*   `package.json`: Project dependencies and scripts.
*   `tsconfig.json`: TypeScript compiler configuration.
*   `vite.config.ts`: Vite build tool configuration.
