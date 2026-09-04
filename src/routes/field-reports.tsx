import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, MapPin, Camera, CloudOff, RefreshCw } from "lucide-react";
import { api } from "@/lib/logi-api";
import { useOnline } from "@/components/logi/app-shell";
import { Chip, PageHeader, Panel, SkeletonRows } from "@/components/logi/primitives";
import { cn } from "@/lib/utils";
import type { FieldReport } from "@/lib/logi-data";

export const Route = createFileRoute("/field-reports")({
  head: () => ({
    meta: [
      { title: "Field Response & Offline Reporting — LOGI-NER" },
      {
        name: "description",
        content:
          "Offline-first geo-tagged incident reporting for NER field officers, with local queue, sync status and district verification workflow.",
      },
      { property: "og:title", content: "Field Response & Offline Reporting — LOGI-NER" },
      { property: "og:description", content: "Report landslides, floods and blockages even without connectivity." },
    ],
  }),
  component: FieldPage,
});

const TYPES: FieldReport["type"][] = [
  "Landslide",
  "Flood",
  "Road blockage",
  "Road damage",
  "Accident",
  "Weather hazard",
  "Other",
];

const QUEUE_KEY = "logiNer.offlineQueue";

type Queued = {
  id: string;
  type: FieldReport["type"];
  location: string;
  coords: string;
  description: string;
  photo: boolean;
  createdAt: string;
};

function loadQueue(): Queued[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]") as Queued[];
  } catch {
    return [];
  }
}

