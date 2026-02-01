"use client";
import { useSocket } from "@/redux/SocketContext";

export const SocketDebug = () => {
  const { socket, isConnected } = useSocket();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        backgroundColor: isConnected ? "green" : "red",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 9999,
      }}>
      <div>Socket: {socket?.id ? "✅ Connected" : "❌ Disconnected"}</div>
      <div>ID: {socket?.id || "None"}</div>
      <div>Status: {isConnected ? "🟢 Online" : "🔴 Offline"}</div>
    </div>
  );
};
