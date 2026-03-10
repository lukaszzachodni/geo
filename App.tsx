import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Map, { Source, Layer, Popup, MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MOCK_MARKERS } from "./mockMarkers";
import { MarkerData, MarkerType } from "./index";
import { markerImageKey, markerTypeToSvg, loadSvgImage } from "./markers";
import { FeatureCollection, Point } from 'geojson';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const LAYER_ID = 'markers-layer';

export default function App() {
    const [markers, setMarkers] = useState<MarkerData[]>(MOCK_MARKERS);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [readyIcons, setReadyIcons] = useState<string[]>([]);
    const [hoverInfo, setHoverInfo] = useState<{
        longitude: number;
        latitude: number;
        label: string;
    } | null>(null);
    
    const mapRef = useRef<MapRef>(null);
    const loadingRef = useRef(false);

    // 1. Convert markers to GeoJSON
    const geojson: FeatureCollection<Point> = useMemo(() => ({
        type: 'FeatureCollection',
        features: markers.map(m => ({
            type: 'Feature',
            id: m.id,
            geometry: {
                type: 'Point',
                coordinates: [m.longitude, m.latitude]
            },
            properties: {
                id: m.id,
                type: m.type,
                label: m.label ?? m.type,
                iconImage: markerImageKey(m.type, m.order?.markerColor ?? '#888888', m.selected),
                isHomePoint: m.type === 'homePoint'
            }
        }))
    }), [markers]);

    // 2. Proactively load icons once map is ready
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map || !mapLoaded || loadingRef.current) return;

        const syncIcons = async () => {
            const requiredIconIds = Array.from(new Set(geojson.features.map(f => f.properties?.iconImage as string)));
            const missingIds = requiredIconIds.filter(id => !map.hasImage(id));

            if (missingIds.length === 0) {
                if (requiredIconIds.length > 0 && requiredIconIds.some(id => !readyIcons.includes(id))) {
                    setReadyIcons(requiredIconIds);
                }
                return;
            }

            loadingRef.current = true;
            try {
                const loadedAssets = await Promise.all(missingIds.map(async (id) => {
                    let type: MarkerType;
                    let color = '#888888';
                    let selected = false;

                    if (id.startsWith('marker-homePoint-')) {
                        type = 'homePoint';
                        selected = id.endsWith('selected');
                    } else {
                        const parts = id.split('-');
                        type = parts[1] as MarkerType;
                        color = `#${parts[2]}`;
                    }

                    const svg = markerTypeToSvg(type, color, selected);
                    const img = await loadSvgImage(svg);
                    return { id, img };
                }));

                loadedAssets.forEach(({ id, img }) => {
                    if (!map.hasImage(id)) {
                        map.addImage(id, img);
                    }
                });

                setReadyIcons(prev => Array.from(new Set([...prev, ...requiredIconIds])));
            } catch (err) {
                console.error("Batch load failed:", err);
            } finally {
                loadingRef.current = false;
            }
        };

        syncIcons();
    }, [geojson, mapLoaded, readyIcons]);

    const handleHomeSelect = useCallback((id: string) => {
        setMarkers(prev =>
            prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m),
        );
    }, []);

    const onClick = useCallback((event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature && feature.properties?.isHomePoint) {
            handleHomeSelect(feature.properties.id);
        }
    }, [handleHomeSelect]);

    const onMouseMove = useCallback((event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature) {
            setHoverInfo({
                longitude: event.lngLat.lng,
                latitude: event.lngLat.lat,
                label: feature.properties?.label
            });
        } else {
            setHoverInfo(null);
        }
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: -0.1276,
                    latitude: 51.5074,
                    zoom: 12,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle={MAP_STYLE}
                onLoad={() => setMapLoaded(true)}
                onClick={onClick}
                onMouseMove={onMouseMove}
                onMouseLeave={() => setHoverInfo(null)}
                interactiveLayerIds={[LAYER_ID]}
            >
                <Source id="markers-source" type="geojson" data={geojson}>
                    <Layer
                        id={LAYER_ID}
                        type="symbol"
                        layout={{
                            'icon-image': ['get', 'iconImage'],
                            'icon-allow-overlap': true,
                            'icon-size': 2,
                        }}
                        // Apply filter ONLY if we have some ready icons to show
                        filter={readyIcons.length > 0 
                            ? ['in', ['get', 'iconImage'], ['literal', readyIcons]] 
                            : ['==', ['get', 'id'], 'NONE'] // Show nothing if none ready
                        }
                    />
                </Source>

                {hoverInfo && (
                    <Popup
                        longitude={hoverInfo.longitude}
                        latitude={hoverInfo.latitude}
                        anchor="bottom"
                        closeButton={false}
                        closeOnClick={false}
                        offset={[0, -10]}
                    >
                        {hoverInfo.label}
                    </Popup>
                )}
            </Map>
        </div>
    );
}
