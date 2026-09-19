"use client";

import { useState } from "react";
import { Badge, Card, SectionTitle, Stat, money } from "@/components/ui";

type Bid = {
  id: string;
  asset: string;
  owner: string;
  units: number;
  ratePerUnit: number;
  battery: number;
  distanceKm: number;
  reliability: number;
  earliest: string;
};

const TOTAL_UNITS = 5_000;
const OWN_CAPACITY = 3_000;
const RESIDUAL = TOTAL_UNITS - OWN_CAPACITY;
const CUSTOMER_RATE = 1.55;

const BIDS: Bid[] = [
  {
    id: "amr-7731",
    asset: "AMR-7731 (MiR600)",
    owner: "Meridian Robotics Fleet",
    units: 1_200,
    ratePerUnit: 1.28,
    battery: 0.92,
    distanceKm: 0,
    reliability: 0.996,
    earliest: "22:10",
  },
  {
    id: "amr-4410",
    asset: "AMR-4410 (tow tractor)",
    owner: "Meridian Robotics Fleet",
    units: 900,
    ratePerUnit: 1.34,
    battery: 0.74,
    distanceKm: 0,
    reliability: 0.988,
    earliest: "22:40",
  },
  {
    id: "amr-2098",
    asset: "AMR-2098 (owner-listed)",
    owner: "Kembla Owner-Operator Pool",
    units: 1_500,
    ratePerUnit: 1.12,
    battery: 0.41,
    distanceKm: 84,
    reliability: 0.968,
    earliest: "01:15",
  },
  {
    id: "agv-5521",
    asset: "AGV-5521 (owner-listed)",
    owner: "Kembla Owner-Operator Pool",
    units: 800,
    ratePerUnit: 1.05,
    battery: 0.88,
    distanceKm: 6,
    reliability: 0.941,
    earliest: "23:50",
  },
  {
    id: "tele-3312",
    asset: "Teleoperated forklift T-3312",
    owner: "Hunter Valley Automation Services",
    units: 2_000,
    ratePerUnit: 1.69,
    battery: 1,
    distanceKm: 12,
    reliability: 0.974,
    earliest: "23:05",
  },
];

/** Marginal-cost selection with a hard reliability floor and battery/travel feasibility check. */
function selectBids(bids: Bid[]) {
  const feasible = bids
    .filter((bid) => bid.reliability >= 0.96)
    .filter((bid) => bid.battery >= 0.5 || bid.distanceKm === 0)
    .sort((a, b) => a.ratePerUnit - b.ratePerUnit);

  const allocation: { bid: Bid; units: number; cost: number }[] = [];
  let remaining = RESIDUAL;
  for (const bid of feasible) {
    if (remaining <= 0) break;
    const units = Math.min(bid.units, remaining);
    allocation.push({ bid, units, cost: Math.round(units * bid.ratePerUnit) });
    remaining -= units;
  }
  return { allocation, unfilled: remaining };
}

