"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#07090d]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-amber-500 text-sm font-bold text-black">
            CX
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-100">
            Capability Exchange
            <span className="ml-2 rounded border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-400">
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
                className={`rounded-md px-3 py-1.5 transition ${
                  active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
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
