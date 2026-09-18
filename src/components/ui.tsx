import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 ${className}`}>{children}</div>
  );
}

export function SectionTitle({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">{eyebrow}</div>
      ) : null}
      <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
      {lead ? <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-400">{lead}</p> : null}
    </div>
  );
}

const TONES = {
  neutral: "border-white/15 text-slate-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  blue: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-300",
} as const;

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-100">{value}</div>
      {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

export const money = (value: number) =>
  value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 });

export const rate = (value: number) =>
  value < 1
    ? `$${value.toFixed(2)}`
    : value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
