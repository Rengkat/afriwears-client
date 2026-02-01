"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

// Get token from cookies
const getTokenFromCookies = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "accessToken") {
        return value;
      }
    }
  }
  return null;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((store: RootState) => store.authSlice);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookies();
    const userId = user?._id;

    if (isAuthenticated && token && userId && !socketRef.current?.connected) {
      // Disconnect existing socket
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

      socketRef.current = io(socketUrl, {
        auth: { token },
        query: { userId },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current?.id);
        setIsConnected(true);

        // Join user room
        socketRef.current?.emit("join-room", userId);

        // Join admin room if admin
        if (user?.role === "admin") {
          socketRef.current?.emit("join-room", "admin_room");
          console.log("👑 Admin joined admin_room");
        }
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("⚠️ Socket connection error:", error.message);
        setIsConnected(false);
      });

      // Debug socket events
      socketRef.current.onAny((event, ...args) => {
        console.log(`📡 Socket event: ${event}`, args);
      });
    }

    // Cleanup on unmount or auth change
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, user?._id, user?.role]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
