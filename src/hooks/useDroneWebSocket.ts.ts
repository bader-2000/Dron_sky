import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

type DroneData = {
  id: number;
  name: string;
  registration: string;
  lat: number;
  lon: number;
  yaw: number;
  altitude: number;
  flightTime: string;
};

type UseWebSocketProps = {
  onMessage: (data: DroneData) => void;
};

export function useWebSocket({ onMessage }: UseWebSocketProps) {
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:9013";

    const socket: Socket = io(socketUrl, {
      transports: ["polling"],
    });

    socket.on("connect", () => {
      console.log("Socket.IO Connected");
    });

    socket.on("message", (data: any) => {
      onMessage(data);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [onMessage]);
}
