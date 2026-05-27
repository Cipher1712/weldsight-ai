import { create } from "zustand";
import type {
  AnomalyEvent,
  ConnectionState,
  MetricsBlock,
  TelemetryPacket,
  WebSocketState,
} from "@/api/types";
import { computePhysicsFeatures, type PhysicsFeatures } from "@/api/physics";

const MAX_SAMPLES = 500;

export interface LiveSample {
  t: number;       // wall-clock ms
  i: number;       // current  (A)
  v: number;       // voltage  (V)
  p: number;       // instantaneous power V·I (W)
}

interface LiveStore {
  // ── streams ────────────────────────────────────────────────
  samples: LiveSample[];
  lastPacketAt: number | null;

  // ── derived / analytics ────────────────────────────────────
  metrics: MetricsBlock | null;
  physics: PhysicsFeatures | null;
  anomalies: AnomalyEvent[];

  // ── connection ─────────────────────────────────────────────
  ws: WebSocketState;

  // ── actions (used by service layer only) ───────────────────
  _ingestPacket: (pkt: TelemetryPacket) => void;
  _setMetrics: (m: MetricsBlock) => void;
  _setAnomalies: (a: AnomalyEvent[]) => void;
  _setWs: (patch: Partial<WebSocketState>) => void;
  _setConnState: (s: ConnectionState) => void;
  reset: () => void;
}

const initialWs: WebSocketState = {
  state: "idle",
  url: null,
  attempts: 0,
  lastMessageAt: null,
  packetCount: 0,
  packetsPerSec: 0,
  latencyMs: null,
  error: null,
};

export const useLiveStore = create<LiveStore>((set, get) => ({
  samples: [],
  lastPacketAt: null,
  metrics: null,
  physics: null,
  anomalies: [],
  ws: initialWs,

  _ingestPacket: (pkt) => {
    const frame = pkt?.telemetry;
    if (!frame || !Array.isArray(frame.current) || !Array.isArray(frame.voltage)) return;
    const ts = frame.timestamp ?? [];
    const cur = frame.current;
    const vol = frame.voltage;
    const n = Math.min(cur.length, vol.length);
    if (n === 0) return;

    const prev = get().samples;
    const next: LiveSample[] = prev.length > MAX_SAMPLES * 2
      ? prev.slice(-MAX_SAMPLES)
      : prev.slice();

    for (let k = 0; k < n; k++) {
      const tIso = ts[k];
      const t = tIso ? Date.parse(tIso) : Date.now() + k;
      const i = cur[k];
      const v = vol[k];
      next.push({ t, i, v, p: i * v });
    }
    if (next.length > MAX_SAMPLES) next.splice(0, next.length - MAX_SAMPLES);

    const last = next.slice(-Math.min(256, next.length));
    const physics = computePhysicsFeatures(
      last.map((s) => s.i),
      last.map((s) => s.v)
    );

    const nowMs = Date.now();
    const ws = get().ws;
    const dt = ws.lastMessageAt ? Math.max(1, nowMs - ws.lastMessageAt) : 1000;
    const pps = Math.round((n / dt) * 1000);

    set({
      samples: next,
      lastPacketAt: nowMs,
      physics,
      ws: {
        ...ws,
        packetCount: ws.packetCount + 1,
        packetsPerSec: pps,
        lastMessageAt: nowMs,
      },
    });
  },

  _setMetrics: (m) => set({ metrics: m }),
  _setAnomalies: (a) => set({ anomalies: a }),
  _setWs: (patch) => set({ ws: { ...get().ws, ...patch } }),
  _setConnState: (s) => set({ ws: { ...get().ws, state: s } }),

  reset: () =>
    set({
      samples: [],
      lastPacketAt: null,
      metrics: null,
      physics: null,
      anomalies: [],
      ws: initialWs,
    }),
}));

// ── selectors ────────────────────────────────────────────────
export const selectSamples = (s: LiveStore) => s.samples;
export const selectPhysics = (s: LiveStore) => s.physics;
export const selectMetrics = (s: LiveStore) => s.metrics;
export const selectAnomalies = (s: LiveStore) => s.anomalies;
export const selectWs = (s: LiveStore) => s.ws;
