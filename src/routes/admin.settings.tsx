import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/logi/primitives";
import { ROLES, NER_STATES } from "@/lib/logi-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Profile — LOGI-NER Admin" },
      {
        name: "description",
        content: "Configure role, default region, alert thresholds, offline sync behaviour and units for the LOGI-NER command centre.",
      },
      { property: "og:title", content: "Settings & Profile — LOGI-NER Admin" },
      { property: "og:description", content: "Operator profile and platform preferences." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ label, hint, defaultOn }: { label: string; hint: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-line bg-ink2/60 px-2.5 py-2 text-left"
    >
      <span className="min-w-0">
        <span className="block truncate text-[12px] text-sand">{label}</span>
        <span className="block truncate font-mono text-[10px] text-mist">{hint}</span>
      </span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors",
          on ? "border-brand/60 bg-brand/30" : "border-line bg-card",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-3.5 rounded-full transition-all",
            on ? "left-[18px] bg-brand" : "left-0.5 bg-mist",
          )}
        />
      </span>
    </button>
  );
}

function SettingsPage() {
  const [role, setRole] = useState<string>(ROLES[0]);
  const [region, setRegion] = useState<string>("All NER");
  const [threshold, setThreshold] = useState(65);

  return (
    <div className="space-y-3">
      <PageHeader title="Settings" subtitle="operator profile and platform preferences" />

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Profile" subtitle="active session">
          <div className="space-y-2.5">
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Role</p>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-[11px]",
                      role === r ? "border-brand/50 bg-brand/15 text-brand" : "border-line bg-card text-mist",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Default region</p>
              <div className="flex flex-wrap gap-1.5">
                {["All NER", ...NER_STATES].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRegion(s)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-[11px]",
                      region === s ? "border-brand/50 bg-brand/15 text-brand" : "border-line bg-card text-mist",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => toast.success("Profile preferences saved")}
              className="w-full rounded-lg bg-brand py-2.5 text-[12px] font-semibold text-ink"
            >
              Save profile
            </button>
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel title="Alerts" subtitle="notification behaviour">
            <div className="space-y-2">
              <div className="rounded-lg border border-line bg-ink2/60 px-2.5 py-2">
                <p className="font-mono text-[10px] text-mist">
                  Alert threshold — notify above <span className="tabular text-brand">{threshold}%</span> risk
                  probability
                </p>
                <input
                  type="range"
                  min={30}
                  max={95}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="mt-2 w-full accent-brand"
                />
              </div>
              <Toggle label="Critical corridor alerts" hint="push + in-app for blocked corridors" defaultOn />
              <Toggle label="AI prediction alerts" hint="marked clearly as prediction, not incident" defaultOn />
              <Toggle label="Daily accessibility digest" hint="07:00 IST summary per region" />
            </div>
          </Panel>

          <Panel title="Offline & data" subtitle="field operation">
            <div className="space-y-2">
              <Toggle label="Offline field mode" hint="queue reports locally and auto-sync" defaultOn />
              <Toggle label="Low-bandwidth map tiles" hint="schematic vectors only" defaultOn />
              <Toggle label="Metric units" hint="km, mm, °C" defaultOn />
              <Toggle label="High contrast mode" hint="stronger risk colour separation" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
