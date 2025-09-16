"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket } from '@/lib/socket-service';
import { authService } from '@/lib/auth-service';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // We need to be on the client side to check for auth and use localStorage
    if (typeof window !== 'undefined') {
      const auth = authService.checkAuthStatus();

      if (auth.isAuthenticated) {
        const socketInstance = initializeSocket();
        if (socketInstance) {
          setSocket(socketInstance);
          setIsConnected(socketInstance.connected);

          const onConnect = () => setIsConnected(true);
          const onDisconnect = () => setIsConnected(false);

          socketInstance.on('connect', onConnect);
          socketInstance.on('disconnect', onDisconnect);

          return () => {
            socketInstance.off('connect', onConnect);
            socketInstance.off('disconnect', onDisconnect);
            disconnectSocket();
          };
        }
      }
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
