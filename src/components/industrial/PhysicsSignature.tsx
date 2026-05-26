import { Sparkline, Bar, Equation, KV, Panel, deterministic, type Sev } from "./sci";

export type PhysicsDefect = {
  id: string;
  name: string;
  sev: Sev;
  station: string;
  conf: number;
  consensus: number;     // AI + Physics agreement 0-1
  interpretation: string;
  arc: string;
  thermal: string;
  spectral: string;
  indicators: { label: string; value: number; max: number; color: string; trend: number[] }[];
  contributors: { name: string; pct: number }[];
  equations: { eq: React.ReactNode; note: string }[];
};

export const PHYSICS_DEFECTS: PhysicsDefect[] = [
  {
    id: "PHX-074", name: "Porosity Cluster", sev: "CRITICAL", station: "WS-04", conf: 0.97, consensus: 0.92,
    interpretation: "Trapped shielding-gas pockets and unstable Ar/CO₂ coverage cause randomized arc dynamics and a broadened arc-acoustic spectrum.",
    arc: "Arc voltage exhibits stochastic micro-extinctions; short-circuit period jitter rises from 4.1 ms σ to 7.6 ms σ.",
    thermal: "Pool surface temperature oscillates ±42°C as gas inclusions periodically vent through the molten cap.",
    spectral: "Energy migrates from 280 Hz fundamental into a 600–950 Hz broadband floor — classic porosity signature.",
    indicators: [
      { label: "Spectral entropy H(x)",  value: 0.81, max: 1, color: "var(--color-critical)", trend: deterministic(11, 32, 0.55, 0.35) },
      { label: "Arc stability index",     value: 0.34, max: 1, color: "var(--color-high)",     trend: deterministic(12, 32, 0.55, -0.3) },
      { label: "Short-circuit jitter σ",  value: 0.62, max: 1, color: "var(--color-warn)",     trend: deterministic(13, 32, 0.45, 0.3) },
      { label: "Gas turbulence p",        value: 0.71, max: 1, color: "var(--color-critical)", trend: deterministic(14, 32, 0.55, 0.25) },
    ],
    contributors: [
      { name: "spectral_entropy", pct: 31 },
      { name: "ripple_sigma",     pct: 22 },
      { name: "voltage_instab.",  pct: 18 },
      { name: "thermal_drift",    pct: 12 },
      { name: "gas_flow_var",     pct: 9 },
      { name: "vision_recon",     pct: 8 },
    ],
    equations: [
      { eq: <>H(x) = −Σ p(x<sub>i</sub>) log<sub>2</sub> p(x<sub>i</sub>)</>, note: "Shannon entropy — broadband spectrum ⇒ H ↑ ⇒ unstable arc dynamics." },
      { eq: <>σ² = 1/N · Σ (V<sub>i</sub> − μ)²</>, note: "Arc voltage variance over 200 ms windows." },
    ],
  },
  {
    id: "PHX-068", name: "Burn-through", sev: "HIGH", station: "WS-07", conf: 0.93, consensus: 0.95,
    interpretation: "Heat input exceeds the substrate's thermal capacity, fully penetrating the joint and collapsing the molten pool.",
    arc: "Voltage collapse events (ΔV < −3.4 V in 18 ms) precede pool rupture; current locks at 280 A.",
    thermal: "Pyrometer integrates >2.1 kJ/mm with no decay — runaway heat accumulation.",
    spectral: "RMS power surge in the 60–180 Hz band; the high-frequency arc fingerprint disappears as the arc detaches.",
    indicators: [
      { label: "P_RMS (kW)",          value: 0.88, max: 1, color: "var(--color-critical)", trend: deterministic(21, 32, 0.5, 0.35) },
      { label: "Heat input Q (kJ/mm)", value: 0.82, max: 1, color: "var(--color-high)",    trend: deterministic(22, 32, 0.55, 0.25) },
      { label: "Voltage collapse n",   value: 0.46, max: 1, color: "var(--color-warn)",    trend: deterministic(23, 32, 0.4, 0.35) },
      { label: "Pool instability",     value: 0.73, max: 1, color: "var(--color-critical)", trend: deterministic(24, 32, 0.55, 0.3) },
    ],
    contributors: [
      { name: "rms_power",       pct: 34 },
      { name: "heat_input_Q",    pct: 25 },
      { name: "v_collapse_rate", pct: 17 },
      { name: "pool_area_dx",    pct: 12 },
      { name: "travel_speed",    pct: 7 },
      { name: "vision_recon",    pct: 5 },
    ],
    equations: [
      { eq: <>P<sub>RMS</sub> = √(1/N · Σ P<sub>i</sub>²)</>, note: "Power surge over rolling 250 ms window." },
      { eq: <>Q = (V · I · 60) / (S · 1000)</>, note: "Heat input per unit length — S is travel speed (mm/min)." },
    ],
  },
  {
    id: "PHX-061", name: "Spatter", sev: "MODERATE", station: "WS-02", conf: 0.88, consensus: 0.84,
    interpretation: "Unstable droplet detachment in the metal-transfer cycle produces impulsive high-frequency transients and arc reignition bursts.",
    arc: "Reignition spikes at 1.4–2.1 kHz; current rises 22% above set-point for 3–6 ms intervals.",
    thermal: "Localized thermal ejecta visible to vision system; mean pool temperature stable.",
    spectral: "Wavelet detail-coefficient energy in bands d3, d4 rises 3.2×; FFT alone underestimates these transients.",
    indicators: [
      { label: "HF transient density",  value: 0.69, max: 1, color: "var(--color-warn)", trend: deterministic(31, 32, 0.45, 0.3) },
      { label: "Wavelet detail energy", value: 0.74, max: 1, color: "var(--color-high)", trend: deterministic(32, 32, 0.5, 0.3) },
      { label: "Reignition rate (Hz)",  value: 0.58, max: 1, color: "var(--color-warn)", trend: deterministic(33, 32, 0.45, 0.25) },
      { label: "Transfer mode entropy", value: 0.61, max: 1, color: "var(--color-warn)", trend: deterministic(34, 32, 0.5, 0.2) },
    ],
    contributors: [
      { name: "wavelet_d3_energy", pct: 28 },
      { name: "wavelet_d4_energy", pct: 22 },
      { name: "hf_transient_rate", pct: 19 },
      { name: "current_overshoot", pct: 14 },
      { name: "spectral_entropy",  pct: 10 },
      { name: "vision_spatter",    pct: 7 },
    ],
    equations: [
      { eq: <>E = Σ |d<sub>i</sub>|²</>, note: "Wavelet sub-band energy — isolates localized droplet-transfer transients." },
    ],
  },
  {
    id: "PHX-057", name: "Lack of Fusion", sev: "HIGH", station: "WS-09", conf: 0.90, consensus: 0.87,
    interpretation: "Insufficient energy delivery prevents the filler material from fully bonding with the base metal at the fusion line.",
    arc: "Current 7% below adaptive band; arc length elongated, voltage drifts +1.2 V.",
    thermal: "Pyrometer integral below threshold by 18%; low-frequency oscillation persists.",
    spectral: "Low-frequency band 30–80 Hz dominant; high-frequency stochastic content absent.",
    indicators: [
      { label: "Heat input deficit",   value: 0.54, max: 1, color: "var(--color-high)", trend: deterministic(41, 32, 0.4, -0.25) },
      { label: "Current consistency",  value: 0.39, max: 1, color: "var(--color-warn)", trend: deterministic(42, 32, 0.45, -0.25) },
      { label: "Penetration energy",   value: 0.31, max: 1, color: "var(--color-high)", trend: deterministic(43, 32, 0.4, -0.3) },
      { label: "LF instability",       value: 0.66, max: 1, color: "var(--color-warn)", trend: deterministic(44, 32, 0.45, 0.2) },
    ],
    contributors: [
      { name: "heat_input_Q",     pct: 30 },
      { name: "current_mean",     pct: 24 },
      { name: "arc_voltage_drift",pct: 16 },
      { name: "lf_band_energy",   pct: 12 },
      { name: "travel_speed",     pct: 10 },
      { name: "vision_geometry",  pct: 8 },
    ],
    equations: [
      { eq: <>Q = (V · I · 60) / (S · 1000)</>, note: "Heat input below 0.84 kJ/mm threshold ⇒ insufficient fusion." },
    ],
  },
];

