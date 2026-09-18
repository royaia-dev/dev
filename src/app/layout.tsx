import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Capability Exchange — AIA",
  description:
    "An outcome-based marketplace for physical work: describe the result, the exchange matches robots, equipment and human capability.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <StoreProvider>
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8">{children}</main>
          <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
            Capability Exchange · concept prototype for All Industrial Automation · data is simulated
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
