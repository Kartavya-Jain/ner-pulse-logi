import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/logi-api";
import { Chip, Meter, PageHeader, Panel, RiskBadge, SkeletonRows } from "@/components/logi/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/route-engine")({
  head: () => ({
    meta: [
      { title: "Smart Route Engine — LOGI-NER" },
      {
        name: "description",
        content:
          "Risk-aware route planning for NER logistics: compare fastest, recommended and alternate routes scored on flood, landslide, road condition, weather and cargo priority.",
      },
      { property: "og:title", content: "Smart Route Engine — LOGI-NER" },
      { property: "og:description", content: "Compare fastest vs safest routes with AI recommendation and reasoning." },
    ],
  }),
  component: RouteEnginePage,
});

const CARGO_TYPES = [
  "Medical supplies (Essential)",
  "Food supplies (Essential)",
  "Emergency equipment (Essential)",
  "Essential commodities (Essential)",
  "General goods (Normal)",
];

function RouteEnginePage() {
  const [form, setForm] = useState({
    origin: "Dimapur, Nagaland",
    destination: "Imphal, Manipur",
    cargo: CARGO_TYPES[0],
    vehicle: "TRK-1042 (16T truck)",
    priority: "Priority 1 — Critical",
    departure: "Today 14:30",
  });

  const routes = useQuery({ queryKey: ["routes"], queryFn: api.getRouteOptions, enabled: false });
  const evaluate = useMutation({
    mutationFn: () => api.getRouteOptions(),
    onSuccess: () => toast.success("Route B recommended", { description: "41% lower disruption risk for +28 min ETA." }),
  });

  const data = evaluate.data ?? routes.data;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="space-y-3">
      <PageHeader title="Smart Route Engine" subtitle="risk-aware, impact-aware, priority-aware routing" />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <Panel title="Shipment brief" subtitle="inputs to the optimisation engine">
          <div className="space-y-2">
            {(
              [
                ["Origin", "origin", "text"],
                ["Destination", "destination", "text"],
                ["Departure time", "departure", "text"],
              ] as const
            ).map(([label, key]) => (
              <label key={key} className="block">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">{label}</span>
                <input
                  value={form[key]}
                  onChange={set(key)}
                  className="mt-1 w-full rounded-lg border border-line bg-ink2 px-2.5 py-2 text-[12px] text-sand outline-none focus:border-brand"
                />
              </label>
            ))}
            <label className="block">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Cargo type</span>
              <select
                value={form.cargo}
                onChange={set("cargo")}
                className="mt-1 w-full rounded-lg border border-line bg-ink2 px-2.5 py-2 text-[12px] text-sand outline-none focus:border-brand"
              >
                {CARGO_TYPES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Vehicle</span>
              <select
                value={form.vehicle}
                onChange={set("vehicle")}
                className="mt-1 w-full rounded-lg border border-line bg-ink2 px-2.5 py-2 text-[12px] text-sand outline-none focus:border-brand"
              >
                <option>TRK-1042 (16T truck)</option>
                <option>TRK-2210 (9T truck)</option>
                <option>AMB-104 (ambulance)</option>
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Priority</span>
              <select
                value={form.priority}
                onChange={set("priority")}
                className="mt-1 w-full rounded-lg border border-line bg-ink2 px-2.5 py-2 text-[12px] text-sand outline-none focus:border-brand"
              >
                <option>Priority 1 — Critical</option>
                <option>Priority 2 — Essential</option>
                <option>Priority 3 — Normal</option>
              </select>
            </label>
            <button
              onClick={() => evaluate.mutate()}
              disabled={evaluate.isPending}
              className="w-full rounded-lg bg-brand py-2.5 text-[12px] font-semibold text-ink disabled:opacity-60"
            >
              {evaluate.isPending ? "Evaluating corridors…" : "Evaluate routes"}
            </button>
            <p className="font-mono text-[9px] leading-relaxed text-mist">
              Scored on distance, road condition, flood risk, landslide risk, traffic, weather, accessibility, ETA and
              cargo priority.
            </p>
          </div>
        </Panel>

        <div className="space-y-3">
          {evaluate.isPending && (
            <Panel title="Route alternatives" subtitle="running optimisation">
              <SkeletonRows rows={3} />
            </Panel>
          )}

          {!evaluate.isPending && !data && (
            <Panel title="Route alternatives" subtitle="awaiting evaluation">
              <p className="text-[12px] text-mist">
                Submit the shipment brief to compare fastest, recommended and alternate corridors.
              </p>
            </Panel>
          )}

          {!evaluate.isPending &&
            data?.map((r) => (
              <article
                key={r.id}
                className={cn(
                  "rounded-2xl border p-3",
                  r.kind === "recommended"
                    ? "border-brand/50 bg-card shadow-lg shadow-brand/10"
                    : "border-line bg-card/50",
                )}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-sand">{r.label}</p>
                    <p className="truncate font-mono text-[10px] text-mist">
                      {r.distanceKm} km · via {r.via.join(" → ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {r.kind === "recommended" && <Chip tone="brand">AI recommended</Chip>}
                    <RiskBadge risk={r.risk} />
                  </div>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-line bg-ink2/60 p-2">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-mist">ETA</p>
                    <p className="tabular font-mono text-[15px] font-bold text-sand">{r.eta}</p>
                  </div>
                  <Meter label="Disruption risk score" value={r.riskScore} tone={r.riskScore > 60 ? "ember" : "sage"} />
                </div>
                <ul className="mt-2 space-y-1">
                  {r.notes.map((n) => (
                    <li key={n} className="text-[11px] text-mist">
                      · {n}
                    </li>
                  ))}
                </ul>
                {r.kind === "recommended" && (
                  <button
                    onClick={() => toast.success("Route B dispatched to TRK-1042")}
                    className="mt-2.5 w-full rounded-lg bg-brand py-2 text-[12px] font-semibold text-ink"
                  >
                    Dispatch this route
                  </button>
                )}
              </article>
            ))}

          {!evaluate.isPending && data && (
            <Panel title="Why Route B?" subtitle="explainable AI">
              <ul className="space-y-1.5 text-[11px] text-sand">
                {[
                  "Avoids the verified NH-37 Km 61 blockage",
                  "Landslide probability along chosen segments stays below 25%",
                  "Cargo is Priority 1 medical — safety weighted above speed",
                  "Only +28 minutes ETA versus the fastest option",
                  "Two fallback corridors remain available mid-journey",
                ].map((l) => (
                  <li key={l} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                    {l}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
