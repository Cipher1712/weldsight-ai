import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Activity, AlertOctagon, Gauge, Grid3x3, Radio,
  UploadCloud, Boxes, SlidersHorizontal, History,
  BarChart3, Waves, LineChart, ShieldCheck,
  HeartPulse, Cable, Cpu, Server,
  ChevronLeft, ChevronRight, Search,
} from "lucide-react";
import { GlobalHeader } from "./GlobalHeader";

type NavItem = { to: string; label: string; icon: typeof Activity; code: string };
type NavSection = { title: string; items: NavItem[] };

const NAV: NavSection[] = [
  {
    title: "Live Operations",
    items: [
      { to: "/",                 label: "Executive Overview",       icon: Gauge,        code: "EXO" },
      { to: "/telemetry",        label: "Live Telemetry",           icon: Activity,     code: "TLM" },
      { to: "/anomalies",        label: "Anomaly Center",           icon: AlertOctagon, code: "ANM" },
      { to: "/stations",         label: "Multi-Station Monitoring", icon: Grid3x3,      code: "STN" },
      { to: "/stream-control",   label: "Stream Control",           icon: Radio,        code: "STR" },
    ],
  },
  {
    title: "AI & Training",
    items: [
      { to: "/upload-train",     label: "Upload & Train",           icon: UploadCloud,  code: "TRN" },
      { to: "/model-profiles",   label: "Model Profiles",           icon: Boxes,        code: "MDL" },
      { to: "/thresholds",       label: "Threshold Management",     icon: SlidersHorizontal, code: "THR" },
      { to: "/replay",           label: "Replay Engine",            icon: History,      code: "RPL" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { to: "/analytics",        label: "Historical Analytics",     icon: BarChart3,    code: "HIS" },
      { to: "/fft",              label: "FFT & Spectral Analysis",  icon: Waves,        code: "FFT" },
      { to: "/metrics",          label: "Metrics Explorer",         icon: LineChart,    code: "MET" },
      { to: "/validation",       label: "Validation Standards",     icon: ShieldCheck,  code: "VAL" },
    ],
  },
  {
    title: "System",
    items: [
      { to: "/system/api-health", label: "API Health",              icon: HeartPulse,   code: "API" },
      { to: "/system/websocket",  label: "WebSocket Status",        icon: Cable,        code: "WSS" },
      { to: "/system/edge",       label: "Edge Devices",            icon: Cpu,          code: "EDG" },
      { to: "/system/runtime",    label: "Runtime Monitoring",      icon: Server,       code: "RUN" },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex">
      <aside
        className={`shrink-0 border-r border-border bg-surface/60 flex flex-col transition-[width] duration-150 ${
          collapsed ? "w-[58px]" : "w-[244px]"
        }`}
        style={{ backdropFilter: "blur(2px)" }}
      >
        {/* Sidebar brand strip */}
        <div className="h-[52px] flex items-center gap-2.5 px-3 border-b border-border bg-surface-2/50">
          <div className="h-8 w-8 rounded-sm border border-border-strong bg-surface-3 grid place-items-center">
            <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 22 L11 10 L17 18 L22 12 L28 20" style={{ stroke: "var(--color-cyan)" }} />
              <circle cx="22" cy="12" r="1.8" fill="var(--color-critical)" stroke="none" />
            </svg>
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <div className="font-serif text-[15px] text-foreground">WeldSight <span style={{ color: "var(--color-cyan)" }} className="mono text-[10px] tracking-[0.2em]">AI</span></div>
              <div className="mono text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground truncate">Adaptive Weld Intel</div>
            </div>
          )}
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-2.5 py-2 border-b border-border">
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm border border-border bg-surface-2/70 text-muted-foreground">
              <Search className="h-3 w-3" />
              <input
                placeholder="Jump to…"
                className="bg-transparent outline-none text-[11px] mono w-full placeholder:text-muted-foreground/70"
              />
              <span className="kbd">⌘K</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-1">
          {NAV.map((sec) => (
            <div key={sec.title} className="px-1.5 py-1.5">
              {!collapsed && (
                <div className="px-2 pt-1 pb-1 mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/80 border-b border-border/60 mb-1">
                  {sec.title}
                </div>
              )}
              <ul className="flex flex-col">
                {sec.items.map((it) => {
                  const active = path === it.to;
                  const Icon = it.icon;
                  return (
                    <li key={it.to}>
                      <Link
                        to={it.to}
                        className={[
                          "group flex items-center gap-2.5 px-2 py-1.5 rounded-sm relative",
                          "text-[12px]",
                          active
                            ? "bg-surface-3 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60",
                        ].join(" ")}
                        title={collapsed ? it.label : undefined}
                      >
                        {active && (
                          <span
                            className="absolute left-0 top-1 bottom-1 w-[2px] rounded-r"
                            style={{ background: "var(--color-cyan)" }}
                          />
                        )}
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{it.label}</span>
                            <span className="mono text-[9px] tracking-[0.12em] text-muted-foreground/70">{it.code}</span>
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer status */}
        <div className="border-t border-border px-2.5 py-2 flex items-center justify-between gap-2">
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <div className="mono text-[9.5px] text-foreground flex items-center gap-1.5">
                <span className="led" style={{ background: "var(--color-stable)" }} />
                SYS NOMINAL
              </div>
              <div className="mono text-[8.5px] text-muted-foreground truncate">edge · jetson-agx · 47.2°C</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="h-7 w-7 grid place-items-center rounded-sm border border-border bg-surface-2 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <GlobalHeader />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

/* Reusable industrial section + page primitives */

export function PageHeader({
  eyebrow, title, sub, actions,
}: { eyebrow: string; title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border px-4 py-3">
      <div className="min-w-0">
        <div className="mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</div>
        <h1 className="font-serif text-[26px] leading-tight text-foreground">{title}</h1>
        {sub && <div className="mono text-[10.5px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function SectionLabel({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-1.5 mb-2">
      <div className="flex items-baseline gap-3">
        <h2 className="font-serif text-[16px] text-foreground tracking-tight">{title}</h2>
        {sub && <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{sub}</span>}
      </div>
      {right ?? <span className="mono text-[10px] text-muted-foreground">LIVE · synchronized</span>}
    </div>
  );
}
