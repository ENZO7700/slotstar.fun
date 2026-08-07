import { z } from 'zod';

export const TaxonomyTermSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  count: z.number().optional(),
});

export const GameThumbnailSchema = z.object({
  src: z.string().nullable(),
  alt: z.string(),
});

export const GameSummarySchema = z.object({
  id: z.number(),
  externalId: z.number().nullable(),
  name: z.string(),
  slug: z.string(),
  canonicalPath: z.string(),
  thumbnail: GameThumbnailSchema,
  provider: TaxonomyTermSchema.nullable(),
  themes: z.array(TaxonomyTermSchema),
  type: TaxonomyTermSchema.nullable(),
  filters: z.array(TaxonomyTermSchema),
  releaseDate: z.string().nullable(),
  description: z.string().nullable(),
  rtp: z.string().nullable(),
  volatility: z.string().nullable(),
  featured: z.boolean(),
  upcoming: z.boolean(),
  modifiedAt: z.string(),
  embedUrl: z.string().optional(),

  // Optional technical info
  technical: z.object({
    reels: z.number().nullable().optional(),
    paylines: z.union([z.string(), z.number()]).nullable().optional(),
    rtp: z.string().nullable().optional(),
    volatility: z.string().nullable().optional(),
    megaways: z.boolean().nullable().optional(),
    bonusBuy: z.boolean().nullable().optional(),
    progressive: z.boolean().nullable().optional(),
    autoplay: z.boolean().nullable().optional(),
    quickspin: z.boolean().nullable().optional(),
    tumblingReels: z.boolean().nullable().optional(),
    increasingMultipliers: z.boolean().nullable().optional(),
    orientation: z.string().nullable().optional(),
  }).nullable().optional(),

  // Optional limits
  limits: z.object({
    minBet: z.number().nullable().optional(),
    maxBet: z.number().nullable().optional(),
    maxWinPerSpin: z.number().nullable().optional(),
    maxExposure: z.number().nullable().optional(),
  }).nullable().optional(),

  // Optional availability
  availability: z.object({
    currencies: z.array(z.string()).nullable().optional(),
    languages: z.array(z.string()).nullable().optional(),
    markets: z.array(z.string()).nullable().optional(),
    restrictions: z.array(z.string()).nullable().optional(),
    landBased: z.boolean().nullable().optional(),
  }).nullable().optional(),

  // Optional status flags
  status: z.object({
    featured: z.boolean().nullable().optional(),
    upcoming: z.boolean().nullable().optional(),
    published: z.boolean().nullable().optional(),
  }).nullable().optional(),

  // Optional timestamps
  timestamps: z.object({
    release: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
  }).nullable().optional(),
});

export const PaginationSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const GamesResponseSchema = z.object({
  data: z.array(GameSummarySchema),
  pagination: PaginationSchema,
});

export const ProviderSchema = TaxonomyTermSchema.extend({
  count: z.number(),
});

export const ProvidersResponseSchema = z.object({
  data: z.array(ProviderSchema),
  pagination: PaginationSchema,
});

export const TaxonomyResponseSchema = z.object({
  data: z.array(TaxonomyTermSchema),
  pagination: PaginationSchema,
});

export const HealthSchema = z.object({
  status: z.string(),
  wordpress: z.boolean(),
  slotsLaunchPluginActive: z.boolean(),
  sourceMode: z.string(),
  gamesDetected: z.number(),
  providersDetected: z.number(),
});

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});