export default function MachineExchangePage() {
  const [phase, setPhase] = useState<"idle" | "bidding" | "awarded">("idle");
  const [visibleBids, setVisibleBids] = useState<Bid[]>([]);

  const { allocation, unfilled } = selectBids(visibleBids);
  const subcontractCost = allocation.reduce((sum, a) => sum + a.cost, 0);
  const residualRevenue = Math.round(RESIDUAL * CUSTOMER_RATE);

  function publish() {
    setPhase("bidding");
    setVisibleBids([]);
    BIDS.forEach((bid, index) => {
      window.setTimeout(() => setVisibleBids((prev) => [...prev, bid]), 400 * (index + 1));
    });
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Stage 3–4 simulation"
        title="Machine-to-machine exchange"
        lead="An asset that cannot complete a job alone subcontracts the shortfall to other machines. This is the long-term vision, not the near-term build: it depends on fleet APIs, machine identity and insurer appetite that do not exist yet."
      />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">Originating asset</div>
            <div className="mt-1 text-sm font-semibold text-ink">AMR-1180 · fleet controller</div>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
              Accepted an overnight job to move {TOTAL_UNITS.toLocaleString()} cartons at {money(CUSTOMER_RATE)}{" "}
              per movement. Internal planner computes it can complete {OWN_CAPACITY.toLocaleString()} within the
              window. Rather than rejecting the job, it lists the shortfall on the exchange.
            </p>
          </div>
          <Badge tone="violet">Autonomous negotiation</Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Job size" value={`${TOTAL_UNITS.toLocaleString()} movements`} />
          <Stat label="Own capacity" value={`${OWN_CAPACITY.toLocaleString()}`} hint="within shift window" />
          <Stat label="Residual listed" value={`${RESIDUAL.toLocaleString()}`} hint={money(residualRevenue)} />
          <Stat label="Reliability floor" value="96.0%" hint="owner-set bidding policy" />
        </div>

        {phase === "idle" ? (
          <button
            type="button"
            onClick={publish}
            className="mt-5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
          >
            Publish residual capacity to the exchange
          </button>
        ) : null}
      </Card>

      {phase !== "idle" ? (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Incoming machine bids ({visibleBids.length}/{BIDS.length})
            </div>
            {visibleBids.length === BIDS.length && phase === "bidding" ? (
              <button
                type="button"
                onClick={() => setPhase("awarded")}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-700"
              >
                Run owner policy and award
              </button>
            ) : null}
          </div>

          <div className="mt-3 space-y-2">
            {visibleBids.map((bid) => {
              const awarded = phase === "awarded" && allocation.some((a) => a.bid.id === bid.id);
              const rejected = phase === "awarded" && !awarded;
              return (
                <div
                  key={bid.id}
                  className={`rounded-lg border p-3 ${
                    awarded ? "border-emerald-600/30 bg-emerald-50" : "border-line bg-canvas"
                  } ${rejected ? "opacity-45" : ""}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-ink">{bid.asset}</div>
                      <div className="text-xs text-muted">{bid.owner}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>{bid.units.toLocaleString()} units offered</span>
                      <span className="text-ink">${bid.ratePerUnit.toFixed(2)}/unit</span>
                      <span>battery {Math.round(bid.battery * 100)}%</span>
                      <span>{bid.distanceKm} km</span>
                      <span>rel. {(bid.reliability * 100).toFixed(1)}%</span>
                      <span>from {bid.earliest}</span>
                    </div>
                  </div>
                  {phase === "awarded" ? (
                    <div className="mt-2 text-xs">
                      {awarded ? (
                        <span className="text-emerald-700">
                          Awarded {allocation.find((a) => a.bid.id === bid.id)!.units.toLocaleString()} units ·{" "}
                          {money(allocation.find((a) => a.bid.id === bid.id)!.cost)}
                        </span>
                      ) : bid.reliability < 0.96 ? (
                        <span className="text-rose-600">Rejected: below owner reliability floor</span>
                      ) : bid.battery < 0.5 && bid.distanceKm > 0 ? (
                        <span className="text-rose-600">Rejected: insufficient battery for travel leg</span>
                      ) : (
                        <span className="text-muted">Not required: residual already covered at lower cost</span>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {phase === "awarded" ? (
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Settlement</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Residual revenue" value={money(residualRevenue)} hint={`${RESIDUAL.toLocaleString()} movements`} />
            <Stat label="Subcontract cost" value={money(subcontractCost)} />
            <Stat label="Margin retained" value={money(residualRevenue - subcontractCost)} hint="by originating asset" />
            <Stat label="Unfilled" value={`${unfilled.toLocaleString()} units`} hint={unfilled ? "escalated to human" : "job fully covered"} />
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
            Everything above is a simulation. To run this for real the exchange needs machine identity,
            signed capability attestations, per-machine reputation, insurer-accepted liability allocation and
            manufacturer APIs that expose bid/accept. None of that is a prerequisite for Stage 1 revenue, which
            is why it should stay off the critical path.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
