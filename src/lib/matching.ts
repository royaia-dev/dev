import { CAPABILITIES, CAPABILITY_BY_ID, type Capability } from "./capabilities";
import { PROVIDERS, type Provider } from "./providers";
import { PROVIDER_COORDS, coordsForSite, distanceKm } from "./geo";

export type Requirement = {
  capabilityId: string;
  quantity: number;
  confidence: number;
  matchedTerms: string[];
};

export type ParsedJob = {
  requirements: Requirement[];
  constraints: string[];
  summary: string;
};

const CONSTRAINT_RULES: { label: string; keywords: string[] }[] = [
  { label: "Working at heights", keywords: ["roof", "height", "facade", "gutter"] },
  { label: "After-hours / outside production", keywords: ["overnight", "night", "after hours", "weekend", "shutdown"] },
  { label: "Live electrical environment", keywords: ["switchboard", "electrical", "transformer", "hv", "energised"] },
  { label: "CASA-controlled airspace operation", keywords: ["drone", "aerial", "uav", "rpas", "fly"] },
  { label: "Food-grade / hygiene controls", keywords: ["food", "hygiene", "clean room", "gmp"] },
  { label: "Site induction required", keywords: ["warehouse", "site", "plant", "facility", "dc"] },
];

/** Quantity cues mapped to the capability unit they qualify. */
const QUANTITY_CUES: { unitWords: string[]; capabilityDomains: Capability["domain"][] }[] = [
  { unitWords: ["panel", "panels", "module", "modules"], capabilityDomains: ["inspection"] },
  { unitWords: ["pallet", "pallets", "carton", "cartons", "movement", "movements", "stillage"], capabilityDomains: ["material"] },
  { unitWords: ["m2", "m²", "sqm", "square metre", "square meter", "square metres"], capabilityDomains: ["cleaning"] },
  { unitWords: ["asset", "assets", "board", "boards", "switchboard", "switchboards"], capabilityDomains: ["inspection"] },
  { unitWords: ["hour", "hours", "hr", "hrs"], capabilityDomains: ["material", "maintenance", "survey"] },
  { unitWords: ["patrol", "patrols", "night", "nights"], capabilityDomains: ["security"] },
];

const DEFAULT_QUANTITY: Record<Capability["unit"], number> = {
  panel: 200,
  movement: 500,
  sqm: 1_000,
  asset: 8,
  hour: 4,
  patrol: 6,
};

function extractQuantity(text: string, capability: Capability): number | null {
  const cue = QUANTITY_CUES.find(
    (c) => c.capabilityDomains.includes(capability.domain) && c.unitWords.some((w) => text.includes(w)),
  );
  if (!cue) return null;
  for (const word of cue.unitWords) {
    const pattern = new RegExp(`([\\d,]+(?:\\.\\d+)?)\\s*(?:${escape(word)})`, "i");
    const match = text.match(pattern);
    if (match) return Number(match[1].replace(/,/g, ""));
  }
  return null;
}

function escape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Translates a free-text request into structured capability requirements. A hosted
 * model would do this in production; the deterministic parser keeps the prototype
 * self-contained and inspectable.
 */
export function parseRequest(text: string): ParsedJob {
  const lower = text.toLowerCase();

  const requirements: Requirement[] = [];
  for (const capability of CAPABILITIES) {
    const matchedTerms = capability.keywords.filter((k) => lower.includes(k));
    if (matchedTerms.length === 0) continue;
    const quantity = extractQuantity(lower, capability) ?? DEFAULT_QUANTITY[capability.unit];
    requirements.push({
      capabilityId: capability.id,
      quantity,
      confidence: Math.min(0.55 + 0.15 * matchedTerms.length, 0.97),
      matchedTerms,
    });
  }

  requirements.sort((a, b) => b.confidence - a.confidence);

  const constraints = CONSTRAINT_RULES.filter((r) => r.keywords.some((k) => lower.includes(k))).map(
    (r) => r.label,
  );

  const summary = requirements.length
    ? requirements
        .slice(0, 3)
        .map((r) => CAPABILITY_BY_ID[r.capabilityId].name.toLowerCase())
        .join(", ")
    : "no recognised capability";

  return { requirements: requirements.slice(0, 3), constraints, summary };
}

export type Offer = {
  id: string;
  providerId: string;
  price: number;
  hours: number;
  etaHours: number;
  distanceKm: number;
  autonomy: Provider["profiles"][number]["autonomy"];
  coverage: number;
  score: number;
  rationale: string[];
};

export type MatchInput = {
  requirements: Requirement[];
  site: string;
  /** Hours from now until the work must be complete. */
  deadlineHours: number;
  budget?: number;
};

export function buildOffers(input: MatchInput): Offer[] {
  const siteCoords = coordsForSite(input.site);

  const offers: Offer[] = [];
  for (const provider of PROVIDERS) {
    const servable = input.requirements.filter((r) =>
      provider.profiles.some((p) => p.capabilityId === r.capabilityId),
    );
    if (servable.length === 0) continue;

    const distance = distanceKm(siteCoords, PROVIDER_COORDS[provider.id]);
    if (distance > provider.radiusKm) continue;

    let price = 0;
    let hours = 0;
    let callOut = 0;
    let autonomyRank = 3;
    let autonomy: Offer["autonomy"] = "human";

    for (const requirement of servable) {
      const profile = provider.profiles.find((p) => p.capabilityId === requirement.capabilityId)!;
      price += profile.rate * requirement.quantity;
      hours += requirement.quantity / profile.throughput;
      callOut = Math.max(callOut, profile.callOut);
      const rank = { autonomous: 0, supervised: 1, teleoperated: 2, human: 3 }[profile.autonomy];
      if (rank < autonomyRank) {
        autonomyRank = rank;
        autonomy = profile.autonomy;
      }
    }

    const travel = distance * 2.4;
    price = Math.round(price + callOut + travel);
    hours = Math.round(hours * 10) / 10;

    const etaHours = Math.round(hours + distance / 55 + (provider.availability === "24/7" ? 1 : 4));
    if (etaHours > input.deadlineHours) continue;

    const coverage = servable.length / input.requirements.length;
    const rep = provider.reputation;

    const priceScore = 1 / (1 + price / 800);
    const repScore = rep.completionRate * 0.5 + rep.onTimeRate * 0.3 + (rep.rating / 5) * 0.2;
    const speedScore = 1 - etaHours / Math.max(input.deadlineHours, 1);
    const autonomyScore = 1 - autonomyRank / 3;

    const score =
      coverage * 0.3 + repScore * 0.28 + priceScore * 0.22 + speedScore * 0.12 + autonomyScore * 0.08;

    const rationale: string[] = [
      `${Math.round(coverage * 100)}% of required capabilities in profile`,
      `${distance} km from site (radius ${provider.radiusKm} km)`,
      `${(rep.completionRate * 100).toFixed(1)}% completion over ${rep.jobs.toLocaleString()} jobs`,
    ];
    if (provider.verified) rationale.push("Verified provider with current certifications");
    if (input.budget && price <= input.budget) rationale.push("Within stated budget");
    if (autonomy === "autonomous") rationale.push("Delivered without on-site human operator");

    offers.push({
      id: `${provider.id}-offer`,
      providerId: provider.id,
      price,
      hours,
      etaHours,
      distanceKm: distance,
      autonomy,
      coverage,
      score: Math.round(score * 1000) / 1000,
      rationale,
    });
  }

  return offers.sort((a, b) => b.score - a.score);
}
