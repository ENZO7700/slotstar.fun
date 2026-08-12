import type { GameSummary } from '@/types/game';
import type { BlogPost } from '@/lib/api/wordpress';
import type { Provider } from '@/types/provider';

export function makeGame(overrides: Partial<GameSummary> = {}): GameSummary {
  const id = overrides.id ?? 1;
  return {
    id,
    externalId: id,
    name: overrides.name ?? `Game ${id}`,
    slug: overrides.slug ?? `game-${id}`,
    canonicalPath: overrides.canonicalPath ?? `/games/provider/game-${id}`,
    thumbnail: overrides.thumbnail ?? {
      src: `/images/games/game-${id}.png`,
      alt: `Game ${id}`,
    },
    provider: overrides.provider ?? {
      id: 10,
      name: 'Pragmatic Play',
      slug: 'pragmatic-play',
    },
    themes: [],
    type: null,
    filters: [],
    releaseDate: null,
    description: null,
    rtp: overrides.rtp === undefined ? '96.5%' : overrides.rtp,
    volatility: overrides.volatility === undefined ? 'High' : overrides.volatility,
    featured: overrides.featured ?? false,
    upcoming: overrides.upcoming ?? false,
    modifiedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

export function makeGames(count: number): GameSummary[] {
  return Array.from({ length: count }, (_, i) => makeGame({ id: i + 1 }));
}

export function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  const id = overrides.id ?? 1;
  return {
    id,
    slug: overrides.slug ?? `post-${id}`,
    title: overrides.title ?? `Post ${id}`,
    excerpt: overrides.excerpt ?? '<p>Excerpt</p>',
    content: overrides.content ?? '<p>Body</p>',
    date: overrides.date ?? '2024-06-15T12:00:00Z',
    modified: overrides.modified ?? '2024-06-15T12:00:00Z',
    featuredImage: overrides.featuredImage ?? null,
    author: overrides.author ?? 'SlotStar',
    ...overrides,
  };
}

export function makeProvider(overrides: Partial<Provider> = {}): Provider {
  const id = overrides.id ?? 1;
  return {
    id,
    name: overrides.name ?? `Provider ${id}`,
    slug: overrides.slug ?? `provider-${id}`,
    count: overrides.count ?? 10,
    ...overrides,
  };
}
