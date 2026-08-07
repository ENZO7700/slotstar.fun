import { TaxonomyTerm } from './taxonomy';

export interface GameThumbnail {
  src: string | null;
  alt: string;
}

export interface GameSummary {
  id: number;
  externalId: number | null;
  name: string;
  slug: string;
  canonicalPath: string;
  thumbnail: GameThumbnail;
  provider: TaxonomyTerm | null;
  themes: TaxonomyTerm[];
  type: TaxonomyTerm | null;
  filters: TaxonomyTerm[];
  releaseDate: string | null;
  description: string | null;
  rtp: string | null;
  volatility: string | null;
  featured: boolean;
  upcoming: boolean;
  modifiedAt: string;
  embedUrl?: string;

  // Future optional technical specs
  technical?: {
    reels?: number | null;
    paylines?: string | number | null;
    rtp?: string | null;
    volatility?: string | null;
    megaways?: boolean | null;
    bonusBuy?: boolean | null;
    progressive?: boolean | null;
    autoplay?: boolean | null;
    quickspin?: boolean | null;
    tumblingReels?: boolean | null;
    increasingMultipliers?: boolean | null;
    orientation?: string | null;
  } | null;

  // Future optional limits
  limits?: {
    minBet?: number | null;
    maxBet?: number | null;
    maxWinPerSpin?: number | null;
    maxExposure?: number | null;
  } | null;

  // Future optional market availability
  availability?: {
    currencies?: string[] | null;
    languages?: string[] | null;
    markets?: string[] | null;
    restrictions?: string[] | null;
    landBased?: boolean | null;
  } | null;

  // Future status flags
  status?: {
    featured?: boolean | null;
    upcoming?: boolean | null;
    published?: boolean | null;
  } | null;

  // Future optional timestamps
  timestamps?: {
    release?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
}

export type GameDetail = GameSummary;

