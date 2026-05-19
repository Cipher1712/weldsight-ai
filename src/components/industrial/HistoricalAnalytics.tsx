import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Line, ComposedChart,
} from "recharts";

const trend = Array.from({ length: 30 }, (_, i) => ({
  d: `D${i + 1}`,
  pass: 95 + Math.sin(i / 4) * 2 + (i > 22 ? -1.5 : 0),
  defects: 1.2 + Math.sin(i / 3) * 0.4 + (i > 22 ? 0.9 : 0) + Math.random() * 0.2,
}));

const stations = Array.from({ length: 10 }, (_, i) => ({
  s: `WS-${(i + 1).toString().padStart(2, "0")}`,
  thp: 70 + Math.random() * 50,
  def: Math.random() * 3,
}));

export function HistoricalAnalytics() {
  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <span className="panel-title">Historical Analytics · 30 day</span>
          <span className="chip mono">JSR-01 · all stations</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] mono">
          {["7D", "30D", "90D", "YTD"].map((f, i) => (
            <button key={f} className={`px-2 py-1 rounded border ${i === 1 ? "bg-surface-3 border-border-strong text-foreground" : "bg-surface-2 border-border text-muted-foreground"}`}>{f}</button>
          ))}
          <button className="px-2 py-1 rounded bg-surface-2 border border-border text-foreground">PDF</button>
          <button className="px-2 py-1 rounded bg-surface-2 border border-border text-foreground">CSV</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
        <div className="bg-panel p-3 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11.5px] font-medium text-foreground">Weld Pass-Rate & Defect Rate</span>
            <span className="mono text-[10px] text-muted-foreground">% / %</span>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trend} margin={{ top: 6, right: 8, bottom: 0, left: -24 }}>
                <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} />
                <YAxis yAxisId="l" domain={[88, 100]} tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={32} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 4]} tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={28} />
                <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }} />
                <Area yAxisId="l" type="monotone" dataKey="pass" stroke="var(--color-stable)" fill="var(--color-stable)" fillOpacity={0.15} />
                <Line yAxisId="r" type="monotone" dataKey="defects" stroke="var(--color-critical)" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-panel p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11.5px] font-medium text-foreground">Station Comparison</span>
            <span className="mono text-[10px] text-muted-foreground">thp · def</span>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stations} margin={{ top: 6, right: 4, bottom: 0, left: -24 }}>
                <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="s" tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={28} />
                <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }} />
                <Bar dataKey="thp" fill="var(--color-cyan)" />
                <Bar dataKey="def" fill="var(--color-critical)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* heatmap */}
      <div className="bg-panel p-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11.5px] font-medium text-foreground">Anomaly Density Heatmap · station × hour</span>
          <span className="mono text-[10px] text-muted-foreground">events/h</span>
        </div>
        <Heatmap />
      </div>
    </div>
  );
}

function Heatmap() {
  const rows = 8, cols = 24;
  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-between mono text-[9px] text-muted-foreground py-1">
        {Array.from({ length: rows }, (_, i) => <div key={i}>WS-0{i + 1}</div>)}
      </div>
      <div className="flex-1">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2 }}>
          {Array.from({ length: rows * cols }, (_, i) => {
            const v = Math.pow(Math.random(), 2);
            const isHot = v > 0.7 && (i % 7 === 3 || i % 11 === 4);
            const c = isHot ? "var(--color-critical)" : v > 0.5 ? "var(--color-high)" : v > 0.3 ? "var(--color-warn)" : "var(--color-cyan)";
            return <div key={i} style={{ background: c, opacity: 0.15 + v * 0.85, height: 14, borderRadius: 2 }} />;
          })}
        </div>
        <div className="flex justify-between mono text-[9px] text-muted-foreground mt-1 px-0.5">
          {[0, 4, 8, 12, 16, 20, 23].map((h) => <span key={h}>{h.toString().padStart(2, "0")}:00</span>)}
        </div>
      </div>
    </div>
  );
}
