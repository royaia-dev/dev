"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/post", label: "Post work" },
  { href: "/jobs", label: "Jobs" },
  { href: "/registry", label: "Capability registry" },
  { href: "/providers", label: "Providers" },
  { href: "/machine", label: "Machine exchange" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-brand text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
        <div className="mx-auto max-w-6xl px-5 py-1.5">
          All Industrial Automation · outcome-based capability marketplace
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold tracking-tight text-brand">
              Cap<span className="text-accent">X</span>
            </span>
            <span className="rounded border border-accent/40 bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              prototype
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 font-semibold transition ${
                  active
                    ? "bg-brand-50 text-brand"
                    : "text-muted hover:bg-brand-50 hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
