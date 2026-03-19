import { WebSocketServer, WebSocket } from 'ws';
import { IStorage } from './storage';
import { createSecurityLog } from './security';

interface Client {
  socket: WebSocket;
  isAlive: boolean;
  userId?: number;
  role?: string;
}

export function setupWebSocketServer(wss: WebSocketServer, storage: IStorage) {
  const clients = new Map<WebSocket, Client>();
  
  // Handle new connection
  wss.on('connection', (socket, request) => {
    console.log('WebSocket client connected');
    
    // Add client to tracking
    clients.set(socket, { socket, isAlive: true });
    
    // Ping to check if client is alive
    socket.on('pong', () => {
      const client = clients.get(socket);
      if (client) {
        client.isAlive = true;
      }
    });
    
    // Handle messages from client
    socket.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === 'USER_LOGIN') {
          const client = clients.get(socket);
          if (client) {
            client.userId = data.userId;
            client.role = data.role;
          }
        }
        else if (data.type === 'USER_LOGOUT') {
          const client = clients.get(socket);
          if (client) {
            client.userId = undefined;
            client.role = undefined;
          }
        }
        else if (data.type === 'VERIFICATION_STEP') {
          if (data.status === 'failed') {
            // Log verification failure
            await createSecurityLog({
              event: `Verification step ${data.step} failed`,
              category: 'Verification',
              severity: 'Warning',
              details: {
                step: data.step,
                reason: data.reason || 'Unknown error'
              },
              ipAddress: request.socket.remoteAddress || 'unknown'
            }, storage);
          }
        }
        
        // Log other important events as needed
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
    
    // Handle client disconnect
    socket.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(socket);
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(socket);
    });
  });
  
  // Set up interval to check for dead connections
  const interval = setInterval(() => {
    for (const [socket, client] of clients.entries()) {
      if (!client.isAlive) {
        socket.terminate();
        clients.delete(socket);
        continue;
      }
      
      client.isAlive = false;
      socket.ping();
    }
  }, 30000);
  
  // Clean up on server close
  wss.on('close', () => {
    clearInterval(interval);
  });
  
  // Broadcast security events to admin clients
  const broadcastSecurityEvent = (event: any) => {
    for (const client of clients.values()) {
      if (client.role === 'admin' && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify({
          type: 'SECURITY_LOG',
          log: event
        }));
      }
    }
  };
  
  // Broadcast security alert to all clients
  const broadcastSecurityAlert = (severity: 'warning' | 'critical', message: string) => {
    for (const client of clients.values()) {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify({
          type: 'SECURITY_ALERT',
          severity,
          message
        }));
      }
    }
  };
  
  // Make broadcasting functions available
  wss.broadcastSecurityEvent = broadcastSecurityEvent;
  wss.broadcastSecurityAlert = broadcastSecurityAlert;
  
  return wss;
}

// Add properties to WebSocketServer type
declare module 'ws' {
  interface WebSocketServer {
    broadcastSecurityEvent: (event: any) => void;
    broadcastSecurityAlert: (severity: 'warning' | 'critical', message: string) => void;
  }
}
