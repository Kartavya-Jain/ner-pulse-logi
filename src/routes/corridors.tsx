import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { NER_STATES, type RiskLevel } from "@/lib/logi-data";
import { PageHeader, Panel, RiskBadge, SkeletonRows } from "@/components/logi/primitives";

export const Route = createFileRoute("/corridors")({
  head: () => ({
    meta: [
      { title: "Risk Corridors — LOGI-NER" },
      {
        name: "description",
        content:
          "Ranked risk corridors across the eight North Eastern states with risk type, affected vehicles and network impact severity.",
      },
      { property: "og:title", content: "Risk Corridors — LOGI-NER" },
      { property: "og:description", content: "Corridor risk league table for NER logistics planning." },
    ],
  }),
  component: CorridorsPage,
});

const RISK_ORDER: RiskLevel[] = ["blocked", "high", "moderate", "safe"];

function CorridorsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["corridors"], queryFn: api.getCorridors });
  const [region, setRegion] = useState<string>("All NER");
  const [sort, setSort] = useState<"risk" | "vehicles">("risk");

  const rows = useMemo(() => {
    const list = (data ?? []).filter((c) => region === "All NER" || c.region === region);
    return [...list].sort((a, b) =>
      sort === "vehicles"
        ? b.vehicles - a.vehicles
        : RISK_ORDER.indexOf(a.risk) - RISK_ORDER.indexOf(b.risk),
    );
  }, [data, region, sort]);

  return (
    <div className="space-y-3">
      <PageHeader
        title="Risk Corridors"
        subtitle="ranked corridor risk · impact-weighted"
        right={
          <div className="flex shrink-0 gap-1.5">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-md border border-line bg-card px-2 py-1.5 font-mono text-[10px] text-sand outline-none focus:border-brand"
            >
              {NER_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "risk" | "vehicles")}
              className="rounded-md border border-line bg-card px-2 py-1.5 font-mono text-[10px] text-sand outline-none focus:border-brand"
            >
              <option value="risk">Sort: risk</option>
              <option value="vehicles">Sort: vehicles</option>
            </select>
          </div>
        }
      />

      <Panel title={`${rows.length} corridors monitored`} subtitle="tap a row for accessibility detail">
        {isLoading ? (
          <SkeletonRows rows={6} />
        ) : isError ? (
          <p className="text-[12px] text-ember">Corridor feed unavailable.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="font-mono text-[9px] uppercase tracking-[0.15em] text-mist">
                  <th className="py-2 pr-3 font-normal">Corridor</th>
                  <th className="py-2 pr-3 font-normal">Region</th>
                  <th className="py-2 pr-3 font-normal">Risk</th>
                  <th className="py-2 pr-3 font-normal">Risk type</th>
                  <th className="py-2 pr-3 font-normal">Vehicles</th>
                  <th className="py-2 pr-3 font-normal">Impact</th>
                  <th className="py-2 pr-3 font-normal">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((c) => (
                  <tr key={c.id} className="text-[12px] text-sand">
                    <td className="py-2.5 pr-3">{c.name}</td>
                    <td className="py-2.5 pr-3 text-mist">{c.region}</td>
                    <td className="py-2.5 pr-3">
                      <RiskBadge risk={c.risk} />
                    </td>
                    <td className="py-2.5 pr-3 text-mist">{c.riskType}</td>
                    <td className="tabular py-2.5 pr-3 font-mono">{c.vehicles}</td>
                    <td className="py-2.5 pr-3">{c.impact}</td>
                    <td className="py-2.5 pr-3 font-mono text-[10px] text-mist">{c.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
