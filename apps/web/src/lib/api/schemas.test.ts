import { describe, expect, it } from 'vitest';
import {
  GameSummarySchema,
  GamesResponseSchema,
  GetGamesOrderBySchema,
  HealthSchema,
  PaginationSchema,
} from './schemas';

const validGame = {
  id: 1,
  externalId: 100,
  name: 'Book of Dead',
  slug: 'book-of-dead',
  canonicalPath: '/games/playn-go/book-of-dead',
  thumbnail: { src: '/images/games/book-of-dead.png', alt: 'Book of Dead' },
  provider: { id: 10, name: "Play'n GO", slug: 'playn-go' },
  themes: [],
  type: null,
  filters: [],
  releaseDate: '2020-01-01',
  description: null,
  rtp: '96.21%',
  volatility: 'High',
  featured: true,
  upcoming: false,
  modifiedAt: '2024-01-01T00:00:00Z',
};

describe('PaginationSchema', () => {
  it('accepts a valid pagination object', () => {
    const result = PaginationSchema.safeParse({
      page: 1,
      perPage: 24,
      total: 100,
      totalPages: 5,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing fields', () => {
    expect(PaginationSchema.safeParse({ page: 1 }).success).toBe(false);
  });
});

describe('GameSummarySchema', () => {
  it('accepts a valid game summary', () => {
    const result = GameSummarySchema.safeParse(validGame);
    expect(result.success).toBe(true);
  });

  it('allows nullable rtp, volatility, and provider', () => {
    const result = GameSummarySchema.safeParse({
      ...validGame,
      rtp: null,
      volatility: null,
      provider: null,
      thumbnail: { src: null, alt: 'No art' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid payload missing required fields', () => {
    const result = GameSummarySchema.safeParse({ id: 1, name: 'Broken' });
    expect(result.success).toBe(false);
  });
});

describe('GamesResponseSchema', () => {
  it('accepts data + pagination envelope', () => {
    const result = GamesResponseSchema.safeParse({
      data: [validGame],
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    });
    expect(result.success).toBe(true);
  });

  it('rejects when data is not an array', () => {
    const result = GamesResponseSchema.safeParse({
      data: validGame,
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    });
    expect(result.success).toBe(false);
  });
});

describe('GetGamesOrderBySchema', () => {
  it('accepts known orderBy values', () => {
    expect(GetGamesOrderBySchema.safeParse('trending').success).toBe(true);
    expect(GetGamesOrderBySchema.safeParse('date').success).toBe(true);
    expect(GetGamesOrderBySchema.safeParse('gold').success).toBe(true);
  });

  it('rejects unknown orderBy values', () => {
    expect(GetGamesOrderBySchema.safeParse('popularity').success).toBe(false);
    expect(GetGamesOrderBySchema.safeParse('').success).toBe(false);
  });
});

describe('HealthSchema', () => {
  it('accepts a valid health payload', () => {
    const result = HealthSchema.safeParse({
      status: 'ok',
      wordpress: true,
      slotsLaunchPluginActive: true,
      sourceMode: 'official-plugin',
      gamesDetected: 1200,
      providersDetected: 40,
    });
    expect(result.success).toBe(true);
  });

  it('rejects incomplete health payload', () => {
    expect(HealthSchema.safeParse({ status: 'ok' }).success).toBe(false);
  });
});
