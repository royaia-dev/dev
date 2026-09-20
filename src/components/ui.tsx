import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(15,29,43,0.05)] ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</div>
      ) : null}
      <h2 className="text-xl font-bold tracking-tight text-brand">{title}</h2>
      {lead ? <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">{lead}</p> : null}
    </div>
  );
}

const TONES = {
  neutral: "border-line bg-canvas text-muted",
  amber: "border-accent/40 bg-accent-50 text-accent",
  green: "border-emerald-600/30 bg-emerald-50 text-emerald-700",
  blue: "border-brand/25 bg-brand-50 text-brand",
  violet: "border-violet-600/30 bg-violet-50 text-violet-700",
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
    <div className="rounded-lg border border-line bg-canvas px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-lg font-bold text-brand">{value}</div>
      {hint ? <div className="text-xs text-muted">{hint}</div> : null}
    </div>
  );
}

export const money = (value: number) =>
  value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 });

export const rate = (value: number) =>
  value < 1
    ? `$${value.toFixed(2)}`
    : value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
