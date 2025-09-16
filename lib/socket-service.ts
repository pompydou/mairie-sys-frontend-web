
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket | null => {
  // Prevent multiple connections
  if (socket) {
    return socket;
  }

  try {
    const tenantDataString = localStorage.getItem('tenantData');
    if (!tenantDataString) {
      console.log('No tenant data found in localStorage. Socket not initialized.');
      return null;
    }

    const tenantData = JSON.parse(tenantDataString);
    const tenantId = tenantData?.id;
    const tenantSlug = tenantData?.slug;

    if (!tenantId || !tenantSlug) {
      console.error('Tenant ID or slug is missing. Socket not initialized.');
      return null;
    }

    // The auth service uses http://localhost:3001/graphql. We'll assume the socket server is at the same base URL.
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/graphql', '') || 'http://localhost:3001';

    socket = io(socketUrl, {
      extraHeaders: {
        'X-Tenant-ID': tenantId,
      },
      autoConnect: false, // We will connect manually
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
      // Join the tenant room after connection
      socket?.emit('join-tenant', tenantSlug);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Manually connect
    socket.connect();

    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return null;
  }
};

export const getSocket = (): Socket | null => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
