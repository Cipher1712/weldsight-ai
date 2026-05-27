// Physics-feature derivations computed client-side from the live telemetry
// stream until the backend exposes dedicated /api/physics/* endpoints.
// All formulas mirror those documented in the Physics Signature module.

export interface PhysicsFeatures {
  rmsCurrent: number;
  rmsVoltage: number;
  rmsPower: number;
  heatInput: number;      // Q = V·I / v   (v normalized to unit travel speed)
  spectralEntropy: number;
  arcStability: number;   // 0–1
  shortCircuitRate: number;
  waveletEnergy: number;
}

const rms = (arr: number[]) => {
  if (!arr.length) return 0;
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i] * arr[i];
  return Math.sqrt(s / arr.length);
};

const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);

const variance = (arr: number[]) => {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += (arr[i] - m) ** 2;
  return s / arr.length;
};

// Naive spectral entropy using histogram-based probability distribution
const shannonEntropy = (arr: number[], bins = 24): number => {
  if (arr.length < 4) return 0;
  let lo = Infinity, hi = -Infinity;
  for (const v of arr) { if (v < lo) lo = v; if (v > hi) hi = v; }
  if (hi === lo) return 0;
  const counts = new Array(bins).fill(0);
  const w = (hi - lo) / bins;
  for (const v of arr) {
    const idx = Math.min(bins - 1, Math.floor((v - lo) / w));
    counts[idx]++;
  }
  const n = arr.length;
  let h = 0;
  for (const c of counts) {
    if (c === 0) continue;
    const p = c / n;
    h -= p * Math.log2(p);
  }
  return h / Math.log2(bins); // normalized 0..1
};

export function computePhysicsFeatures(
  current: number[],
  voltage: number[]
): PhysicsFeatures {
  const rmsI = rms(current);
  const rmsV = rms(voltage);
  const rmsP = rmsI * rmsV;
  const heatInput = rmsP / 5; // normalized travel-speed proxy
  const entropy = shannonEntropy(current);
  const varI = variance(current);
  const arcStab = Math.max(0, Math.min(1, 1 - varI / (rmsI * rmsI + 1e-9)));

  // Short-circuit events: zero-crossings of voltage below a low-threshold
  let sc = 0;
  const lowV = rmsV * 0.35;
  for (const v of voltage) if (v < lowV) sc++;
  const scRate = sc / Math.max(1, voltage.length);

  // Wavelet-energy proxy: high-frequency component via 1st-difference RMS
  const diffs: number[] = [];
  for (let i = 1; i < current.length; i++) diffs.push(current[i] - current[i - 1]);
  const waveletEnergy = rms(diffs);

  return {
    rmsCurrent: rmsI,
    rmsVoltage: rmsV,
    rmsPower: rmsP,
    heatInput,
    spectralEntropy: entropy,
    arcStability: arcStab,
    shortCircuitRate: scRate,
    waveletEnergy,
  };
}
