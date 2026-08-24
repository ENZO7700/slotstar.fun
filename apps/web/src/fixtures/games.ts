import { GameSummary } from '@/types/game';
import { Provider } from '@/types/provider';
import { TaxonomyTerm } from '@/types/taxonomy';

export const mockProviders: Provider[] = [
  { id: 1, name: 'Pragmatic Play', slug: 'pragmatic-play', count: 12 },
  { id: 2, name: 'Hacksaw Gaming', slug: 'hacksaw-gaming', count: 8 },
  { id: 3, name: 'Nolimit City', slug: 'nolimit-city', count: 6 },
  { id: 4, name: 'Play\'n GO', slug: 'play-n-go', count: 15 },
  { id: 5, name: 'NetEnt', slug: 'netent', count: 10 },
  { id: 6, name: 'Push Gaming', slug: 'push-gaming', count: 5 }
];

export const mockThemes: TaxonomyTerm[] = [
  { id: 1, name: 'Egypt & Pyramídy', slug: 'egypt' },
  { id: 2, name: 'Ovocné Klasiky', slug: 'fruit' },
  { id: 3, name: 'Mytológia & Bohovia', slug: 'mythology' },
  { id: 4, name: 'Divoký Západ', slug: 'wild-west' },
  { id: 5, name: 'Drahokamy & Diamanty', slug: 'gems' },
  { id: 6, name: 'Dobrodružstvo', slug: 'adventure' },
  { id: 7, name: 'Fantasy & Mágia', slug: 'fantasy' },
  { id: 8, name: 'Zvieratá & Ryby', slug: 'animal' },
  { id: 9, name: 'Sci-Fi & Vesmír', slug: 'scifi' },
  { id: 10, name: 'Ázijské & Draky', slug: 'asian' }
];

export const mockTypes: TaxonomyTerm[] = [
  { id: 1, name: 'Megaways™ Automaty', slug: 'megaways' },
  { id: 2, name: 'Video Automaty', slug: 'video-slot' },
  { id: 3, name: 'Klasické Automaty', slug: 'classic-slot' },
  { id: 4, name: 'Jackpot Automaty', slug: 'jackpot' },
  { id: 5, name: 'Bonus Buy Automaty', slug: 'bonus-buy' }
];

function localThumbnail(slug: string, alt: string) {
  return {
    src: `/images/games/${slug}.png`,
    alt,
  };
}

export const mockGames: GameSummary[] = [
  {
    id: 101,
    externalId: 1001,
    name: 'Gates of Olympus',
    slug: 'gates-of-olympus-1001',
    canonicalPath: '/games/pragmatic-play/gates-of-olympus-1001',
    thumbnail: localThumbnail('gates-of-olympus-1001', 'Gates of Olympus'),
    provider: { id: 1, name: 'Pragmatic Play', slug: 'pragmatic-play' },
    themes: [{ id: 3, name: 'Mytológia', slug: 'mythology' }],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2021-02-13',
    description: 'Sladká a epická grécka mytologická hra so stupňujúcimi sa násobiteľmi.',
    rtp: '96.50%',
    volatility: 'High',
    featured: true,
    upcoming: false,
    modifiedAt: '2026-08-07 00:00:00'
  },
  {
    id: 102,
    externalId: 1002,
    name: 'Sweet Bonanza',
    slug: 'sweet-bonanza-1002',
    canonicalPath: '/games/pragmatic-play/sweet-bonanza-1002',
    thumbnail: localThumbnail('sweet-bonanza-1002', 'Sweet Bonanza'),
    provider: { id: 1, name: 'Pragmatic Play', slug: 'pragmatic-play' },
    themes: [{ id: 2, name: 'Ovocie', slug: 'fruit' }],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2019-06-27',
    description: 'Ovocná bomba plná výhier s možnosťou kupovania bonusových stávok.',
    rtp: '96.48%',
    volatility: 'Medium-High',
    featured: true,
    upcoming: false,
    modifiedAt: '2026-08-07 00:00:00'
  },
  {
    id: 103,
    externalId: 1003,
    name: 'Big Bass Bonanza',
    slug: 'big-bass-bonanza-1003',
    canonicalPath: '/games/pragmatic-play/big-bass-bonanza-1003',
    thumbnail: localThumbnail('big-bass-bonanza-1003', 'Big Bass Bonanza'),
    provider: { id: 1, name: 'Pragmatic Play', slug: 'pragmatic-play' },
    themes: [],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2020-12-01',
    description: 'Rybársky automat s bonus free spins.',
    rtp: '96.71%',
    volatility: 'High',
    featured: false,
    upcoming: false,
    modifiedAt: '2026-08-07 00:00:00'
  },
  {
    id: 104,
    externalId: 2001,
    name: 'Starburst',
    slug: 'starburst-2001',
    canonicalPath: '/games/netent/starburst-2001',
    thumbnail: localThumbnail('starburst-2001', 'Starburst'),
    provider: { id: 5, name: 'NetEnt', slug: 'netent' },
    themes: [],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2012-11-12',
    description: 'Kultový vesmírny automat s expanding wilds.',
    rtp: '96.09%',
    volatility: 'Low',
    featured: false,
    upcoming: false,
    modifiedAt: '2026-08-07 00:00:00'
  },
  {
    id: 105,
    externalId: 3001,
    name: 'Book of Dead',
    slug: 'book-of-dead-3001',
    canonicalPath: '/games/play-n-go/book-of-dead-3001',
    thumbnail: localThumbnail('book-of-dead-3001', 'Book of Dead'),
    provider: { id: 4, name: 'Play\'n GO', slug: 'play-n-go' },
    themes: [
      { id: 1, name: 'Egypt', slug: 'egypt' },
      { id: 4, name: 'Knihy', slug: 'books' }
    ],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2016-01-14',
    description: 'Klasický egyptský knižný automat s Richom Wildom.',
    rtp: '96.21%',
    volatility: 'High',
    featured: false,
    upcoming: false,
    modifiedAt: '2026-08-07 00:00:00'
  },
  {
    id: 106,
    externalId: 1005,
    name: 'Fruit Party',
    slug: 'fruit-party-1005',
    canonicalPath: '/games/pragmatic-play/fruit-party-1005',
    thumbnail: localThumbnail('fruit-party-1005', 'Fruit Party'),
    provider: { id: 1, name: 'Pragmatic Play', slug: 'pragmatic-play' },
    themes: [],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2020-05-01',
    description: 'Ovocný cluster slot s multiplikátormi.',
    rtp: '96.47%',
    volatility: 'High',
    featured: false,
    upcoming: true,
    modifiedAt: '2026-08-07 00:00:00'
  }
];
