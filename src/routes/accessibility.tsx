import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { NerMap } from "@/components/logi/ner-map";
import { Chip, ConfidenceBlock, Meter, PageHeader, Panel, RiskBadge, SkeletonRows } from "@/components/logi/primitives";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Dynamic Accessibility Map — LOGI-NER" },
      {
        name: "description",
        content:
          "Segment-level road accessibility across the North East: safe, moderate, high-risk and blocked corridors with flood and landslide probability.",
      },
      { property: "og:title", content: "Dynamic Accessibility Map — LOGI-NER" },
      {
        property: "og:description",
        content: "Live road accessibility status for every NER corridor with risk probability and data confidence.",
      },
    ],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  const { data, isLoading } = useQuery({ queryKey: ["corridors"], queryFn: api.getCorridors });
  const [selected, setSelected] = useState<string | null>("nh10");
  const segment = data?.find((c) => c.id === selected) ?? null;

  return (
    <div className="space-y-3">
      <PageHeader title="Dynamic Accessibility Map" subtitle="segment-level accessibility · 41,208 road segments" />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <NerMap height={420} selectedCorridor={selected} onSelectCorridor={setSelected} />

        <div className="space-y-3">
          <Panel title="Segment detail" subtitle={segment ? segment.name : "select a corridor on the map"}>
            {isLoading ? (
              <SkeletonRows rows={4} />
            ) : segment ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-sand">{segment.name}</p>
                    <p className="truncate font-mono text-[10px] text-mist">
                      {segment.district} district · {segment.region}
                    </p>
                  </div>
                  <RiskBadge risk={segment.risk} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Meter label="Flood probability" value={segment.floodProb} tone="sage" />
                  <Meter label="Landslide probability" value={segment.landslideProb} tone="ember" />
                </div>
                <div className="flex flex-wrap gap-1">
                  <Chip>{segment.riskType}</Chip>
                  <Chip>{segment.vehicles} vehicles</Chip>
                  <Chip>{segment.incidents} active incidents</Chip>
                  <Chip>updated {segment.updated}</Chip>
                </div>
                <div className="rounded-lg border border-brand/40 bg-brand/10 p-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand">Recommended action</p>
                  <p className="mt-1 text-[12px] text-sand">{segment.action}</p>
                </div>
                <ConfidenceBlock
                  confidence={segment.confidence}
                  sources={["Weather", "Terrain", "Satellite", "GPS", "Field report"]}
                />
              </div>
            ) : (
              <p className="text-[12px] text-mist">Tap any corridor line on the map to inspect it.</p>
            )}
          </Panel>

          <Panel title="Accessibility ledger" subtitle="ranked by current risk">
            <ul className="divide-y divide-line">
              {data?.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c.id)}
                    className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2 text-left"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] text-sand">{c.name}</p>
                      <p className="truncate font-mono text-[10px] text-mist">
                        {c.region} · {c.riskType}
                      </p>
                    </div>
                    <RiskBadge risk={c.risk} />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
