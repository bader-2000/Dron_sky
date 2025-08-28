// DroneTypesData.ts

export interface Drone {
  registration: string;
  serial: string;
  name: string;
  pilot: string;
  organization: string;
  lat: number;
  lon: number;
  yaw: number;
  altitude: number;
  flightTime: string;
  path: number[][];
}
