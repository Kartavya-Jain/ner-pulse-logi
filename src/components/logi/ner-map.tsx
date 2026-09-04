import { useState } from "react";
import { cn } from "@/lib/utils";
import { corridors, vehicles, type RiskLevel } from "@/lib/logi-data";
import { RiskDot } from "./primitives";

/**
 * Stylized geospatial canvas of the 8 North Eastern states with real NH corridor
 * alignments (schematic, not survey-accurate). Layer toggles mirror a GIS client.
 */

type Layer = "roads" | "districts" | "vehicles" | "flood" | "landslide" | "weather" | "reports" | "satellite";

const STATES: { id: string; name: string; d: string; label: [number, number] }[] = [
  { id: "sikkim", name: "Sikkim", d: "M4,20 L13,15 L18,22 L13,30 L5,28 Z", label: [10, 23] },
  {
    id: "arunachal",
    name: "Arunachal Pradesh",
    d: "M28,10 L52,6 L74,10 L88,18 L84,28 L70,26 L54,22 L36,24 L28,18 Z",
    label: [58, 16],
  },
  {
    id: "assam",
    name: "Assam",
    d: "M20,30 L36,26 L56,26 L72,30 L82,32 L78,42 L62,44 L52,40 L38,42 L26,40 L18,36 Z",
    label: [42, 35],
  },
  { id: "nagaland", name: "Nagaland", d: "M74,32 L84,32 L86,46 L78,50 L72,44 Z", label: [79, 41] },
  { id: "manipur", name: "Manipur", d: "M72,50 L84,48 L86,62 L76,66 L70,58 Z", label: [78, 57] },
  { id: "meghalaya", name: "Meghalaya", d: "M24,42 L44,42 L50,48 L42,52 L26,50 Z", label: [36, 47] },
  { id: "mizoram", name: "Mizoram", d: "M62,64 L74,66 L72,84 L64,88 L58,76 Z", label: [66, 75] },
  { id: "tripura", name: "Tripura", d: "M42,60 L54,58 L56,72 L46,76 L40,68 Z", label: [48, 67] },
];

const HIGHWAYS: { id: string; name: string; risk: RiskLevel; d: string }[] = [
  { id: "nh10", name: "NH-10", risk: "high", d: "M8,30 C12,26 16,24 20,22" },
  { id: "nh27", name: "NH-27", risk: "moderate", d: "M20,36 C34,32 48,32 66,34 S78,38 82,38" },
  { id: "nh37", name: "NH-37", risk: "blocked", d: "M76,40 C78,46 76,52 78,58" },
  { id: "nh6", name: "NH-6", risk: "moderate", d: "M34,46 C44,50 54,58 64,70" },
  { id: "nh29", name: "NH-29", risk: "high", d: "M78,42 C82,42 84,44 85,46" },
  { id: "nh102", name: "NH-102B", risk: "safe", d: "M78,58 C82,56 84,54 86,52" },
  { id: "nh515", name: "NH-515", risk: "moderate", d: "M66,68 C68,74 68,80 68,86" },
  { id: "nh8", name: "NH-8", risk: "safe", d: "M46,60 C48,66 48,72 47,75" },
  { id: "nh13", name: "NH-13", risk: "high", d: "M40,24 C46,20 52,16 58,14" },
];

const riskStroke: Record<RiskLevel, string> = {
  safe: "var(--risk-safe)",
  moderate: "var(--risk-moderate)",
  high: "var(--risk-high)",
  blocked: "var(--risk-blocked)",
};

const LAYERS: { id: Layer; label: string }[] = [
  { id: "roads", label: "Road network" },
  { id: "districts", label: "Districts" },
  { id: "vehicles", label: "Vehicles" },
  { id: "flood", label: "Flood risk" },
  { id: "landslide", label: "Landslide risk" },
  { id: "weather", label: "Weather" },
  { id: "reports", label: "Field reports" },
  { id: "satellite", label: "Satellite" },
];

