import React from "react";
import "../assets/styles/DronePanel.css";
import type { Drone } from "../utils/droneTypesData";

interface Props {
  drones: Drone[];
  selectedDroneId: string | null;
  handleListClick: (drone: Drone) => void;
  getDroneStatusColor: (reg: string) => "green" | "red";
  onClose: () => void;
}

const DronePanel: React.FC<Props> = ({
  drones,
  selectedDroneId,
  handleListClick,
  getDroneStatusColor,
  onClose,
}) => {
  return (
    <div className="drones-panel">
      <div className="panel-header">
        <h3>DRONE FLYING</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="tabs">
        <span className="active-tab">Drones</span>
        <span>Flights History</span>
      </div>

      <ul className="drone-list">
        {drones.map((drone) => (
          <li
            key={drone.registration}
            className={`drone-item ${
              selectedDroneId === drone.registration ? "active" : ""
            }`}
            onClick={() => handleListClick(drone)}
          >
            <h4>{drone.name}</h4>

            <div className="row-block">
              <div className="detail-block">
                <label>Serial #</label>
                <span>{drone.serial}</span>
              </div>

              <div className="detail-block status-cell">
                <label>Registration #</label>
                <span>
                  {drone.registration}
                  <span
                    className={`status-dot ${getDroneStatusColor(
                      drone.registration
                    )}`}
                  />
                </span>
              </div>
            </div>

            <div className="row-block">
              <div className="detail-block">
                <label>Pilot</label>
                <span>{drone.pilot}</span>
              </div>

              <div className="detail-block">
                <label>Organization</label>
                <span>{drone.organization}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DronePanel;
