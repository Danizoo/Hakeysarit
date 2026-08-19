/** The single place pages get content from.
 *  Reads Sanity when it's configured, falls back to the sample content when it
 *  isn't, and memoises so a build hits the API once per document type. */

import { client, readingMinutes, renderBody, sanityConfigured, toPhoto } from './sanity';
import { resolveCoords } from './geo';
import { samplePosts, sampleSalads, sampleSettings } from './sample';
import type { Photo, Post, Salad, Settings } from './types';

/** How many restaurants we're willing to geocode in a single build. */
const GEOCODE_BUDGET = 25;

const SALAD_QUERY = `*[_type == "salad" && defined(slug.current)] | order(coalesce(visitedAt, _createdAt) desc) {
  _id,
  restaurant,
  "slug": slug.current,
  city,
  address,
  mapsUrl,
  location,
  score,
  subScores,
  price,
  visitedAt,
  verdict,
  body,
  tags,
  wouldReturn,
  featured,
  photos[]{ alt, asset, "meta": asset->metadata{ lqip, dimensions } }
}`;

const POST_QUERY = `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  body,
  tags,
  cover{ alt, asset, "meta": asset->metadata{ lqip, dimensions } }
}`;

const SETTINGS_QUERY = `*[_type == "settings"][0]{
  title, tagline, heroText, aboutTitle, about, email, instagram, scaleNote,
  portrait{ alt, asset, "meta": asset->metadata{ lqip, dimensions } }
}`;

type RawImage = { alt?: string; asset?: { _ref?: string }; meta?: { lqip?: string; dimensions?: { width: number; height: number } } };

function photo(raw: RawImage | undefined, fallbackAlt: string): Photo | undefined {
  if (!raw?.asset?._ref) return undefined;
  return toPhoto({ alt: raw.alt, asset: { _ref: raw.asset._ref, metadata: raw.meta } }, fallbackAlt);
}

function clampScore(value: unknown): number {
  const score = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(score)) return 0;
  return Math.min(10, Math.max(0, score));
}

async function fetchSalads(): Promise<Salad[]> {
  if (!client) return sampleSalads;

  let rows: any[] = [];
  try {
    rows = await client.fetch(SALAD_QUERY);
  } catch (error) {
    console.error('[hakeysarit] failed to load salads from Sanity:', error);
    return [];
  }

  const salads: Salad[] = rows.map((row) => ({
    id: row._id,
    restaurant: row.restaurant ?? 'ללא שם',
    slug: row.slug,
    city: row.city ?? undefined,
    address: row.address ?? undefined,
    mapsUrl: row.mapsUrl ?? undefined,
    lat: row.location?.lat ?? undefined,
    lng: row.location?.lng ?? undefined,
    score: clampScore(row.score),
    subScores: row.subScores ?? undefined,
    price: typeof row.price === 'number' ? row.price : undefined,
    visitedAt: row.visitedAt ?? undefined,
    verdict: row.verdict ?? undefined,
    bodyHtml: renderBody(row.body, `סלט קיסר ב${row.restaurant ?? ''}`),
    photos: (row.photos ?? [])
      .map((p: RawImage) => photo(p, `סלט קיסר ב${row.restaurant ?? ''}`))
      .filter(Boolean) as Photo[],
    tags: Array.isArray(row.tags) ? row.tags.filter(Boolean) : [],
    wouldReturn: row.wouldReturn ?? undefined,
    featured: row.featured ?? undefined,
  }));

  // Fill in whatever coordinates we can, cheapest sources first.
  let budget = GEOCODE_BUDGET;
  for (const salad of salads) {
    if (salad.lat != null && salad.lng != null) continue;
    if (budget-- <= 0) break;
    const coords = await resolveCoords(salad);
    if (coords) {
      salad.lat = coords.lat;
      salad.lng = coords.lng;
    }
  }

  return salads;
}

async function fetchPosts(): Promise<Post[]> {
  if (!client) return samplePosts;

  try {
    const rows: any[] = await client.fetch(POST_QUERY);
    return rows.map((row) => ({
      id: row._id,
      title: row.title ?? 'ללא כותרת',
      slug: row.slug,
      publishedAt: row.publishedAt ?? undefined,
      excerpt: row.excerpt ?? undefined,
      cover: photo(row.cover, row.title ?? ''),
      bodyHtml: renderBody(row.body, row.title ?? ''),
      tags: Array.isArray(row.tags) ? row.tags.filter(Boolean) : [],
      readingMinutes: readingMinutes(row.body),
    }));
  } catch (error) {
    console.error('[hakeysarit] failed to load posts from Sanity:', error);
    return [];
  }
}

async function fetchSettings(): Promise<Settings> {
  if (!client) return sampleSettings;

  try {
    const row = await client.fetch(SETTINGS_QUERY);
    if (!row) return sampleSettings;
    return {
      title: row.title || sampleSettings.title,
      tagline: row.tagline || sampleSettings.tagline,
      heroText: row.heroText || undefined,
      aboutTitle: row.aboutTitle || sampleSettings.aboutTitle,
      aboutHtml: renderBody(row.about, row.aboutTitle ?? ''),
      portrait: photo(row.portrait, row.title ?? ''),
      email: row.email || undefined,
      instagram: row.instagram || undefined,
      scaleNote: row.scaleNote || undefined,
    };
  } catch (error) {
    console.error('[hakeysarit] failed to load settings from Sanity:', error);
    return sampleSettings;
  }
}

let saladsPromise: Promise<Salad[]> | null = null;
let postsPromise: Promise<Post[]> | null = null;
let settingsPromise: Promise<Settings> | null = null;

export const getSalads = (): Promise<Salad[]> => (saladsPromise ??= fetchSalads());
export const getPosts = (): Promise<Post[]> => (postsPromise ??= fetchPosts());
export const getSettings = (): Promise<Settings> => (settingsPromise ??= fetchSettings());

export const usingSampleContent = !sanityConfigured;

/** Unique tag list with counts, most used first. */
export function collectTags(items: Array<{ tags: string[] }>): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'he'));
}

/** Unique city list, alphabetical in Hebrew. */
export function collectCities(salads: Salad[]): string[] {
  return [...new Set(salads.map((s) => s.city).filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b, 'he'),
  );
}
