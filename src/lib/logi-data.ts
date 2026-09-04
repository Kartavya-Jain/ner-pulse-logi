/**
 * LOGI-NER mock data layer.
 * All UI reads through src/lib/logi-api.ts so a real backend (FastAPI + ML services)
 * can replace this file without touching components.
 */

export type RiskLevel = "safe" | "moderate" | "high" | "blocked";

export const RISK_LABEL: Record<RiskLevel, string> = {
  safe: "SAFE",
  moderate: "MODERATE",
  high: "HIGH RISK",
  blocked: "BLOCKED",
};

export const NER_STATES = [
  "All NER",
  "Assam",
  "Arunachal Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
] as const;

export type Kpi = {
  id: string;
  label: string;
  value: string;
  sub: string;
  tone: "brand" | "sage" | "ember" | "brand2" | "sand";
};

export const kpis: Kpi[] = [
  { id: "access", label: "Network accessibility", value: "82.6%", sub: "-3.1% vs 24h", tone: "brand" },
  { id: "vehicles", label: "Active vehicles", value: "147", sub: "138 on route", tone: "sage" },
  { id: "corridors", label: "High-risk corridors", value: "23", sub: "6 severe", tone: "ember" },
  { id: "disruptions", label: "Active disruptions", value: "8", sub: "3 verified", tone: "brand2" },
  { id: "cargo", label: "Essential cargo in transit", value: "64", sub: "11 critical", tone: "sand" },
  { id: "emergency", label: "Emergency routes", value: "12", sub: "4 activated", tone: "sage" },
];

export type Corridor = {
  id: string;
  name: string;
  region: string;
  risk: RiskLevel;
  riskType: "Landslide" | "Flood" | "Road damage" | "Blockage" | "Heavy rainfall";
  vehicles: number;
  impact: "Severe" | "Major" | "Moderate" | "Low";
  updated: string;
  floodProb: number;
  landslideProb: number;
  district: string;
  action: string;
  incidents: number;
  confidence: number;
};

export const corridors: Corridor[] = [
  { id: "nh10", name: "NH-10 (Sevoke–Gangtok)", region: "Sikkim", risk: "high", riskType: "Landslide", vehicles: 18, impact: "Severe", updated: "2 min ago", floodProb: 34, landslideProb: 82, district: "Pakyong", action: "Divert to NH-717A; hold non-essential cargo 6h", incidents: 3, confidence: 84 },
  { id: "nh27", name: "NH-27 (Guwahati–Jorhat)", region: "Assam", risk: "moderate", riskType: "Flood", vehicles: 41, impact: "Major", updated: "5 min ago", floodProb: 76, landslideProb: 18, district: "Nagaon", action: "Monitor Kopili gauge; stage relief convoy at Nagaon", incidents: 2, confidence: 79 },
  { id: "nh37", name: "NH-37 (Dimapur–Imphal)", region: "Nagaland", risk: "blocked", riskType: "Blockage", vehicles: 26, impact: "Severe", updated: "just now", floodProb: 22, landslideProb: 88, district: "Kohima", action: "Corridor closed. Reroute via NH-2 (Jessami spur)", incidents: 4, confidence: 91 },
  { id: "nh6", name: "NH-6 (Shillong–Aizawl)", region: "Meghalaya", risk: "moderate", riskType: "Heavy rainfall", vehicles: 12, impact: "Moderate", updated: "8 min ago", floodProb: 48, landslideProb: 51, district: "Jowai", action: "Reduce night movement; escort medical cargo", incidents: 1, confidence: 72 },
  { id: "nh29", name: "NH-29 (Kohima–Zunheboto)", region: "Nagaland", risk: "high", riskType: "Road damage", vehicles: 9, impact: "Major", updated: "12 min ago", floodProb: 19, landslideProb: 66, district: "Zunheboto", action: "Single-lane only; cap axle load at 16T", incidents: 2, confidence: 68 },
  { id: "nh102", name: "NH-102B (Imphal–Ukhrul)", region: "Manipur", risk: "safe", riskType: "Landslide", vehicles: 14, impact: "Low", updated: "3 min ago", floodProb: 11, landslideProb: 21, district: "Ukhrul", action: "Normal movement cleared", incidents: 0, confidence: 88 },
  { id: "nh515", name: "NH-515 (Aizawl–Lunglei)", region: "Mizoram", risk: "moderate", riskType: "Landslide", vehicles: 7, impact: "Moderate", updated: "15 min ago", floodProb: 27, landslideProb: 58, district: "Serchhip", action: "Daylight convoys only", incidents: 1, confidence: 74 },
  { id: "nh8", name: "NH-8 (Agartala–Sabroom)", region: "Tripura", risk: "safe", riskType: "Flood", vehicles: 20, impact: "Low", updated: "6 min ago", floodProb: 24, landslideProb: 8, district: "Gomati", action: "Normal movement cleared", incidents: 0, confidence: 90 },
  { id: "nh13", name: "NH-13 (Itanagar–Ziro)", region: "Arunachal Pradesh", risk: "high", riskType: "Landslide", vehicles: 6, impact: "Major", updated: "21 min ago", floodProb: 31, landslideProb: 71, district: "Lower Subansiri", action: "Pre-position earthmovers at Km 42", incidents: 2, confidence: 66 },
];

