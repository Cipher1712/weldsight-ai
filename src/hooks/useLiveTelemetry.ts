import { useEffect } from "react";
import { connectTelemetry, disconnectTelemetry } from "@/services/telemetry";

let mountCount = 0;

/**
 * Bootstraps the singleton telemetry connection. Safe to call from many
 * components — the underlying service is reference-counted so the websocket
 * is only torn down when the last consumer unmounts.
 */
export function useLiveTelemetry() {
  useEffect(() => {
    mountCount++;
    connectTelemetry();
    return () => {
      mountCount = Math.max(0, mountCount - 1);
      if (mountCount === 0) disconnectTelemetry();
    };
  }, []);
}
