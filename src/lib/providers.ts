import type { AutonomyLevel } from "./capabilities";

export type CapabilityProfile = {
  capabilityId: string;
  /** Units deliverable per hour. */
  throughput: number;
  autonomy: AutonomyLevel;
  /** Price per capability unit, in AUD. */
  rate: number;
  /** Minimum charge for a mobilised job, in AUD. */
  callOut: number;
};

export type Provider = {
  id: string;
  name: string;
  kind: "robot-fleet" | "integrator" | "contractor" | "owner-operator" | "autonomous-asset";
  base: string;
  /** Service radius from base, in km. */
  radiusKm: number;
  availability: string;
  verified: boolean;
  insuredTo: number;
  certifications: string[];
  reputation: {
    jobs: number;
    completionRate: number;
    onTimeRate: number;
    rating: number;
    interventionsPer100: number;
    incidents: number;
  };
  fleet: string[];
  profiles: CapabilityProfile[];
};

export const PROVIDERS: Provider[] = [
  {
    id: "prv-skyline",
    name: "Skyline Autonomous Inspection",
    kind: "robot-fleet",
    base: "Wetherill Park, NSW",
    radiusKm: 60,
    availability: "Mon–Sat, 07:00–18:00",
    verified: true,
    insuredTo: 20_000_000,
    certifications: ["CASA ReOC", "Level 2 Thermography", "White Card"],
    reputation: {
      jobs: 412,
      completionRate: 0.988,
      onTimeRate: 0.964,
      rating: 4.8,
      interventionsPer100: 3.1,
      incidents: 0,
    },
    fleet: ["DJI M350 RTK ×4", "H20T thermal payload ×4"],
    profiles: [
      { capabilityId: "inspect.solar.thermal", throughput: 520, autonomy: "autonomous", rate: 0.72, callOut: 280 },
      { capabilityId: "inspect.roof.visual", throughput: 3, autonomy: "supervised", rate: 210, callOut: 260 },
      { capabilityId: "survey.site.aerial", throughput: 1, autonomy: "autonomous", rate: 295, callOut: 300 },
    ],
  },
  {
    id: "prv-meridian",
    name: "Meridian Robotics Fleet",
    kind: "robot-fleet",
    base: "Eastern Creek, NSW",
    radiusKm: 45,
    availability: "24/7",
    verified: true,
    insuredTo: 20_000_000,
    certifications: ["ISO 3691-4", "SafeWork NSW registered plant"],
    reputation: {
      jobs: 1_284,
      completionRate: 0.996,
      onTimeRate: 0.981,
      rating: 4.9,
      interventionsPer100: 1.4,
      incidents: 1,
    },
    fleet: ["MiR600 ×6", "Autonomous tow tractor ×2"],
    profiles: [
      { capabilityId: "move.material.indoor", throughput: 62, autonomy: "autonomous", rate: 1.35, callOut: 420 },
      { capabilityId: "count.inventory.cycle", throughput: 1, autonomy: "autonomous", rate: 88, callOut: 220 },
    ],
  },
  {
    id: "prv-hunter",
    name: "Hunter Valley Automation Services",
    kind: "integrator",
    base: "Newcastle, NSW",
    radiusKm: 180,
    availability: "Mon–Fri, 06:00–22:00",
    verified: true,
    insuredTo: 10_000_000,
    certifications: ["AS/NZS 4801", "Restricted electrical licence"],
    reputation: {
      jobs: 236,
      completionRate: 0.974,
      onTimeRate: 0.918,
      rating: 4.5,
      interventionsPer100: 8.7,
      incidents: 2,
    },
    fleet: ["Mobile robot cell ×2", "Thermography kit ×3"],
    profiles: [
      { capabilityId: "tend.machine.cnc", throughput: 1, autonomy: "supervised", rate: 72, callOut: 350 },
      { capabilityId: "inspect.electrical.thermal", throughput: 12, autonomy: "human", rate: 58, callOut: 240 },
      { capabilityId: "move.material.indoor", throughput: 38, autonomy: "teleoperated", rate: 1.72, callOut: 380 },
    ],
  },
  {
    id: "prv-clearline",
    name: "Clearline Facility Services",
    kind: "contractor",
    base: "Parramatta, NSW",
    radiusKm: 70,
    availability: "Mon–Sun, 05:00–23:00",
    verified: true,
    insuredTo: 5_000_000,
    certifications: ["ISO 9001", "Working at Heights"],
    reputation: {
      jobs: 3_910,
      completionRate: 0.992,
      onTimeRate: 0.944,
      rating: 4.6,
      interventionsPer100: 0,
      incidents: 4,
    },
    fleet: ["Tennant T7AMR ×3", "Pressure units ×8", "Crews ×14"],
    profiles: [
      { capabilityId: "clean.floor.industrial", throughput: 1_900, autonomy: "supervised", rate: 0.052, callOut: 180 },
      { capabilityId: "clean.surface.pressure", throughput: 90, autonomy: "human", rate: 0.82, callOut: 150 },
      { capabilityId: "patrol.security.autonomous", throughput: 1, autonomy: "human", rate: 52, callOut: 120 },
    ],
  },
  {
    id: "prv-nightwatch",
    name: "Nightwatch Autonomy",
    kind: "robot-fleet",
    base: "Homebush, NSW",
    radiusKm: 55,
    availability: "18:00–06:00",
    verified: true,
    insuredTo: 10_000_000,
    certifications: ["Security Master Licence", "ISO 27001"],
    reputation: {
      jobs: 688,
      completionRate: 0.981,
      onTimeRate: 0.972,
      rating: 4.7,
      interventionsPer100: 5.2,
      incidents: 0,
    },
    fleet: ["Patrol UGV ×5", "Tethered observation drone ×2"],
    profiles: [
      { capabilityId: "patrol.security.autonomous", throughput: 2, autonomy: "autonomous", rate: 41, callOut: 90 },
      { capabilityId: "clean.floor.industrial", throughput: 1_200, autonomy: "autonomous", rate: 0.058, callOut: 140 },
    ],
  },
  {
    id: "prv-kembla",
    name: "Kembla Owner-Operator Pool",
    kind: "owner-operator",
    base: "Wollongong, NSW",
    radiusKm: 90,
    availability: "Flexible / idle-capacity",
    verified: false,
    insuredTo: 2_000_000,
    certifications: ["White Card"],
    reputation: {
      jobs: 74,
      completionRate: 0.932,
      onTimeRate: 0.864,
      rating: 4.1,
      interventionsPer100: 14.3,
      incidents: 1,
    },
    fleet: ["Owner-listed AMRs ×9", "Pressure units ×4"],
    profiles: [
      { capabilityId: "clean.surface.pressure", throughput: 70, autonomy: "human", rate: 0.68, callOut: 95 },
      { capabilityId: "move.material.indoor", throughput: 28, autonomy: "supervised", rate: 1.18, callOut: 260 },
      { capabilityId: "count.inventory.cycle", throughput: 1, autonomy: "human", rate: 64, callOut: 140 },
    ],
  },
  {
    id: "prv-aia-direct",
    name: "AIA Capability Direct",
    kind: "integrator",
    base: "Smithfield, NSW",
    radiusKm: 120,
    availability: "Mon–Fri, 07:00–17:00",
    verified: true,
    insuredTo: 20_000_000,
    certifications: ["ISO 45001", "Robot integrator (CRIA)", "HV switching"],
    reputation: {
      jobs: 158,
      completionRate: 1,
      onTimeRate: 0.987,
      rating: 4.9,
      interventionsPer100: 2.2,
      incidents: 0,
    },
    fleet: ["Demo cell ×2", "UR cobots ×4", "AMR loan pool ×3"],
    profiles: [
      { capabilityId: "tend.machine.cnc", throughput: 1, autonomy: "autonomous", rate: 84, callOut: 300 },
      { capabilityId: "inspect.electrical.thermal", throughput: 14, autonomy: "supervised", rate: 61, callOut: 260 },
      { capabilityId: "count.inventory.cycle", throughput: 1, autonomy: "supervised", rate: 92, callOut: 200 },
    ],
  },
];

export const PROVIDER_BY_ID = Object.fromEntries(PROVIDERS.map((p) => [p.id, p])) as Record<string, Provider>;

export const PROVIDER_KIND_LABEL: Record<Provider["kind"], string> = {
  "robot-fleet": "Robot fleet",
  integrator: "Automation integrator",
  contractor: "Service contractor",
  "owner-operator": "Owner-operator",
  "autonomous-asset": "Autonomous asset",
};