export type Disruption = {
  id: string;
  title: string;
  corridor: string;
  region: string;
  risk: RiskLevel;
  probability: number;
  confidence: number;
  window: string;
  impact: string;
  signals: string[];
  kind: "prediction" | "verified";
  detail: string;
};

export const disruptions: Disruption[] = [
  {
    id: "dr-4471",
    title: "Landslide risk detected",
    corridor: "NH-10 Corridor",
    region: "Sikkim",
    risk: "high",
    probability: 82,
    confidence: 84,
    window: "Next 6 hours",
    impact: "Major route accessibility reduction",
    signals: ["Terrain slope 24°", "Rainfall 118mm/24h", "Historical incidents", "Field report #FR-208"],
    kind: "prediction",
    detail:
      "Saturated slope above Km 38 near Teesta valley. Predicted debris flow reduces NH-10 to single lane or full closure.",
  },
  {
    id: "dr-4468",
    title: "Road blockage confirmed",
    corridor: "NH-37 Dimapur → Imphal",
    region: "Nagaland",
    risk: "blocked",
    probability: 100,
    confidence: 96,
    window: "Active now",
    impact: "Corridor closed, 26 vehicles rerouting",
    signals: ["Field report (verified)", "GPS halt cluster", "District control room"],
    kind: "verified",
    detail: "Debris slide at Km 61 verified by Field Officer 104. Clearance ETA 9 hours.",
  },
  {
    id: "dr-4459",
    title: "Flood risk rising",
    corridor: "NH-27 Nagaon stretch",
    region: "Assam",
    risk: "moderate",
    probability: 76,
    confidence: 79,
    window: "Next 12 hours",
    impact: "3 delivery routes likely delayed",
    signals: ["Kopili river gauge", "Rainfall forecast", "Satellite water extent"],
    kind: "prediction",
    detail: "River gauge 0.6m below danger mark and rising 4cm/h with continued upstream rainfall.",
  },
];

export type AiPrediction = {
  id: string;
  name: string;
  probability: number;
  confidence: number;
  risk: RiskLevel;
  factors: { label: string; weight: number }[];
  action: string;
};

export const aiPredictions: AiPrediction[] = [
  {
    id: "flood",
    name: "Flood risk",
    probability: 76,
    confidence: 81,
    risk: "high",
    factors: [
      { label: "Rainfall forecast", weight: 34 },
      { label: "River gauge trend", weight: 28 },
      { label: "Satellite water extent", weight: 21 },
      { label: "Historical flooding", weight: 17 },
    ],
    action: "Stage relief convoys at Nagaon; avoid low embankment stretches",
  },
  {
    id: "landslide",
    name: "Landslide risk",
    probability: 64,
    confidence: 84,
    risk: "high",
    factors: [
      { label: "Slope gradient", weight: 31 },
      { label: "Soil saturation", weight: 29 },
      { label: "Previous incidents", weight: 24 },
      { label: "Field reports", weight: 16 },
    ],
    action: "Pre-position earthmovers at NH-10 Km 38",
  },
  {
    id: "road",
    name: "Road condition risk",
    probability: 71,
    confidence: 70,
    risk: "moderate",
    factors: [
      { label: "Surface damage reports", weight: 36 },
      { label: "Load history", weight: 25 },
      { label: "Rainfall exposure", weight: 22 },
      { label: "Maintenance age", weight: 17 },
    ],
    action: "Cap axle load at 16T on NH-29",
  },
  {
    id: "eta",
    name: "ETA delay risk",
    probability: 58,
    confidence: 76,
    risk: "moderate",
    factors: [
      { label: "Corridor congestion", weight: 30 },
      { label: "Weather along route", weight: 27 },
      { label: "Checkpoint delays", weight: 23 },
      { label: "Vehicle telemetry", weight: 20 },
    ],
    action: "Re-sequence non-essential cargo after 18:00",
  },
];

