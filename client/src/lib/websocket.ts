/**
 * Creates and manages a WebSocket connection
 */
export function createWebSocketConnection() {
  // Use correct protocol based on page protocol (ws for http, wss for https)
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY_MS = 3000;
  
  // Event callbacks
  let onOpenCallback: (() => void) | null = null;
  let onMessageCallback: ((event: MessageEvent) => void) | null = null;
  let onErrorCallback: ((event: Event) => void) | null = null;
  let onCloseCallback: ((event: CloseEvent) => void) | null = null;
  
  /**
   * Establishes the WebSocket connection
   */
  const connect = () => {
    try {
      socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts = 0;
        if (onOpenCallback) onOpenCallback();
      };
      
      socket.onmessage = (event) => {
        if (onMessageCallback) onMessageCallback(event);
      };
      
      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        if (onErrorCallback) onErrorCallback(event);
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        if (onCloseCallback) onCloseCallback(event);
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && event.code !== 1001) {
          attemptReconnect();
        }
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  };
  
  /**
   * Attempts to reconnect to the WebSocket server
   */
  const attemptReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log(`Maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached`);
      return;
    }
    
    reconnectAttempts++;
    
    console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
    setTimeout(() => {
      connect();
    }, RECONNECT_DELAY_MS);
  };
  
  /**
   * Sends a message through the WebSocket
   */
  const send = (data: string | object) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return false;
    }
    
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      socket.send(message);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };
  
  /**
   * Closes the WebSocket connection
   */
  const disconnect = () => {
    if (socket) {
      socket.close(1000, 'Closed by client');
    }
  };
  
  /**
   * Sets callback for connection open event
   */
  const onOpen = (callback: () => void) => {
    onOpenCallback = callback;
  };
  
  /**
   * Sets callback for message received event
   */
  const onMessage = (callback: (event: MessageEvent) => void) => {
    onMessageCallback = callback;
  };
  
  /**
   * Sets callback for error event
   */
  const onError = (callback: (event: Event) => void) => {
    onErrorCallback = callback;
  };
  
  /**
   * Sets callback for connection close event
   */
  const onClose = (callback: (event: CloseEvent) => void) => {
    onCloseCallback = callback;
  };
  
  /**
   * Returns the current WebSocket connection state
   */
  const getState = () => {
    if (!socket) return 'DISCONNECTED';
    
    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  };
  
  return {
    connect,
    send,
    disconnect,
    onOpen,
    onMessage,
    onError,
    onClose,
    getState
  };
}
