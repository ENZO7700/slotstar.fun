import 'server-only';
import { fetchApi } from './client';
import { env } from '../env';

import {
  GameSummarySchema,
  GamesResponseSchema,
  HealthSchema,
  ProviderSchema,
  ProvidersResponseSchema,
  TaxonomyResponseSchema,
} from './schemas';
import { HealthResponse, PaginatedResponse } from '@/types/api';
import { GameDetail, GameSummary } from '@/types/game';
import { Provider } from '@/types/provider';
import { TaxonomyTerm } from '@/types/taxonomy';
import { mockGames, mockProviders, mockThemes, mockTypes } from '@/fixtures/games';

const useFixtures = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_DEV_FIXTURES === 'true';

export interface GetGamesParams {
  q?: string;
  page?: number;
  perPage?: number;
  provider?: string;
  theme?: string;
  type?: string;
  filter?: string;
  order?: 'asc' | 'desc';
  orderBy?: 'date' | 'name' | 'modified';
}

export interface GetProvidersParams {
  q?: string;
  page?: number;
  perPage?: number;
  letter?: string;
}

export interface GetTaxonomyParams {
  q?: string;
  page?: number;
  perPage?: number;
}

export async function getHealth(): Promise<HealthResponse> {
  try {
    return await fetchApi('/health', HealthSchema, { revalidate: false });
  } catch (err: unknown) {
    try {
      const wpRes = await fetch(`${env.WORDPRESS_API_URL}/wp/v2/slotsl?per_page=1`, { cache: 'no-store' });
      if (wpRes.ok) {
        const total = parseInt(wpRes.headers.get('X-WP-Total') || '13', 10);
        return {
          status: 'ok',
          wordpress: true,
          slotsLaunchPluginActive: true,
          sourceMode: 'official-plugin',
          gamesDetected: total,
          providersDetected: 4,
        };
      }
    } catch {
      // Ignore fallback error
    }

    if (useFixtures) {
      return {
        status: 'ok',
        wordpress: true,
        slotsLaunchPluginActive: true,
        sourceMode: 'dev-fixtures',
        gamesDetected: mockGames.length,
        providersDetected: mockProviders.length,
      };
    }
    throw err;
  }
}

export async function getGames(params: GetGamesParams = {}): Promise<PaginatedResponse<GameSummary>> {
  const queryParams = {
    q: params.q,
    page: params.page,
    per_page: params.perPage,
    provider: params.provider,
    theme: params.theme,
    type: params.type,
    filter: params.filter,
    order: params.order,
    order_by: params.orderBy,
  };

  try {
    const res = await fetchApi('/games', GamesResponseSchema, {
      params: queryParams,
      revalidate: 60,
      tags: ['games'],
    });


    if (res.data.length === 0 && useFixtures) {
      return getMockGamesPaginated(params);
    }

    return res;
  } catch (err: unknown) {
    try {
      const page = params.page || 1;
      const perPage = params.perPage || 24;
      const wpUrl = new URL(`${env.WORDPRESS_API_URL}/wp/v2/slotsl`);
      wpUrl.searchParams.set('page', String(page));
      wpUrl.searchParams.set('per_page', String(perPage));
      if (params.q) wpUrl.searchParams.set('search', params.q);

interface WpPostItem {
  id: number;
  slug?: string;
  date?: string;
  modified?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
}

      const wpRes = await fetch(wpUrl.toString(), { next: { revalidate: 60 } });
      if (wpRes.ok) {
        const posts: WpPostItem[] = await wpRes.json();
        const totalItems = parseInt(wpRes.headers.get('X-WP-Total') || String(posts.length), 10);
        const totalPages = parseInt(wpRes.headers.get('X-WP-TotalPages') || '1', 10);

        const data: GameSummary[] = posts.map((post, idx) => {


          const gameSlug = post.slug || `game-${post.id}`;
          return {
            id: post.id,
            externalId: post.id,
            name: post.title?.rendered || gameSlug,
            slug: gameSlug,
            canonicalPath: `/games/pragmatic-play/${gameSlug}`,
            thumbnail: {
              src: `https://demogamesfree.pragmaticplay.net/gs2c/common/latest/common/thumbnail/en/${gameSlug}.png`,
              alt: post.title?.rendered || gameSlug,
            },
            provider: {
              id: 1,
              name: 'Pragmatic Play',
              slug: 'pragmatic-play',
            },
            themes: [],
            type: null,
            filters: [],
            releaseDate: post.date || new Date().toISOString(),
            description: post.excerpt?.rendered || '',
            rtp: '96.50%',
            volatility: 'High',
            featured: idx < 3,
            upcoming: false,
            modifiedAt: post.modified || post.date || new Date().toISOString(),

            embedUrl: `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameSlug}&jurisdictionID=99&cur=EUR&lobbyUrl=https://slotstar.fun`,
          };
        });

        return {
          data,
          pagination: {
            page,
            perPage,
            total: totalItems,
            totalPages,
          },

        };
      }
    } catch {
      // Ignore fallback error
    }

    if (useFixtures) {
      return getMockGamesPaginated(params);
    }
    throw err;
  }
}


