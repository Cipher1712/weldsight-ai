import { useEffect, useState } from "react";

export function GlobalHeader() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  const stat = (label: string, value: string, tone: "ok" | "warn" | "crit" = "ok") => {
    const cls = tone === "ok" ? "chip-stable" : tone === "warn" ? "chip-warn" : "chip-critical";
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className={`chip ${cls}`}>
          <span className={`dot ${tone === "crit" ? "pulse-critical" : ""}`} style={{
            background: tone === "ok" ? "var(--color-stable)" : tone === "warn" ? "var(--color-warn)" : "var(--color-critical)"
          }} />
          {value}
        </span>
      </div>
    );
  };

  return (
    <header className="panel sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-2.5 rounded-none border-x-0 border-t-0">
      {/* Brand */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-md border border-border-strong bg-surface-2 grid place-items-center overflow-hidden">
            <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" stroke="var(--color-cyan)" strokeWidth="2">
              <path d="M4 24 L12 8 L20 20 L28 6" />
              <circle cx="12" cy="8" r="1.6" fill="var(--color-cyan)" stroke="none" />
              <circle cx="20" cy="20" r="1.6" fill="var(--color-critical)" stroke="none" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tata Steel · Industry 4.0</div>
            <div className="text-[13.5px] font-semibold text-foreground">Industrial AI Weld Intelligence Platform</div>
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="hidden lg:flex items-center gap-5 text-[11px] mono">
        <Ctx k="Plant" v="JSR-01 Jamshedpur" />
        <Ctx k="Line" v="HRC-LINE-04" />
        <Ctx k="Station" v="WS-07" />
        <Ctx k="Machine" v="MIG-K400-A" />
        <Ctx k="Shift" v="B · 14:00–22:00" />
        <Ctx k="Operator" v="OP-2241 · R. Mahato" />
      </div>

      {/* Status cluster */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2.5">
          {stat("AI", "ONLINE", "ok")}
          {stat("PLC", "LINK", "ok")}
          {stat("EDGE", "OK", "ok")}
          {stat("CAM", "1080p·60", "ok")}
          {stat("WS", "STREAM", "warn")}
          {stat("INF", "12.4ms", "ok")}
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="text-right leading-tight">
          <div className="mono text-[11px] text-foreground">{time}</div>
          <div className="mono text-[10px] text-muted-foreground">UPTIME 42d 06:18:51</div>
        </div>
      </div>
    </header>
  );
}

function Ctx({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
