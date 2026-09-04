import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/logi-api";
import { NerMap } from "@/components/logi/ner-map";
import { ModuleRail } from "@/components/logi/app-shell";
import {
  Chip,
  ConfidenceBlock,
  KindBadge,
  Meter,
  Panel,
  PageHeader,
  RiskBadge,
  SkeletonRows,
} from "@/components/logi/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOGI-NER Command Center — Logistics Intelligence for North East India" },
      {
        name: "description",
        content:
          "LOGI-NER by TerraPulse fuses road, weather, terrain, GPS and field signals into predictive disruption insight and risk-aware logistics decisions across the 8 NER states.",
      },
      { property: "og:title", content: "LOGI-NER Command Center — TerraPulse" },
      {
        property: "og:description",
        content: "From disruption detection to intelligent logistics decisions across North East India.",
      },
    ],
  }),
  component: Dashboard,
});

const PIPELINE = [
  "Data fusion",
  "AI prediction",
  "Impact analysis",
  "Cargo priority",
  "Risk routing",
  "Live monitoring",
  "Field verification",
];

function Dashboard() {
  const kpis = useQuery({ queryKey: ["kpis"], queryFn: api.getKpis });
  const disruptions = useQuery({ queryKey: ["disruptions"], queryFn: api.getDisruptions });
  const impact = useQuery({ queryKey: ["impact"], queryFn: api.getNetworkImpact });

  return (
    <div className="space-y-3">
      <PageHeader
        title="LOGI-NER COMMAND CENTER"
        subtitle="From disruption detection to intelligent logistics decisions"
        right={
          <Link
            to="/simulation"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-ink sm:flex"
          >
            What-if simulator <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      {/* pipeline strip */}
      <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1">
        {PIPELINE.map((p, i) => (
          <div key={p} className="flex shrink-0 items-center gap-1">
            <span className="rounded-md border border-line bg-card/60 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-mist">
              {p}
            </span>
            {i < PIPELINE.length - 1 && <span className="font-mono text-[10px] text-line">→</span>}
          </div>
        ))}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.isLoading && <SkeletonRows rows={2} />}
        {kpis.data?.map((k) => (
          <div key={k.id} className="rounded-xl border border-line bg-card/60 p-2.5">
            <p className="truncate font-mono text-[9px] uppercase tracking-[0.15em] text-mist">{k.label}</p>
            <p
              className={cn(
                "tabular mt-1 text-2xl font-semibold leading-none",
                k.tone === "brand" && "text-brand",
                k.tone === "sage" && "text-sage",
                k.tone === "ember" && "text-ember",
                k.tone === "brand2" && "text-brand2",
                k.tone === "sand" && "text-sand",
              )}
            >
              {k.value}
            </p>
            <p className="mt-1 truncate font-mono text-[10px] text-mist">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <NerMap height={360} />

        <div className="space-y-3">
          <Panel
            title="Disruption Intelligence"
            subtitle="active + predicted events"
            right={<span className="font-mono text-[10px] text-mist">updated 4s ago</span>}
          >
            {disruptions.isLoading ? (
              <SkeletonRows rows={3} />
            ) : (
              <div className="space-y-2">
                {disruptions.data?.map((d) => (
                  <article
                    key={d.id}
                    className={cn(
                      "rounded-xl border p-3",
                      d.risk === "high" || d.risk === "blocked"
                        ? "border-ember/40 bg-card shadow-lg shadow-ember/10"
                        : "border-line bg-card/50",
                    )}
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-sand">{d.title}</p>
                        <p className="truncate font-mono text-[10px] text-mist">
                          {d.corridor} · {d.region}
                        </p>
                      </div>
                      <RiskBadge risk={d.risk} />
                    </div>
                    <p className="mt-1.5 text-[11px] leading-snug text-mist">{d.detail}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <KindBadge kind={d.kind} />
                      <Chip>{d.window}</Chip>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-3">
                      <Meter label="Probability" value={d.probability} tone="ember" />
                      <Meter label="Confidence" value={d.confidence} tone="sage" />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {d.signals.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/route-engine"
                        className="flex-1 rounded-lg bg-brand py-2 text-center text-[12px] font-semibold text-ink"
                      >
                        Reroute fleet
                      </Link>
                      <Link
                        to="/simulation"
                        className="flex-1 rounded-lg border border-line bg-ink2 py-2 text-center text-[12px] font-medium text-sand"
                      >
                        What-if
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Network impact" subtitle="impact-aware routing, not shortest distance">
            {impact.data && (
              <div className="space-y-2.5">
                <p className="text-[12px] font-semibold text-sand">{impact.data.corridor}</p>
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { k: "Blocked corridor", v: "NH-37" },
                    { k: "Districts", v: String(impact.data.districts.length) },
                    { k: "Routes", v: String(impact.data.routes) },
                    { k: "Vehicles", v: String(impact.data.vehicles) },
                    { k: "Delay", v: impact.data.delay },
                  ].map((s, i, arr) => (
                    <div key={s.k} className="flex items-center gap-1">
                      <div className="rounded-md border border-line bg-ink2 px-2 py-1 text-center">
                        <p className="font-mono text-[8px] uppercase tracking-wider text-mist">{s.k}</p>
                        <p className="tabular font-mono text-[11px] font-bold text-sand">{s.v}</p>
                      </div>
                      {i < arr.length - 1 && <span className="font-mono text-[10px] text-line">→</span>}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {impact.data.districts.map((d) => (
                    <Chip key={d}>{d}</Chip>
                  ))}
                </div>
                <div className="rounded-lg border border-line bg-ink2/60 p-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Alternatives</p>
                  <ul className="mt-1 space-y-1">
                    {impact.data.alternatives.map((a) => (
                      <li key={a} className="text-[11px] text-sand">
                        · {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <ConfidenceBlock
                  confidence={88}
                  sources={["GIS", "Weather", "Satellite", "GPS", "Field report"]}
                />
              </div>
            )}
          </Panel>
        </div>
      </div>

      <ModuleRail />
    </div>
  );
}
