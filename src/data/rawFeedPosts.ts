import { RawFeedPost } from '../types';

/**
 * CURATED COMMUNITY FEED — /telemetry fallback
 * --------------------------------------------
 * Ships with the app so THE TELEMETRY is always populated. When the
 * Instagram Graph API is configured (`INSTAGRAM_ACCESS_TOKEN` on the
 * server) the official @LawrenceMonroe posts are fetched live via
 * `/api/instagram` and prepended to this curated set.
 *
 * `tags[].squareItemId` maps to Square Item IDs (or bundled product ids
 * pre-Square) — the "SHOP THE LOOK" links.
 */

const T = (squareItemId: string, name: string) => ({ squareItemId, name });

export const CURATED_FEED_POSTS: RawFeedPost[] = [
  {
    id: 'curated-01',
    handle: 'lawrencemonroe',
    isOfficial: true,
    image: '/models/LM_P01_02_BLACK_BLACK_2.jpg',
    alt: 'Official campaign plate — LM Shorts 001 black arch colorway',
    caption:
      'LM SHORTS 001 / ARCH BLACK — studio plate 02. Vertical arch, heavyweight drape. Photographed on 35mm.',
    postedAt: '2026-09-12T17:30:00Z',
    likes: 1284,
    aspect: 'tall',
    tags: [T('lm-shorts-001', 'LM SHORTS 001')],
  },
  {
    id: 'curated-02',
    handle: 'lawrencemonroe',
    isOfficial: true,
    image: '/models/LM_P01_02_GRAY_2.jpg',
    alt: 'Official campaign plate — LM Shorts 002 heather cobalt colorway',
    caption: 'LM SHORTS 002 / HEATHER COBALT — plate 04. Athletic heather, electric arch.',
    postedAt: '2026-09-10T15:05:00Z',
    likes: 967,
    aspect: 'tall',
    tags: [T('lm-shorts-002', 'LM SHORTS 002')],
  },
  {
    id: 'curated-03',
    handle: 'concretefixtures',
    isOfficial: false,
    image: '/images/campaign-contact-stride.jpg',
    alt: 'Community post — stride study in LM Shorts',
    caption: 'stride proportion study. the arch holds its line mid-motion. @lawrencemonroe',
    postedAt: '2026-09-09T20:12:00Z',
    likes: 214,
    aspect: 'wide',
    tags: [T('lm-shorts-001', 'LM SHORTS 001')],
  },
  {
    id: 'curated-04',
    handle: 'silvergelatin.club',
    isOfficial: false,
    image: '/images/campaign-contact-fabric.jpg',
    alt: 'Community post — macro fabric knit study',
    caption: '480gsm knit under the loupe. fabric does not lie. LM SHORTS 001',
    postedAt: '2026-09-08T12:40:00Z',
    likes: 342,
    aspect: 'square',
    tags: [T('lm-shorts-001', 'LM SHORTS 001')],
  },
  {
    id: 'curated-05',
    handle: 'lawrencemonroe',
    isOfficial: true,
    image: '/images/campaign-hero-motion.jpg',
    alt: 'Official campaign plate — seated cantilever study',
    caption: 'CANTILEVER REST — seated study, chrome against heavyweight cotton.',
    postedAt: '2026-09-06T18:00:00Z',
    likes: 856,
    aspect: 'square',
    tags: [],
  },
  {
    id: 'curated-06',
    handle: 'noir.index',
    isOfficial: false,
    image: '/images/shorts-002-detail.jpg',
    alt: 'Community post — raw hem detail',
    caption: 'raw hem, anti-fray stay stitch. engineering as ornament. LM SHORTS 002',
    postedAt: '2026-09-05T09:26:00Z',
    likes: 178,
    aspect: 'wide',
    tags: [T('lm-shorts-002', 'LM SHORTS 002')],
  },
  {
    id: 'curated-07',
    handle: 'archive.specimens',
    isOfficial: false,
    image: '/images/campaign-contact-hardware.jpg',
    alt: 'Community post — hardware macro',
    caption: 'antique gold hardware macro. the details are the document.',
    postedAt: '2026-09-03T22:15:00Z',
    likes: 259,
    aspect: 'square',
    tags: [],
  },
  {
    id: 'curated-08',
    handle: 'lawrencemonroe',
    isOfficial: true,
    image: '/models/LM_P01_02_GRAY_.jpg',
    alt: 'Official campaign plate — profile study',
    caption: 'PROFILE / GRAY — plate 03. silhouette against the wall.',
    postedAt: '2026-09-01T16:45:00Z',
    likes: 1103,
    aspect: 'tall',
    tags: [T('lm-shorts-002', 'LM SHORTS 002')],
  },
];
