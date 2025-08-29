import { useState, useEffect } from "react";
import { useWebSocket } from "./useDroneWebSocket.ts";
import { transformGeoJSONToDrones } from "../utils/dataTransform";
import type { Drone } from "../utils/droneTypesData";

/**
 * Calculate the yaw (rotation angle) in degrees
 * between two geographic coordinates.
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
 * Custom hook to manage and track drone data.
 * Listens to WebSocket messages, transforms incoming data,
 * updates the drone list with history and yaw calculation,
 * and supports external reload via reloadKey.
 *
 * @param reloadKey - A number used to trigger a reset of the drone data.
 * @returns An array of Drone objects with updated paths and yaw.
 */
export function useDronesData(reloadKey: number) {
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

            const hasMoved =
              !lastCoord ||
              Math.abs(lastCoord[0] - newCoord[0]) > 1e-6 ||
              Math.abs(lastCoord[1] - newCoord[1]) > 1e-6;

            const newPath = hasMoved
              ? [...(oldDrone.path ?? []), newCoord]
              : oldDrone.path ?? [];

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
            // New drone entry
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

  // When reloadKey changes, reset the drone list
  useEffect(() => {
    setDrones([]);
  }, [reloadKey]);

  return drones;
}
