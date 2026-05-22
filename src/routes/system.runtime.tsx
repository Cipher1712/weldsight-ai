import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/system/runtime")({
  head: () => ({ meta: [{ title: "Runtime Monitoring · WeldSight AI" }] }),
  component: Runtime,
});

function Bar({ label, val, color = "var(--color-cyan)" }: { label: string; val: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between mono text-[10px] mb-0.5">
        <span className="text-muted-foreground uppercase tracking-[0.16em] text-[9px]">{label}</span>
        <span className="text-foreground">{val}%</span>
      </div>
      <div className="h-1.5 rounded-sm bg-surface-2 overflow-hidden">
        <div className="h-full" style={{ width: `${val}%`, background: color }} />
      </div>
    </div>
  );
}

function Runtime() {
  return (
    <>
      <PageHeader
        eyebrow="SYSTEM · RUNTIME"
        title="Runtime Monitoring"
        sub="Inference queue · CPU / GPU / memory · model runtime · stream uptime"
      />
      <div className="p-3 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="panel p-3 space-y-2.5">
            <div className="font-serif text-[15px] text-foreground">Compute Utilisation</div>
            <Bar label="CPU"          val={42} color="var(--color-cyan)" />
            <Bar label="GPU · CUDA"   val={56} color="var(--color-stable)" />
            <Bar label="Memory"       val={66} color="var(--color-warn)" />
            <Bar label="Disk · I/O"   val={28} color="var(--color-cyan)" />
          </div>
          <div className="panel p-3 space-y-2.5">
            <div className="font-serif text-[15px] text-foreground">Inference Queue</div>
            <Bar label="Depth · WS-07" val={18} color="var(--color-stable)" />
            <Bar label="Depth · WS-04" val={72} color="var(--color-warn)" />
            <Bar label="Throughput"    val={88} color="var(--color-cyan)" />
            <div className="mono text-[10.5px] text-muted-foreground pt-1">enqueued · 14 · drained at 1,184 / s</div>
          </div>
          <div className="panel p-3">
            <div className="font-serif text-[15px] text-foreground mb-2">Stream Uptime · 24 h</div>
            <div className="grid grid-cols-24 gap-[2px]">
              {Array.from({ length: 96 }).map((_, i) => {
                const ok = !(i === 31 || i === 32 || i === 64);
                return (
                  <span
                    key={i}
                    className="h-3 rounded-[1px]"
                    style={{ background: ok ? "color-mix(in oklch, var(--color-stable) 60%, transparent)" : "var(--color-critical)" }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mono text-[10px] text-muted-foreground mt-2">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
            </div>
          </div>
        </div>

        <SectionLabel title="Model Runtime" />
        <div className="panel p-3 grid grid-cols-2 md:grid-cols-4 gap-3 mono text-[11.5px]">
          {[
            ["MODEL", "WELD-VISION v4.2"],
            ["RUNTIME", "TensorRT 9.2"],
            ["PRECISION", "FP16"],
            ["BATCH", "1 · streaming"],
            ["WARMUP", "complete"],
            ["INFERENCE p50", "11.2 ms"],
            ["INFERENCE p99", "18.4 ms"],
            ["LAST RELOAD", "42 d ago"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-muted-foreground text-[9px] uppercase tracking-[0.16em]">{k}</div>
              <div className="text-foreground">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
