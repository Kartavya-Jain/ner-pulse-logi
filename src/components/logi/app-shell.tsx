import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Database,
  FileClock,
  FlaskConical,
  Gauge,
  Map as MapIcon,
  Radar,
  Route as RouteIcon,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NER_STATES, ROLES, type Role } from "@/lib/logi-data";

const MAIN = [
  { to: "/", label: "Command Dashboard", icon: Gauge, roles: ["Government / Admin", "Logistics Operator", "Emergency Response Team", "District Officer"] },
  { to: "/accessibility", label: "Accessibility Map", icon: MapIcon, roles: ROLES },
  { to: "/route-engine", label: "Smart Route Engine", icon: RouteIcon, roles: ["Government / Admin", "Logistics Operator", "Emergency Response Team"] },
  { to: "/vehicles", label: "Vehicle Tracking", icon: Truck, roles: ["Government / Admin", "Logistics Operator", "Emergency Response Team"] },
  { to: "/corridors", label: "Risk Corridors", icon: Radar, roles: ROLES },
  { to: "/supply", label: "Supply Status", icon: Boxes, roles: ["Government / Admin", "Logistics Operator", "Emergency Response Team"] },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle, roles: ROLES },
  { to: "/field-reports", label: "Field Reports", icon: ShieldCheck, roles: ROLES },
  { to: "/ai-insights", label: "AI Insights", icon: BarChart3, roles: ["Government / Admin", "Logistics Operator", "District Officer", "Emergency Response Team"] },
  { to: "/simulation", label: "What-If Simulation", icon: FlaskConical, roles: ["Government / Admin", "Emergency Response Team"] },
] as const;

const ADMIN = [
  { to: "/admin/users", label: "Users & Roles", icon: Users },
  { to: "/admin/data-sources", label: "Data Sources", icon: Database },
  { to: "/admin/system-health", label: "System Health", icon: Activity },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

const MOBILE = [
  { to: "/accessibility", label: "Map", icon: MapIcon },
  { to: "/field-reports", label: "Report", icon: ShieldCheck },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/route-engine", label: "Routes", icon: RouteIcon },
  { to: "/admin/settings", label: "Profile", icon: User },
] as const;

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return online;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const now = useClock();
  const online = useOnline();
  const [region, setRegion] = useState<string>("All NER");
  const [role, setRole] = useState<Role>("Government / Admin");

  const allowed = MAIN.filter((m) => (m.roles as readonly string[]).includes(role));

  return (
    <div className="relative min-h-screen bg-ink text-sand">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-brand2/20 via-brand/8 to-transparent" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 size-72 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative z-10 flex">
        {/* desktop rail */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-ink2/70 lg:flex">
          <div className="flex items-center gap-2.5 px-4 py-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand2 shadow-lg shadow-brand2/30">
              <span className="font-mono text-sm font-bold text-ink">TP</span>
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[15px] font-semibold tracking-tight">LOGI-NER</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-mist">TerraPulse</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 pb-6">
            <p className="px-2 pb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Main</p>
            {allowed.map((m) => (
              <NavRow key={m.to} to={m.to} label={m.label} Icon={m.icon} active={pathname === m.to} />
            ))}
            <p className="px-2 pb-1.5 pt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Administration</p>
            {ADMIN.map((m) => (
              <NavRow key={m.to} to={m.to} label={m.label} Icon={m.icon} active={pathname === m.to} />
            ))}
          </nav>

          <div className="border-t border-line px-3 py-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Active role</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="mt-1 w-full rounded-md border border-line bg-ink px-2 py-1.5 font-mono text-[10px] text-sand outline-none focus:border-brand"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand2 lg:hidden">
                  <span className="font-mono text-sm font-bold text-ink">TP</span>
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-[13px] font-semibold tracking-tight sm:text-[15px]">
                    LOGI-NER COMMAND CENTER
                  </p>
                  <p className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-mist">
                    {now ? now.toLocaleString("en-IN", { hour12: false }) : "—"} IST · {region}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="hidden rounded-md border border-line bg-card px-2 py-1.5 font-mono text-[10px] text-sand outline-none focus:border-brand sm:block"
                >
                  {NER_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px]",
                    online ? "border-line bg-card text-sage" : "border-ember/50 bg-ember/10 text-ember",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", online ? "bg-sage live2" : "bg-ember live")} />
                  {online ? "LIVE" : "OFFLINE"}
                </span>
                <div className="grid size-9 place-items-center rounded-full border border-line bg-ink2 font-mono text-[11px] text-brand">
                  RB
                </div>
              </div>
            </div>
          </header>

          <main className="px-3 pb-24 pt-3 sm:px-4 lg:pb-8">{children}</main>
        </div>
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-ink/95 backdrop-blur lg:hidden">
        {MOBILE.map((m) => {
          const active = pathname === m.to;
          return (
            <Link
              key={m.to}
              to={m.to}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 font-mono text-[9px] uppercase tracking-wider transition-colors",
                active ? "text-brand" : "text-mist",
              )}
            >
              <m.icon className="size-4" />
              {m.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function NavRow({
  to,
  label,
  Icon,
  active,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "mb-0.5 flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] font-medium transition-colors",
        active ? "border border-brand/40 bg-brand/15 text-brand" : "border border-transparent text-mist hover:bg-card",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function ModuleRail() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="lg:hidden">
      <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Modules</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {MAIN.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors",
              pathname === m.to ? "border-brand/40 bg-brand/15 text-brand" : "border-line bg-card text-mist",
            )}
          >
            {m.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
