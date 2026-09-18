import { VaultStory } from '../types';

/**
 * BUNDLED ARCHIVE — /vault fallback
 * ---------------------------------
 * Ships with the app so THE ARCHIVE is always populated. When Sanity is
 * configured (VITE_SANITY_PROJECT_ID) the vault is replaced by live
 * Sanity Studio content — same shape, published by the site owner.
 * (See `sanity/schemas.ts` and VERCEL_ARCHITECTURE.md §4–5.)
 */

export const BUNDLED_VAULT_STORIES: VaultStory[] = [
  {
    id: 'vault-campaign-001',
    slug: 'campaign-001-monochrome',
    title: 'CAMPAIGN 001 / MONOCHROME',
    category: 'CAMPAIGN',
    summary:
      'The inaugural release, photographed as form study. Two silhouettes, one uniform — black arch against heather cobalt under single-key Rembrandt light.',
    coverImage: '/models/LM_P01_02_BLACK_BLACK_2.jpg',
    gallery: [
      { src: '/models/LM_P01_02_BLACK_BLACK_2.jpg', label: 'PLATE 02 / 35MM' },
      { src: '/models/LM_P01_02_BLACK_BLACK.jpg', label: 'PLATE 01 / TELE' },
      { src: '/images/campaign-hero-motion.jpg', label: 'CANTILEVER REST' },
      { src: '/images/shorts-001-back.jpg', label: 'SEATED DRAPE' },
    ],
    publishedAt: '2026-09-12T10:00:00Z',
    credits: ['DIRECTION — LAWRENCE MONROE', 'OPTICS — 35MM / 80MM PRIME', 'GRADE — SILVER-GELATIN DIGITAL'],
    linkedSquareItemIds: ['lm-shorts-001', 'lm-shorts-002'],
    featured: true,
  },
  {
    id: 'vault-gen-effects-1',
    slug: 'gen-effects-vol-1',
    title: 'GEN EFFECTS / VOL 1',
    category: 'GEN EFFECTS',
    summary:
      'Scanner moiré, tape drag, chromatic split — the analog defect library behind the brand system. Source plates and the artifacts they became.',
    coverImage: '/images/campaign-contact-fabric.jpg',
    gallery: [
      { src: '/images/campaign-contact-fabric.jpg', label: 'SOURCE / KNIT MACRO' },
      { src: '/images/campaign-contact-hardware.jpg', label: 'SOURCE / HARDWARE' },
      { src: '/images/shorts-002-detail.jpg', label: 'ARTIFACT / MOIRÉ PASS' },
    ],
    publishedAt: '2026-09-05T09:00:00Z',
    credits: ['PROCESS — ANALOG DEFECT LAB', 'FORMAT — DRUM SCAN'],
    linkedSquareItemIds: ['lm-shorts-001'],
  },
  {
    id: 'vault-silver-gelatin',
    slug: 'silver-gelatin-studies',
    title: 'SILVER-GELATIN STUDIES',
    category: 'SILVER-GELATIN',
    summary:
      'High-contrast print studies of the collection. Directional light, deep blacks, paper whites — garments rendered as sculpture.',
    coverImage: '/models/LM_P01_02_GRAY_2.jpg',
    gallery: [
      { src: '/models/LM_P01_02_GRAY_2.jpg', label: 'STUDY 04 / COBALT' },
      { src: '/models/LM_P01_02_GRAY_.jpg', label: 'STUDY 03 / PROFILE' },
      { src: '/images/campaign-contact-stride.jpg', label: 'STUDY 02 / STRIDE' },
    ],
    publishedAt: '2026-08-28T14:30:00Z',
    credits: ['PRINT — FIBER BASE SILVER-GELATIN', 'TONING — SELENIUM 1:9'],
    linkedSquareItemIds: ['lm-shorts-002'],
  },
  {
    id: 'vault-archive-next',
    slug: 'archive-next',
    title: 'ARCHIVE NEXT / SEALED',
    category: 'CAMPAIGN',
    summary:
      'Classified research for the second allocation. Torso and headwear silhouettes under redaction. Access by request only.',
    coverImage: '/images/archive-shirt-teaser.jpg',
    gallery: [
      { src: '/images/archive-shirt-teaser.jpg', label: 'SEALED / TORSO' },
      { src: '/images/archive-hat-teaser.jpg', label: 'SEALED / HEADWEAR' },
    ],
    publishedAt: '2026-08-20T08:00:00Z',
    credits: ['STATUS — CLASSIFIED', 'RELEASE — NEXT ALLOCATION'],
    linkedSquareItemIds: [],
  },
];
