import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { Chip, PageHeader, Panel, SkeletonRows } from "@/components/logi/primitives";

export const Route = createFileRoute("/admin/system-health")({
  head: () => ({
    meta: [
      { title: "System Health — LOGI-NER Admin" },
      {
        name: "description",
        content: "Operational status of the API gateway, GPS stream, weather feed, GIS service, ML engine and realtime socket layer.",
      },
      { property: "og:title", content: "System Health — LOGI-NER Admin" },
      { property: "og:description", content: "Platform service status for the NER logistics command centre." },
    ],
  }),
  component: HealthPage,
});

function HealthPage() {
  const health = useQuery({ queryKey: ["systemHealth"], queryFn: api.getSystemHealth });

  return (
    <div className="space-y-3">
      <PageHeader title="System Health" subtitle="service status and latency" />
      {health.isLoading ? (
        <SkeletonRows rows={4} />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {health.data?.map((h) => (
            <div key={h.id} className="panel grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-3">
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-sand">{h.name}</p>
                <p className="truncate font-mono text-[10px] text-mist">{h.note}</p>
              </div>
              <Chip tone={h.status === "Operational" ? "sage" : "ember"}>{h.status}</Chip>
            </div>
          ))}
        </div>
      )}
      <Panel title="Model registry" subtitle="4 models loaded">
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {[
            "flood-risk v2.4 · AUC 0.91",
            "landslide-risk v1.8 · AUC 0.88",
            "road-condition v3.1 · MAE 0.12",
            "eta-delay v2.0 · MAPE 8.4%",
          ].map((m) => (
            <li key={m} className="rounded-lg border border-line bg-ink2/60 px-2.5 py-2 font-mono text-[11px] text-sand">
              {m}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
