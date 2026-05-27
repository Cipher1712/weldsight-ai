import { apiGet } from "./client";
import type { MetricsPacket, ValidationResponse } from "./types";

export const getMetrics = () => apiGet<MetricsPacket>("/api/metrics");

export const getValidationStandards = () =>
  apiGet<ValidationResponse>("/api/validation/standards");