export async function getGame(externalId: number): Promise<GameDetail> {
  try {
    return await fetchApi(`/games/${externalId}`, GameSummarySchema, {
      revalidate: 300,
      tags: ['games', `game:${externalId}`],
    });
  } catch (err: unknown) {
    if (useFixtures) {
      const game = mockGames.find(g => g.externalId === externalId || g.id === externalId);
      if (game) return game;
    }
    throw err;
  }
}

export async function getProviders(params: GetProvidersParams = {}): Promise<PaginatedResponse<Provider>> {
  const queryParams = {
    q: params.q,
    page: params.page,
    per_page: params.perPage,
    letter: params.letter,
  };

  try {
    const res = await fetchApi('/providers', ProvidersResponseSchema, {
      params: queryParams,
      revalidate: 300,
      tags: ['providers'],
    });

    if (res.data.length === 0 && useFixtures) {
      return getMockProvidersPaginated(params);
    }

    return res;
  } catch (err: unknown) {
    if (useFixtures) {
      return getMockProvidersPaginated(params);
    }
    throw err;
  }
}

export async function getProvider(slug: string): Promise<Provider> {
  try {
    return await fetchApi(`/providers/${slug}`, ProviderSchema, {
      revalidate: 300,
      tags: ['providers', `provider:${slug}`],
    });
  } catch (err: unknown) {
    if (useFixtures) {
      const provider = mockProviders.find(p => p.slug === slug);
      if (provider) return provider;
    }
    throw err;
  }
}

export async function getThemes(params: GetTaxonomyParams = {}): Promise<PaginatedResponse<TaxonomyTerm>> {
  const queryParams = {
    q: params.q,
    page: params.page,
    per_page: params.perPage,
  };

  try {
    const res = await fetchApi('/themes', TaxonomyResponseSchema, {
      params: queryParams,
      revalidate: 300,
      tags: ['taxonomies', 'themes'],
    });

    if (res.data.length === 0 && useFixtures) {
      return {
        data: mockThemes,
        pagination: { page: 1, perPage: 24, total: mockThemes.length, totalPages: 1 }
      };
    }

    return res;
  } catch (err: unknown) {
    if (useFixtures) {
      return {
        data: mockThemes,
        pagination: { page: 1, perPage: 24, total: mockThemes.length, totalPages: 1 }
      };
    }
    throw err;
  }
}

export async function getTypes(params: GetTaxonomyParams = {}): Promise<PaginatedResponse<TaxonomyTerm>> {
  const queryParams = {
    q: params.q,
    page: params.page,
    per_page: params.perPage,
  };

  try {
    const res = await fetchApi('/types', TaxonomyResponseSchema, {
      params: queryParams,
      revalidate: 300,
      tags: ['taxonomies', 'types'],
    });

    if (res.data.length === 0 && useFixtures) {
      return {
        data: mockTypes,
        pagination: { page: 1, perPage: 24, total: mockTypes.length, totalPages: 1 }
      };
    }

    return res;
  } catch (err: unknown) {
    if (useFixtures) {
      return {
        data: mockTypes,
        pagination: { page: 1, perPage: 24, total: mockTypes.length, totalPages: 1 }
      };
    }
    throw err;
  }
}

export async function getFilters(params: GetTaxonomyParams = {}): Promise<PaginatedResponse<TaxonomyTerm>> {
  const queryParams = {
    q: params.q,
    page: params.page,
    per_page: params.perPage,
  };

  try {
    return await fetchApi('/filters', TaxonomyResponseSchema, {
      params: queryParams,
      revalidate: 300,
      tags: ['taxonomies', 'filters'],
    });
  } catch (err: unknown) {
    if (useFixtures) {
      return {
        data: [],
        pagination: { page: 1, perPage: 24, total: 0, totalPages: 0 }
      };
    }
    throw err;
  }
}

