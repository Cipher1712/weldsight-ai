import { useEffect, useState } from "react";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Area, ComposedChart, BarChart, Bar,
} from "recharts";

type Channel = {
  id: string;
  label: string;
  unit: string;
  base: number;
  amp: number;
  color: string;
  spike?: boolean;
};

const CHANNELS: Channel[] = [
  { id: "mig-i", label: "MIG Current",  unit: "A",  base: 215, amp: 18, color: "var(--color-cyan)" },
  { id: "mig-v", label: "MIG Voltage",  unit: "V",  base: 24.6, amp: 1.6, color: "var(--color-stable)", spike: true },
  { id: "tig-i", label: "TIG Current",  unit: "A",  base: 145, amp: 10, color: "var(--color-warn)" },
  { id: "tig-v", label: "TIG Voltage",  unit: "V",  base: 12.4, amp: 0.9, color: "#9aa6ff" },
  { id: "enc",   label: "Encoder",       unit: "Hz", base: 480, amp: 12, color: "#c9a8ff" },
  { id: "arc",   label: "Arc Stability", unit: "idx",base: 0.92, amp: 0.05, color: "var(--color-stable)" },
];

function makeSeries(n: number, base: number, amp: number, t: number, spike = false) {
  const out: { t: number; v: number; hi: number; lo: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i + t) / 12;
    let v = base + Math.sin(x) * amp * 0.7 + Math.sin(x * 3.1) * amp * 0.25 + (Math.random() - 0.5) * amp * 0.15;
    if (spike && i > n - 28 && i < n - 18) v += amp * 1.3 * Math.sin((i - (n - 28)) * 0.6);
    out.push({ t: i, v, hi: base + amp * 1.2, lo: base - amp * 1.2 });
  }
  return out;
}

export function TelemetryEngine({ onSpike }: { onSpike: (v: number) => void }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((p) => p + 1), 250);
    return () => clearInterval(id);
  }, []);

  // raise spike intensity periodically for cross-panel sync
  useEffect(() => {
    const s = Math.max(0, Math.sin(t / 6)) * 0.9;
    onSpike(s);
  }, [t, onSpike]);

  return (
    <div className="panel flex flex-col overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <span className="panel-title">Real-Time Telemetry Engine · SCADA Bus</span>
          <span className="chip chip-stable mono">PLC OK · 1 kHz · sync ±0.4 ms</span>
          <span className="chip mono">CH 6/24 · ROLLING 60 s</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] mono">
          <button className="px-2 py-1 rounded bg-surface-3 border border-border-strong text-foreground">LIVE</button>
          <button className="px-2 py-1 rounded bg-surface-2 border border-border text-muted-foreground">1m</button>
          <button className="px-2 py-1 rounded bg-surface-2 border border-border text-muted-foreground">5m</button>
          <button className="px-2 py-1 rounded bg-surface-2 border border-border text-muted-foreground">1h</button>
          <button className="px-2 py-1 rounded bg-surface-2 border border-border text-muted-foreground">FFT</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
        {CHANNELS.map((c) => (
          <ChannelChart key={c.id} ch={c} t={t} />
        ))}
      </div>

      {/* FFT / spectral row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border border-t border-border">
        <SpectrumPanel t={t} />
        <RippleAnalysis t={t} />
        <DriftAnalysis t={t} />
      </div>
    </div>
  );
}

function ChannelChart({ ch, t }: { ch: Channel; t: number }) {
  const data = makeSeries(120, ch.base, ch.amp, t, ch.spike);
  const last = data[data.length - 1].v;
  return (
    <div className="bg-panel p-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="dot" style={{ background: ch.color }} />
          <span className="text-[11.5px] font-medium text-foreground">{ch.label}</span>
          <span className="mono text-[10px] text-muted-foreground uppercase tracking-wider">{ch.id}</span>
        </div>
        <div className="mono text-[11.5px]">
          <span className="text-foreground">{last.toFixed(ch.unit === "idx" ? 3 : 1)}</span>
          <span className="text-muted-foreground"> {ch.unit}</span>
        </div>
      </div>
      <div className="h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 2, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
              domain={[ch.base - ch.amp * 1.8, ch.base + ch.amp * 1.8]} width={36} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }}
              labelStyle={{ color: "var(--color-muted-foreground)" }}
              formatter={(v) => [Number(v).toFixed(2), ch.unit]}
            />
            <ReferenceLine y={ch.base + ch.amp * 1.2} stroke="var(--color-warn)" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={ch.base - ch.amp * 1.2} stroke="var(--color-warn)" strokeDasharray="3 3" strokeOpacity={0.5} />
            <Area type="monotone" dataKey="v" stroke="none" fill={ch.color} fillOpacity={0.08} />
            <Line type="monotone" dataKey="v" stroke={ch.color} strokeWidth={1.4} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SpectrumPanel({ t }: { t: number }) {
  const bars = Array.from({ length: 36 }, (_, i) => ({
    f: i * 50,
    v: Math.abs(Math.sin((i + t * 0.1) / 3) * (i < 5 ? 80 : 30) + (Math.random() * 12)),
  }));
  return (
    <div className="bg-panel p-2.5">
      <Heading title="FFT · Arc Spectrum" sub="0–1.8 kHz · Hann" />
      <div className="h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
            <XAxis dataKey="f" tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} />
            <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={36} />
            <Bar dataKey="v" fill="var(--color-cyan)" fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RippleAnalysis({ t }: { t: number }) {
  const data = Array.from({ length: 80 }, (_, i) => ({
    t: i,
    v: 0.4 + Math.sin((i + t) / 5) * 0.18 + Math.sin((i + t) / 1.7) * 0.06,
  }));
  return (
    <div className="bg-panel p-2.5">
      <Heading title="Ripple Variance σ" sub="rolling 5 s" />
      <div className="h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={36} domain={[0, 0.8]} />
            <ReferenceLine y={0.55} stroke="var(--color-critical)" strokeDasharray="3 3" label={{ value: "TH", fill: "var(--color-critical)", fontSize: 9 }} />
            <Line type="monotone" dataKey="v" stroke="var(--color-warn)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DriftAnalysis({ t }: { t: number }) {
  const data = Array.from({ length: 80 }, (_, i) => ({
    t: i,
    v: 22 + i * 0.06 + Math.sin((i + t) / 9) * 1.4,
  }));
  return (
    <div className="bg-panel p-2.5">
      <Heading title="Thermal Drift" sub="°C · setpoint Δ" />
      <div className="h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={36} />
            <Area type="monotone" dataKey="v" stroke="none" fill="var(--color-high)" fillOpacity={0.15} />
            <Line type="monotone" dataKey="v" stroke="var(--color-high)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11.5px] font-medium text-foreground">{title}</span>
      <span className="mono text-[10px] text-muted-foreground">{sub}</span>
    </div>
  );
}
