# Coding Challenge: Map Marker Performance Refactor

## Background

This app renders delivery order markers on a MapLibre map. Each marker is currently
a React `<Marker>` component — one DOM node and one MapLibre overlay per point.

At low counts this works fine. As marker volume grows (hundreds → thousands), this
approach becomes a bottleneck: React reconciliation, individual DOM nodes, and
MapLibre's overlay management all add up.

The standard solution is to move markers into MapLibre's WebGL pipeline using a
**GeoJSON source + symbol layer**. All markers are then rendered in a single draw
call regardless of count.

---

## Your Task

Refactor the marker rendering from the current `<MapMarker>` component approach
to a **GeoJSON source + symbol layer** approach.

### Requirements

1. **Replace `<MapMarker>` instances** in `App.tsx` with a single GeoJSON-based
   component (or inline layer). The per-marker React component loop should be gone.

2. **Preserve all marker types and colours.** The existing `markerTypeToSvg` and
   `markerImageKey` utilities in `src/utils/markers.ts` generate SVG strings and
   cache keys — use them. Every distinct `(type, color, selected)` combination
   should be pre-registered as a MapLibre image before the layer is added.

3. **Preserve hover tooltips.** Hovering a marker should still show a popup with
   the marker's label (or type as fallback).

4. **Preserve `homePoint` click → select toggle.** Clicking a `homePoint` marker
   should toggle its `selected` state. The icon should visually update (grey → green).

5. **No change to `src/utils/markers.ts` or `src/types/index.ts`** — treat these
   as stable library code.

6. **TypeScript** — no `any`, no suppressed errors.

---

## Files to Work In

| File | Status |
|------|--------|
| `src/App.tsx` | ✏️ Change freely |
| `src/components/MapMarker.tsx` | ✏️ Replace or delete |
| `src/data/mockMarkers.ts` | ✏️ Add data if helpful |
| `src/utils/markers.ts` | 🔒 Do not modify |
| `src/types/index.ts` | 🔒 Do not modify |

---

## Hints

- `react-map-gl` exposes `<Source>` and `<Layer>` components that wrap MapLibre's
  GeoJSON source and symbol layer APIs.
- To use SVG images as map symbols, you need to call `map.addImage(key, htmlImageElement)`
  via the `onLoad` / `useMap()` hook before the layer renders.
- `loadSvgImage(svg)` in `src/utils/markers.ts` returns a `Promise<HTMLImageElement>` —
  you'll need to await all of them before adding the layer.
- MapLibre's `layout` properties like `icon-image` can reference a feature property
  via the expression `['get', 'propertyName']` — use this to drive the icon per feature.
- For click and hover events on a symbol layer, use the map's `onClick` / `onMouseEnter`
  / `onMouseLeave` handlers scoped to the layer id.

---

## What We're Looking For

- **Correctness** — all marker types render, tooltips work, homePoint toggles.
- **Understanding of the trade-off** — can you articulate *why* GeoJSON layers
  scale better than React markers?
- **Clean TypeScript** — well-typed GeoJSON features, no escape hatches.
- **Minimal surface area** — solve the problem without introducing unnecessary
  abstractions.

---

## Getting Started

```bash
npm install
npm run dev
```

The app will open at `http://localhost:5173` showing markers over central London.

Time allowed: **90 minutes**.
