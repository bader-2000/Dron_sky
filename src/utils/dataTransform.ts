import type { Drone } from "./droneTypesData";

export function transformGeoJSONToDrones(data: any): Drone[] {
  if (!data || !Array.isArray(data.features)) return [];

  return data.features
    .filter((feature: any) => {
      return (
        feature.geometry?.type === "Point" &&
        Array.isArray(feature.geometry.coordinates) &&
        feature.geometry.coordinates.length === 2
      );
    })
    .map((feature: any) => {
      const coords = feature.geometry.coordinates;
      const props = feature.properties || {};

      return {
        registration: props.registration || "N/A",
        serial: props.serial || "",
        name: props.Name || "Unknown",
        pilot: props.pilot || "Unknown",
        organization: props.organization || "Unknown",
        lat: Number(coords[1]) || 0,
        lon: Number(coords[0]) || 0,
        yaw: Number(props.yaw) || 0,
        altitude: Number(props.altitude) || 0,
        flightTime: "00:00",
        path: [],
      };
    });
}