export type Vehicle = {
  id: string;
  driver: string;
  cargo: string;
  priority: 1 | 2 | 3;
  location: string;
  destination: string;
  speed: number;
  eta: string;
  risk: RiskLevel;
  status: "On route" | "Halted" | "Rerouting" | "Delivered" | "Delayed";
  progress: number;
  x: number;
  y: number;
};

export const vehicles: Vehicle[] = [
  { id: "TRK-1042", driver: "B. Hazarika", cargo: "Medical supplies", priority: 1, location: "NH-37 Km 54", destination: "Imphal District Hospital", speed: 0, eta: "2h 14m", risk: "moderate", status: "Rerouting", progress: 62, x: 58, y: 46 },
  { id: "TRK-1088", driver: "L. Sangma", cargo: "Food supplies", priority: 2, location: "NH-27 Nagaon", destination: "Jorhat Relief Depot", speed: 42, eta: "3h 05m", risk: "moderate", status: "On route", progress: 48, x: 34, y: 52 },
  { id: "TRK-2210", driver: "T. Bhutia", cargo: "Emergency equipment", priority: 1, location: "NH-10 Km 31", destination: "Gangtok Command Store", speed: 18, eta: "1h 40m", risk: "high", status: "On route", progress: 71, x: 20, y: 26 },
  { id: "TRK-3301", driver: "K. Lalrin", cargo: "General cargo", priority: 3, location: "NH-515 Serchhip", destination: "Lunglei Market Yard", speed: 36, eta: "4h 22m", risk: "moderate", status: "On route", progress: 33, x: 48, y: 76 },
  { id: "TRK-1177", driver: "A. Debbarma", cargo: "Essential commodities", priority: 2, location: "NH-8 Udaipur", destination: "Sabroom Border Depot", speed: 51, eta: "1h 12m", risk: "safe", status: "On route", progress: 82, x: 33, y: 84 },
  { id: "TRK-4405", driver: "M. Konyak", cargo: "Medical supplies", priority: 1, location: "NH-29 Km 12", destination: "Zunheboto CHC", speed: 0, eta: "5h 48m", risk: "high", status: "Halted", progress: 21, x: 66, y: 40 },
  { id: "TRK-5150", driver: "R. Nyori", cargo: "Food supplies", priority: 2, location: "NH-13 Ziro approach", destination: "Ziro Sub-depot", speed: 29, eta: "2h 55m", risk: "high", status: "Delayed", progress: 57, x: 62, y: 18 },
  { id: "TRK-6021", driver: "S. Marak", cargo: "General cargo", priority: 3, location: "NH-6 Jowai", destination: "Aizawl Warehouse", speed: 44, eta: "6h 10m", risk: "moderate", status: "On route", progress: 27, x: 40, y: 64 },
];

export type RouteOption = {
  id: string;
  label: string;
  kind: "fastest" | "recommended" | "alternate";
  eta: string;
  distanceKm: number;
  risk: RiskLevel;
  riskScore: number;
  via: string[];
  notes: string[];
};

