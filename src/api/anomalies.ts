import { apiGet, apiPost } from "./client";
import type { AnomalyResponse, AnomalyEvent } from "./types";

export const getAnomalies = () => apiGet<AnomalyResponse>("/api/anomalies");

export const getAnomalyHistory = () =>
  apiGet<{ history: AnomalyEvent[] }>("/api/anomaly/history");

export interface LiveAnomalyRequest {
  current: number[];
  voltage: number[];
  timestamp?: string;
}

export const postLiveAnomaly = (payload: LiveAnomalyRequest) =>
  apiPost<AnomalyResponse>("/api/anomaly/live", payload);
