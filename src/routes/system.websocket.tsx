import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/system/websocket")({
  head: () => ({ meta: [{ title: "WebSocket Status · WeldSight AI" }] }),
  component: WSStatus,
});

const CONNS = [
  ["ws/telemetry · WS-01", "CONNECTED", "0.3 ms", "1,024 msg/s", "chip-stable"],
  ["ws/telemetry · WS-02", "CONNECTED", "0.4 ms", "1,022 msg/s", "chip-stable"],
  ["ws/telemetry · WS-03", "CONNECTED", "0.5 ms", "1,019 msg/s", "chip-stable"],
  ["ws/telemetry · WS-04", "DEGRADED",  "1.2 ms", "997 msg/s",   "chip-warn"],
  ["ws/telemetry · WS-05", "CONNECTED", "0.4 ms", "1,024 msg/s", "chip-stable"],
  ["ws/telemetry · WS-06", "PAUSED",    "—",      "—",            ""],
  ["ws/telemetry · WS-07", "CONNECTED", "0.4 ms", "1,024 msg/s", "chip-stable"],
  ["ws/telemetry · WS-08", "CONNECTED", "0.4 ms", "1,023 msg/s", "chip-stable"],
  ["ws/inference",         "CONNECTED", "11.2 ms","30 inf/s",    "chip-stable"],
  ["ws/events",            "CONNECTED", "8 ms",   "12 evt/min",  "chip-stable"],
];

function WSStatus() {
  return (
    <>
      <PageHeader
        eyebrow="SYSTEM · TRANSPORT"
        title="WebSocket Status"
        sub="Kafka-backed websocket fan-out · 10 connections · 1 degraded"
      />
      <div className="p-3 space-y-4">
        <SectionLabel title="Active Connections" />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Connection</th>
                <th className="text-left px-3 py-2">State</th>
                <th className="text-right px-3 py-2">Latency</th>
                <th className="text-right px-3 py-2 pr-3">Throughput</th>
              </tr>
            </thead>
            <tbody className="mono">
              {CONNS.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">{r[0]}</td>
                  <td className="px-3 py-2"><span className={`chip mono ${r[4]}`}>{r[1]}</span></td>
                  <td className="px-3 py-2 text-right text-foreground">{r[2]}</td>
                  <td className="px-3 py-2 text-right text-foreground pr-3">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