export const routeOptions: RouteOption[] = [
  {
    id: "a",
    label: "Route A — Fastest",
    kind: "fastest",
    eta: "5h 20m",
    distanceKm: 214,
    risk: "high",
    riskScore: 78,
    via: ["NH-37", "Km 61 slide zone", "Kangpokpi"],
    notes: ["Crosses active blockage at NH-37 Km 61", "Landslide probability 82%"],
  },
  {
    id: "b",
    label: "Route B — Recommended",
    kind: "recommended",
    eta: "5h 48m",
    distanceKm: 236,
    risk: "safe",
    riskScore: 22,
    via: ["NH-2", "Jessami spur", "Ukhrul bypass"],
    notes: ["Avoids all high-risk segments", "Reduces disruption risk by 41% for +28 min ETA"],
  },
  {
    id: "c",
    label: "Route C — Alternate",
    kind: "alternate",
    eta: "6h 15m",
    distanceKm: 251,
    risk: "moderate",
    riskScore: 44,
    via: ["NH-129A", "Peren", "Senapati"],
    notes: ["Moderate flood exposure near Peren", "Useful if NH-2 congestion rises"],
  },
];

export type NetworkImpact = {
  corridor: string;
  districts: string[];
  routes: number;
  vehicles: number;
  delay: string;
  cargoAtRisk: number;
  alternatives: string[];
};

export const networkImpact: NetworkImpact = {
  corridor: "NH-37 Dimapur → Imphal",
  districts: ["Kohima", "Senapati", "Imphal West"],
  routes: 14,
  vehicles: 27,
  delay: "+4h 20m",
  cargoAtRisk: 9,
  alternatives: ["NH-2 via Jessami spur", "NH-129A via Peren", "Air lift (emergency only)"],
};

export type Cargo = {
  id: string;
  priority: 1 | 2 | 3;
  tier: "Critical" | "Essential" | "Normal";
  type: string;
  category: "Medical" | "Food" | "Emergency equipment" | "Essential commodities" | "General cargo";
  destination: string;
  eta: string;
  risk: RiskLevel;
  status: "Priority routing" | "In transit" | "Delivered" | "Delayed" | "At risk";
};

export const cargo: Cargo[] = [
  { id: "CG-8801", priority: 1, tier: "Critical", type: "Medical supplies", category: "Medical", destination: "Imphal District Hospital", eta: "4h 10m", risk: "moderate", status: "Priority routing" },
  { id: "CG-8802", priority: 1, tier: "Critical", type: "Blood units + vaccines", category: "Medical", destination: "Kohima Civil Hospital", eta: "2h 35m", risk: "high", status: "At risk" },
  { id: "CG-8810", priority: 2, tier: "Essential", type: "Food supplies", category: "Food", destination: "Jorhat Relief Depot", eta: "3h 05m", risk: "moderate", status: "In transit" },
  { id: "CG-8814", priority: 2, tier: "Essential", type: "Water pumps + tarpaulin", category: "Emergency equipment", destination: "Nagaon Flood Camp", eta: "1h 50m", risk: "safe", status: "In transit" },
  { id: "CG-8820", priority: 2, tier: "Essential", type: "Kerosene + LPG", category: "Essential commodities", destination: "Sabroom Border Depot", eta: "1h 12m", risk: "safe", status: "In transit" },
  { id: "CG-8830", priority: 3, tier: "Normal", type: "Retail consignment", category: "General cargo", destination: "Aizawl Warehouse", eta: "6h 10m", risk: "moderate", status: "Delayed" },
  { id: "CG-8834", priority: 3, tier: "Normal", type: "Construction material", category: "General cargo", destination: "Lunglei Market Yard", eta: "4h 22m", risk: "moderate", status: "In transit" },
  { id: "CG-8840", priority: 1, tier: "Critical", type: "Oxygen concentrators", category: "Medical", destination: "Zunheboto CHC", eta: "5h 48m", risk: "high", status: "Priority routing" },
];

export type Alert = {
  id: string;
  category: "Road blockage" | "Delay warning" | "High-risk route" | "Weather alert";
  severity: "Critical" | "High" | "Medium" | "Low";
  message: string;
  location: string;
  timestamp: string;
  routes: string[];
  vehicles: string[];
  action: string;
};

