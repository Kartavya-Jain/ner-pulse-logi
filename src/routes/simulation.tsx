import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/logi-api";
import { NerMap } from "@/components/logi/ner-map";
import { Chip, Meter, PageHeader, Panel, RiskBadge, SkeletonRows } from "@/components/logi/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulation")({
  head: () => ({
    meta: [
      { title: "Disaster What-If Simulator — LOGI-NER" },
      {
        name: "description",
        content:
          "Simulate floods, landslides, blockages and multi-corridor failure across NER to see affected districts, routes, vehicles, cargo delays and alternatives.",
      },
      { property: "og:title", content: "Disaster What-If Simulator — LOGI-NER" },
      { property: "og:description", content: "Serious decision support for disaster-management planning in NER." },
    ],
  }),
  component: SimulationPage,
});

const SCENARIOS = ["Flood", "Landslide", "Road blockage", "Heavy rainfall", "Multiple corridor failure"];
const CORRIDORS = ["NH-10", "NH-27", "NH-37", "NH-6", "NH-29"];

function SimulationPage() {
  const [scenario, setScenario] = useState<string>("Road blockage");
  const [corridor, setCorridor] = useState("NH-10");

  const run = useMutation({
    mutationFn: () => api.runSimulation(scenario, corridor),
    onSuccess: (r) =>
      toast.message(`Simulation complete — ${corridor} ${scenario.toLowerCase()}`, {
        description: `${r.vehicles} vehicles and ${r.routes} routes affected.`,
      }),
  });

  return (
    <div className="space-y-3">
      <PageHeader title="Disaster What-If Simulator" subtitle="network-level impact modelling" />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
        <Panel title="Scenario setup" subtitle="choose hazard and corridor">
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[11px]",
                    scenario === s ? "border-brand/50 bg-brand/15 text-brand" : "border-line bg-card text-mist",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CORRIDORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCorridor(c)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 font-mono text-[11px]",
                    corridor === c ? "border-ember/50 bg-ember/15 text-ember" : "border-line bg-card text-mist",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={() => run.mutate()}
              disabled={run.isPending}
              className="w-full rounded-lg bg-brand py-2.5 text-[12px] font-semibold text-ink disabled:opacity-60"
            >
              {run.isPending ? "Propagating through network…" : `Run simulation — block ${corridor}`}
            </button>
            {run.data && (
              <div className="space-y-2 rounded-lg border border-line bg-ink2/60 p-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">
                  Network accessibility before → after
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="tabular font-mono text-lg text-sage">{run.data.accessibilityBefore}%</span>
                  <span className="text-mist">→</span>
                  <span className="tabular font-mono text-lg text-ember">{run.data.accessibilityAfter}%</span>
                </div>
                <Meter label="Post-event accessibility" value={run.data.accessibilityAfter} tone="ember" />
              </div>
            )}
          </div>
        </Panel>

        <div className="space-y-3">
          <NerMap height={340} simulatedBlock={run.data ? corridor : null} />

          {run.isPending && (
            <Panel title="Impact propagation" subtitle="computing">
              <SkeletonRows rows={4} />
            </Panel>
          )}

          {run.data && !run.isPending && (
            <Panel title="Impact propagation" subtitle={`${corridor} · ${scenario}`}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    ["Districts", String(run.data.districts.length)],
                    ["Routes", String(run.data.routes)],
                    ["Vehicles", String(run.data.vehicles)],
                    ["Cargo delayed", String(run.data.cargoDelayed)],
                    ["Delay", run.data.delay],
                  ].map(([k, v], i, arr) => (
                    <div key={k} className="flex items-center gap-1">
                      <div className="rounded-md border border-line bg-ink2 px-2 py-1 text-center">
                        <p className="font-mono text-[8px] uppercase tracking-wider text-mist">{k}</p>
                        <p className="tabular font-mono text-[12px] font-bold text-sand">{v}</p>
                      </div>
                      {i < arr.length - 1 && <span className="font-mono text-[10px] text-line">→</span>}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {run.data.districts.map((d) => (
                    <Chip key={d} tone="ember">
                      {d}
                    </Chip>
                  ))}
                </div>

                <div className="rounded-lg border border-ember/40 bg-ember/10 p-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ember">Estimated supply impact</p>
                  <p className="mt-1 text-[12px] text-sand">{run.data.supplyImpact}</p>
                </div>

                <div>
                  <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-mist">
                    Alternative emergency routes
                  </p>
                  <ul className="space-y-1.5">
                    {run.data.alternatives.map((a) => (
                      <li
                        key={a.name}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-line bg-card/50 px-2.5 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[12px] text-sand">{a.name}</p>
                          <p className="font-mono text-[10px] text-mist">ETA {a.eta}</p>
                        </div>
                        <RiskBadge risk={a.risk} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
