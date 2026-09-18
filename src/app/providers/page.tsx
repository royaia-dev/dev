import Link from "next/link";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { PROVIDERS, PROVIDER_KIND_LABEL } from "@/lib/providers";

export default function ProvidersPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Supply"
        title="Capability providers"
        lead="Robot fleets, integrators, contractors and owner-operators with idle capacity. Reputation is recorded per provider and, in later stages, per machine."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {PROVIDERS.map((provider) => (
          <Link key={provider.id} href={`/providers/${provider.id}`}>
            <Card className="h-full transition hover:border-amber-500/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{provider.name}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {provider.base} · {provider.radiusKm} km radius
                  </div>
                </div>
                {provider.verified ? <Badge tone="blue">Verified</Badge> : <Badge>Unverified</Badge>}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{PROVIDER_KIND_LABEL[provider.kind]}</Badge>
                <Badge tone="green">{(provider.reputation.completionRate * 100).toFixed(1)}% completion</Badge>
                <Badge tone="amber">{provider.reputation.rating.toFixed(1)} ★</Badge>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                {provider.profiles.length} capability profiles · {provider.reputation.jobs.toLocaleString()} jobs
                delivered
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
