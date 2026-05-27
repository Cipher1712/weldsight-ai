// Singleton telemetry transport.
//
// Strategy:
//   1. Try to upgrade to WebSocket on a list of candidate paths.
//   2. If every candidate is rejected, fall back to REST polling so the
//      dashboards stay live regardless of edge-proxy WS support.
//   3. Periodically refresh /api/metrics + /api/anomalies in parallel.
//
// The service writes directly into the zustand live-store.

import {
  ANOMALY_POLL_INTERVAL_MS,
  METRICS_POLL_INTERVAL_MS,
  TELEMETRY_POLL_INTERVAL_MS,
  WS_BASE_URL,
  WS_CANDIDATE_PATHS,
} from "@/config/api";
import {
  getRealisticTelemetry,
  startStream,
} from "@/api/telemetry";
import { getMetrics } from "@/api/metrics";
import { getAnomalies } from "@/api/anomalies";
import { useLiveStore } from "@/store/liveStore";
import type { TelemetryPacket } from "@/api/types";

type Timer = ReturnType<typeof setInterval>;

class TelemetryService {
  private ws: WebSocket | null = null;
  private candidateIdx = 0;
  private wsAttempts = 0;
  private telemetryTimer: Timer | null = null;
  private metricsTimer: Timer | null = null;
  private anomalyTimer: Timer | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private started = false;
  private stopped = false;

  connect() {
    if (this.started) return;
    this.started = true;
    this.stopped = false;
    // Kick the server-side broadcaster (idempotent, ignore failures).
    startStream().catch(() => {});
    this.startMetricsPolling();
    this.startAnomalyPolling();
    this.tryWebSocket();
    // Always start polling immediately too — provides instant data while
    // the WS handshake is in flight. Polling stops as soon as a WS frame
    // arrives.
    this.startTelemetryPolling();
  }

