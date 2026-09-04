import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/logi-api";
import { Chip, PageHeader, Panel, SkeletonRows } from "@/components/logi/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alert Center — LOGI-NER" },
      {
        name: "description",
        content:
          "Real-time road blockage, delay, high-risk route and weather alerts with affected routes, vehicles and recommended action.",
      },
      { property: "og:title", content: "Alert Center — LOGI-NER" },
      { property: "og:description", content: "Live logistics alerts for the North Eastern Region." },
    ],
  }),
  component: AlertsPage,
});

const sevTone: Record<string, string> = {
  Critical: "border-ember/50 bg-ember/10 text-ember",
  High: "border-brand2/50 bg-brand2/10 text-brand2",
  Medium: "border-brand/40 bg-brand/10 text-brand",
  Low: "border-line bg-ink2 text-mist",
};

function AlertsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["alerts"], queryFn: api.getAlerts });

  useEffect(() => {
    const t = setTimeout(() => {
      toast.error("Road blockage — NH-37 Km 61", {
        description: "Landslide confirmed. 26 vehicles rerouting via NH-2 Jessami spur.",
      });
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3">
      <PageHeader title="Alert Center" subtitle="websocket stream · 312 subscribers" />

      <Panel title="Live alert stream" subtitle="newest first">
        {isLoading ? (
          <SkeletonRows rows={5} />
        ) : (
          <ul className="space-y-2">
            {data?.map((a) => (
              <li key={a.id} className="rounded-xl border border-line bg-card/50 p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-sand">{a.category}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-mist">{a.message}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                      sevTone[a.severity],
                    )}
                  >
                    {a.severity}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Chip>{a.location}</Chip>
                  <Chip>{a.timestamp}</Chip>
                  {a.routes.map((r) => (
                    <Chip key={r}>{r}</Chip>
                  ))}
                  {a.vehicles.map((v) => (
                    <Chip key={v} tone="brand">
                      {v}
                    </Chip>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-sand">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Action · </span>
                  {a.action}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
