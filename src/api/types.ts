// Strongly typed contracts mirroring the FastAPI backend at
// https://web-production-0d600.up.railway.app/docs

export type ConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "polling"     // REST fallback active
  | "disconnected"
  | "error";

export interface TelemetryFrame {
  // Wall-clock timestamps (ISO strings, ms resolution)
  timestamp: string[];
  current: number[];
  voltage: number[];
}

export interface TelemetryPacket {
  telemetry: TelemetryFrame;
  metadata?: Record<string, unknown>;
  sample_count?: number;
}

export interface MetricsBlock {
  current_rms: number;
  current_variance: number;
  current_std_dev: number;
  current_ripple_factor: number;
  current_energy: number;
  current_drift: number;
  voltage_rms: number;
  voltage_variance: number;
  voltage_std_dev: number;
  voltage_ripple_factor: number;
  voltage_energy: number;
  voltage_drift: number;
  current_stability_score: number;
  voltage_stability_score: number;
  arc_stability_index: number;
  process_quality_index: number;
}

export interface MetricsPacket {
  metrics: MetricsBlock;
  normalized_metrics?: Record<string, number>;
}

export type AnomalySeverity = "NORMAL" | "WARNING" | "CRITICAL" | string;

export interface AnomalyEvent {
  reconstruction_error: number;
  severity: AnomalySeverity;
  confidence: number;
  is_anomaly: boolean;
  timestamp: string | null;
  defect_class?: string;
  features?: Record<string, number>;
}

export interface AnomalyAnalysis {
  total_windows: number;
  normal_windows: number;
  warning_windows: number;
  critical_windows: number;
  overall_process_health: number;
}

export interface AnomalyResponse {
  analysis: AnomalyAnalysis;
  recent_anomalies: AnomalyEvent[];
  analyzed_at: string;
}

export interface RollingWindow {
  window_index: number;
  start_sample: number;
  end_sample: number;
  num_samples: number;
  current_rms: number;
  voltage_rms: number;
  stability_score: number;
}

export interface StreamStats {
  streaming_active: boolean;
  connection_stats: {
    active_connections: number;
    max_connections: number;
    connection_utilization: number;
    total_messages_sent: number;
    clients: Record<string, unknown>;
  };
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  platform: string;
  version: string;
  timestamp: string;
  services: Record<string, string>;
}

export interface ValidationResponse {
  process_type: string;
  timestamp: string;
  metrics_compliant: boolean;
  warnings: string[];
  errors: string[];
  compliance_score?: number;
}

export interface WebSocketState {
  state: ConnectionState;
  url: string | null;
  attempts: number;
  lastMessageAt: number | null;
  packetCount: number;
  packetsPerSec: number;
  latencyMs: number | null;
  error: string | null;
}
