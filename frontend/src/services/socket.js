import { Client } from "@stomp/stompjs";
import { API_BASE_URL } from "./api";

function resolveSocketBaseUrl(baseUrl) {
  if (baseUrl.startsWith("https://")) {
    return baseUrl.replace(/^https/, "wss");
  }

  if (baseUrl.startsWith("http://")) {
    return baseUrl.replace(/^http/, "ws");
  }

  if (baseUrl.startsWith("/")) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}${baseUrl}`;
  }

  return baseUrl;
}

const socketBaseUrl = resolveSocketBaseUrl(API_BASE_URL);

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
