// Shape enum — used to determine which SVG shape to render for a marker
export enum Shape {
    Circle = 'circle',
    Square = 'square',
    Star = 'star',
    Pentagon = 'pentagon',
    Diamond = 'diamond',
}

// MarkerType covers named special markers and all Shape values
export type MarkerType = Shape | 'homePoint' | 'movWarning' | 'combined';

// Per-order metadata attached to each marker
export interface OrderProps {
    orderId: string;
    orderRef?: string;
    markerColor?: string;
}

// A single marker's full data — used in mock data and passed into MapMarker
export interface MarkerData {
    id: string;
    type: MarkerType;
    longitude: number;
    latitude: number;
    label?: string;
    order?: OrderProps;
    selected?: boolean;
}
