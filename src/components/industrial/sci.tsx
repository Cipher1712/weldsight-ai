import { useMemo } from "react";

/* ============================================================
   Scientific / industrial diagnostic primitives
   Pure SVG, no external deps. Themed via CSS vars.
============================================================ */

export const sev = {
  CRITICAL: "var(--color-critical)",
  HIGH: "var(--color-high)",
  MODERATE: "var(--color-warn)",
  LOW: "var(--color-stable)",
  OK: "var(--color-stable)",
} as const;

export type Sev = keyof typeof sev;

export function Sparkline({
  data, w = 120, h = 28, color = "var(--color-cyan)", fill = true, baseline,
}: { data: number[]; w?: number; h?: number; color?: string; fill?: boolean; baseline?: number }) {
  const { d, area, y0 } = useMemo(() => {
    if (!data.length) return { d: "", area: "", y0: h };
    const min = Math.min(...data), max = Math.max(...data);
    const span = max - min || 1;
    const step = w / (data.length - 1 || 1);
    const pts = data.map((v, i) => [i * step, h - ((v - min) / span) * (h - 2) - 1] as const);
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = d + ` L${w} ${h} L0 ${h} Z`;
    const y0 = baseline != null ? h - ((baseline - min) / span) * (h - 2) - 1 : h;
    return { d, area, y0 };
  }, [data, w, h, baseline]);
  return (
    <svg width={w} height={h} className="block">
      {fill && <path d={area} fill={color} opacity={0.12} />}
      {baseline != null && <line x1={0} x2={w} y1={y0} y2={y0} stroke="var(--color-border-strong)" strokeDasharray="2 2" />}
      <path d={d} fill="none" stroke={color} strokeWidth={1.2} />
    </svg>
  );
}

export function Bar({ value, max = 1, color = "var(--color-cyan)", label, suffix }: {
  value: number; max?: number; color?: string; label?: string; suffix?: string;
}) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  return (
    <div className="space-y-0.5">
      {label && (
        <div className="flex justify-between mono text-[10px] text-muted-foreground">
          <span>{label}</span>
          <span className="text-foreground">{value.toFixed(3)}{suffix}</span>
        </div>
      )}
      <div className="h-1.5 bg-surface-3 rounded-sm overflow-hidden">
        <div className="h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function Equation({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="rounded-sm border border-border bg-surface-2/60 px-2.5 py-1.5 my-1">
      <div className="font-serif italic text-[13px] text-foreground leading-snug">{children}</div>
      {note && <div className="mono text-[10px] text-muted-foreground mt-0.5">{note}</div>}
    </div>
  );
}

export function KV({ k, v, hint, sevKey }: { k: string; v: React.ReactNode; hint?: string; sevKey?: Sev }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-border/60 last:border-0">
      <div className="min-w-0">
        <div className="mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{k}</div>
        {hint && <div className="text-[11px] text-foreground/70 leading-tight">{hint}</div>}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="mono text-[12px] text-foreground">{v}</span>
        {sevKey && <span className="dot" style={{ background: sev[sevKey] }} />}
      </div>
    </div>
  );
}

export function Heatmap({
  rows, cols, values, rowLabels, colLabels, max = 1,
}: {
  rows: number; cols: number; values: number[]; rowLabels?: string[]; colLabels?: string[]; max?: number;
}) {
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: `100px repeat(${cols}, minmax(0,1fr))` }}>
      <div />
      {colLabels?.map((l, i) => (
        <div key={i} className="mono text-[9px] text-muted-foreground text-center truncate px-0.5">{l}</div>
      ))}
      {Array.from({ length: rows }).map((_, r) => (
        <>
          <div key={`r${r}`} className="mono text-[10px] text-muted-foreground truncate pr-1">{rowLabels?.[r] ?? `r${r}`}</div>
          {Array.from({ length: cols }).map((_, c) => {
            const v = values[r * cols + c] ?? 0;
            const n = Math.max(-1, Math.min(1, v / max));
            const bg = n >= 0
              ? `color-mix(in oklch, var(--color-critical) ${n * 70}%, var(--surface-2))`
              : `color-mix(in oklch, var(--color-cyan) ${Math.abs(n) * 70}%, var(--surface-2))`;
            return (
              <div key={`${r}-${c}`} className="h-6 grid place-items-center mono text-[9px] text-foreground/90" style={{ background: bg }}>
                {v.toFixed(2)}
              </div>
            );
          })}
        </>
      ))}
    </div>
  );
}