export function PhysicsSignaturePanel({ d, compact = false }: { d: PhysicsDefect; compact?: boolean }) {
  return (
    <Panel
      title={`Physics Signature · ${d.name}`}
      sub={`${d.id} · ${d.station}`}
      right={
        <div className="flex items-center gap-2">
          <span className="chip mono">AI×PHYS · {(d.consensus * 100).toFixed(0)}%</span>
          <span className={`chip ${d.sev === "CRITICAL" ? "chip-critical" : d.sev === "HIGH" ? "chip-high" : "chip-warn"}`}>{d.sev}</span>
        </div>
      }
    >
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "lg:grid-cols-[1.2fr_1fr]"}`}>
        <div className="space-y-3">
          <p className="text-[12.5px] text-foreground/85 leading-snug">{d.interpretation}</p>
          <div className="grid grid-cols-1 gap-1.5">
            <KV k="Arc behaviour"      v="" hint={d.arc} />
            <KV k="Thermal profile"    v="" hint={d.thermal} />
            <KV k="Spectral signature" v="" hint={d.spectral} />
          </div>
          <div className="space-y-1">
            {d.equations.map((e, i) => <Equation key={i} note={e.note}>{e.eq}</Equation>)}
          </div>
        </div>
        <div className="space-y-2">
          {d.indicators.map((ind) => (
            <div key={ind.label} className="rounded-sm border border-border bg-surface-2/60 px-2 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{ind.label}</span>
                <span className="mono text-[11px] text-foreground">{ind.value.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1"><Bar value={ind.value} color={ind.color} /></div>
                <Sparkline data={ind.trend} w={84} h={20} color={ind.color} />
              </div>
            </div>
          ))}
          <div className="rounded-sm border border-border bg-surface-2/60 px-2 py-1.5">
            <div className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">Contributing telemetry</div>
            <div className="space-y-1">
              {d.contributors.slice(0, 5).map(c => (
                <div key={c.name}>
                  <div className="flex justify-between mono text-[10.5px]">
                    <span className="text-foreground/85">{c.name}</span>
                    <span className="text-muted-foreground">{c.pct}%</span>
                  </div>
                  <div className="h-1 bg-surface-3 rounded-sm overflow-hidden">
                    <div className="h-full" style={{ width: `${c.pct * 2.4}%`, background: "var(--color-cyan)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function PhysicsConsensusStrip() {
  return (
    <div className="panel px-3 py-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
      <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Physics ↔ AI consensus</span>
      {PHYSICS_DEFECTS.map(d => (
        <div key={d.id} className="flex items-center gap-1.5 mono text-[10.5px]">
          <span className="dot" style={{ background:
            d.consensus > 0.9 ? "var(--color-stable)" : d.consensus > 0.8 ? "var(--color-warn)" : "var(--color-high)"
          }} />
          <span className="text-foreground/85">{d.name}</span>
          <span className="text-muted-foreground">{(d.consensus * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}
