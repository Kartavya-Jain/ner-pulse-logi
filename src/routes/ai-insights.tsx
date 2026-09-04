import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import {
  Chip,
  ConfidenceBlock,
  KindBadge,
  Meter,
  PageHeader,
  Panel,
  RiskBadge,
  SkeletonRows,
} from "@/components/logi/primitives";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Risk Engine & Insights — LOGI-NER" },
      {
        name: "description",
        content:
          "Flood, landslide, road condition and ETA delay predictions with probability, confidence, contributing factors and explainable AI reasoning.",
      },
      { property: "og:title", content: "AI Risk Engine & Insights — LOGI-NER" },
      { property: "og:description", content: "Explainable disruption prediction for North East India logistics." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const predictions = useQuery({ queryKey: ["predictions"], queryFn: api.getPredictions });
  const insights = useQuery({ queryKey: ["insights"], queryFn: api.getInsights });

  return (
    <div className="space-y-3">
      <PageHeader title="AI Risk Engine" subtitle="4 models loaded · fusion of 5 signal families" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {predictions.isLoading && <SkeletonRows rows={3} />}
        {predictions.data?.map((p) => (
          <article key={p.id} className="panel p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <p className="truncate text-[13px] font-semibold text-sand">{p.name}</p>
              <RiskBadge risk={p.risk} />
            </div>
            <p className="tabular mt-2 font-mono text-3xl font-bold leading-none text-brand">{p.probability}%</p>
            <p className="mt-1 font-mono text-[10px] text-mist">probability · confidence {p.confidence}%</p>
            <div className="mt-3 space-y-1.5">
              {p.factors.map((f) => (
                <Meter key={f.label} label={f.label} value={f.weight} tone="brand2" />
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-brand/40 bg-brand/10 p-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand">Recommended action</p>
              <p className="mt-1 text-[11px] text-sand">{p.action}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Panel title="Why is NH-10 high risk?" subtitle="explainable AI">
          <div className="space-y-2">
            {[
              { label: "Heavy rainfall forecast (118mm/24h)", weight: 92 },
              { label: "Steep terrain (mean slope 24°)", weight: 78 },
              { label: "Previous landslide history (3 events/2y)", weight: 71 },
              { label: "Reduced road accessibility (single lane)", weight: 63 },
              { label: "Recent field report FR-208", weight: 55 },
            ].map((f) => (
              <Meter key={f.label} label={f.label} value={f.weight} tone="ember" suffix="" />
            ))}
            <ConfidenceBlock confidence={84} sources={["Weather", "Terrain", "Satellite", "GPS", "Field report"]} />
          </div>
        </Panel>

        <Panel title="Insight stream" subtitle="predictions are never shown as confirmed incidents">
          {insights.isLoading ? (
            <SkeletonRows rows={5} />
          ) : (
            <ul className="space-y-2">
              {insights.data?.map((i) => (
                <li key={i.id} className="rounded-xl border border-line bg-card/50 p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <p className="truncate text-[12px] font-semibold text-sand">{i.title}</p>
                    <KindBadge kind={i.kind} />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-snug text-mist">{i.body}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Chip>{i.tag}</Chip>
                    <Chip tone={i.kind === "verified" ? "sage" : "brand"}>confidence {i.confidence}%</Chip>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
