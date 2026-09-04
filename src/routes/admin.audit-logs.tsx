import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { Chip, PageHeader, Panel, SkeletonRows } from "@/components/logi/primitives";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — LOGI-NER Admin" },
      {
        name: "description",
        content: "Traceable record of rerouting decisions, emergency route activations, report verifications and access attempts.",
      },
      { property: "og:title", content: "Audit Logs — LOGI-NER Admin" },
      { property: "og:description", content: "Accountability trail for every operational decision." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const logs = useQuery({ queryKey: ["auditLogs"], queryFn: api.getAuditLogs });

  return (
    <div className="space-y-3">
      <PageHeader title="Audit Logs" subtitle="every decision is traceable" />
      <Panel title="Activity trail" subtitle="most recent first">
        {logs.isLoading ? (
          <SkeletonRows rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[9px] uppercase tracking-[0.15em] text-mist">
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">User</th>
                  <th className="py-2 pr-3">Action</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {logs.data?.map((l, i) => (
                  <tr key={`${l.ts}-${i}`} className="border-b border-line/60">
                    <td className="tabular py-2.5 pr-3 font-mono text-[11px] text-mist">{l.ts}</td>
                    <td className="py-2.5 pr-3 font-mono text-[11px] text-sand">{l.user}</td>
                    <td className="py-2.5 pr-3 text-[12px] text-sand">{l.action}</td>
                    <td className="py-2.5 pr-3 text-[11px] text-mist">{l.location}</td>
                    <td className="py-2.5">
                      <Chip tone={l.status === "Success" ? "sage" : l.status === "Blocked" ? "ember" : "brand"}>
                        {l.status}
                      </Chip>
                    </td>
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
