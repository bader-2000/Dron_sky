import { Popup } from "react-map-gl";
import type { Drone } from "../utils/droneTypesData";
import "../assets/styles/DronePopup.css";
export default function DronePopup({
  drone,
  onClose,
}: {
  drone: Drone;
  onClose: () => void;
}) {
  return (
    <Popup
      latitude={drone.lat}
      longitude={drone.lon}
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
      offset={30}
    >
      <div className="popup-content">
        <h4>{drone.name}</h4>
        <div className="popup-row">
          <div className="popup-column">
            <p>Altitude</p>
            <p>{drone.altitude.toFixed(1)} m</p>
          </div>
          <div>
            <p>Flight Time</p>
            <p>{drone.flightTime ?? "00:00:00"}</p>
          </div>
        </div>
      </div>
    </Popup>
  );
}