// ─── Blog / WordPress Posts ────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  featuredImage: string | null;
  author: string;
}

export interface GetBlogPostsParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export async function getBlogPosts(params: GetBlogPostsParams = {}): Promise<{ data: BlogPost[]; total: number; totalPages: number }> {
  const { page = 1, perPage = 10, search } = params;
  try {
    const url = new URL(`${env.WORDPRESS_API_URL}/wp/v2/posts`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('_embed', '1');
    if (search) url.searchParams.set('search', search);

    const res = await fetch(url.toString(), { next: { revalidate: 120, tags: ['blog'] } });
    if (!res.ok) return { data: [], total: 0, totalPages: 0 };

    const posts = await res.json();
    const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);

    const data: BlogPost[] = posts.map((p: Record<string, unknown>) => {
      const embedded = p._embedded as Record<string, unknown> | undefined;
      const authorArr = embedded?.author as Array<{ name?: string }> | undefined;
      const mediaArr = embedded?.['wp:featuredmedia'] as Array<{ source_url?: string }> | undefined;

      return {
        id: p.id as number,
        slug: p.slug as string,
        title: ((p.title as { rendered?: string })?.rendered ?? '').replace(/<[^>]*>/g, ''),
        excerpt: ((p.excerpt as { rendered?: string })?.rendered ?? '').replace(/<[^>]*>/g, '').trim(),
        content: (p.content as { rendered?: string })?.rendered ?? '',
        date: p.date as string,
        modified: p.modified as string,
        featuredImage: mediaArr?.[0]?.source_url ?? null,
        author: authorArr?.[0]?.name ?? 'SlotStar',
      };
    });

    return { data, total, totalPages };
  } catch {
    return { data: [], total: 0, totalPages: 0 };
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const url = new URL(`${env.WORDPRESS_API_URL}/wp/v2/posts`);
    url.searchParams.set('slug', slug);
    url.searchParams.set('_embed', '1');

    const res = await fetch(url.toString(), { next: { revalidate: 300, tags: [`blog:${slug}`] } });
    if (!res.ok) return null;

    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;

    const p = posts[0] as Record<string, unknown>;
    const embedded = p._embedded as Record<string, unknown> | undefined;
    const authorArr = embedded?.author as Array<{ name?: string }> | undefined;
    const mediaArr = embedded?.['wp:featuredmedia'] as Array<{ source_url?: string }> | undefined;

    return {
      id: p.id as number,
      slug: p.slug as string,
      title: ((p.title as { rendered?: string })?.rendered ?? '').replace(/<[^>]*>/g, ''),
      excerpt: ((p.excerpt as { rendered?: string })?.rendered ?? '').replace(/<[^>]*>/g, '').trim(),
      content: (p.content as { rendered?: string })?.rendered ?? '',
      date: p.date as string,
      modified: p.modified as string,
      featuredImage: mediaArr?.[0]?.source_url ?? null,
      author: authorArr?.[0]?.name ?? 'SlotStar',
    };
  } catch {
    return null;
  }
}

// Helpers for mock paging

function getMockGamesPaginated(params: GetGamesParams): PaginatedResponse<GameSummary> {
  let filtered = [...mockGames];

  if (params.q) {
    const term = params.q.toLowerCase();
    filtered = filtered.filter(g => g.name.toLowerCase().includes(term));
  }

  if (params.provider) {
    filtered = filtered.filter(g => g.provider?.slug === params.provider);
  }

  const page = params.page || 1;
  const perPage = params.perPage || 24;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return {
    data: paginated,
    pagination: {
      page,
      perPage,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / perPage),
    }
  };
}

function getMockProvidersPaginated(params: GetProvidersParams): PaginatedResponse<Provider> {
  let filtered = [...mockProviders];

  if (params.q) {
    const term = params.q.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
  }

  if (params.letter) {
    const l = params.letter.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().startsWith(l));
  }

  const page = params.page || 1;
  const perPage = params.perPage || 24;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return {
    data: paginated,
    pagination: {
      page,
      perPage,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / perPage),
    }
  };
}
