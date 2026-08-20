/** Cover art for salads that don't have a photo yet.
 *
 *  Rather than a repeated "missing image" tile, each restaurant gets its own
 *  gradient — same family, no two neighbours alike — picked deterministically
 *  from its name, so it stays put between builds. */

type Palette = { from: string; via: string; to: string; ink: string };

const PALETTES: Palette[] = [
  { from: '#e4eede', via: '#f7f3e7', to: '#f1e5c6', ink: '#2b3a24' },
  { from: '#eef0e2', via: '#f8f5ec', to: '#dde8da', ink: '#2b3a24' },
  { from: '#f3ecd8', via: '#faf6ec', to: '#e5efe1', ink: '#2f3a26' },
  { from: '#dfeae1', via: '#f4f2e8', to: '#ece3cd', ink: '#26362a' },
  { from: '#f2ece0', via: '#f9f4e9', to: '#e4e9d4', ink: '#333a25' },
];

const ANGLES = [135, 152, 168, 196, 214];

export type Tile = { background: string; ink: string };

export function tile(seed: string): Tile {
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  const palette = PALETTES[hash % PALETTES.length];
  const angle = ANGLES[(hash >>> 3) % ANGLES.length];

  return {
    background: `linear-gradient(${angle}deg, ${palette.from}, ${palette.via} 55%, ${palette.to})`,
    ink: palette.ink,
  };
}
