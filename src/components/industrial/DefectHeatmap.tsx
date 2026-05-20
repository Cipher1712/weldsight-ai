import { useMemo } from "react";

const STATIONS = ["WS-01","WS-02","WS-03","WS-04","WS-05","WS-06","WS-07","WS-08","WS-09","WS-10"];
const ZONES = ["Root","Fill-1","Fill-2","Cap-1","Cap-2","HAZ-L","HAZ-R","Seam-A","Seam-B","Tail"];

function hash(x: number, y: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export function DefectHeatmap() {
  const cells = useMemo(() => {
    const arr: { s: number; z: number; v: number }[] = [];
    for (let s = 0; s < STATIONS.length; s++)
      for (let z = 0; z < ZONES.length; z++) {
        let v = hash(s, z);
        if (s === 6 && z >= 2 && z <= 4) v = Math.min(1, v + 0.55); // WS-07 hotspot
        if (s === 2 && z === 5) v = Math.min(1, v + 0.4);
        arr.push({ s, z, v });
      }
    return arr;
  }, []);

  const color = (v: number) => {
    if (v < 0.25) return "color-mix(in oklch, var(--color-stable) 18%, transparent)";
    if (v < 0.5)  return "color-mix(in oklch, var(--color-warn) 28%, transparent)";
    if (v < 0.75) return "color-mix(in oklch, var(--color-high) 45%, transparent)";
    return "color-mix(in oklch, var(--color-critical) 70%, transparent)";
  };

  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-title-serif">Defect Heatmap</span>
          <span className="chip mono">Station × Zone · last 60 min</span>
        </div>
        <span className="chip chip-high mono">WS-07 hotspot</span>
      </div>
      <div className="p-3 overflow-auto">
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(${ZONES.length}, minmax(28px, 1fr))`, gap: 2 }}>
          <div />
          {ZONES.map(z => (
            <div key={z} className="mono text-[9px] text-muted-foreground uppercase tracking-wider text-center pb-1">{z}</div>
          ))}
          {STATIONS.map((s, si) => (
            <>
              <div key={s} className="mono text-[10px] text-muted-foreground self-center pr-2">{s}</div>
              {ZONES.map((_, zi) => {
                const c = cells[si * ZONES.length + zi];
                return (
                  <div
                    key={zi}
                    title={`${s} · ${ZONES[zi]} · ${(c.v * 100).toFixed(0)}%`}
                    className="aspect-square border border-border/60"
                    style={{ background: color(c.v) }}
                  />
                );
              })}
            </>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 mono text-[9.5px] text-muted-foreground">
          <span>SEVERITY</span>
          {[0.1, 0.35, 0.6, 0.85].map((v, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 border border-border" style={{ background: color(v) }} />
              {["low","mod","high","crit"][i]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
