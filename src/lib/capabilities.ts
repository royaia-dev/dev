export type AutonomyLevel = "autonomous" | "supervised" | "teleoperated" | "human";

export type CapabilityUnit = "hour" | "panel" | "movement" | "sqm" | "asset" | "patrol";

export type Capability = {
  id: string;
  name: string;
  domain: "inspection" | "material" | "cleaning" | "security" | "maintenance" | "survey";
  unit: CapabilityUnit;
  description: string;
  /** Terms used by the intake parser to detect this capability in free text. */
  keywords: string[];
  /** Terms that qualify a number as a quantity of this capability's unit. */
  unitWords: string[];
  /** Indicative market rate per unit, in AUD. */
  indicativeRate: number;
};

export const CAPABILITIES: Capability[] = [
  {
    id: "inspect.solar.thermal",
    name: "Thermal solar panel inspection",
    domain: "inspection",
    unit: "panel",
    description:
      "Aerial or ground thermal imaging of photovoltaic arrays with fault classification and report generation.",
    keywords: ["solar", "photovoltaic", "pv array", "solar panel", "hotspot"],
    unitWords: ["panel", "panels", "module", "modules"],
    indicativeRate: 0.8,
  },
  {
    id: "inspect.roof.visual",
    name: "Roof and facade visual inspection",
    domain: "inspection",
    unit: "asset",
    description: "High-resolution visual capture of roof, gutter and facade condition with defect markup.",
    keywords: ["roof inspection", "gutter", "facade", "storm damage", "roof condition"],
    unitWords: ["roof", "roofs", "building", "buildings"],
    indicativeRate: 240,
  },
  {
    id: "inspect.electrical.thermal",
    name: "Electrical asset thermography",
    domain: "inspection",
    unit: "asset",
    description: "Thermal survey of switchboards, transformers and distribution assets to AS/NZS practice.",
    keywords: ["switchboard", "electrical", "transformer", "thermography", "thermal scan"],
    unitWords: ["switchboard", "switchboards", "board", "boards", "asset", "assets"],
    indicativeRate: 65,
  },
  {
    id: "survey.site.aerial",
    name: "Aerial site survey",
    domain: "survey",
    unit: "hour",
    description: "RPAS photogrammetry producing orthomosaic, point cloud and volumetric measurement.",
    keywords: ["survey", "stockpile", "photogrammetry", "orthomosaic", "volumetric"],
    unitWords: ["hour", "hours", "hr", "hrs"],
    indicativeRate: 320,
  },
  {
    id: "move.material.indoor",
    name: "Indoor material movement",
    domain: "material",
    unit: "movement",
    description: "Autonomous mobile robots moving pallets, cages and stillages within a facility.",
    keywords: ["pallet", "carton", "stillage", "material movement", "move ", "transport", "forklift"],
    unitWords: ["pallet", "pallets", "carton", "cartons", "movement", "movements", "stillage", "stillages"],
    indicativeRate: 1.6,
  },
  {
    id: "count.inventory.cycle",
    name: "Cycle counting and stock verification",
    domain: "material",
    unit: "hour",
    description: "Autonomous scanning of rack locations for stock counts and location accuracy reporting.",
    keywords: ["inventory", "stocktake", "stock count", "cycle count", "count stock"],
    unitWords: ["hour", "hours", "hr", "hrs", "shift", "shifts"],
    indicativeRate: 95,
  },
  {
    id: "tend.machine.cnc",
    name: "Machine tending",
    domain: "maintenance",
    unit: "hour",
    description: "Robotic load/unload of CNC or press cells including part presentation and quality gate.",
    keywords: ["machine tending", "cnc", "press brake", "machining cell", "tending"],
    unitWords: ["hour", "hours", "hr", "hrs", "shift", "shifts"],
    indicativeRate: 78,
  },
  {
    id: "clean.floor.industrial",
    name: "Industrial floor cleaning",
    domain: "cleaning",
    unit: "sqm",
    description: "Autonomous scrubbing and sweeping of warehouse, retail and production floors.",
    keywords: ["floor", "scrub", "sweep", "hygiene", "mop"],
    unitWords: ["m2", "m²", "sqm", "square metre", "square metres", "square meter", "square meters"],
    indicativeRate: 0.06,
  },
  {
    id: "clean.surface.pressure",
    name: "Pressure surface cleaning",
    domain: "cleaning",
    unit: "sqm",
    description: "High-pressure cleaning of hardstand, driveways, loading docks and external surfaces.",
    keywords: ["pressure wash", "pressure-wash", "driveway", "hardstand", "washdown"],
    unitWords: ["m2", "m²", "sqm", "square metre", "square metres", "square meter", "square meters"],
    indicativeRate: 0.9,
  },
  {
    id: "patrol.security.autonomous",
    name: "Autonomous security patrol",
    domain: "security",
    unit: "patrol",
    description: "Scheduled perimeter and internal patrols with anomaly detection and incident escalation.",
    keywords: ["security", "patrol", "perimeter", "guard", "surveillance"],
    unitWords: ["patrol", "patrols", "round", "rounds"],
    indicativeRate: 48,
  },
];

export const CAPABILITY_BY_ID = Object.fromEntries(CAPABILITIES.map((c) => [c.id, c])) as Record<
  string,
  Capability
>;

export const UNIT_LABEL: Record<CapabilityUnit, string> = {
  hour: "hour",
  panel: "panel",
  movement: "movement",
  sqm: "m²",
  asset: "asset",
  patrol: "patrol",
};

export const UNIT_LABEL_PLURAL: Record<CapabilityUnit, string> = {
  hour: "hours",
  panel: "panels",
  movement: "movements",
  sqm: "m²",
  asset: "assets",
  patrol: "patrols",
};

export const AUTONOMY_LABEL: Record<AutonomyLevel, string> = {
  autonomous: "Fully autonomous",
  supervised: "Remote supervised",
  teleoperated: "Teleoperated",
  human: "Human delivered",
};
