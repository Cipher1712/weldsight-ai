import { apiGet } from "./client";
import type { TelemetryPacket } from "./types";

export const getReplayProfile = () =>
  apiGet<TelemetryPacket>("/api/replay/profile");

export const getProfiles = () =>
  apiGet<{ profiles: Array<Record<string, unknown>> }>("/api/profiles");

export const getProfile = (id: string) =>
  apiGet<Record<string, unknown>>(`/api/profiles/${encodeURIComponent(id)}`);

export const getThresholds = () =>
  apiGet<{ success: boolean; thresholds?: Record<string, number>; error?: string }>(
    "/api/thresholds"
  );

export const getScenarios = () =>
  apiGet<{ scenarios: Array<Record<string, unknown>> }>("/api/telemetry/scenarios");
