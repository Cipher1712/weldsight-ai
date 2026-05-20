import { useEffect, useState } from "react";

export function GlobalHeader() {
  const [now, setNow] = useState(new Date());
  const [mode, setMode] = useState<"ops" | "exec">("ops");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "exec") root.classList.add("exec");
    else root.classList.remove("exec");
  }, [mode]);

  const time = now.toISOString().replace("T", " ").slice(0, 19) + "Z";

  const stat = (label: string, value: string, tone: "ok" | "warn" | "crit" = "ok") => {
    const cls = tone === "ok" ? "chip-stable" : tone === "warn" ? "chip-warn" : "chip-critical";
    return (
      <div className="flex items-center gap-1.5">
        <span className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
        <span className={`chip ${cls}`}>
          <span className="led" style={{
            background: tone === "ok" ? "var(--color-stable)" : tone === "warn" ? "var(--color-warn)" : "var(--color-critical)"
          }} />
          {value}
        </span>
      </div>
    );
  };

  return (
    <header className="panel sticky top-0 z-30 rounded-none border-x-0 border-t-0">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 rounded-sm border border-border-strong bg-surface-2 grid place-items-center overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{
              background: "repeating-linear-gradient(135deg, color-mix(in oklch, var(--color-foreground) 6%, transparent) 0 1px, transparent 1px 4px)"
            }} />
            <svg viewBox="0 0 32 32" className="h-5 w-5 relative" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 22 L11 10 L17 18 L22 12 L28 20" style={{ stroke: "var(--color-cyan)" }} />
              <circle cx="22" cy="12" r="1.8" fill="var(--color-critical)" stroke="none" />
              <path d="M2 28 H30" style={{ stroke: "var(--color-border-strong)" }} />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="mono text-[9.5px] uppercase tracking-[0.24em] text-muted-foreground">Tata Steel · Industry 4.0 · JSR-01</div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[18px] text-foreground tracking-tight">WeldSight</span>
              <span className="mono text-[10px] tracking-[0.2em] text-cyan-foreground" style={{ color: "var(--color-cyan)" }}>AI</span>
              <span className="mono text-[9.5px] text-muted-foreground">v4.2.1</span>
            </div>
          </div>
        </div>

        {/* Context breadcrumb */}
        <div className="hidden lg:flex items-center gap-px text-[11px] mono bg-surface/60 border border-border rounded-sm overflow-hidden">
          <Ctx k="PLANT" v="JSR-01" />
          <Sep />
          <Ctx k="LINE"  v="HRC-04" />
          <Sep />
          <Ctx k="STATION" v="WS-07" />
          <Sep />
          <Ctx k="MACHINE" v="MIG-K400-A" />
          <Sep />
          <Ctx k="SHIFT"   v="B · 14–22" />
          <Sep />
          <Ctx k="OP"      v="2241 · R.MAHATO" />
        </div>

        {/* Status cluster */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            {stat("AI",   "ONLINE", "ok")}
            {stat("PLC",  "LINK", "ok")}
            {stat("EDGE", "OK", "ok")}
            {stat("CAM",  "1080·60", "ok")}
            {stat("KAFKA","0.4ms", "warn")}
            {stat("INF",  "12.4ms", "ok")}
          </div>
          <div className="h-7 w-px bg-border" />

          {/* Theme toggle */}
          <div className="flex items-center rounded-sm border border-border bg-surface-2 overflow-hidden text-[10px] mono">
            <button
              onClick={() => setMode("ops")}
              className={`px-2 py-1 uppercase tracking-[0.14em] ${mode === "ops" ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >Ops</button>
            <button
              onClick={() => setMode("exec")}
              className={`px-2 py-1 uppercase tracking-[0.14em] border-l border-border ${mode === "exec" ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >Exec</button>
          </div>

          <div className="h-7 w-px bg-border" />
          <div className="text-right leading-tight">
            <div className="mono text-[11px] text-foreground">{time}</div>
            <div className="mono text-[9.5px] text-muted-foreground">UPTIME 42d·06:18:51</div>
          </div>
        </div>
      </div>

      {/* Sub-ticker */}
      <div className="flex items-center justify-between gap-4 px-4 py-1 border-t border-border bg-surface/40 mono text-[10px] text-muted-foreground overflow-hidden">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <span><span className="text-foreground">SYS</span> nominal</span>
          <span>· model <span className="text-foreground">WELD-VISION-v4.2</span></span>
          <span>· stream <span className="text-foreground">weld.telemetry.v3</span></span>
          <span>· edge <span className="text-foreground">Jetson AGX Orin · 47.2°C</span></span>
          <span>· lag <span style={{ color: "var(--color-stable)" }}>0.4ms</span></span>
          <span>· inference <span style={{ color: "var(--color-stable)" }}>12.4ms</span></span>
          <span>· anomalies <span style={{ color: "var(--color-warn)" }}>14 active</span> / <span style={{ color: "var(--color-critical)" }}>3 critical</span></span>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span><span className="kbd">⌘K</span> command</span>
          <span><span className="kbd">A</span> acknowledge</span>
          <span><span className="kbd">F</span> freeze frame</span>
        </div>
      </div>
    </header>
  );
}

function Ctx({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-1.5 px-2.5 py-1">
      <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
function Sep() {
  return <span className="self-stretch w-px bg-border" />;
}
