"use client";

import Link from "next/link";
import { Badge, Card, SectionTitle, money } from "@/components/ui";
import { STATUS_LABEL, STATUS_TONE } from "@/components/jobStatus";
import { useStore } from "@/lib/store";

export default function JobsPage() {
  const { jobs, ready, reset } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          eyebrow="Order book"
          title="Jobs on the exchange"
          lead="Every job carries its structured requirements, competing offers, escrow position and evidence of completion."
        />
        {jobs.length > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-400 transition hover:border-rose-500/50 hover:text-rose-300"
          >
            Clear demo data
          </button>
        ) : null}
      </div>

      {!ready ? null : jobs.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">
            No jobs yet.{" "}
            <Link href="/post" className="text-amber-400 hover:underline">
              Post work to the exchange
            </Link>{" "}
            to see matching, offers, escrow and evidence run end to end.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const accepted = job.offers.find((o) => o.id === job.acceptedOfferId);
            return (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                <Card className="transition hover:border-amber-500/40">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-100">{job.title}</div>
                      <p className="mt-1 max-w-2xl truncate text-sm text-slate-400">{job.request}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>{job.site}</span>
                        <span>·</span>
                        <span>{job.offers.length} offers</span>
                        <span>·</span>
                        <span>{job.parsed.requirements.length} capability requirements</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge tone={STATUS_TONE[job.status]}>{STATUS_LABEL[job.status]}</Badge>
                      <div className="mt-2 text-sm text-slate-300">
                        {accepted
                          ? money(accepted.price)
                          : job.offers.length
                            ? `from ${money(Math.min(...job.offers.map((o) => o.price)))}`
                            : "no supply"}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
