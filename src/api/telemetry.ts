import { apiGet, apiPost } from "./client";
import type {
  TelemetryPacket,
  RollingWindow,
  StreamStats,
  HealthResponse,
} from "./types";

export const getHealth = () => apiGet<HealthResponse>("/api/health");

export const getRealisticTelemetry = () =>
  apiGet<TelemetryPacket>("/api/telemetry/realistic");

export const getAnomalyTelemetry = () =>
  apiGet<TelemetryPacket>("/api/telemetry/anomaly");

export const getSignals = () => apiGet<TelemetryPacket>("/api/signals");

export const getRollingWindows = () =>
  apiGet<{ windows: RollingWindow[] }>("/api/rolling-windows");

export const getStreamStats = () => apiGet<StreamStats>("/api/stream/stats");

export const startStream = () =>
  apiPost<{ status: string; started_at: string; broadcast_interval: number }>(
    "/api/stream/start"
  );

export const stopStream = () => apiPost<{ status: string }>("/api/stream/stop");
