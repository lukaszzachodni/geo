import {MarkerData, Shape} from "./index";

const INITIAL_MARKERS: MarkerData[] = [
    {
        id: '1',
        type: Shape.Circle,
        longitude: -0.1276,
        latitude: 51.5074,
        label: 'ORD-001',
        order: { orderId: 'ORD-001', orderRef: 'REF-A', markerColor: '#e74c3c' },
    },
    {
        id: '2',
        type: Shape.Square,
        longitude: -0.1410,
        latitude: 51.5155,
        label: 'ORD-002',
        order: { orderId: 'ORD-002', orderRef: 'REF-B', markerColor: '#3498db' },
    },
    {
        id: '3',
        type: Shape.Star,
        longitude: -0.1180,
        latitude: 51.5033,
        label: 'ORD-003',
        order: { orderId: 'ORD-003', orderRef: 'REF-C', markerColor: '#f39c12' },
    },
    {
        id: '4',
        type: Shape.Pentagon,
        longitude: -0.1350,
        latitude: 51.5200,
        label: 'ORD-004',
        order: { orderId: 'ORD-004', orderRef: 'REF-D', markerColor: '#9b59b6' },
    },
    {
        id: '5',
        type: Shape.Diamond,
        longitude: -0.1050,
        latitude: 51.5120,
        label: 'ORD-005',
        order: { orderId: 'ORD-005', orderRef: 'REF-E', markerColor: '#1abc9c' },
    },
    {
        id: '6',
        type: 'movWarning',
        longitude: -0.1490,
        latitude: 51.5090,
        label: 'WARN-001',
        order: { orderId: 'ORD-006', markerColor: '#e67e22' },
    },
    {
        id: '7',
        type: 'combined',
        longitude: -0.1220,
        latitude: 51.5250,
        label: 'COMB-001',
        order: { orderId: 'ORD-007', markerColor: '#e74c3c' },
    },
    {
        id: 'home',
        type: 'homePoint',
        longitude: -0.1276,
        latitude: 51.5200,
        label: 'Home',
        selected: false,
    },
];

// Generate n extra random markers for performance demonstration
const EXTRA_MARKERS: MarkerData[] = Array.from({ length: 10000 }).map((_, i) => {
    const shapes = Object.values(Shape);
    const colors = ['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#1abc9c', '#2ecc71', '#e67e22'];
    return {
        id: `extra-${i}`,
        type: shapes[i % shapes.length],
        longitude: -0.1276 + (Math.random() - 0.5) * 1,
        latitude: 51.5074 + (Math.random() - 0.5) * 1,
        label: `EXTRA-${i}`,
        order: {
            orderId: `ORD-EXTRA-${i}`,
            markerColor: colors[i % colors.length]
        }
    };
});

export const MOCK_MARKERS: MarkerData[] = [...INITIAL_MARKERS, ...EXTRA_MARKERS];