export function Scatter({
  points, w = 360, h = 220, classes, title,
}: {
  points: { x: number; y: number; cls: string }[];
  w?: number; h?: number;
  classes: { key: string; color: string; label: string }[];
  title?: string;
}) {
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs), yMin = Math.min(...ys), yMax = Math.max(...ys);
  const sx = (x: number) => 24 + ((x - xMin) / (xMax - xMin || 1)) * (w - 32);
  const sy = (y: number) => h - 18 - ((y - yMin) / (yMax - yMin || 1)) * (h - 28);
  return (
    <div>
      {title && <div className="mono text-[10px] text-muted-foreground mb-1">{title}</div>}
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="block">
        {/* axes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={24} x2={w} y1={(h - 18) * (i / 5) + 4} y2={(h - 18) * (i / 5) + 4} stroke="var(--color-grid)" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} y1={4} y2={h - 14} x1={24 + ((w - 32) * i) / 7} x2={24 + ((w - 32) * i) / 7} stroke="var(--color-grid)" />
        ))}
        {points.map((p, i) => {
          const c = classes.find(c => c.key === p.cls)?.color ?? "var(--color-cyan)";
          return <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={2.4} fill={c} opacity={0.85} />;
        })}
        <text x={26} y={12} className="mono" fontSize="9" fill="var(--color-muted-foreground)">PC1</text>
        <text x={w - 26} y={h - 4} className="mono" fontSize="9" fill="var(--color-muted-foreground)">PC2</text>
      </svg>
      <div className="flex flex-wrap gap-2 mt-1">
        {classes.map(c => (
          <div key={c.key} className="flex items-center gap-1 mono text-[10px] text-muted-foreground">
            <span className="dot" style={{ background: c.color }} /> {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ROCCurve({ points, label }: { points: { fpr: number; tpr: number }[]; label?: string }) {
  const w = 220, h = 160;
  const sx = (x: number) => 22 + x * (w - 28);
  const sy = (y: number) => h - 16 - y * (h - 22);
  const d = points.map((p, i) => (i ? "L" : "M") + sx(p.fpr) + " " + sy(p.tpr)).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block">
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={22} x2={w} y1={(h - 16) * (i / 4) + 4} y2={(h - 16) * (i / 4) + 4} stroke="var(--color-grid)" />
      ))}
      <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="var(--color-border-strong)" strokeDasharray="2 2" />
      <path d={d} fill="none" stroke="var(--color-cyan)" strokeWidth={1.4} />
      <text x={24} y={12} fontSize="9" className="mono" fill="var(--color-muted-foreground)">TPR</text>
      <text x={w - 22} y={h - 4} fontSize="9" className="mono" fill="var(--color-muted-foreground)">FPR</text>
      {label && <text x={w - 4} y={20} fontSize="9" textAnchor="end" className="mono" fill="var(--color-foreground)">{label}</text>}
    </svg>
  );
}

export function Boxplot({
  series, w = 360, h = 140,
}: { series: { label: string; min: number; q1: number; med: number; q3: number; max: number; color?: string }[]; w?: number; h?: number }) {
  const all = series.flatMap(s => [s.min, s.max]);
  const lo = Math.min(...all), hi = Math.max(...all);
  const sy = (v: number) => h - 18 - ((v - lo) / (hi - lo || 1)) * (h - 30);
  const slot = (w - 30) / series.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block">
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={24} x2={w} y1={(h - 18) * (i / 4) + 6} y2={(h - 18) * (i / 4) + 6} stroke="var(--color-grid)" />
      ))}
      {series.map((s, i) => {
        const cx = 24 + slot * i + slot / 2;
        const c = s.color ?? "var(--color-cyan)";
        return (
          <g key={s.label}>
            <line x1={cx} x2={cx} y1={sy(s.max)} y2={sy(s.min)} stroke={c} />
            <rect x={cx - 12} width={24} y={sy(s.q3)} height={Math.max(2, sy(s.q1) - sy(s.q3))} fill={c} opacity={0.18} stroke={c} />
            <line x1={cx - 12} x2={cx + 12} y1={sy(s.med)} y2={sy(s.med)} stroke={c} strokeWidth={1.5} />
            <text x={cx} y={h - 4} textAnchor="middle" fontSize="9" className="mono" fill="var(--color-muted-foreground)">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function MultiLine({
  series, w = 440, h = 160, labels,
}: { series: { color: string; data: number[]; name: string }[]; w?: number; h?: number; labels?: string[] }) {
  const all = series.flatMap(s => s.data);
  const lo = Math.min(...all), hi = Math.max(...all);
  const n = series[0]?.data.length ?? 0;
  const sx = (i: number) => 22 + (i / (n - 1 || 1)) * (w - 28);
  const sy = (v: number) => h - 18 - ((v - lo) / (hi - lo || 1)) * (h - 28);
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="block">
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={22} x2={w} y1={(h - 18) * (i / 4) + 4} y2={(h - 18) * (i / 4) + 4} stroke="var(--color-grid)" />
        ))}
        {series.map(s => (
          <path key={s.name} d={s.data.map((v, i) => (i ? "L" : "M") + sx(i) + " " + sy(v)).join(" ")}
                fill="none" stroke={s.color} strokeWidth={1.2} />
        ))}
        {labels && (
          <g>
            <text x={22} y={12} fontSize="9" className="mono" fill="var(--color-muted-foreground)">{labels[0]}</text>
            <text x={w - 2} y={h - 4} fontSize="9" textAnchor="end" className="mono" fill="var(--color-muted-foreground)">{labels[1]}</text>
          </g>
        )}
      </svg>
      <div className="flex flex-wrap gap-3 mt-1">
        {series.map(s => (
          <div key={s.name} className="flex items-center gap-1 mono text-[10px] text-muted-foreground">
            <span className="inline-block h-[2px] w-3" style={{ background: s.color }} /> {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Panel({
  title, sub, right, children, className,
}: { title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`panel ${className ?? ""}`}>
      <div className="panel-header">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="panel-title">{title}</span>
          {sub && <span className="mono text-[10px] text-muted-foreground truncate">{sub}</span>}
        </div>
        {right}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export function deterministic(seed: number, n: number, base = 0.5, amp = 0.4): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    out.push(base + Math.sin(i * 0.35 + seed) * amp * 0.6 + (r - 0.5) * amp * 0.4);
  }
  return out;
}
