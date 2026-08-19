/** Getting a restaurant onto the map without asking anyone to type coordinates.
 *
 *  Order of attack, per salad:
 *    1. Coordinates already saved on the document (nothing to do).
 *    2. Coordinates parsed out of a pasted Google Maps link.
 *    3. Same, after following a maps.app.goo.gl short link to its real URL.
 *    4. Geocoding the address with OpenStreetMap's Nominatim.
 *
 *  Whatever we work out gets written back to Sanity when a write token is
 *  available, so each restaurant costs a lookup exactly once, ever. Every step
 *  is wrapped so a flaky network can never fail the build — a salad without
 *  coordinates simply doesn't get a pin.
 */

import { writeClient } from './sanity';

export type Coords = { lat: number; lng: number };

const UA = 'Hakeysarit/1.0 (personal caesar-salad blog)';
const TIMEOUT = 8000;

function plausible(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

/** Google Maps hides coordinates in several places depending on how the link was copied. */
export function parseCoordsFromUrl(url: string | undefined): Coords | undefined {
  if (!url) return undefined;
  const patterns = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // place links
    /@(-?\d+\.\d+),(-?\d+\.\d+)/, // viewport in the path
    /[?&](?:q|ll|daddr|center)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/, // query params
    /^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/, // she pasted raw "32.07, 34.78"
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const lat = Number.parseFloat(match[1]);
      const lng = Number.parseFloat(match[2]);
      if (plausible(lat, lng)) return { lat, lng };
    }
  }
  return undefined;
}

async function expandShortLink(url: string): Promise<string | undefined> {
  if (!/goo\.gl|maps\.app|g\.co/.test(url)) return undefined;
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    return response.url;
  } catch {
    return undefined;
  }
}

let lastGeocodeAt = 0;

async function geocode(query: string): Promise<Coords | undefined> {
  // Nominatim asks for no more than one request per second.
  const wait = 1100 - (Date.now() - lastGeocodeAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastGeocodeAt = Date.now();

  try {
    const endpoint = new URL('https://nominatim.openstreetmap.org/search');
    endpoint.searchParams.set('q', query);
    endpoint.searchParams.set('format', 'json');
    endpoint.searchParams.set('limit', '1');
    endpoint.searchParams.set('accept-language', 'he');

    const response = await fetch(endpoint, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!response.ok) return undefined;

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!results.length) return undefined;

    const lat = Number.parseFloat(results[0].lat);
    const lng = Number.parseFloat(results[0].lon);
    return plausible(lat, lng) ? { lat, lng } : undefined;
  } catch {
    return undefined;
  }
}

type Locatable = {
  id: string;
  restaurant: string;
  city?: string;
  address?: string;
  mapsUrl?: string;
  lat?: number;
  lng?: number;
};

export async function resolveCoords(salad: Locatable): Promise<Coords | undefined> {
  if (salad.lat != null && salad.lng != null && plausible(salad.lat, salad.lng)) {
    return { lat: salad.lat, lng: salad.lng };
  }

  let coords = parseCoordsFromUrl(salad.mapsUrl);

  if (!coords && salad.mapsUrl) {
    const expanded = await expandShortLink(salad.mapsUrl);
    coords = parseCoordsFromUrl(expanded);
  }

  if (!coords) {
    const parts = [salad.address, salad.city].filter(Boolean).join(', ');
    const query = parts ? `${parts}, ישראל` : undefined;
    if (query) coords = await geocode(query);
    // Last resort: the restaurant name itself is often enough for a known place.
    if (!coords && salad.city) coords = await geocode(`${salad.restaurant}, ${salad.city}, ישראל`);
  }

  if (coords) await cacheCoords(salad.id, coords);
  return coords;
}

/** Save the result back to Sanity so we never look this restaurant up again. */
async function cacheCoords(id: string, coords: Coords): Promise<void> {
  if (!writeClient || id.startsWith('sample-')) return;
  try {
    await writeClient
      .patch(id)
      .set({ location: { _type: 'geopoint', lat: coords.lat, lng: coords.lng } })
      .commit({ visibility: 'async' });
  } catch (error) {
    console.warn(`[hakeysarit] could not cache coordinates for ${id}:`, error);
  }
}
