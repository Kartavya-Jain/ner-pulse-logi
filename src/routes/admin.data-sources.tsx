import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { Chip, PageHeader, Panel, SkeletonRows } from "@/components/logi/primitives";

export const Route = createFileRoute("/admin/data-sources")({
  head: () => ({
    meta: [
      { title: "Data Sources — LOGI-NER Admin" },
      {
        name: "description",
        content: "Status of the GIS road graph, IMD weather feed, GPS telemetry, satellite terrain model and field report sync pipeline.",
      },
      { property: "og:title", content: "Data Sources — LOGI-NER Admin" },
      { property: "og:description", content: "Signal families feeding the NER risk engine." },
    ],
  }),
  component: DataSourcesPage,
});

function DataSourcesPage() {
  const sources = useQuery({ queryKey: ["dataSources"], queryFn: api.getDataSources });

  return (
    <div className="space-y-3">
      <PageHeader title="Data Sources" subtitle="ingestion pipelines feeding the risk engine" />
      {sources.isLoading ? (
        <SkeletonRows rows={5} />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {sources.data?.map((s) => (
            <Panel key={s.id} title={s.name} subtitle={s.detail}>
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip tone="sage">{s.status}</Chip>
                <Chip>latency {s.latency}</Chip>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
