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
import "../assets/styles/TogglePanelButton.css";

export default function MapPage() {
  // State to keep the list of drones
  const [drones, setDrones] = useState<Drone[]>([]);

  // State to track which drone is selected by registration number
  const [selectedDroneReg, setSelectedDroneReg] = useState<string | null>(null);

  // Control whether the drone panel is visible or hidden
  const [showPanel, setShowPanel] = useState(true);

  // State to control map viewport (position, zoom, bearing, pitch)
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 31.9896,
    longitude: 35.887,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  // Mapbox token from environment variables
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  // Use WebSocket hook to receive live drone data
  useWebSocket({
    onMessage: (rawData) => {
      // Transform incoming GeoJSON data to Drone objects
      const newDrones = transformGeoJSONToDrones(rawData);

      setDrones((prev) => {
        const updatedList = [...prev];
        const now = Date.now();

        for (const newDrone of newDrones) {
          // Find if drone already exists in the list by registration
          const index = updatedList.findIndex(
            (d) => d.registration === newDrone.registration
          );
          const newCoord: [number, number] = [newDrone.lon, newDrone.lat];

          if (index !== -1) {
            // If drone exists, update its path and other data
            const oldDrone = updatedList[index];
            const lastCoord = oldDrone.path?.[oldDrone.path.length - 1];

            // Check if drone has moved significantly
            const hasMoved =
              !lastCoord ||
              Math.abs(lastCoord[0] - newCoord[0]) > 0.000001 ||
              Math.abs(lastCoord[1] - newCoord[1]) > 0.000001;

            // Update path only if drone moved
            const newPath = hasMoved
              ? [...(oldDrone.path || []), newCoord]
              : oldDrone.path || [];

            // Calculate yaw (orientation) based on last movement vector
            let calculatedYaw = oldDrone.yaw;
            if (lastCoord) {
              const deltaX = newCoord[0] - lastCoord[0];
              const deltaY = newCoord[1] - lastCoord[1];
              const yawRad = Math.atan2(deltaY, deltaX);
              calculatedYaw = (yawRad * (180 / Math.PI) + 360) % 360;
            }

            // If startTime is missing, set it now as flight start time
            const startTime = oldDrone.startTime ?? now;

            // Calculate elapsed flight time in seconds
            const elapsedSeconds = Math.floor((now - startTime) / 1000);

            // Convert seconds to HH:MM:SS format
            const flightTime = new Date(elapsedSeconds * 1000)
              .toISOString()
              .substr(11, 8);

            // Update the drone in the list
            updatedList[index] = {
              ...oldDrone,
              ...newDrone,
              registration: newDrone.registration,
              path: newPath,
              yaw: calculatedYaw,
              startTime,
              flightTime,
            };
          } else {
            // New drone: add it with initial data
            updatedList.push({
              ...newDrone,
              registration: newDrone.registration,
              path: [newCoord],
              yaw: newDrone.yaw || 0,
              startTime: now,
              flightTime: "00:00:00",
            });
          }
        }

        return updatedList;
      });
    },
  });

  // Find the currently selected drone from the drones list
  const selectedDrone = drones.find((d) => d.registration === selectedDroneReg);

  // Handle clicking a drone in the panel: select it and center map on it
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
      {/* Toggle button to show panel if hidden */}
      {!showPanel && (
        <button
          className="toggle-panel-arrow"
          onClick={() => setShowPanel(true)}
          aria-label="Show Drone Panel"
        >
          →
        </button>
      )}

      {/* Drone info panel */}
      {showPanel && (
        <DronePanel
          drones={drones}
          selectedDroneId={selectedDroneReg}
          handleListClick={handleListClick}
          getDroneStatusColor={getDroneStatusColor}
          onClose={() => setShowPanel(false)}
        />
      )}

      {/* Map component with current viewState */}
      <ReactMapGL
        {...viewState}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(evt) => setViewState(evt.viewState)} // Update view state on user interaction
      >
        {/* Render path and marker for each drone */}
        {drones.map((drone) => (
          <React.Fragment key={drone.registration}>
            <DronePath drone={drone} />
            <DroneMarker
              drone={drone}
              onClick={() => setSelectedDroneReg(drone.registration)}
            />
          </React.Fragment>
        ))}

        {/* Show popup with drone info if a drone is selected */}
        {selectedDrone && (
          <DronePopup
            drone={selectedDrone}
            onClose={() => setSelectedDroneReg(null)}
          />
        )}
      </ReactMapGL>

      {/* Counter showing number of drones with red status */}
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