export const alerts: Alert[] = [
  { id: "AL-9001", category: "Road blockage", severity: "Critical", message: "Road segment blocked due to landslide.", location: "NH-37 Km 61, Kohima", timestamp: "12:04 IST", routes: ["Dimapur–Imphal"], vehicles: ["TRK-1042", "TRK-4405"], action: "Reroute via NH-2 Jessami spur" },
  { id: "AL-9002", category: "Delay warning", severity: "High", message: "Vehicle TRK-1042 is expected to arrive 47 minutes late.", location: "NH-37 Km 54", timestamp: "12:01 IST", routes: ["Dimapur–Imphal"], vehicles: ["TRK-1042"], action: "Notify Imphal District Hospital" },
  { id: "AL-9003", category: "High-risk route", severity: "High", message: "Current route has entered a high-risk flood corridor.", location: "NH-27 Nagaon stretch", timestamp: "11:52 IST", routes: ["Guwahati–Jorhat"], vehicles: ["TRK-1088"], action: "Shift to embankment bypass at Km 22" },
  { id: "AL-9004", category: "Weather alert", severity: "Medium", message: "Extreme rainfall detected near route (118mm/24h).", location: "Teesta valley, Sikkim", timestamp: "11:40 IST", routes: ["Sevoke–Gangtok"], vehicles: ["TRK-2210"], action: "Hold non-essential cargo for 6 hours" },
  { id: "AL-9005", category: "Delay warning", severity: "Low", message: "Checkpoint queue adding 12 minutes at Jowai.", location: "NH-6 Jowai", timestamp: "11:28 IST", routes: ["Shillong–Aizawl"], vehicles: ["TRK-6021"], action: "No action required" },
];

export type FieldReport = {
  id: string;
  type: "Landslide" | "Flood" | "Road blockage" | "Road damage" | "Accident" | "Weather hazard" | "Other";
  officer: string;
  location: string;
  coords: string;
  description: string;
  photo: boolean;
  status: "Pending verification" | "Verified" | "Rejected" | "More info requested";
  createdAt: string;
  synced: boolean;
};

export const fieldReports: FieldReport[] = [
  { id: "FR-208", type: "Landslide", officer: "Field Officer 104", location: "NH-10 Km 38, Sikkim", coords: "27.2461° N, 88.5652° E", description: "Debris and mud across uphill lane, slope still shedding material.", photo: true, status: "Pending verification", createdAt: "11:58 IST", synced: true },
  { id: "FR-207", type: "Road blockage", officer: "Field Officer 104", location: "NH-37 Km 61, Nagaland", coords: "25.7208° N, 94.0947° E", description: "Full closure, boulders on both lanes. JCB required.", photo: true, status: "Verified", createdAt: "10:42 IST", synced: true },
  { id: "FR-206", type: "Flood", officer: "Field Officer 077", location: "NH-27 Nagaon, Assam", coords: "26.3464° N, 92.6840° E", description: "Water over shoulder near Km 22, approx 20cm on carriageway edge.", photo: false, status: "More info requested", createdAt: "09:15 IST", synced: true },
  { id: "FR-205", type: "Road damage", officer: "Field Officer 112", location: "NH-29 Km 12, Nagaland", coords: "25.9012° N, 94.5261° E", description: "Deep rutting and edge collapse over 60m stretch.", photo: true, status: "Verified", createdAt: "08:30 IST", synced: true },
];

export type Insight = {
  id: string;
  kind: "prediction" | "verified";
  title: string;
  body: string;
  confidence: number;
  tag: string;
};

export const insights: Insight[] = [
  { id: "in-1", kind: "prediction", title: "Predicted disruption", body: "High probability of landslide activity on NH-10 (Km 31–42) within the next 6 hours.", confidence: 84, tag: "Landslide" },
  { id: "in-2", kind: "prediction", title: "Network impact", body: "A single blockage on NH-37 could affect 14 downstream delivery routes and 27 vehicles.", confidence: 88, tag: "Impact" },
  { id: "in-3", kind: "prediction", title: "Route recommendation", body: "Route B is recommended because it reduces disruption risk by 41% with only 28 minutes additional ETA.", confidence: 91, tag: "Routing" },
  { id: "in-4", kind: "prediction", title: "Infrastructure insight", body: "Historical data indicates NH-29 has recurring disruption patterns during heavy rainfall in July–September.", confidence: 76, tag: "Historical" },
  { id: "in-5", kind: "verified", title: "Verified field incident", body: "NH-37 Km 61 blockage verified by Field Officer 104 with geo-tagged photo evidence.", confidence: 96, tag: "Field" },
];

export type SupplyCategory = {
  category: Cargo["category"];
  inTransit: number;
  delivered: number;
  delayed: number;
  atRisk: number;
  critical: number;
};