export function NerMap({
  height = 320,
  onSelectCorridor,
  selectedCorridor,
  simulatedBlock,
  compact = false,
}: {
  height?: number;
  onSelectCorridor?: (id: string) => void;
  selectedCorridor?: string | null;
  simulatedBlock?: string | null;
  compact?: boolean;
}) {
  const [active, setActive] = useState<Layer[]>(["roads", "districts", "vehicles", "landslide"]);
  const [zoom, setZoom] = useState(1);
  const [terrain, setTerrain] = useState<"terrain" | "satellite">("terrain");

  const toggle = (l: Layer) => setActive((a) => (a.includes(l) ? a.filter((x) => x !== l) : [...a, l]));
  const on = (l: Layer) => active.includes(l);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink2 shadow-2xl shadow-black/40">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-line px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-sand">North-East Command Map</p>
          <p className="truncate font-mono text-[10px] text-mist">Risk corridors · live telemetry</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => setTerrain(terrain === "terrain" ? "satellite" : "terrain")}
            className="rounded-md border border-line bg-ink px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-mist transition-colors hover:text-brand"
          >
            {terrain}
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.15).toFixed(2)))}
            className="size-6 rounded-md border border-line bg-ink font-mono text-[11px] text-mist hover:text-brand"
          >
            −
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))}
            className="size-6 rounded-md border border-line bg-ink font-mono text-[11px] text-mist hover:text-brand"
          >
            +
          </button>
        </div>
      </div>

      <div className="scanline relative mapgrid overflow-hidden" style={{ height }}>
        <div
          className={cn(
            "absolute inset-0 transition-opacity",
            terrain === "satellite"
              ? "bg-[radial-gradient(circle_at_45%_40%,color-mix(in_oklab,var(--sage)_18%,transparent),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_28%_38%,color-mix(in_oklab,var(--brand)_20%,transparent),transparent_55%)]",
          )}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 size-full transition-transform duration-500"
          style={{ transform: `scale(${zoom})` }}
        >
          {on("flood") && (
            <g opacity="0.5">
              <ellipse cx="42" cy="36" rx="18" ry="6" fill="var(--sage)" opacity="0.18" />
              <ellipse cx="48" cy="68" rx="8" ry="9" fill="var(--sage)" opacity="0.14" />
            </g>
          )}
          {on("landslide") && (
            <g opacity="0.55">
              <circle cx="11" cy="26" r="7" fill="var(--risk-high)" opacity="0.16" />
              <circle cx="78" cy="46" r="9" fill="var(--risk-high)" opacity="0.16" />
              <circle cx="46" cy="18" r="6" fill="var(--risk-high)" opacity="0.12" />
            </g>
          )}

          {on("districts") &&
            STATES.map((s) => (
              <path
                key={s.id}
                d={s.d}
                fill="color-mix(in oklab, var(--card) 55%, transparent)"
                stroke="var(--line)"
                strokeWidth="0.4"
              />
            ))}

          {on("roads") &&
            HIGHWAYS.map((h) => {
              const blocked = simulatedBlock === h.name || h.risk === "blocked";
              const selected = selectedCorridor === h.id;
              return (
                <path
                  key={h.id}
                  d={h.d}
                  fill="none"
                  stroke={blocked ? riskStroke.blocked : riskStroke[h.risk]}
                  strokeWidth={selected ? 1.6 : 1}
                  strokeLinecap="round"
                  strokeDasharray={blocked ? "1.6 1.6" : undefined}
                  className={cn(
                    "cursor-pointer transition-all",
                    !blocked && (h.risk === "high" || h.risk === "moderate") && "flow",
                  )}
                  onClick={() => onSelectCorridor?.(h.id)}
                />
              );
            })}

          {on("weather") && (
            <g>
              <path d="M20,14 q6,-4 12,0 q6,-3 10,2" fill="none" stroke="var(--brand2)" strokeWidth="0.4" opacity="0.7" />
              <path d="M30,50 q6,-4 12,0" fill="none" stroke="var(--brand2)" strokeWidth="0.4" opacity="0.5" />
            </g>
          )}

          {on("districts") &&
            !compact &&
            STATES.map((s) => (
              <text
                key={`t-${s.id}`}
                x={s.label[0]}
                y={s.label[1]}
                textAnchor="middle"
                className="font-mono"
                fontSize="2.1"
                fill="var(--mist)"
              >
                {s.name}
              </text>
            ))}
        </svg>

        {on("vehicles") &&
          vehicles.map((v) => (
            <span
              key={v.id}
              title={`${v.id} · ${v.cargo}`}
              className={cn(
                "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4",
                v.risk === "high" && "bg-risk-high ring-risk-high/20 live",
                v.risk === "moderate" && "bg-risk-moderate ring-risk-moderate/20 live2",
                v.risk === "safe" && "bg-risk-safe ring-risk-safe/20",
                v.risk === "blocked" && "bg-mist ring-mist/20",
              )}
              style={{ left: `${v.x}%`, top: `${v.y}%` }}
            />
          ))}

        {on("reports") && (
          <span className="absolute left-[12%] top-[27%] -translate-x-1/2 rounded-md border border-brand/40 bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] text-brand">
            FR-208
          </span>
        )}

        <div className="absolute bottom-2 left-2 flex gap-2 rounded-lg border border-line bg-ink/85 px-2 py-1.5 font-mono text-[9px] uppercase tracking-wider text-mist">
          <span className="flex items-center gap-1">
            <RiskDot risk="safe" /> safe
          </span>
          <span className="flex items-center gap-1">
            <RiskDot risk="moderate" /> mod
          </span>
          <span className="flex items-center gap-1">
            <RiskDot risk="high" /> high
          </span>
          <span className="flex items-center gap-1">
            <RiskDot risk="blocked" /> blocked
          </span>
        </div>

        {simulatedBlock && (
          <div className="absolute right-2 top-2 rounded-md border border-ember/50 bg-ink/90 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-ember">
            {simulatedBlock} blocked · simulation
          </div>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto border-t border-line px-2 py-2">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => toggle(l.id)}
            className={cn(
              "shrink-0 rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors",
              on(l.id) ? "border-brand/40 bg-brand/15 text-brand" : "border-line bg-card text-mist",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export const mapCorridorName = (id: string) => corridors.find((c) => c.id === id)?.name ?? id;
