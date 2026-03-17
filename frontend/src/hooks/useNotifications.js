import { useEffect } from "react";
import { connectNotifications } from "../services/socket";

export default function useNotifications(email, onMessage) {
  useEffect(() => {
    if (!email) return undefined;
    const client = connectNotifications(onMessage);
    return () => client.deactivate();
  }, [email, onMessage]);
}
