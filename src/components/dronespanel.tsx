// src/components/drone/DronePanel.tsx

import React from "react";
import "./DronePanel.css";

interface Drone {
  id: string;
  name: string;
  registration: string;
}

interface Props {
  drones: Drone[];
  selectedDroneId: number;
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
            key={drone.id}
            className={`drone-item ${
              selectedDroneId === drone.id ? "active" : ""
            }`}
            onClick={() => handleListClick(drone)}
          >
            <h4>{drone.name}</h4>

            <div className="details-grid">
              <div className="detail-block">
                <label>Serial #</label>
                <span>{drone.id}</span>
              </div>

              <div className="detail-block status-cell">
                <label>Registration #</label>
                <span>
                  {drone.registration}
                  <span
                    className={`status-dot ${getDroneStatusColor(
                      drone.registration
                    )}`}
                  ></span>
                </span>
              </div>

              <div className="detail-block">
                <label>Pilot</label>
                <span>Basem Hamad</span>
              </div>

              <div className="detail-block">
                <label>Organization</label>
                <span>Sager Drone</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DronePanel;
