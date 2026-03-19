import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createWebSocketConnection } from '@/lib/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: MessageEvent | null;
  send: (data: object | string) => boolean;
}

// Create WebSocket context
const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
  send: () => false
});

// WebSocket provider component
export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [wsConnection] = useState(createWebSocketConnection());

  // Initialize WebSocket connection
  useEffect(() => {
    // Set up event handlers
    wsConnection.onOpen(() => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    wsConnection.onMessage((event) => {
      setLastMessage(event);
    });

    wsConnection.onError(() => {
      console.error('WebSocket error occurred');
    });

    wsConnection.onClose(() => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    // Establish connection
    wsConnection.connect();

    // Clean up on unmount
    return () => {
      wsConnection.disconnect();
    };
  }, [wsConnection]);

  // Send message helper
  const send = (data: object | string): boolean => {
    return wsConnection.send(data);
  };

  const contextValue: WebSocketContextType = {
    isConnected,
    lastMessage,
    send
  };

  return React.createElement(
    WebSocketContext.Provider,
    { value: contextValue },
    children
  );
}

// Custom hook to use the WebSocket context
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  
  return context;
}
