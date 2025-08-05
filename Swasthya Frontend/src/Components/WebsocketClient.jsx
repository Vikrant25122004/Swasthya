// websocketClient.js
import SockJS from 'sockjs-client';

import { Client } from '@stomp/stompjs';

let stompClient = null;
export const connectWebSocket = (email, onMessageReceived, onConnectSuccess, onError) => {
  const sock = new SockJS('http://localhost:8080/signal');
  const stompClient = new Client({
    webSocketFactory: () => sock,
    connectHeaders: {},
    debug: (str) => console.log('[STOMP DEBUG]', str),
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    if (email) {
      stompClient.subscribe(`/topic/${email}`, (message) => {
        if (message.body) {
          onMessageReceived(JSON.parse(message.body));
        }
      });
    }
    onConnectSuccess && onConnectSuccess();
  };

  stompClient.onStompError = (frame) => {
    onError && onError(frame);
  };

  stompClient.activate();
  return stompClient;
};
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
