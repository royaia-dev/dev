# CapX — Capability Exchange concept prototype

A clickable prototype of the CapX (Robotic Capability Exchange) concept proposed for All Industrial Automation:
an outcome-based marketplace where a customer describes the result they need and CapX matches the
best combination of robots, equipment, contractors and human operators to deliver it.

All data is simulated and held in the browser (`localStorage`). There is no backend, no payment processor
and no real provider data.

## What it demonstrates

| Route | Purpose |
| --- | --- |
| `/` | Positioning and which proposal stages the prototype covers |
| `/post` | Free-text intake → structured capability requirements (editable) → publish to the exchange |
| `/jobs`, `/jobs/[id]` | Order book, ranked offers, award + escrow, work start, evidence of work, payment release |
| `/registry` | The capability taxonomy (`inspect.solar.thermal`, `move.material.indoor`, …) and the supply listed against each |
| `/providers`, `/providers/[id]` | Provider profiles: capability profiles, throughput, autonomy level, reputation, certifications |
| `/machine` | Stage 3–4 simulation: an asset subcontracting residual capacity to other machines under an owner-set bidding policy |

## Where the logic lives

- `src/lib/capabilities.ts` — the capability registry: identifier, unit, indicative rate, parser keywords.
- `src/lib/providers.ts` — seed supply side: capability profiles (throughput, autonomy, rate, call-out) and reputation.
- `src/lib/matching.ts` — intake parsing (capability detection, quantity extraction, compliance constraints) and
  offer construction, scored on coverage, reputation, price, ETA and autonomy.
- `src/lib/store.tsx` — job lifecycle state (`offers → awarded → in_progress → evidence_submitted → completed`).

The intake parser is deterministic rather than model-backed so the prototype runs with no API key and so the
extracted structure is inspectable; swapping in an LLM only changes `parseRequest`.

## Running

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

Node 24 (see `.nvmrc` conventions of your environment); the app is Next.js 15 App Router + Tailwind v4.
