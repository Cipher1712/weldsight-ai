import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/system/edge")({
  head: () => ({ meta: [{ title: "Edge Devices · WeldSight AI" }] }),
  component: Edge,
});

const NODES = [
  ["EDGE-JTX-01", "Jetson AGX Orin", "WS-01", "46.2 °C", "GPU 42 %", "MEM 5.4 GB", "ONLINE", "chip-stable"],
  ["EDGE-JTX-02", "Jetson AGX Orin", "WS-02", "47.8 °C", "GPU 51 %", "MEM 6.2 GB", "ONLINE", "chip-stable"],
  ["EDGE-JTX-03", "Jetson Orin NX",  "WS-03", "52.1 °C", "GPU 64 %", "MEM 6.8 GB", "ONLINE", "chip-stable"],
  ["EDGE-JTX-04", "Jetson AGX Orin", "WS-04", "58.4 °C", "GPU 78 %", "MEM 7.4 GB", "WARN",   "chip-warn"],
  ["EDGE-JTX-05", "Jetson AGX Orin", "WS-05", "47.1 °C", "GPU 44 %", "MEM 5.8 GB", "ONLINE", "chip-stable"],
  ["EDGE-JTX-06", "Jetson Orin NX",  "WS-06", "39.0 °C", "GPU 0 %",  "MEM 1.2 GB", "STDBY",  ""],
  ["EDGE-JTX-07", "Jetson AGX Orin", "WS-07", "47.2 °C", "GPU 56 %", "MEM 6.6 GB", "ONLINE", "chip-stable"],
  ["EDGE-JTX-08", "Jetson AGX Orin", "WS-08", "48.0 °C", "GPU 49 %", "MEM 6.0 GB", "ONLINE", "chip-stable"],
  ["EDGE-JTX-09", "Jetson AGX Orin", "WS-09", "49.6 °C", "GPU 53 %", "MEM 6.4 GB", "ONLINE", "chip-stable"],
  ["EDGE-JTX-10", "Jetson Orin NX",  "WS-10", "—",       "—",        "—",          "OFFLINE","chip-critical"],
];

function Edge() {
  return (
    <>
      <PageHeader
        eyebrow="SYSTEM · EDGE"
        title="Edge Devices"
        sub="On-station inference nodes · NVIDIA Jetson AGX Orin / Orin NX · 9 online · 1 offline"
      />
      <div className="p-3 space-y-4">
        <SectionLabel title="Edge Inventory" />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Node</th>
                <th className="text-left px-3 py-2">Hardware</th>
                <th className="text-left px-3 py-2">Station</th>
                <th className="text-right px-3 py-2">Temp</th>
                <th className="text-right px-3 py-2">GPU</th>
                <th className="text-right px-3 py-2">Mem</th>
                <th className="text-left px-3 py-2 pl-3">State</th>
              </tr>
            </thead>
            <tbody className="mono">
              {NODES.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">{r[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                  <td className="px-3 py-2 text-foreground">{r[2]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{r[3]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{r[4]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{r[5]}</td>
                  <td className="px-3 py-2 pl-3"><span className={`chip mono ${r[7]}`}>{r[6]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