  disconnect() {
    this.stopped = true;
    this.started = false;
    if (this.ws) {
      try { this.ws.close(); } catch { /* noop */ }
      this.ws = null;
    }
    if (this.telemetryTimer) clearInterval(this.telemetryTimer);
    if (this.metricsTimer) clearInterval(this.metricsTimer);
    if (this.anomalyTimer) clearInterval(this.anomalyTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.telemetryTimer = this.metricsTimer = this.anomalyTimer = null;
    this.reconnectTimer = null;
    useLiveStore.getState()._setConnState("disconnected");
  }

  // ───────────────────────── WebSocket ─────────────────────────
  private tryWebSocket() {
    if (this.stopped) return;
    if (this.candidateIdx >= WS_CANDIDATE_PATHS.length) {
      // Exhausted candidates — stay on REST polling.
      useLiveStore.getState()._setWs({
        state: "polling",
        url: null,
        error: "WebSocket upgrade not available · REST polling active",
      });
      return;
    }
    const path = WS_CANDIDATE_PATHS[this.candidateIdx];
    const url = `${WS_BASE_URL}${path}`;
    useLiveStore.getState()._setWs({
      state: this.wsAttempts === 0 ? "connecting" : "reconnecting",
      url,
      attempts: ++this.wsAttempts,
      error: null,
    });

    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch (e) {
      this.advanceCandidate(String((e as Error)?.message ?? e));
      return;
    }
    this.ws = ws;

    const failTimer = setTimeout(() => {
      try { ws.close(); } catch { /* noop */ }
    }, 4000);

    ws.onopen = () => {
      clearTimeout(failTimer);
      useLiveStore.getState()._setWs({
        state: "connected",
        url,
        error: null,
      });
      // Stop the redundant REST polling for telemetry once WS is live.
      if (this.telemetryTimer) {
        clearInterval(this.telemetryTimer);
        this.telemetryTimer = null;
      }
    };

    ws.onmessage = (evt) => {
      try {
        const data = typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
        this.routeMessage(data);
      } catch {
        /* ignore malformed packet */
      }
    };

    ws.onerror = () => {
      // onerror fires before onclose; let onclose handle reconnection.
    };

    ws.onclose = () => {
      clearTimeout(failTimer);
      if (this.stopped) return;
      // If we never got a frame on this candidate, try the next.
      const { lastMessageAt } = useLiveStore.getState().ws;
      if (!lastMessageAt) {
        this.advanceCandidate("WS handshake rejected");
      } else {
        // We were connected before; attempt reconnect with backoff.
        useLiveStore.getState()._setWs({
          state: "reconnecting",
          error: "connection dropped",
        });
        this.scheduleReconnect();
      }
    };
  }

  private advanceCandidate(err: string) {
    this.candidateIdx++;
    useLiveStore.getState()._setWs({ error: err });
    if (this.candidateIdx < WS_CANDIDATE_PATHS.length) {
      this.reconnectTimer = setTimeout(() => this.tryWebSocket(), 250);
    } else {
      useLiveStore.getState()._setWs({
        state: "polling",
        url: null,
        error: "WebSocket upgrade not available · REST polling active",
      });
      // Ensure polling is on.
      this.startTelemetryPolling();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const backoff = Math.min(15000, 1000 * Math.pow(1.6, this.wsAttempts));
    this.reconnectTimer = setTimeout(() => {
      this.candidateIdx = 0;
      this.tryWebSocket();
    }, backoff);
  }

  private routeMessage(data: unknown) {
    if (!data || typeof data !== "object") return;
    const d = data as Record<string, unknown>;
    // The backend may emit either a TelemetryPacket-shaped message, a
    // wrapped {type, payload} envelope, or a metrics/anomaly update.
    if ("telemetry" in d) {
      useLiveStore.getState()._ingestPacket(d as unknown as TelemetryPacket);
      return;
    }
    if (d.type === "telemetry" && d.payload) {
      useLiveStore.getState()._ingestPacket(d.payload as TelemetryPacket);
      return;
    }
    if (d.type === "metrics" && d.payload && typeof d.payload === "object") {
      const p = d.payload as { metrics?: Record<string, number> };
      if (p.metrics) useLiveStore.getState()._setMetrics(p.metrics as never);
      return;
    }
    if (d.type === "anomaly" && d.payload) {
      const p = d.payload as { recent_anomalies?: unknown[] };
      if (Array.isArray(p.recent_anomalies)) {
        useLiveStore.getState()._setAnomalies(p.recent_anomalies as never);
      }
    }
  }

  // ───────────────────────── REST polling ─────────────────────────
  private startTelemetryPolling() {
    if (this.telemetryTimer) return;
    const tick = async () => {
      try {
        const pkt = await getRealisticTelemetry();
        useLiveStore.getState()._ingestPacket(pkt);
        const ws = useLiveStore.getState().ws;
        if (ws.state !== "connected") {
          useLiveStore.getState()._setWs({ state: "polling", error: null });
        }
      } catch (e) {
        useLiveStore.getState()._setWs({
          state: "error",
          error: (e as Error)?.message ?? "telemetry fetch failed",
        });
      }
    };
    tick();
    this.telemetryTimer = setInterval(tick, TELEMETRY_POLL_INTERVAL_MS);
  }

  private startMetricsPolling() {
    if (this.metricsTimer) return;
    const tick = async () => {
      try {
        const res = await getMetrics();
        if (res?.metrics) useLiveStore.getState()._setMetrics(res.metrics);
      } catch { /* swallow */ }
    };
    tick();
    this.metricsTimer = setInterval(tick, METRICS_POLL_INTERVAL_MS);
  }

  private startAnomalyPolling() {
    if (this.anomalyTimer) return;
    const tick = async () => {
      try {
        const res = await getAnomalies();
        if (res?.recent_anomalies) useLiveStore.getState()._setAnomalies(res.recent_anomalies);
      } catch { /* swallow */ }
    };
    tick();
    this.anomalyTimer = setInterval(tick, ANOMALY_POLL_INTERVAL_MS);
  }
}

export const telemetryService = new TelemetryService();

export const connectTelemetry = () => telemetryService.connect();
export const disconnectTelemetry = () => telemetryService.disconnect();
