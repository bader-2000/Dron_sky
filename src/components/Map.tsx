import React, { useState } from "react";
import ReactMapGL from "react-map-gl";
import type { ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useWebSocket } from "../hooks/useDroneWebSocket.ts";
import { transformGeoJSONToDrones } from "../utils/dataTransform";
import { getDroneStatusColor } from "../utils/getDroneStatusColor";
import type { Drone } from "../utils/droneTypesData";

import DronePanel from "./DronePanel";
import DroneMarker from "../components/DroneMarker";
import DronePath from "../components/DronePath";
import DronePopup from "../components/DronePopup";

import "../assets/styles/Map.css";

export default function MapPage() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [selectedDroneReg, setSelectedDroneReg] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(true);

  const [viewState, setViewState] = useState<ViewState>({
    latitude: 31.9896,
    longitude: 35.887,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  // Handle live WebSocket updates
  useWebSocket({
    onMessage: (rawData) => {
      const newDrones = transformGeoJSONToDrones(rawData);

      setDrones((prev) => {
        const updatedList = [...prev];

        for (const newDrone of newDrones) {
          const index = updatedList.findIndex(
            (d) => d.registration === newDrone.registration
          );
          const newCoord: [number, number] = [newDrone.lon, newDrone.lat];

          if (index !== -1) {
            const oldDrone = updatedList[index];
            const lastCoord = oldDrone.path?.[oldDrone.path.length - 1];

            const hasMoved =
              !lastCoord ||
              Math.abs(lastCoord[0] - newCoord[0]) > 0.000001 ||
              Math.abs(lastCoord[1] - newCoord[1]) > 0.000001;

            const newPath = hasMoved
              ? [...(oldDrone.path || []), newCoord]
              : oldDrone.path || [];

            let calculatedYaw = oldDrone.yaw;
            if (lastCoord) {
              const deltaX = newCoord[0] - lastCoord[0];
              const deltaY = newCoord[1] - lastCoord[1];
              const yawRad = Math.atan2(deltaY, deltaX);
              calculatedYaw = (yawRad * (180 / Math.PI) + 360) % 360;
            }

            updatedList[index] = {
              ...oldDrone,
              ...newDrone,
              registration: newDrone.registration,
              path: newPath,
              yaw: calculatedYaw,
            };
          } else {
            updatedList.push({
              ...newDrone,
              registration: newDrone.registration,
              path: [newCoord],
              yaw: newDrone.yaw || 0,
            });
          }
        }

        return updatedList;
      });
    },
  });

  const selectedDrone = drones.find((d) => d.registration === selectedDroneReg);

  const handleListClick = (drone: Drone) => {
    setSelectedDroneReg(drone.registration);
    setViewState({
      ...viewState,
      latitude: drone.lat,
      longitude: drone.lon,
      zoom: 14,
    });
  };

  return (
    <div className="map-container">
      {!showPanel && (
        <button
          className="toggle-panel-arrow"
          onClick={() => setShowPanel(true)}
          aria-label="Show Drone Panel"
        >
          →
        </button>
      )}

      {showPanel && (
        <DronePanel
          drones={drones}
          selectedDroneId={selectedDroneReg}
          handleListClick={handleListClick}
          getDroneStatusColor={getDroneStatusColor}
          onClose={() => setShowPanel(false)}
        />
      )}

      <ReactMapGL
        {...viewState}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {drones.map((drone) => (
          <React.Fragment key={drone.registration}>
            <DronePath drone={drone} />
            <DroneMarker
              drone={drone}
              onClick={() => setSelectedDroneReg(drone.registration)}
            />
          </React.Fragment>
        ))}

        {selectedDrone && (
          <DronePopup
            drone={selectedDrone}
            onClose={() => setSelectedDroneReg(null)}
          />
        )}
      </ReactMapGL>

      <div
        className="counter"
        style={{ position: "absolute", bottom: 10, right: 10 }}
      >
        Red Drones:{" "}
        {
          drones.filter((d) => getDroneStatusColor(d.registration) === "red")
            .length
        }
      </div>
    </div>
  );
}
