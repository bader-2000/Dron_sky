import { useState } from "react";
import ReactMapGL, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Drone = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  status: string;
  path: number[][];
};

const drones: Drone[] = [
  {
    id: 1,
    name: "Mavic 3 Pro",
    lat: 37.77,
    lon: -122.42,
    status: "red",
    path: [
      [-122.43, 37.76],
      [-122.42, 37.77],
      [-122.41, 37.78],
    ],
  },
  {
    id: 2,
    name: "Mini 3 Pro",
    lat: 37.76,
    lon: -122.44,
    status: "green",
    path: [
      [-122.45, 37.75],
      [-122.44, 37.76],
      [-122.43, 37.77],
    ],
  },
];

export default function MapPage() {
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
  });

  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);

  // استخدم متغير البيئة من ملف .env
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <ReactMapGL
      {...viewState}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={(evt) => setViewState(evt.viewState)}
    >
      {/* Markers */}
      {drones.map((drone) => (
        <Marker key={drone.id} latitude={drone.lat} longitude={drone.lon}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: drone.status,
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={() => setSelectedDrone(drone)}
          />
        </Marker>
      ))}

      {/* Popup */}
      {selectedDrone && (
        <Popup
          latitude={selectedDrone.lat}
          longitude={selectedDrone.lon}
          onClose={() => setSelectedDrone(null)}
          closeOnClick={false}
        >
          <div>
            <h4>{selectedDrone.name}</h4>
            <p>Status: {selectedDrone.status}</p>
          </div>
        </Popup>
      )}

      {/* Drone paths */}
      {drones.map((drone) => (
        <Source
          key={drone.id}
          id={`path-${drone.id}`}
          type="geojson"
          data={{
            type: "Feature",
            geometry: { type: "LineString", coordinates: drone.path },
            properties: {},
          }}
        >
          <Layer
            id={`line-${drone.id}`}
            type="line"
            paint={{
              "line-color": drone.status,
              "line-width": 3,
            }}
          />
        </Source>
      ))}
    </ReactMapGL>
  );
}
