import Link from "next/link";
import { Badge, Card, SectionTitle, Stat } from "@/components/ui";
import { CAPABILITIES } from "@/lib/capabilities";
import { PROVIDERS } from "@/lib/providers";

const STAGES = [
  {
    stage: "Stage 1",
    name: "Marketplace validation",
    detail: "Humans, contractors and robot-assisted providers fulfil outcome-priced work in one vertical.",
    state: "Prototyped here",
    tone: "amber" as const,
  },
  {
    stage: "Stage 2",
    name: "Robotics integration",
    detail: "Fleets expose structured capability profiles, availability and telemetry through the registry.",
    state: "Prototyped here",
    tone: "amber" as const,
  },
  {
    stage: "Stage 3",
    name: "Autonomous matching",
    detail: "Machines discover work, compute marginal cost and bid without human coordination.",
    state: "Simulated",
    tone: "blue" as const,
  },
  {
    stage: "Stage 4",
    name: "Machine-to-machine exchange",
    detail: "Autonomous assets subcontract residual capacity to other machines.",
    state: "Simulated",
    tone: "violet" as const,
  },
];

export default function Home() {
  const autonomousProfiles = PROVIDERS.flatMap((p) => p.profiles).filter((p) => p.autonomy === "autonomous");

  return (
    <div className="space-y-14">
      <section className="pt-6">
        <Badge tone="amber">Concept prototype · All Industrial Automation</Badge>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
          Tell the market what needs to be <span className="text-amber-400">accomplished</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          The exchange converts a plain-language request into structured capability requirements, then matches
          the best combination of robots, equipment, contractors and human operators to deliver the outcome —
          with escrow, evidence of work and machine reputation attached to every transaction.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/post"
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Post work to the exchange
          </Link>
          <Link
            href="/registry"
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5"
          >
            Browse the capability registry
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Capabilities listed" value={String(CAPABILITIES.length)} hint="manufacturer-neutral taxonomy" />
          <Stat label="Verified providers" value={String(PROVIDERS.filter((p) => p.verified).length)} hint={`${PROVIDERS.length} total onboarded`} />
          <Stat label="Autonomous profiles" value={String(autonomousProfiles.length)} hint="no on-site operator required" />
          <Stat label="Platform fee" value="10%" hint="held in escrow until acceptance" />
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="How it works"
          title="Outcome in, capability out"
          lead="The marketplace unit is a capability — inspect.solar.thermal, move.material.indoor — not a robot model. That is what makes the exchange independent of any one manufacturer."
        />
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              step: "01",
              title: "Describe the outcome",
              body: "Free text, site, deadline and optional budget. No equipment knowledge required.",
            },
            {
              step: "02",
              title: "Structured requirements",
              body: "The intake model extracts capabilities, quantities and compliance constraints.",
            },
            {
              step: "03",
              title: "Competing offers",
              body: "Providers and fleets are ranked on coverage, reputation, price, ETA and autonomy.",
            },
            {
              step: "04",
              title: "Escrow and evidence",
              body: "Funds held on award, released after telemetry-backed evidence is accepted.",
            },
          ].map((item) => (
            <Card key={item.step}>
              <div className="text-xs font-semibold text-amber-400">{item.step}</div>
              <div className="mt-2 text-sm font-semibold text-slate-100">{item.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Staging"
          title="What this prototype covers"
          lead="Stages 1 and 2 are clickable end-to-end. Stages 3 and 4 are shown as a simulation so the board can see the direction without funding it yet."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {STAGES.map((stage) => (
            <Card key={stage.stage}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">{stage.stage}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-100">{stage.name}</div>
                </div>
                <Badge tone={stage.tone}>{stage.state}</Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{stage.detail}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
