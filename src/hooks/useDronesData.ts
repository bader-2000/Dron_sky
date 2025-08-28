import { useState } from "react";
import { useWebSocket } from "./useDroneWebSocket.ts";
import { transformGeoJSONToDrones } from "../utils/dataTransform";
import type { Drone } from "../utils/droneTypesData";

/**
 * Calculate the yaw (rotation angle) in degrees
 * between two geographic coordinates.
 *
 * @param from - Starting coordinate [longitude, latitude]
 * @param to - Ending coordinate [longitude, latitude]
 * @returns Yaw angle in degrees (0-360)
 */
const calculateYaw = (from: [number, number], to: [number, number]): number => {
  const deltaX = to[0] - from[0];
  const deltaY = to[1] - from[1];
  const yawRad = Math.atan2(deltaY, deltaX);
  return (yawRad * (180 / Math.PI) + 360) % 360; // Convert radians to degrees and normalize
};

/**
 * Custom hook to manage drone data.
 * Listens to WebSocket messages, transforms data,
 * updates drones state with path history and calculates yaw.
 */
export function useDronesData() {
  const [drones, setDrones] = useState<Drone[]>([]);

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
            const lastCoord = oldDrone.path?.slice(-1)[0];

            // Check if the drone has actually moved significantly
            const hasMoved =
              !lastCoord ||
              Math.abs(lastCoord[0] - newCoord[0]) > 1e-6 ||
              Math.abs(lastCoord[1] - newCoord[1]) > 1e-6;

            // Update path only if moved
            const newPath = hasMoved
              ? [...(oldDrone.path ?? []), newCoord]
              : oldDrone.path ?? [];

            // Calculate new yaw based on movement direction
            let calculatedYaw = oldDrone.yaw;
            if (lastCoord) {
              calculatedYaw = calculateYaw(lastCoord, newCoord);
            }

            updatedList[index] = {
              ...oldDrone,
              ...newDrone,
              path: newPath,
              yaw: calculatedYaw,
            };
          } else {
            // New drone, initialize path and yaw (default to 0 if not provided)
            updatedList.push({
              ...newDrone,
              path: [newCoord],
              yaw: newDrone.yaw ?? 0,
            });
          }
        }

        return updatedList;
      });
    },
  });

  return drones;
}
