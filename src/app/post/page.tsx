"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Card, SectionTitle, money } from "@/components/ui";
import { CAPABILITY_BY_ID, UNIT_LABEL_PLURAL } from "@/lib/capabilities";
import { SITES } from "@/lib/geo";
import { buildOffers, parseRequest, type Requirement } from "@/lib/matching";
import { nowLabel, useStore, type Job } from "@/lib/store";

const EXAMPLES = [
  {
    label: "Solar inspection",
    text: "Inspect the roof of my warehouse for damaged solar panels — around 1,800 panels, need a thermal report for the insurer.",
    site: "Eastern Creek, NSW",
    deadline: 48,
    budget: 2500,
  },
  {
    label: "Overnight pallet movement",
    text: "Move 1,200 pallets from inbound dock to racking overnight during the shutdown window at our DC.",
    site: "Eastern Creek, NSW",
    deadline: 48,
    budget: 3000,
  },
  {
    label: "Switchboard thermography",
    text: "Thermal scan of 14 switchboards across the plant, report to AS/NZS practice, live electrical environment.",
    site: "Newcastle, NSW",
    deadline: 72,
    budget: 1800,
  },
  {
    label: "Floor cleaning",
    text: "Nightly scrub of 6,000 m2 of warehouse floor, food-grade hygiene requirements.",
    site: "Botany, NSW",
    deadline: 48,
    budget: 900,
  },
];

const DEADLINES = [
  { hours: 12, label: "Within 12 hours" },
  { hours: 24, label: "Tomorrow" },
  { hours: 48, label: "Within 2 days" },
  { hours: 72, label: "Within 3 days" },
  { hours: 168, label: "Within a week" },
];

export default function PostWorkPage() {
  const router = useRouter();
  const { addJob } = useStore();

  const [request, setRequest] = useState(EXAMPLES[0].text);
  const [site, setSite] = useState(EXAMPLES[0].site);
  const [deadlineHours, setDeadlineHours] = useState(EXAMPLES[0].deadline);
  const [budget, setBudget] = useState<string>(String(EXAMPLES[0].budget));
  const [parsed, setParsed] = useState<ReturnType<typeof parseRequest> | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [parsing, setParsing] = useState(false);

  const budgetValue = budget ? Number(budget) : undefined;

  const previewOffers = useMemo(
    () =>
      requirements.length
        ? buildOffers({ requirements, site, deadlineHours, budget: budgetValue })
        : [],
    [requirements, site, deadlineHours, budgetValue],
  );

  function applyExample(example: (typeof EXAMPLES)[number]) {
    setRequest(example.text);
    setSite(example.site);
    setDeadlineHours(example.deadline);
    setBudget(String(example.budget));
    setParsed(null);
    setRequirements([]);
  }

  function runParse() {
    setParsing(true);
    window.setTimeout(() => {
      const result = parseRequest(request);
      setParsed(result);
      setRequirements(result.requirements);
      setParsing(false);
    }, 550);
  }

  function publish() {
    if (!parsed || requirements.length === 0) return;
    const id = `job-${Date.now().toString(36)}`;
    const offers = buildOffers({ requirements, site, deadlineHours, budget: budgetValue });
    const job: Job = {
      id,
      title: CAPABILITY_BY_ID[requirements[0].capabilityId].name,
      request,
      site,
      deadlineHours,
      budget: budgetValue,
      parsed: { ...parsed, requirements },
      offers,
      status: offers.length ? "offers" : "matching",
      escrowHeld: 0,
      evidence: [],
      timeline: [
        { at: nowLabel(), actor: "customer", message: "Work published to the exchange" },
        {
          at: nowLabel(),
          actor: "platform",
          message: `Request structured into ${requirements.length} capability requirement(s); ${offers.length} provider(s) responded`,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    addJob(job);
    router.push(`/jobs/${id}`);
  }

  function updateQuantity(capabilityId: string, quantity: number) {
    setRequirements((prev) =>
      prev.map((r) => (r.capabilityId === capabilityId ? { ...r, quantity: Math.max(1, quantity) } : r)),
    );
  }

  function removeRequirement(capabilityId: string) {
    setRequirements((prev) => prev.filter((r) => r.capabilityId !== capabilityId));
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Customer"
        title="Describe the outcome you need"
        lead="You do not specify equipment. The exchange decides whether a robot, a fleet, a supervised machine or a contractor is the right way to deliver it."
      />

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => applyExample(example)}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-accent hover:text-accent"
          >
            {example.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
            What needs to be accomplished
          </label>
          <textarea
            value={request}
            onChange={(event) => {
              setRequest(event.target.value);
              setParsed(null);
              setRequirements([]);
            }}
            rows={5}
            className="mt-2 w-full resize-none rounded-lg border border-line bg-canvas p-3 text-sm text-ink outline-none focus:border-brand"
            placeholder="e.g. Inspect 1,800 solar panels on our warehouse roof and report damaged modules"
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Site</label>
              <select
                value={site}
                onChange={(event) => setSite(event.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              >
                {SITES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">Deadline</label>
              <select
                value={deadlineHours}
                onChange={(event) => setDeadlineHours(Number(event.target.value))}
                className="mt-2 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              >
                {DEADLINES.map((d) => (
                  <option key={d.hours} value={d.hours}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Budget (optional)
              </label>
              <input
                value={budget}
                onChange={(event) => setBudget(event.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="mt-2 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                placeholder="AUD"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={runParse}
            disabled={parsing || request.trim().length < 10}
            className="mt-5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            {parsing ? "Structuring request…" : "Structure request"}
          </button>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">
            Structured capability requirements
          </div>

          {!parsed ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The intake layer converts free text into capability identifiers, quantities and compliance
              constraints. Everything downstream — matching, pricing, evidence — is driven by this structure,
              not by the wording of the request.
            </p>
          ) : requirements.length === 0 ? (
            <p className="mt-3 text-sm text-rose-600">
              No capability in the registry matched this request. In production this would route to manual
              triage and become a candidate for a new capability definition.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {requirements.map((requirement) => {
                const capability = CAPABILITY_BY_ID[requirement.capabilityId];
                return (
                  <div key={requirement.capabilityId} className="rounded-lg border border-line bg-canvas p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <code className="text-xs text-accent">{capability.id}</code>
                        <div className="text-sm text-ink">{capability.name}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRequirement(requirement.capabilityId)}
                        className="text-xs text-muted hover:text-rose-700"
                      >
                        remove
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <input
                        type="number"
                        value={requirement.quantity}
                        onChange={(event) => updateQuantity(requirement.capabilityId, Number(event.target.value))}
                        className="w-24 rounded border border-line bg-canvas px-2 py-1 text-ink outline-none focus:border-brand"
                      />
                      <span>{UNIT_LABEL_PLURAL[capability.unit]}</span>
                      <Badge tone="blue">{Math.round(requirement.confidence * 100)}% confidence</Badge>
                      <span className="text-muted">matched: {requirement.matchedTerms.join(", ")}</span>
                    </div>
                  </div>
                );
              })}

              {parsed.constraints.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {parsed.constraints.map((constraint) => (
                    <Badge key={constraint} tone="amber">
                      {constraint}
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="rounded-lg border border-line bg-canvas p-3 text-xs text-muted">
                {previewOffers.length} provider{previewOffers.length === 1 ? "" : "s"} can serve this within the
                deadline and service radius
                {previewOffers.length > 0
                  ? `, from ${money(Math.min(...previewOffers.map((o) => o.price)))}`
                  : ""}
                .
              </div>

              <button
                type="button"
                onClick={publish}
                className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
              >
                Publish to the exchange
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