function FieldPage() {
  const online = useOnline();
  const reports = useQuery({ queryKey: ["fieldReports"], queryFn: api.getFieldReports });
  const [queue, setQueue] = useState<Queued[]>([]);
  const [synced, setSynced] = useState<Queued[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);
  const [type, setType] = useState<FieldReport["type"]>("Landslide");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(false);
  const [coords, setCoords] = useState("27.2461° N, 88.5652° E");
  const [gpsReady, setGpsReady] = useState(false);

  const effectiveOnline = online && !forceOffline;

  useEffect(() => {
    setQueue(loadQueue());
    const t = setTimeout(() => setGpsReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  const persist = (next: Queued[]) => {
    setQueue(next);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  };

  const submit = () => {
    const entry: Queued = {
      id: `FR-${Math.floor(Math.random() * 900 + 300)}`,
      type,
      location: "NH-10 Km 38, Sikkim",
      coords,
      description: description || "No additional description provided.",
      photo,
      createdAt: new Date().toLocaleTimeString("en-IN", { hour12: false }),
    };
    persist([entry, ...queue]);
    setDescription("");
    setPhoto(false);
    toast[effectiveOnline ? "success" : "message"](
      effectiveOnline ? `${entry.id} submitted` : `${entry.id} stored locally`,
      { description: effectiveOnline ? "Awaiting district verification." : "Will sync when connectivity returns." },
    );
  };

  const sync = () => {
    if (!queue.length) return;
    setSyncing(true);
    const count = queue.length;
    setTimeout(() => {
      setSynced((s) => [...queue, ...s]);
      persist([]);
      setSyncing(false);
      toast.success(`${count} report${count > 1 ? "s" : ""} successfully synchronized`);
    }, 1600);
  };

  useEffect(() => {
    if (effectiveOnline && queue.length && !syncing) {
      const t = setTimeout(sync, 1200);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOnline, queue.length]);

  return (
    <div className="space-y-3">
      <PageHeader
        title="Field Response"
        subtitle="offline-first incident reporting · Field Officer 104"
        right={
          <button
            onClick={() => setForceOffline((f) => !f)}
            className={cn(
              "shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider",
              effectiveOnline ? "border-line bg-card text-mist" : "border-ember/50 bg-ember/10 text-ember",
            )}
          >
            {effectiveOnline ? "simulate offline" : "offline mode"}
          </button>
        }
      />

      {!effectiveOnline && (
        <div className="flex items-center gap-2 rounded-xl border border-ember/50 bg-ember/10 p-3">
          <CloudOff className="size-4 shrink-0 text-ember" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-ember">OFFLINE MODE</p>
            <p className="font-mono text-[10px] text-mist">
              Reports are stored on the device and queued for sync.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Panel title="New incident report" subtitle="geo-tagged, works without network">
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                    type === t ? "border-brand/50 bg-brand/15 text-brand" : "border-line bg-card text-mist",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what you can see — extent, lanes affected, equipment needed…"
              className="w-full rounded-lg border border-line bg-ink2 px-2.5 py-2 text-[12px] text-sand outline-none placeholder:text-mist focus:border-brand"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPhoto(true)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px]",
                  photo ? "border-sage/50 bg-sage/10 text-sage" : "border-line bg-card text-mist",
                )}
              >
                <Camera className="size-3.5" />
                {photo ? "Photo geo-tagged ✓" : "Attach photo"}
              </button>
              <div
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border py-2 font-mono text-[10px]",
                  gpsReady ? "border-sage/50 bg-sage/10 text-sage" : "border-line bg-card text-mist",
                )}
              >
                <MapPin className="size-3.5" />
                {gpsReady ? "GPS captured ✓" : "Acquiring GPS…"}
              </div>
            </div>

            <p className="font-mono text-[10px] text-mist">Coordinates: {coords}</p>
            <input
              value={coords}
              onChange={(e) => setCoords(e.target.value)}
              className="w-full rounded-lg border border-line bg-ink2 px-2.5 py-2 font-mono text-[11px] text-sand outline-none focus:border-brand"
            />

            <button
              onClick={submit}
              className="w-full rounded-lg bg-brand py-2.5 text-[12px] font-semibold text-ink"
            >
              {effectiveOnline ? "Submit report" : "Save report locally"}
            </button>
            <p className="font-mono text-[9px] text-mist">
              Status after submit: <span className="text-brand">Pending verification</span>
            </p>
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel
            title="Local sync queue"
            subtitle={syncing ? "Syncing…" : `${queue.length} report${queue.length === 1 ? "" : "s"} waiting to sync`}
            right={
              <button
                onClick={sync}
                disabled={!queue.length || syncing || !effectiveOnline}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-mist disabled:opacity-50"
              >
                <RefreshCw className={cn("size-3", syncing && "animate-spin")} />
                sync
              </button>
            }
          >
            {queue.length === 0 && synced.length === 0 && (
              <p className="text-[12px] text-mist">Nothing queued. New reports appear here until synchronized.</p>
            )}
            <ul className="space-y-2">
              {queue.map((q) => (
                <li key={q.id} className="rounded-lg border border-brand/30 bg-brand/5 p-2.5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-[12px] text-sand">
                      {q.id} · {q.type}
                    </p>
                    <Chip tone="brand">queued</Chip>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-mist">
                    {q.coords} · {q.createdAt} {q.photo && "· photo ✓"}
                  </p>
                </li>
              ))}
              {synced.map((q) => (
                <li key={`s-${q.id}`} className="rounded-lg border border-sage/30 bg-sage/5 p-2.5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-[12px] text-sand">
                      {q.id} · {q.type}
                    </p>
                    <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-sage">
                      <CheckCircle2 className="size-3" /> synced
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-mist">Pending verification by district officer</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Verification workflow" subtitle="only verified incidents drive major rerouting">
            {reports.isLoading ? (
              <SkeletonRows rows={4} />
            ) : (
              <ul className="space-y-2">
                {reports.data?.map((r) => (
                  <li key={r.id} className="rounded-xl border border-line bg-card/50 p-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-sand">
                          {r.type} reported — {r.location}
                        </p>
                        <p className="truncate font-mono text-[10px] text-mist">
                          {r.officer} · {r.coords} · {r.createdAt}
                        </p>
                      </div>
                      <Chip tone={r.status === "Verified" ? "sage" : r.status === "Rejected" ? "ember" : "brand"}>
                        {r.status}
                      </Chip>
                    </div>
                    <p className="mt-1.5 text-[11px] text-mist">{r.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.photo && <Chip tone="sage">Photo geo-tagged ✓</Chip>}
                      <Chip>GPS captured ✓</Chip>
                    </div>
                    {r.status === "Pending verification" && (
                      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => toast.success(`${r.id} verified — routing weight raised`)}
                          className="rounded-lg bg-sage py-1.5 text-[11px] font-semibold text-ink"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => toast.error(`${r.id} rejected`)}
                          className="rounded-lg border border-line bg-ink2 py-1.5 text-[11px] text-sand"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => toast.message(`More information requested for ${r.id}`)}
                          className="rounded-lg border border-line bg-ink2 py-1.5 text-[11px] text-sand"
                        >
                          More info
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
