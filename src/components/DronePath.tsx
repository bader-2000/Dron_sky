import { Source, Layer } from "react-map-gl";
import type { Drone } from "../utils/droneTypesData";
import { getDroneStatusColor } from "../utils/getDroneStatusColor";
import "../assets/styles/DronePath.css";

export default function DronePath({ drone }: { drone: Drone }) {
  if (!drone.path || drone.path.length < 2) return null;

  return (
    <Source
      id={`path-${drone.registration}`}
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
        id={`line-${drone.registration}`}
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": getDroneStatusColor(drone.registration),
          "line-width": 3,
        }}
      />
    </Source>
  );
}
