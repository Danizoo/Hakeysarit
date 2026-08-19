import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';
import type { Photo } from './types';

const env = (key: string): string =>
  (import.meta.env?.[key] as string | undefined) ?? process.env[key] ?? '';

export const projectId = env('SANITY_PROJECT_ID');
export const dataset = env('SANITY_DATASET') || 'production';
const writeToken = env('SANITY_WRITE_TOKEN');

/** When no project is configured we fall back to the bundled sample content,
 *  so the site always builds and looks right — even before Sanity is wired up. */
export const sanityConfigured = Boolean(projectId);

export const client = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      useCdn: true,
      perspective: 'published',
    })
  : null;

/** Separate client with write access, only used to cache resolved map coordinates. */
export const writeClient =
  sanityConfigured && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion: '2024-10-01',
        useCdn: false,
        token: writeToken,
      })
    : null;

const builder = sanityConfigured ? imageUrlBuilder({ projectId, dataset }) : null;

type SanityImageValue = {
  asset?: { _ref?: string; url?: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } };
  alt?: string;
  _ref?: string;
};

/** Turn a Sanity image field into the flat {src, thumb, alt} shape the components expect. */
export function toPhoto(value: SanityImageValue | undefined | null, fallbackAlt = ''): Photo | undefined {
  if (!value || !builder) return undefined;
  const ref = value.asset?._ref ?? value._ref;
  if (!ref && !value.asset?.url) return undefined;

  const source = value.asset?._ref ? { _type: 'reference', _ref: value.asset._ref } : value;
  try {
    const base = builder.image(source as never).auto('format').fit('max');
    return {
      src: base.width(1600).quality(82).url(),
      thumb: base.width(800).quality(78).url(),
      lqip: value.asset?.metadata?.lqip,
      alt: value.alt?.trim() || fallbackAlt,
      width: value.asset?.metadata?.dimensions?.width,
      height: value.asset?.metadata?.dimensions?.height,
    };
  } catch {
    return undefined;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Render Sanity's rich text (Portable Text) to HTML styled by `.prose-hk`. */
export function renderBody(blocks: unknown, fallbackAlt = ''): string | undefined {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return undefined;
  try {
    return toHTML(blocks as never, {
      components: {
        types: {
          image: ({ value }: { value: SanityImageValue & { caption?: string } }) => {
            const photo = toPhoto(value, fallbackAlt);
            if (!photo) return '';
            const caption = value.caption
              ? `<figcaption>${escapeHtml(value.caption)}</figcaption>`
              : '';
            return `<figure><img src="${photo.src}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async" />${caption}</figure>`;
          },
        },
        marks: {
          link: ({ value, children }: { value?: { href?: string }; children: string }) => {
            const href = value?.href ?? '#';
            const external = /^https?:\/\//.test(href);
            const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${escapeHtml(href)}"${rel}>${children}</a>`;
          },
        },
      },
    });
  } catch (error) {
    console.warn('[hakeysarit] could not render rich text:', error);
    return undefined;
  }
}

/** Rough Hebrew reading speed, used for the "x דקות קריאה" label. */
export function readingMinutes(blocks: unknown): number {
  if (!Array.isArray(blocks)) return 1;
  const words = blocks
    .filter((b: any) => b?._type === 'block')
    .flatMap((b: any) => (b.children ?? []).map((c: any) => c.text ?? ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
