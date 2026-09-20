import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Stat, rate } from "@/components/ui";
import { AUTONOMY_LABEL, CAPABILITY_BY_ID, UNIT_LABEL, UNIT_LABEL_PLURAL } from "@/lib/capabilities";
import { PROVIDERS, PROVIDER_BY_ID, PROVIDER_KIND_LABEL } from "@/lib/providers";

export function generateStaticParams() {
  return PROVIDERS.map((provider) => ({ id: provider.id }));
}

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = PROVIDER_BY_ID[id];
  if (!provider) notFound();

  const rep = provider.reputation;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/providers" className="text-xs text-muted hover:text-ink">
          ← Providers
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{provider.name}</h1>
            <p className="mt-1.5 text-sm text-muted">
              {PROVIDER_KIND_LABEL[provider.kind]} · {provider.base} · {provider.availability}
            </p>
          </div>
          {provider.verified ? <Badge tone="blue">Verified provider</Badge> : <Badge>Unverified</Badge>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Completion rate" value={`${(rep.completionRate * 100).toFixed(1)}%`} hint={`${rep.jobs.toLocaleString()} jobs`} />
        <Stat label="On time" value={`${(rep.onTimeRate * 100).toFixed(1)}%`} />
        <Stat label="Interventions" value={`${rep.interventionsPer100.toFixed(1)}`} hint="per 100 jobs" />
        <Stat label="Safety incidents" value={String(rep.incidents)} hint={`insured to $${(provider.insuredTo / 1_000_000).toFixed(0)}m`} />
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">Capability profiles</div>
        <div className="mt-3 space-y-2">
          {provider.profiles.map((profile) => {
            const capability = CAPABILITY_BY_ID[profile.capabilityId];
            return (
              <div
                key={profile.capabilityId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-canvas px-3 py-2.5"
              >
                <div>
                  <code className="text-xs text-accent">{capability.id}</code>
                  <div className="text-sm text-ink">{capability.name}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                  <Badge tone={profile.autonomy === "autonomous" ? "green" : "neutral"}>
                    {AUTONOMY_LABEL[profile.autonomy]}
                  </Badge>
                  <span>
                    {profile.throughput.toLocaleString()} {UNIT_LABEL_PLURAL[capability.unit]}/h
                  </span>
                  <span className="text-ink">
                    {rate(profile.rate)} / {UNIT_LABEL[capability.unit]}
                  </span>
                  <span>call-out {rate(profile.callOut)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Fleet</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {provider.fleet.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">
            Certifications and compliance
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.certifications.map((cert) => (
              <Badge key={cert} tone="amber">
                {cert}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
