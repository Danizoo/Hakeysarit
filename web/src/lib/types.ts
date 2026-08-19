/** Shared content shapes. Everything the pages render is normalised into these,
 *  whether it came from Sanity or from the built-in sample content. */

export type Photo = {
  /** Large version, for hero/lightbox use */
  src: string;
  /** Card-sized version */
  thumb: string;
  /** Tiny blurred version used as a background while the photo loads */
  lqip?: string;
  alt: string;
  width?: number;
  height?: number;
};

/** Optional per-component scores, 1-10. All optional — she can fill in as few as she likes. */
export type SubScores = {
  dressing?: number;
  lettuce?: number;
  croutons?: number;
  parmesan?: number;
  protein?: number;
  value?: number;
};

export const SUB_SCORE_LABELS: Record<keyof SubScores, string> = {
  dressing: 'הרוטב',
  lettuce: 'החסה',
  croutons: 'הקרוטונים',
  parmesan: 'הפרמזן',
  protein: 'התוספת',
  value: 'תמורה למחיר',
};

export type Salad = {
  id: string;
  restaurant: string;
  slug: string;
  city?: string;
  address?: string;
  mapsUrl?: string;
  lat?: number;
  lng?: number;
  /** Overall score, 1-10, halves allowed */
  score: number;
  subScores?: SubScores;
  /** Price in shekels */
  price?: number;
  /** ISO date of the visit */
  visitedAt?: string;
  /** The one-line punchline shown on cards */
  verdict?: string;
  /** Rendered HTML of the full review */
  bodyHtml?: string;
  photos: Photo[];
  tags: string[];
  wouldReturn?: boolean;
  featured?: boolean;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  cover?: Photo;
  bodyHtml?: string;
  tags: string[];
  readingMinutes: number;
};

export type Settings = {
  title: string;
  tagline: string;
  heroText?: string;
  aboutTitle: string;
  aboutHtml?: string;
  portrait?: Photo;
  email?: string;
  instagram?: string;
  scaleNote?: string;
};
