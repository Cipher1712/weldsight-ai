// Realistic industrial telemetry simulation utilities
export type Severity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export function seededNoise(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function rollingWaveform(
  n: number,
  base: number,
  amp: number,
  freq: number,
  noise: number,
  t = 0,
  spikes: number[] = [],
) {
  const out: { i: number; v: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i + t) / n;
    let v = base + amp * Math.sin(2 * Math.PI * freq * x);
    v += (Math.random() - 0.5) * noise;
    if (spikes.includes(i)) v += amp * 1.8 * (Math.random() > 0.5 ? 1 : -1);
    out.push({ i, v });
  }
  return out;
}

export function sparkline(n = 24, base = 80, amp = 6, drift = 0) {
  return Array.from({ length: n }, (_, i) => ({
    i,
    v: base + Math.sin(i / 3) * amp + (Math.random() - 0.5) * 2 + drift * i * 0.05,
  }));
}

export const sevColor: Record<Severity, string> = {
  LOW: "var(--color-stable)",
  MODERATE: "var(--color-warn)",
  HIGH: "var(--color-high)",
  CRITICAL: "var(--color-critical)",
};
