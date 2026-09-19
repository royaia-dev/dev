"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Card, Stat, money } from "@/components/ui";
import { STATUS_LABEL, STATUS_TONE } from "@/components/jobStatus";
import { AUTONOMY_LABEL, CAPABILITY_BY_ID, UNIT_LABEL_PLURAL } from "@/lib/capabilities";
import { PROVIDER_BY_ID, PROVIDER_KIND_LABEL } from "@/lib/providers";
import { nowLabel, useStore, type EvidenceItem, type Job } from "@/lib/store";

const PLATFORM_FEE = 0.1;

const toCents = (value: number) => Math.round(value * 100) / 100;
const feeOn = (price: number) => toCents(price * PLATFORM_FEE);
const withFee = (price: number) => toCents(price * (1 + PLATFORM_FEE));

function evidenceFor(job: Job): EvidenceItem[] {
  const items: EvidenceItem[] = [
    {
      kind: "location",
      label: "Geofence confirmation",
      detail: `Asset entered ${job.site} geofence and remained on site for the booked window`,
    },
    {
      kind: "telemetry",
      label: "Machine telemetry",
      detail: "Continuous log of run time, path coverage, battery state and intervention events",
    },
  ];
  for (const requirement of job.parsed.requirements) {
    const capability = CAPABILITY_BY_ID[requirement.capabilityId];
    if (capability.domain === "inspection" || capability.domain === "survey") {
      items.push({
        kind: "report",
        label: `${capability.name} report`,
        detail: `${requirement.quantity.toLocaleString()} ${UNIT_LABEL_PLURAL[capability.unit]} assessed; defect list and imagery attached`,
      });
    } else {
      items.push({
        kind: "photo",
        label: `${capability.name} before/after capture`,
        detail: `${requirement.quantity.toLocaleString()} ${UNIT_LABEL_PLURAL[capability.unit]} completed; timestamped imagery attached`,
      });
    }
  }
  return items;
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { jobs, ready, updateJob } = useStore();
  const job = jobs.find((j) => j.id === params.id);

  if (!ready) return null;

  if (!job) {
    return (
      <Card>
        <p className="text-sm text-muted">
          Job not found.{" "}
          <Link href="/jobs" className="text-accent hover:underline">
            Back to the order book
          </Link>
          .
        </p>
      </Card>
    );
  }

  const accepted = job.offers.find((o) => o.id === job.acceptedOfferId);
  const acceptedProvider = accepted ? PROVIDER_BY_ID[accepted.providerId] : undefined;

  function award(offerId: string) {
    updateJob(job!.id, (current) => {
      const offer = current.offers.find((o) => o.id === offerId)!;
      const provider = PROVIDER_BY_ID[offer.providerId];
      return {
        ...current,
        acceptedOfferId: offerId,
        status: "awarded",
        escrowHeld: withFee(offer.price),
        timeline: [
          ...current.timeline,
          { at: nowLabel(), actor: "customer", message: `Offer accepted from ${provider.name}` },
          {
            at: nowLabel(),
            actor: "platform",
            message: `${money(withFee(offer.price))} held in escrow (job ${money(offer.price)} + ${PLATFORM_FEE * 100}% platform fee)`,
          },
        ],
      };
    });
  }

  function startWork() {
    updateJob(job!.id, (current) => ({
      ...current,
      status: "in_progress",
      timeline: [
        ...current.timeline,
        { at: nowLabel(), actor: "provider", message: "Asset mobilised to site; work started" },
      ],
    }));
  }

  function submitEvidence() {
    updateJob(job!.id, (current) => ({
      ...current,
      status: "evidence_submitted",
      evidence: evidenceFor(current),
      timeline: [
        ...current.timeline,
        { at: nowLabel(), actor: "provider", message: "Completion evidence submitted for review" },
      ],
    }));
  }

  function releasePayment() {
    updateJob(job!.id, (current) => {
      const offer = current.offers.find((o) => o.id === current.acceptedOfferId)!;
      const provider = PROVIDER_BY_ID[offer.providerId];
      return {
        ...current,
        status: "completed",
        escrowHeld: 0,
        timeline: [
          ...current.timeline,
          { at: nowLabel(), actor: "customer", message: "Evidence accepted; outcome confirmed" },
          {
            at: nowLabel(),
            actor: "platform",
            message: `${money(offer.price)} released to ${provider.name}; ${money(feeOn(offer.price))} retained as platform fee`,
          },
          {
            at: nowLabel(),
            actor: "platform",
            message: "Reputation updated: completion, punctuality and intervention count written to provider record",
          },
        ],
      };
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/jobs" className="text-xs text-muted hover:text-ink">
          ← Order book
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{job.title}</h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">{job.request}</p>
          </div>
          <Badge tone={STATUS_TONE[job.status]}>{STATUS_LABEL[job.status]}</Badge>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Site" value={job.site} />
        <Stat label="Deadline" value={`${job.deadlineHours} h`} hint="from publication" />
        <Stat label="Escrow held" value={money(job.escrowHeld)} hint={job.status === "completed" ? "released" : "released on acceptance"} />
        <Stat
          label="Awarded to"
          value={acceptedProvider ? acceptedProvider.name.split(" ")[0] : "—"}
          hint={acceptedProvider ? PROVIDER_KIND_LABEL[acceptedProvider.kind] : "awaiting selection"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <Card>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Structured requirements
            </div>
            <div className="mt-3 space-y-2">
              {job.parsed.requirements.map((requirement) => {
                const capability = CAPABILITY_BY_ID[requirement.capabilityId];
                return (
                  <div
                    key={requirement.capabilityId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-canvas px-3 py-2"
                  >
                    <div>
                      <code className="text-xs text-accent">{capability.id}</code>
                      <div className="text-sm text-ink">{capability.name}</div>
                    </div>
                    <div className="text-sm text-muted">
                      {requirement.quantity.toLocaleString()} {UNIT_LABEL_PLURAL[capability.unit]}
                    </div>
                  </div>
                );
              })}
            </div>
            {job.parsed.constraints.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.parsed.constraints.map((constraint) => (
                  <Badge key={constraint} tone="amber">
                    {constraint}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Offers ({job.offers.length})
              </div>
              <div className="text-xs text-muted">ranked by coverage, reputation, price, ETA, autonomy</div>
            </div>

            <div className="mt-3 space-y-3">
              {job.offers.map((offer) => {
                const provider = PROVIDER_BY_ID[offer.providerId];
                const isAccepted = offer.id === job.acceptedOfferId;
                const dimmed = Boolean(job.acceptedOfferId) && !isAccepted;
                return (
                  <div
                    key={offer.id}
                    className={`rounded-lg border p-4 transition ${
                      isAccepted ? "border-emerald-600/30 bg-emerald-50" : "border-line bg-canvas"
                    } ${dimmed ? "opacity-45" : ""}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link href={`/providers/${provider.id}`} className="text-sm font-semibold text-ink hover:text-accent">
                          {provider.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <Badge>{PROVIDER_KIND_LABEL[provider.kind]}</Badge>
                          <Badge tone={offer.autonomy === "autonomous" ? "green" : "neutral"}>
                            {AUTONOMY_LABEL[offer.autonomy]}
                          </Badge>
                          {provider.verified ? <Badge tone="blue">Verified</Badge> : <Badge>Unverified</Badge>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-ink">{money(offer.price)}</div>
                        <div className="text-xs text-muted">
                          ETA {offer.etaHours} h · {offer.hours} h on site · {offer.distanceKm} km
                        </div>
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1 text-xs text-muted">
                      {offer.rationale.map((line) => (
                        <li key={line}>· {line}</li>
                      ))}
                    </ul>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-muted">match score {offer.score.toFixed(3)}</div>
                      {job.acceptedOfferId ? (
                        isAccepted ? (
                          <Badge tone="green">Awarded</Badge>
                        ) : null
                      ) : (
                        <button
                          type="button"
                          onClick={() => award(offer.id)}
                          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand"
                        >
                          Accept offer · hold {money(withFee(offer.price))} in escrow
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {job.offers.length === 0 ? (
                <p className="text-sm text-muted">
                  No provider currently covers these capabilities within the deadline and service radius. In
                  production this becomes a supply gap signal for provider recruitment.
                </p>
              ) : null}
            </div>
          </Card>

          {job.evidence.length > 0 ? (
            <Card>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Evidence of work</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {job.evidence.map((item) => (
                  <div key={item.label} className="rounded-lg border border-line bg-canvas p-3">
                    <div className="flex items-center gap-2">
                      <Badge tone="violet">{item.kind}</Badge>
                      <span className="text-sm text-ink">{item.label}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Next action</div>
            <div className="mt-3 space-y-3">
              {job.status === "offers" ? (
                <p className="text-sm text-muted">Acting as the customer: accept one of the offers.</p>
              ) : null}
              {job.status === "awarded" ? (
                <>
                  <p className="text-sm text-muted">Acting as the provider: mobilise the asset.</p>
                  <button
                    type="button"
                    onClick={startWork}
                    className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Start work
                  </button>
                </>
              ) : null}
              {job.status === "in_progress" ? (
                <>
                  <p className="text-sm text-muted">
                    Acting as the provider: submit telemetry-backed completion evidence.
                  </p>
                  <button
                    type="button"
                    onClick={submitEvidence}
                    className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    Submit completion evidence
                  </button>
                </>
              ) : null}
              {job.status === "evidence_submitted" ? (
                <>
                  <p className="text-sm text-muted">Acting as the customer: review evidence and settle.</p>
                  <button
                    type="button"
                    onClick={releasePayment}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Accept and release payment
                  </button>
                </>
              ) : null}
              {job.status === "completed" && accepted ? (
                <div className="space-y-2 text-sm text-muted">
                  <div className="flex justify-between">
                    <span className="text-muted">Provider paid</span>
                    <span>{money(accepted.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Platform revenue</span>
                    <span className="text-accent">{money(feeOn(accepted.price))}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          <Card>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Transaction timeline</div>
            <ol className="mt-3 space-y-3">
              {job.timeline.map((entry, index) => (
                <li key={`${entry.at}-${index}`} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <div className="text-sm leading-snug text-muted">{entry.message}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted">
                      {entry.actor} · {entry.at}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
