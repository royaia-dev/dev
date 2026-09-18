export type Coords = { lat: number; lng: number };

export const PROVIDER_COORDS: Record<string, Coords> = {
  "prv-skyline": { lat: -33.85, lng: 150.9 },
  "prv-meridian": { lat: -33.8, lng: 150.86 },
  "prv-hunter": { lat: -32.93, lng: 151.78 },
  "prv-clearline": { lat: -33.81, lng: 151.0 },
  "prv-nightwatch": { lat: -33.86, lng: 151.08 },
  "prv-kembla": { lat: -34.42, lng: 150.89 },
  "prv-aia-direct": { lat: -33.85, lng: 150.93 },
};

export const SITES: { name: string; coords: Coords }[] = [
  { name: "Eastern Creek, NSW", coords: { lat: -33.8, lng: 150.85 } },
  { name: "Wetherill Park, NSW", coords: { lat: -33.85, lng: 150.9 } },
  { name: "Sydney CBD, NSW", coords: { lat: -33.87, lng: 151.21 } },
  { name: "Newcastle, NSW", coords: { lat: -32.93, lng: 151.78 } },
  { name: "Wollongong, NSW", coords: { lat: -34.42, lng: 150.89 } },
  { name: "Penrith, NSW", coords: { lat: -33.75, lng: 150.69 } },
  { name: "Botany, NSW", coords: { lat: -33.94, lng: 151.2 } },
];

export function distanceKm(a: Coords, b: Coords): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export function coordsForSite(name: string): Coords {
  return SITES.find((s) => s.name === name)?.coords ?? SITES[0].coords;
}
