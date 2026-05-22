import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/system/api-health")({
  head: () => ({ meta: [{ title: "API Health · WeldSight AI" }] }),
  component: ApiHealth,
});

const EPS = [
  ["GET  /api/telemetry/stream",       "p50 4ms",  "p99 18ms", "OK", "chip-stable"],
  ["POST /api/inference",              "p50 11ms", "p99 32ms", "OK", "chip-stable"],
  ["POST /api/upload",                 "p50 142ms","p99 612ms","OK", "chip-stable"],
  ["POST /api/train/start",            "p50 86ms", "p99 240ms","OK", "chip-stable"],
  ["GET  /api/profiles",               "p50 6ms",  "p99 22ms", "OK", "chip-stable"],
  ["GET  /api/events",                 "p50 9ms",  "p99 41ms", "DEG","chip-warn"],
  ["POST /api/ack",                    "p50 8ms",  "p99 24ms", "OK", "chip-stable"],
  ["WS   /ws/telemetry",               "0.4 ms",   "1.2 ms",   "OK", "chip-stable"],
];

function ApiHealth() {
  return (
    <>
      <PageHeader
        eyebrow="SYSTEM · API"
        title="API Health"
        sub="FastAPI gateway · 8 routes · 1 degraded · uptime 42d 06:18"
      />
      <div className="p-3 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border border border-border rounded-md overflow-hidden">
          {[
            ["UPTIME", "42d 06:18", "var(--color-stable)"],
            ["REQ/S", "1,284", "var(--color-foreground)"],
            ["ERR RATE", "0.04 %", "var(--color-stable)"],
            ["P99 LATENCY", "612 ms", "var(--color-warn)"],
            ["DEGRADED", "1 / 8", "var(--color-warn)"],
          ].map(([k, v, c]) => (
            <div key={k} className="bg-panel px-3 py-2">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{k}</div>
              <div className="mono text-[15px]" style={{ color: c as string }}>{v}</div>
            </div>
          ))}
        </div>

        <SectionLabel title="Endpoint Status" />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Endpoint</th>
                <th className="text-right px-3 py-2">p50</th>
                <th className="text-right px-3 py-2">p99</th>
                <th className="text-left px-3 py-2 pl-3">State</th>
              </tr>
            </thead>
            <tbody className="mono">
              {EPS.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">{r[0]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{r[1]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{r[2]}</td>
                  <td className="px-3 py-2 pl-3"><span className={`chip mono ${r[4]}`}>{r[3]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
