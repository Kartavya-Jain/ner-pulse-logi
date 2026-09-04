import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { NerMap } from "@/components/logi/ner-map";
import { Chip, Meter, PageHeader, Panel, RiskBadge, SkeletonRows } from "@/components/logi/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vehicles")({
  head: () => ({
    meta: [
      { title: "Live Vehicle Tracking — LOGI-NER" },
      {
        name: "description",
        content:
          "Live GPS tracking of logistics vehicles across NER with cargo, route risk, delivery progress, ETA and risk alerts.",
      },
      { property: "og:title", content: "Live Vehicle Tracking — LOGI-NER" },
      { property: "og:description", content: "Track fleet position, cargo priority and route risk in real time." },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["vehicles"], queryFn: api.getVehicles });
  const [selected, setSelected] = useState<string>("TRK-1042");
  const vehicle = data?.find((v) => v.id === selected);

  return (
    <div className="space-y-3">
      <PageHeader title="Live Vehicle Tracking" subtitle="147 GPS streams · 820 ms telemetry" />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <NerMap height={380} />

        <div className="space-y-3">
          {vehicle && (
            <Panel title={vehicle.id} subtitle={`${vehicle.driver} · ${vehicle.cargo}`}>
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <RiskBadge risk={vehicle.risk} />
                  <Chip tone={vehicle.status === "On route" ? "sage" : "ember"}>{vehicle.status}</Chip>
                  <Chip tone="brand">Priority {vehicle.priority}</Chip>
                </div>
                <dl className="grid grid-cols-2 gap-2">
                  {[
                    ["Current location", vehicle.location],
                    ["Destination", vehicle.destination],
                    ["Speed", `${vehicle.speed} km/h`],
                    ["ETA", vehicle.eta],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-line bg-ink2/60 p-2">
                      <dt className="font-mono text-[9px] uppercase tracking-wider text-mist">{k}</dt>
                      <dd className="truncate text-[12px] text-sand">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Meter label="Delivery progress" value={vehicle.progress} tone="sage" />
                <div className="rounded-lg border border-line bg-ink2/60 p-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Route history</p>
                  <ol className="mt-1 space-y-1 text-[11px] text-sand">
                    <li>· Dispatched — depot gate cleared</li>
                    <li>· Checkpoint passed — 12 min queue</li>
                    <li>· Risk alert — entered high-risk segment</li>
                    <li>· Rerouting — alternative corridor accepted</li>
                  </ol>
                </div>
              </div>
            </Panel>
          )}

          <Panel title="Fleet" subtitle="tap a vehicle to inspect">
            {isLoading ? (
              <SkeletonRows rows={5} />
            ) : (
              <ul className="divide-y divide-line">
                {data?.map((v) => (
                  <li key={v.id}>
                    <button
                      onClick={() => setSelected(v.id)}
                      className={cn(
                        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2 text-left",
                        selected === v.id && "text-brand",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[12px]">{v.id}</p>
                        <p className="truncate font-mono text-[10px] text-mist">
                          {v.cargo} · ETA {v.eta}
                        </p>
                      </div>
                      <RiskBadge risk={v.risk} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
