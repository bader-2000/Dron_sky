import { Marker } from "react-map-gl";
import type { Drone } from "../utils/droneTypesData";
import { getDroneStatusColor } from "../utils/getDroneStatusColor";
import "../assets/styles/DroneMarker.css";

export default function DroneMarker({
  drone,
  onClick,
}: {
  drone: Drone;
  onClick: () => void;
}) {
  return (
    <Marker
      key={drone.registration}
      latitude={drone.lat}
      longitude={drone.lon}
      anchor="center"
    >
      <div
        className="drone-marker"
        onClick={onClick}
        style={{
          transform: `rotate(${drone.yaw}deg)`,
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <div
          className="drone-circle"
          style={{
            borderColor: getDroneStatusColor(drone.registration),
            backgroundColor: "#111",
          }}
        >
          <img
            src="./src/assets/Icon/drone.svg"
            alt="drone"
            className="drone-icon"
          />
        </div>
        <div
          className="drone-arrow"
          style={{
            borderTopColor: getDroneStatusColor(drone.registration),
          }}
        />
      </div>
    </Marker>
  );
}
