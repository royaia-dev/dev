import Link from "next/link";
import { Badge, Card, SectionTitle, rate } from "@/components/ui";
import { AUTONOMY_LABEL, CAPABILITIES, UNIT_LABEL, UNIT_LABEL_PLURAL } from "@/lib/capabilities";
import { PROVIDERS } from "@/lib/providers";

export default function RegistryPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Standard"
        title="Capability registry"
        lead="A manufacturer-neutral description of what a robot, fleet or business can actually do. This is the asset the exchange owns: matching, pricing data and machine reputation all key off these identifiers."
      />

      <div className="space-y-4">
        {CAPABILITIES.map((capability) => {
          const supply = PROVIDERS.flatMap((provider) =>
            provider.profiles
              .filter((profile) => profile.capabilityId === capability.id)
              .map((profile) => ({ provider, profile })),
          ).sort((a, b) => a.profile.rate - b.profile.rate);

          return (
            <Card key={capability.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <code className="text-sm text-accent">{capability.id}</code>
                  <div className="mt-1 text-sm font-semibold text-ink">{capability.name}</div>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
                    {capability.description}
                  </p>
                </div>
                <div className="text-right text-xs text-muted">
                  <div>
                    indicative {rate(capability.indicativeRate)} / {UNIT_LABEL[capability.unit]}
                  </div>
                  <div className="mt-1">
                    {supply.length} provider{supply.length === 1 ? "" : "s"} listed
                  </div>
                </div>
              </div>

              {supply.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-muted">
                        <th className="pb-2 font-medium">Provider</th>
                        <th className="pb-2 font-medium">Autonomy</th>
                        <th className="pb-2 font-medium">Throughput</th>
                        <th className="pb-2 font-medium">Radius</th>
                        <th className="pb-2 text-right font-medium">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted">
                      {supply.map(({ provider, profile }) => (
                        <tr key={provider.id} className="border-t border-line">
                          <td className="py-2">
                            <Link href={`/providers/${provider.id}`} className="hover:text-accent">
                              {provider.name}
                            </Link>
                          </td>
                          <td className="py-2 text-muted">
                            <Badge tone={profile.autonomy === "autonomous" ? "green" : "neutral"}>
                              {AUTONOMY_LABEL[profile.autonomy]}
                            </Badge>
                          </td>
                          <td className="py-2 text-muted">
                            {profile.throughput.toLocaleString()} {UNIT_LABEL_PLURAL[capability.unit]}/h
                          </td>
                          <td className="py-2 text-muted">{provider.radiusKm} km</td>
                          <td className="py-2 text-right">
                            {rate(profile.rate)} / {UNIT_LABEL[capability.unit]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
