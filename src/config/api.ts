// Central API + WS configuration for WeldSight AI frontend
// Override with VITE_API_BASE_URL / VITE_WS_URL in .env

const RAW_API = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  || "https://web-production-0d600.up.railway.app";

const RAW_WS = (import.meta.env.VITE_WS_URL as string | undefined)
  || "wss://web-production-0d600.up.railway.app";

export const API_BASE_URL = RAW_API.replace(/\/+$/, "");
export const WS_BASE_URL = RAW_WS.replace(/\/+$/, "");

// Polling interval (ms) used as a graceful fallback when the live WebSocket
// upgrade is rejected by the edge / not available.
export const TELEMETRY_POLL_INTERVAL_MS = 1000;
export const METRICS_POLL_INTERVAL_MS = 2500;
export const ANOMALY_POLL_INTERVAL_MS = 3500;

// Candidate WS paths — the deployed backend exposes one of these.
// The service iterates until one accepts the upgrade.
export const WS_CANDIDATE_PATHS = [
  "/ws/telemetry",
  "/ws/stream",
  "/api/ws/telemetry",
  "/api/stream/ws",
  "/ws",
];
