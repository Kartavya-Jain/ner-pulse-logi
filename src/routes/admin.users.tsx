import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/logi-api";
import { Chip, PageHeader, Panel, SkeletonRows } from "@/components/logi/primitives";
import { ROLES } from "@/lib/logi-data";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — LOGI-NER Admin" },
      {
        name: "description",
        content: "Role-based access control for government admins, logistics operators, district and field officers across NER.",
      },
      { property: "og:title", content: "Users & Roles — LOGI-NER Admin" },
      { property: "og:description", content: "Manage access scope by role and region." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const users = useQuery({ queryKey: ["users"], queryFn: api.getUsers });

  return (
    <div className="space-y-3">
      <PageHeader title="Users & Roles" subtitle="role-based access control" />

      <Panel title="Role definitions" subtitle="each role sees only the modules it needs">
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => (
            <Chip key={r} tone="brand">
              {r}
            </Chip>
          ))}
        </div>
      </Panel>

      <Panel title="Accounts" subtitle={`${users.data?.length ?? 0} provisioned users`}>
        {users.isLoading ? (
          <SkeletonRows rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[9px] uppercase tracking-[0.15em] text-mist">
                  <th className="py-2 pr-3">User</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Region scope</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.data?.map((u) => (
                  <tr key={u.id} className="border-b border-line/60">
                    <td className="py-2.5 pr-3 text-[12px] font-semibold text-sand">{u.name}</td>
                    <td className="py-2.5 pr-3 text-[11px] text-mist">{u.role}</td>
                    <td className="py-2.5 pr-3 font-mono text-[11px] text-mist">{u.scope}</td>
                    <td className="py-2.5">
                      <Chip tone={u.status === "Active" ? "sage" : "ember"}>{u.status}</Chip>
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
