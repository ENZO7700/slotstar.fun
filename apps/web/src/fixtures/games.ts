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

export const mockGames: GameSummary[] = [
  {
    id: 101,
    externalId: 5001,
    name: 'Gates of Olympus',
    slug: 'gates-of-olympus-5001',
    canonicalPath: '/games/pragmatic-play/gates-of-olympus-5001',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&q=80',
      alt: 'Gates of Olympus'
    },
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
    externalId: 5002,
    name: 'Sweet Bonanza',
    slug: 'sweet-bonanza-5002',
    canonicalPath: '/games/pragmatic-play/sweet-bonanza-5002',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400&q=80',
      alt: 'Sweet Bonanza'
    },
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
    externalId: 5003,
    name: 'Wanted Dead or a Wild',
    slug: 'wanted-dead-or-a-wild-5003',
    canonicalPath: '/games/hacksaw-gaming/wanted-dead-or-a-wild-5003',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80',
      alt: 'Wanted Dead or a Wild'
    },
    provider: { id: 2, name: 'Hacksaw Gaming', slug: 'hacksaw-gaming' },
    themes: [],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2021-09-29',
    description: 'Temný western s obrovskými násobiteľmi wild a VS symbolmi.',
    rtp: '96.38%',
    volatility: 'High',
    featured: false,
    upcoming: false,
    modifiedAt: '2026-08-07 00:00:00'
  },
  {
    id: 104,
    externalId: 5004,
    name: 'San Quentin xWays',
    slug: 'san-quentin-xways-5004',
    canonicalPath: '/games/nolimit-city/san-quentin-xways-5004',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
      alt: 'San Quentin xWays'
    },
    provider: { id: 3, name: 'Nolimit City', slug: 'nolimit-city' },
    themes: [],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2021-01-12',
    description: 'Najznámejšia väzenská dráma s extrémnou volatilitou a bonus buy stávkami.',
    rtp: '96.03%',
    volatility: 'Extreme',
    featured: false,
    upcoming: false,
    modifiedAt: '2026-08-07 00:00:00'
  },
  {
    id: 105,
    externalId: 5005,
    name: 'Book of Dead',
    slug: 'book-of-dead-5005',
    canonicalPath: '/games/play-n-go/book-of-dead-5005',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
      alt: 'Book of Dead'
    },
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
    externalId: 5006,
    name: 'Chaos Crew 2',
    slug: 'chaos-crew-2-5006',
    canonicalPath: '/games/hacksaw-gaming/chaos-crew-2-5006',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
      alt: 'Chaos Crew 2'
    },
    provider: { id: 2, name: 'Hacksaw Gaming', slug: 'hacksaw-gaming' },
    themes: [],
    type: { id: 1, name: 'Video sloty', slug: 'video-slots' },
    filters: [],
    releaseDate: '2023-09-28',
    description: 'Graffiti punkový mačací chaos s obrovským násobiteľovým bonusom.',
    rtp: '96.27%',
    volatility: 'High',
    featured: false,
    upcoming: true,
    modifiedAt: '2026-08-07 00:00:00'
  }
];
