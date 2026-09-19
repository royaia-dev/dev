import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SiteNav } from "@/components/SiteNav";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "CapX — Capability Exchange by All Industrial Automation",
  description:
    "An outcome-based marketplace for physical work: describe the result, CapX matches robots, equipment and human capability.",
  icons: { icon: "/capx-logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="antialiased font-sans">
        <StoreProvider>
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8">{children}</main>
          <footer className="border-t border-line bg-white py-8 text-center text-xs text-muted">
            CapX · concept prototype for All Industrial Automation · data is simulated
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
