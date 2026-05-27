import { memo, useMemo } from "react";
import {
  CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Area,
} from "recharts";
import { selectSamples, useLiveStore, type LiveSample } from "@/store/liveStore";

type Channel = "i" | "v" | "p";

interface Props {
  channel: Channel;
  label: string;
  unit: string;
  color: string;
  thresholds?: { hi: number; lo: number };
}

function LiveTelemetryChartImpl({ channel, label, unit, color, thresholds }: Props) {
  const samples = useLiveStore(selectSamples);

  const data = useMemo(() => {
    const len = samples.length;
    if (len === 0) return [];
    const slice = samples.slice(-300);
    return slice.map((s: LiveSample, idx: number) => ({
      t: idx,
      v: s[channel],
    }));
  }, [samples, channel]);

  const last = data.length ? data[data.length - 1].v : 0;
  const min = data.length ? Math.min(...data.map(d => d.v)) : 0;
  const max = data.length ? Math.max(...data.map(d => d.v)) : 1;
  const pad = (max - min) * 0.18 || Math.abs(max) * 0.1 || 1;

  return (
    <div className="bg-panel p-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="dot" style={{ background: color }} />
          <span className="text-[11.5px] font-medium text-foreground">{label}</span>
          <span className="mono text-[10px] text-muted-foreground uppercase tracking-wider">
            LIVE · backend
          </span>
        </div>
        <div className="mono text-[11.5px]">
          <span className="text-foreground">
            {Number.isFinite(last) ? last.toFixed(2) : "—"}
          </span>
          <span className="text-muted-foreground"> {unit}</span>
        </div>
      </div>
      <div className="h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 2, right: 4, bottom: 0, left: -28 }}>
            <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis
              stroke="var(--color-muted-foreground)"
              tick={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
              domain={[min - pad, max + pad]}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: 6,
                fontSize: 11,
              }}
              labelStyle={{ color: "var(--color-muted-foreground)" }}
              formatter={(v) => [Number(v).toFixed(3), unit]}
            />
            {thresholds && (
              <>
                <ReferenceLine y={thresholds.hi} stroke="var(--color-warn)" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={thresholds.lo} stroke="var(--color-warn)" strokeDasharray="3 3" strokeOpacity={0.5} />
              </>
            )}
            <Area type="monotone" dataKey="v" stroke="none" fill={color} fillOpacity={0.08} isAnimationActive={false} />
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.4} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const LiveTelemetryChart = memo(LiveTelemetryChartImpl);
