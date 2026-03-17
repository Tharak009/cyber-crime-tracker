import { Client } from "@stomp/stompjs";
import { API_BASE_URL } from "./api";

const socketBaseUrl = API_BASE_URL.replace(/^http/i, "ws");

export function connectNotifications(onMessage) {
  const token = localStorage.getItem("token");
  const client = new Client({
    brokerURL: `${socketBaseUrl}/ws`,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    debug: (message) => {
      if (import.meta.env.DEV) {
        console.debug("[stomp]", message);
      }
    }
  });

  client.onConnect = () => {
    client.subscribe("/user/queue/notifications", (message) => {
      onMessage(JSON.parse(message.body));
    });
  };

  client.onStompError = (frame) => {
    console.error("STOMP error", frame.headers?.message, frame.body);
  };

  client.onWebSocketError = (event) => {
    console.error("WebSocket error", event);
  };

  client.activate();
  return client;
}
