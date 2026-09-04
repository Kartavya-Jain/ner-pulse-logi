import { cn } from "@/lib/utils";
import { RISK_LABEL, type RiskLevel } from "@/lib/logi-data";

const riskClasses: Record<RiskLevel, string> = {
  safe: "border-risk-safe/40 bg-risk-safe/10 text-risk-safe",
  moderate: "border-risk-moderate/40 bg-risk-moderate/10 text-risk-moderate",
  high: "border-risk-high/40 bg-risk-high/10 text-risk-high",
  blocked: "border-line bg-ink2 text-mist",
};

const riskDot: Record<RiskLevel, string> = {
  safe: "bg-risk-safe",
  moderate: "bg-risk-moderate",
  high: "bg-risk-high",
  blocked: "bg-mist",
};

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest",
        riskClasses[risk],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", riskDot[risk], risk === "high" && "live")} />
      {RISK_LABEL[risk]}
    </span>
  );
}

export function RiskDot({ risk, className }: { risk: RiskLevel; className?: string }) {
  return <span className={cn("size-2 rounded-full", riskDot[risk], className)} />;
}

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel overflow-hidden", className)}>
      {(title || right) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-3 py-2.5">
          <div className="min-w-0">
            {title && <h2 className="truncate text-[13px] font-semibold text-sand">{title}</h2>}
            {subtitle && <p className="truncate font-mono text-[10px] text-mist">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="p-3">{children}</div>
    </section>
  );
}

export function Meter({
  label,
  value,
  tone = "brand",
  suffix = "%",
}: {
  label: string;
  value: number;
  tone?: "brand" | "sage" | "ember" | "brand2";
  suffix?: string;
}) {
  const bar = {
    brand: "bg-gradient-to-r from-brand to-brand2",
    sage: "bg-sage",
    ember: "bg-gradient-to-r from-brand to-ember",
    brand2: "bg-brand2",
  }[tone];
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between font-mono text-[10px] text-mist">
        <span className="truncate">{label}</span>
        <span className="tabular text-sand">
          {value}
          {suffix}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink2">
        <div className={cn("h-full rounded-full transition-all duration-700", bar)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Chip({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "brand" | "sage" | "ember" }) {
  const tones = {
    muted: "border-line bg-ink2 text-mist",
    brand: "border-brand/40 bg-brand/10 text-brand",
    sage: "border-sage/40 bg-sage/10 text-sage",
    ember: "border-ember/40 bg-ember/10 text-ember",
  }[tone];
  return (
    <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider", tones)}>
      {children}
    </span>
  );
}

export function KindBadge({ kind }: { kind: "prediction" | "verified" }) {
  return kind === "prediction" ? (
    <Chip tone="brand">AI prediction</Chip>
  ) : (
    <Chip tone="sage">Verified field incident</Chip>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight text-sand sm:text-xl">{title}</h1>
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-mist">{subtitle}</p>
      </div>
      {right}
    </header>
  );
}

export function SkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg border border-line bg-card/40" />
      ))}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-ember/40 bg-ember/10 p-3 font-mono text-[11px] text-ember">{message}</div>
  );
}

export function ConfidenceBlock({ confidence, sources }: { confidence: number; sources: string[] }) {
  return (
    <div className="rounded-lg border border-line bg-ink2/60 p-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist">Data confidence</span>
        <span className="tabular font-mono text-[12px] font-bold text-sage">{confidence}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink">
        <div className="h-full rounded-full bg-sage" style={{ width: `${confidence}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {sources.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>
    </div>
  );
}
