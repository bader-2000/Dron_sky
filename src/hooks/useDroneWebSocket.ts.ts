// useWebSocket.ts
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { Drone } from "../utils/droneTypesData";

type UseWebSocketProps = {
  onMessage: (data: Drone | Drone[]) => void;
};

export function useWebSocket({ onMessage }: UseWebSocketProps) {
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:9013";

    const socket: Socket = io(socketUrl, {
      transports: ["polling"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket.IO Connected");
    });

    socket.on("message", (data: any) => {
      console.log("ق WebSocket message received:", data);

      onMessage(data as Drone | Drone[]);
    });

    socket.on("disconnect", () => {
      console.log(" Socket.IO Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [onMessage]);
}
