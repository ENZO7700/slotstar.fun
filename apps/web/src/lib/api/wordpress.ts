import 'server-only';
import { fetchApi } from './client';
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
