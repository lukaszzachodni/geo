import {MarkerType, Shape} from "./index";

const SIZE = 18;
const STROKE = '#333333';
const STROKE_WIDTH = 0.5;

export function svgToDataUri(svg: string): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function makeSvg(inner: string, size = SIZE): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="geometricPrecision">${inner}</svg>`;
}

function circle(fill: string, size = SIZE): string {
    const r = size * 0.35;
    const cx = size / 2;
    const cy = size / 2;
    return makeSvg(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}"/>`,
        size,
    );
}

function square(fill: string, size = SIZE): string {
    const w = size * 0.55;
    const x = (size - w) / 2;
    return makeSvg(
        `<rect x="${x}" y="${x}" width="${w}" height="${w}" fill="${fill}" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}"/>`,
        size,
    );
}

function star(fill: string, size = SIZE): string {
    const s = size;
    const pts = [
        [s * 0.5, s * 0.06],
        [s * 0.62, s * 0.38],
        [s * 0.95, s * 0.38],
        [s * 0.68, s * 0.57],
        [s * 0.79, s * 0.9],
        [s * 0.5, s * 0.72],
        [s * 0.21, s * 0.9],
        [s * 0.32, s * 0.57],
        [s * 0.05, s * 0.38],
        [s * 0.38, s * 0.38],
    ]
        .map(([x, y]) => `${x},${y}`)
        .join(' ');
    return makeSvg(
        `<polygon points="${pts}" fill="${fill}" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}"/>`,
        size,
    );
}

function pentagon(fill: string, size = SIZE): string {
    const s = size;
    const pts = [
        [s * 0.5, s * 0.06],
        [s * 0.95, s * 0.38],
        [s * 0.78, s * 0.9],
        [s * 0.22, s * 0.9],
        [s * 0.05, s * 0.38],
    ]
        .map(([x, y]) => `${x},${y}`)
        .join(' ');
    return makeSvg(
        `<polygon points="${pts}" fill="${fill}" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}"/>`,
        size,
    );
}

function diamond(fill: string, size = SIZE): string {
    const s = size;
    const pts = [
        [s * 0.5, s * 0.06],
        [s * 0.94, s * 0.5],
        [s * 0.5, s * 0.94],
        [s * 0.06, s * 0.5],
    ]
        .map(([x, y]) => `${x},${y}`)
        .join(' ');
    return makeSvg(
        `<polygon points="${pts}" fill="${fill}" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}"/>`,
        size,
    );
}

function triangle(fill: string, size = SIZE): string {
    const s = size;
    const pts = `${s / 2},${s * 0.06} ${s * 0.94},${s * 0.94} ${s * 0.06},${s * 0.94}`;
    return makeSvg(
        `<polygon points="${pts}" fill="${fill}" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}"/>`,
        size,
    );
}

function movWarning(fill: string, size = SIZE): string {
    const isLightColor = isLight(fill);
    const innerColor = isLightColor ? '#000000' : '#ffffff';
    const r = size * 0.44;
    const cx = size / 2;
    const cy = size / 2;
    return makeSvg(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#333" stroke-width="0.8"/>` +
            `<rect x="${size * 0.45}" y="${size * 0.18}" width="${size * 0.1}" height="${size * 0.48}" rx="${size * 0.05}" fill="${innerColor}"/>` +
            `<circle cx="${cx}" cy="${size * 0.76}" r="${size * 0.06}" fill="${innerColor}"/>`,
        size,
    );
}

function homePoint(selected: boolean, size = SIZE): string {
    const fill = selected ? '#008000' : '#808080';
    return makeSvg(
        `<g transform="scale(${size / 24})">
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="${fill}" stroke="#333" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" fill="#ffffff" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>`,
        size,
    );
}

function isLight(color: string): boolean {
    const hex = color.replace('#', '');
    if (hex.length < 6) return false;
    const c_r = parseInt(hex.substring(0, 2), 16);
    const c_g = parseInt(hex.substring(2, 4), 16);
    const c_b = parseInt(hex.substring(4, 6), 16);
    return (c_r * 299 + c_g * 587 + c_b * 114) / 1000 > 155;
}

function shapeSvg(shape: Shape, fill: string, size = SIZE): string {
    switch (shape) {
        case Shape.Circle:
            return circle(fill, size);
        case Shape.Square:
            return square(fill, size);
        case Shape.Star:
            return star(fill, size);
        case Shape.Pentagon:
            return pentagon(fill, size);
        case Shape.Diamond:
            return diamond(fill, size);
        default:
            return circle(fill, size);
    }
}

export function markerTypeToSvg(
    type: MarkerType,
    fill: string,
    selected?: boolean,
): string {
    if (type === 'homePoint') return homePoint(selected ?? false);
    if (type === 'movWarning') return movWarning(fill);
    if (type === 'combined') return triangle(fill);
    return shapeSvg(type as Shape, fill);
}

export function markerImageKey(
    type: MarkerType,
    fill: string,
    selected?: boolean,
): string {
    if (type === 'homePoint') return `marker-homePoint-${selected ? 'selected' : 'default'}`;
    return `marker-${type}-${fill.replace('#', '')}`;
}

export function loadSvgImage(svg: string): Promise<HTMLImageElement> {
    // @ts-ignore
    return new Promise((resolve, reject) => {
        const img = new Image(SIZE, SIZE);
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = svgToDataUri(svg);
    });
}
