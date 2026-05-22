import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { Play, Square, Pause, Radio } from "lucide-react";

export const Route = createFileRoute("/stream-control")({
  head: () => ({ meta: [{ title: "Stream Control · WeldSight AI" }] }),
  component: StreamControl,
});

const STREAMS = [
  { id: "WS-01", state: "LIVE", fps: "60.0", bitrate: "8.4 Mb/s", lag: "0.3 ms", drop: "0.004 %" },
  { id: "WS-02", state: "LIVE", fps: "60.0", bitrate: "8.6 Mb/s", lag: "0.4 ms", drop: "0.011 %" },
  { id: "WS-03", state: "LIVE", fps: "59.8", bitrate: "8.1 Mb/s", lag: "0.5 ms", drop: "0.022 %" },
  { id: "WS-04", state: "DEGRADED", fps: "57.4", bitrate: "7.2 Mb/s", lag: "1.2 ms", drop: "0.184 %" },
  { id: "WS-05", state: "LIVE", fps: "60.0", bitrate: "8.5 Mb/s", lag: "0.4 ms", drop: "0.009 %" },
  { id: "WS-06", state: "PAUSED", fps: "0.0", bitrate: "—", lag: "—", drop: "—" },
  { id: "WS-07", state: "LIVE", fps: "60.0", bitrate: "8.8 Mb/s", lag: "0.4 ms", drop: "0.018 %" },
  { id: "WS-08", state: "LIVE", fps: "60.0", bitrate: "8.5 Mb/s", lag: "0.4 ms", drop: "0.012 %" },
  { id: "WS-09", state: "LIVE", fps: "60.0", bitrate: "8.7 Mb/s", lag: "0.4 ms", drop: "0.014 %" },
  { id: "WS-10", state: "OFFLINE", fps: "—", bitrate: "—", lag: "—", drop: "—" },
];

function stateClass(s: string) {
  if (s === "LIVE") return "chip chip-stable";
  if (s === "DEGRADED") return "chip chip-warn";
  if (s === "PAUSED") return "chip";
  return "chip chip-critical";
}

function StreamControl() {
  return (
    <>
      <PageHeader
        eyebrow="LIVE OPERATIONS · STREAM CONTROL"
        title="Stream Control"
        sub="Vision + telemetry stream orchestration · RTSP / Kafka / WebSocket pipelines"
        actions={
          <>
            <button className="chip chip-stable mono"><Play className="h-3 w-3" /> START ALL</button>
            <button className="chip mono"><Pause className="h-3 w-3" /> PAUSE ALL</button>
            <button className="chip chip-critical mono"><Square className="h-3 w-3" /> STOP ALL</button>
          </>
        }
      />
      <div className="p-3 space-y-5">
        <SectionLabel title="Stream Registry" sub="10 stations · RTSP · 1080p60 · H.264" />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Station</th>
                <th className="text-left px-3 py-2">State</th>
                <th className="text-right px-3 py-2">FPS</th>
                <th className="text-right px-3 py-2">Bitrate</th>
                <th className="text-right px-3 py-2">Lag</th>
                <th className="text-right px-3 py-2">Drop</th>
                <th className="text-right px-3 py-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody className="mono">
              {STREAMS.map((s, i) => (
                <tr key={s.id} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">
                    <span className="inline-flex items-center gap-1.5"><Radio className="h-3 w-3 text-muted-foreground" /> {s.id}</span>
                  </td>
                  <td className="px-3 py-2"><span className={stateClass(s.state) + " mono"}>{s.state}</span></td>
                  <td className="px-3 py-2 text-right text-foreground">{s.fps}</td>
                  <td className="px-3 py-2 text-right text-foreground">{s.bitrate}</td>
                  <td className="px-3 py-2 text-right text-foreground">{s.lag}</td>
                  <td className="px-3 py-2 text-right text-foreground">{s.drop}</td>
                  <td className="px-3 py-2 text-right pr-3">
                    <button className="chip mono mr-1">START</button>
                    <button className="chip mono">STOP</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