export const supplyStatus: SupplyCategory[] = [
  { category: "Medical", inTransit: 18, delivered: 42, delayed: 4, atRisk: 3, critical: 2 },
  { category: "Food", inTransit: 26, delivered: 61, delayed: 7, atRisk: 4, critical: 1 },
  { category: "Emergency equipment", inTransit: 11, delivered: 19, delayed: 2, atRisk: 2, critical: 1 },
  { category: "Essential commodities", inTransit: 15, delivered: 33, delayed: 3, atRisk: 1, critical: 0 },
  { category: "General cargo", inTransit: 38, delivered: 88, delayed: 12, atRisk: 5, critical: 0 },
];

export type DataSource = {
  id: string;
  name: string;
  status: "Connected" | "Live" | "Available" | "Active" | "Degraded";
  latency: string;
  detail: string;
};

export const dataSources: DataSource[] = [
  { id: "gis", name: "GIS / Road network", status: "Connected", latency: "310 ms", detail: "NHAI + state PWD road graph, 41,208 segments" },
  { id: "weather", name: "Weather data", status: "Live", latency: "1.2 s", detail: "IMD nowcast + rainfall gauges (218 stations)" },
  { id: "gps", name: "GPS vehicle location", status: "Live", latency: "820 ms", detail: "147 active telemetry streams" },
  { id: "sat", name: "Satellite / terrain", status: "Available", latency: "6 h refresh", detail: "DEM slope model + water extent tiles" },
  { id: "field", name: "Field reports", status: "Active", latency: "on sync", detail: "112 field officers, offline-first queue" },
];

export const systemHealth = [
  { id: "api", name: "API gateway", status: "Operational", note: "p95 142 ms" },
  { id: "gpsstream", name: "GPS stream", status: "Operational", note: "147 streams" },
  { id: "weatherfeed", name: "Weather feed", status: "Degraded", note: "IMD retry 2/5" },
  { id: "gis", name: "GIS service", status: "Operational", note: "tiles warm" },
  { id: "ml", name: "ML engine", status: "Operational", note: "4 models loaded" },
  { id: "ws", name: "WebSocket", status: "Operational", note: "312 clients" },
  { id: "redis", name: "Redis cache", status: "Operational", note: "hit rate 94%" },
  { id: "sync", name: "Offline sync queue", status: "Degraded", note: "3 pending reports" },
] as const;

export const auditLogs = [
  { ts: "12:04:11", user: "cmd.admin", action: "Activated emergency route NH-2 spur", location: "Kohima", status: "Success" },
  { ts: "12:01:48", user: "ops.rk", action: "Rerouted TRK-1042", location: "Imphal West", status: "Success" },
  { ts: "11:58:02", user: "field.104", action: "Submitted report FR-208", location: "Sikkim", status: "Queued" },
  { ts: "11:44:37", user: "dist.kohima", action: "Verified incident FR-207", location: "Kohima", status: "Success" },
  { ts: "11:30:19", user: "ops.mz", action: "Exported corridor risk report", location: "Aizawl", status: "Success" },
  { ts: "11:12:05", user: "unknown", action: "Failed login attempt", location: "—", status: "Blocked" },
];

export const users = [
  { id: "u1", name: "R. Baruah", role: "Government / Admin", scope: "All NER", status: "Active" },
  { id: "u2", name: "S. Pradhan", role: "Logistics Operator", scope: "Sikkim, Assam", status: "Active" },
  { id: "u3", name: "K. Angami", role: "District Officer", scope: "Kohima", status: "Active" },
  { id: "u4", name: "Field Officer 104", role: "Field Officer", scope: "NH-10 corridor", status: "Offline" },
  { id: "u5", name: "T. Lalthanmawia", role: "Emergency Response Team", scope: "Mizoram", status: "Active" },
];

export const ROLES = [
  "Government / Admin",
  "Logistics Operator",
  "District Officer",
  "Field Officer",
  "Emergency Response Team",
] as const;

export type Role = (typeof ROLES)[number];

export type SimResult = {
  districts: string[];
  routes: number;
  vehicles: number;
  cargoDelayed: number;
  delay: string;
  alternatives: { name: string; eta: string; risk: RiskLevel }[];
  accessibilityBefore: number;
  accessibilityAfter: number;
  supplyImpact: string;
};
