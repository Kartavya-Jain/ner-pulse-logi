/**
 * Data access layer. Components never import mock data directly — they call these
 * functions, so each can later be swapped for a fetch to the FastAPI backend.
 */
import {
  alerts,
  aiPredictions,
  auditLogs,
  cargo,
  corridors,
  dataSources,
  disruptions,
  fieldReports,
  insights,
  kpis,
  networkImpact,
  routeOptions,
  supplyStatus,
  systemHealth,
  users,
  vehicles,
  type RiskLevel,
  type SimResult,
} from "./logi-data";

const latency = <T>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const api = {
  getKpis: () => latency(kpis),
  getCorridors: () => latency(corridors, 260),
  getDisruptions: () => latency(disruptions),
  getPredictions: () => latency(aiPredictions),
  getVehicles: () => latency(vehicles, 300),
  getRouteOptions: () => latency(routeOptions, 700),
  getNetworkImpact: () => latency(networkImpact),
  getCargo: () => latency(cargo),
  getAlerts: () => latency(alerts),
  getFieldReports: () => latency(fieldReports),
  getInsights: () => latency(insights),
  getSupplyStatus: () => latency(supplyStatus),
  getDataSources: () => latency(dataSources),
  getSystemHealth: () => latency(systemHealth),
  getAuditLogs: () => latency(auditLogs),
  getUsers: () => latency(users),
  runSimulation: (scenario: string, corridor: string): Promise<SimResult> =>
    latency(
      {
        districts:
          corridor === "NH-10"
            ? ["Pakyong", "Gangtok", "Darjeeling approach"]
            : ["Kohima", "Senapati", "Imphal West"],
        routes: scenario === "Multiple corridor failure" ? 26 : 14,
        vehicles: scenario === "Multiple corridor failure" ? 48 : 27,
        cargoDelayed: scenario === "Multiple corridor failure" ? 17 : 9,
        delay: scenario === "Multiple corridor failure" ? "+9h 40m" : "+4h 20m",
        alternatives: [
          { name: `${corridor === "NH-10" ? "NH-717A via Rangpo" : "NH-2 via Jessami spur"}`, eta: "5h 48m", risk: "safe" as RiskLevel },
          { name: `${corridor === "NH-10" ? "Old Silk Route (light only)" : "NH-129A via Peren"}`, eta: "6h 15m", risk: "moderate" as RiskLevel },
        ],
        accessibilityBefore: 82.6,
        accessibilityAfter: scenario === "Multiple corridor failure" ? 51.4 : 68.2,
        supplyImpact:
          scenario === "Multiple corridor failure"
            ? "Critical medical resupply to 4 district hospitals breaches 12h window"
            : "2 critical medical consignments breach their 6h delivery window",
      },
      1200,
    ),
};
