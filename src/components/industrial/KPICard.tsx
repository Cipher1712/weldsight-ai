import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { sparkline } from "@/lib/sim";
import { useEffect, useState } from "react";

type Status = "STABLE" | "MODERATE" | "HIGH" | "CRITICAL";

interface KPIProps {
  label: string;
  value: number | string;
  unit?: string;
  delta?: number;
  status?: Status;
  precision?: number;
  base?: number;
  amp?: number;
}

const statusChip: Record<Status, string> = {
  STABLE: "chip-stable",
  MODERATE: "chip-warn",
  HIGH: "chip-high",
  CRITICAL: "chip-critical",
};

export function KPICard({ label, value, unit, delta = 0, status = "STABLE", precision = 1, base = 80, amp = 6 }: KPIProps) {
  const [data] = useState(() => sparkline(28, base, amp, delta));
  const [v, setV] = useState(typeof value === "number" ? value : 0);

  useEffect(() => {
    if (typeof value !== "number") return;
    const id = setInterval(() => {
      setV((prev) => prev + (Math.random() - 0.5) * amp * 0.08);
    }, 1400);
    return () => clearInterval(id);
  }, [amp, value]);

  const display = typeof value === "number" ? (value + (v - (typeof value === "number" ? value : 0))).toFixed(precision) : value;
  const stroke =
    status === "CRITICAL" ? "var(--color-critical)" :
    status === "HIGH" ? "var(--color-high)" :
    status === "MODERATE" ? "var(--color-warn)" :
    "var(--color-cyan)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel relative overflow-hidden p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{label}</div>
        <span className={`chip ${statusChip[status]}`}>{status}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <div className="mono text-[22px] font-semibold leading-none text-foreground">{display}</div>
        {unit && <div className="mono text-[11px] text-muted-foreground">{unit}</div>}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[10.5px] mono">
        <span style={{ color: delta >= 0 ? "var(--color-stable)" : "var(--color-critical)" }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%
        </span>
        <span className="text-muted-foreground">vs last shift</span>
      </div>
      <div className="-mx-1 -mb-1 mt-1 h-9">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
            <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
