import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { NerMap } from "@/components/logi/ner-map";
import { Chip, PageHeader, Panel, RiskBadge, SkeletonRows } from "@/components/logi/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/supply")({
  head: () => ({
    meta: [
      { title: "Supply Status & Cargo Priority — LOGI-NER" },
      {
        name: "description",
        content:
          "Priority-aware cargo monitoring across NER: medical, food, emergency equipment and essential commodities in transit, delayed or at risk.",
      },
      { property: "og:title", content: "Supply Status & Cargo Priority — LOGI-NER" },
      { property: "og:description", content: "Essential cargo prioritisation and supply destination monitoring." },
    ],
  }),
  component: SupplyPage,
});

const tierTone: Record<string, string> = {
  Critical: "border-ember/50 bg-ember/10 text-ember",
  Essential: "border-brand/40 bg-brand/10 text-brand",
  Normal: "border-line bg-ink2 text-mist",
};

function SupplyPage() {
  const status = useQuery({ queryKey: ["supply"], queryFn: api.getSupplyStatus });
  const cargo = useQuery({ queryKey: ["cargo"], queryFn: api.getCargo });

  return (
    <div className="space-y-3">
      <PageHeader title="Supply Status" subtitle="priority-aware essential cargo movement" />

      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {status.isLoading && <SkeletonRows rows={2} />}
        {status.data?.map((s) => (
          <div key={s.category} className="rounded-xl border border-line bg-card/60 p-2.5">
            <p className="truncate font-mono text-[9px] uppercase tracking-[0.15em] text-mist">{s.category}</p>
            <p className="tabular mt-1 text-2xl font-semibold leading-none text-sand">{s.inTransit}</p>
            <p className="mt-1 font-mono text-[10px] text-mist">in transit</p>
            <div className="mt-2 grid grid-cols-2 gap-1 font-mono text-[9px]">
              <span className="text-sage">✓ {s.delivered} delivered</span>
              <span className="text-brand">⧗ {s.delayed} delayed</span>
              <span className="text-brand2">⚠ {s.atRisk} at risk</span>
              <span className="text-ember">● {s.critical} critical</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Panel title="Cargo queue" subtitle="priority order — essential cargo routed safest-first">
          {cargo.isLoading ? (
            <SkeletonRows rows={5} />
          ) : (
            <ul className="space-y-2">
              {cargo.data
                ?.slice()
                .sort((a, b) => a.priority - b.priority)
                .map((c) => (
                  <li key={c.id} className="rounded-xl border border-line bg-card/50 p-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-sand">
                          Priority {c.priority} — {c.tier}
                        </p>
                        <p className="truncate text-[11px] text-mist">{c.type}</p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                          tierTone[c.tier],
                        )}
                      >
                        {c.id}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <Chip>{c.destination}</Chip>
                      <Chip>ETA {c.eta}</Chip>
                      <RiskBadge risk={c.risk} />
                      <Chip tone={c.status === "At risk" ? "ember" : "brand"}>{c.status}</Chip>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-3">
          <NerMap height={340} compact />
          <Panel title="Supply destinations" subtitle="depots, hospitals and relief camps">
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {[
                "Imphal District Hospital",
                "Kohima Civil Hospital",
                "Jorhat Relief Depot",
                "Nagaon Flood Camp",
                "Zunheboto CHC",
                "Sabroom Border Depot",
                "Aizawl Warehouse",
                "Gangtok Command Store",
              ].map((d) => (
                <li key={d} className="rounded-lg border border-line bg-ink2/60 px-2 py-1.5 text-[11px] text-sand">
                  {d}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
