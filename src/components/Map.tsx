// import { useState } from "react";
// import ReactMapGL, { Marker, Popup, Source, Layer } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import "./Map.css";

// type Drone = {
//   id: number;
//   name: string;
//   lat: number;
//   lon: number;
//   status: string;
//   path: number[][];
// };

// const drones: Drone[] = [
//   {
//     id: 1,
//     name: "Mavic 3 Pro",
//     lat: 37.77,
//     lon: -122.42,
//     status: "red",
//     path: [
//       [-122.43, 37.76],
//       [-122.42, 37.77],
//       [-122.41, 37.78],
//     ],
//   },
//   {
//     id: 2,
//     name: "Mini 3 Pro",
//     lat: 37.76,
//     lon: -122.44,
//     status: "green",
//     path: [
//       [-122.45, 37.75],
//       [-122.44, 37.76],
//       [-122.43, 37.77],
//     ],
//   },
// ];

// export default function MapPage() {
//   const [viewState, setViewState] = useState({
//     latitude: 37.7749,
//     longitude: -122.4194,
//     zoom: 12,
//   });

//   const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);

//   const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

//   return (
//     <div className="map-wrapper">
//       <ReactMapGL
//         {...viewState}
//         id="mapboxgl-map"
//         mapStyle="mapbox://styles/mapbox/dark-v11"
//         mapboxAccessToken={MAPBOX_TOKEN}
//         onMove={(evt) => setViewState(evt.viewState)}
//       >
//         {/* Markers */}
//         {drones.map((drone) => (
//           <Marker key={drone.id} latitude={drone.lat} longitude={drone.lon}>
//             <div
//               className="drone-marker"
//               style={{ backgroundColor: drone.status }}
//               onClick={() => setSelectedDrone(drone)}
//             />
//           </Marker>
//         ))}

//         {/* Popup */}
//         {selectedDrone && (
//           <Popup
//             latitude={selectedDrone.lat}
//             longitude={selectedDrone.lon}
//             onClose={() => setSelectedDrone(null)}
//             closeOnClick={false}
//           >
//             <div>
//               <h4>{selectedDrone.name}</h4>
//               <p>Status: {selectedDrone.status}</p>
//             </div>
//           </Popup>
//         )}

//         {/* Paths */}
//         {drones.map((drone) => (
//           <Source
//             key={drone.id}
//             id={`path-${drone.id}`}
//             type="geojson"
//             data={{
//               type: "Feature",
//               geometry: { type: "LineString", coordinates: drone.path },
//               properties: {},
//             }}
//           >
//             <Layer
//               id={`line-${drone.id}`}
//               type="line"
//               paint={{
//                 "line-color": drone.status,
//                 "line-width": 3,
//               }}
//             />
//           </Source>
//         ))}
//       </ReactMapGL>
//     </div>
//   );
// }

import { useState } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  Source,
  Layer,
  type ViewState,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import DronePanel from "./drones-panel";

type Drone = {
  id: number;
  name: string;
  registration: string;
  lat: number;
  lon: number;
  yaw: number;
  altitude: number;
  flightTime: string;
  path: number[][];
};

const initialDrones: Drone[] = [
  {
    id: 1,
    name: "Mavic 3 Pro",
    registration: "SG-AA",
    lat: 37.78,
    lon: -122.43,
    yaw: 45,
    altitude: 325,
    flightTime: "00:25:45",
    path: [
      [-122.45, 37.77],
      [-122.44, 37.775],
      [-122.43, 37.78],
    ],
  },
  {
    id: 2,
    name: "Mini 3 Pro",
    registration: "SG-BA",
    lat: 37.76,
    lon: -122.45,
    yaw: 90,
    altitude: 280,
    flightTime: "00:20:10",
    path: [
      [-122.46, 37.75],
      [-122.45, 37.76],
    ],
  },
];

const getDroneStatusColor = (registration: string) =>
  registration.startsWith("B") || registration.includes("SG-B")
    ? "green"
    : "red";

export default function MapPage() {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [drones] = useState<Drone[]>(initialDrones);
  const [selectedDroneId, setSelectedDroneId] = useState<number | null>(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const selectedDrone = drones.find((d) => d.id === selectedDroneId);

  const handleListClick = (drone: Drone) => {
    setViewState({
      ...viewState,
      latitude: drone.lat,
      longitude: drone.lon,
      zoom: 14,
    });
    setSelectedDroneId(drone.id);
  };

  return (
    <div className="map-container">
      <DronePanel
        drones={drones}
        selectedDroneId={selectedDroneId}
        handleListClick={handleListClick}
        getDroneStatusColor={getDroneStatusColor}
        onClose={() => setShowPanel(false)} // تحكم في إغلاق اللوحة
      />
      {/* Map */}
      <ReactMapGL
        {...viewState}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {drones.map((drone) => (
          <Marker
            key={drone.id}
            latitude={drone.lat}
            longitude={drone.lon}
            anchor="center"
          >
            <div
              className="drone-icon"
              style={{
                transform: `rotate(${drone.yaw}deg)`,
                backgroundColor: getDroneStatusColor(drone.registration),
              }}
              onClick={() => setSelectedDroneId(drone.id)}
              title={drone.name}
            />
          </Marker>
        ))}

        {selectedDrone && (
          <Popup
            latitude={selectedDrone.lat}
            longitude={selectedDrone.lon}
            onClose={() => setSelectedDroneId(null)}
            closeOnClick={false}
          >
            <div>
              <h4>{selectedDrone.name}</h4>
              <p>Altitude: {selectedDrone.altitude} m</p>
              <p>Flight Time: {selectedDrone.flightTime}</p>
            </div>
          </Popup>
        )}

        {/* Paths */}
        {drones.map((drone) => (
          <Source
            key={`source-${drone.id}`}
            id={`path-${drone.id}`}
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: drone.path,
              },
              properties: {},
            }}
          >
            <Layer
              id={`line-${drone.id}`}
              type="line"
              paint={{
                "line-color": getDroneStatusColor(drone.registration),
                "line-width": 3,
              }}
            />
          </Source>
        ))}
      </ReactMapGL>

      {/* Red Drones Counter */}
      <div className="counter">
        Red Drones:{" "}
        {
          drones.filter((d) => getDroneStatusColor(d.registration) === "red")
            .length
        }
      </div>
    </div>
  );
}
