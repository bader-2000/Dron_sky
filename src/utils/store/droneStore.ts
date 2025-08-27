import { create } from "zustand";

export interface Drone {
  id: string;
  registration: string;
  latitude: number;
  longitude: number;
  altitude: number;
  orientation: number;
  allowedToFly: boolean;
}

interface DroneStore {
  drones: Drone[];
  addDrone: (drone: Drone) => void;
  updateDrone: (drone: Drone) => void;
}

export const useDroneStore = create<DroneStore>((set) => ({
  drones: [],
  addDrone: (drone) => set((state) => ({ drones: [...state.drones, drone] })),
  updateDrone: (drone) =>
    set((state) => ({
      drones: state.drones.map((d) =>
        d.id === drone.id ? { ...d, ...drone } : d
      ),
    })),
}));

export interface Drone {
  id: string;
  name: string;
  registration: string;
}
