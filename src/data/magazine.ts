/**
 * THE MAGAZINE MODEL — single source of truth for the issue structure.
 * ---------------------------------------------------------------
 * The whole site reads as one printed issue: every route is a "page"
 * with a folio number, the nav overlay is the contents spread, and the
 * cover lines on the index reference these page numbers.
 *
 * Consumed by: Navigation (contents overlay), PageTransition (page-turn
 * label), MagazineFolio (running folio), the Cover, and the colophon.
 */

export interface IssueMeta {
  number: string;
  title: string;
  date: string;
  established: string;
  priceLine: string;
}

export const ISSUE: IssueMeta = {
  number: '001',
  title: 'THE FORM ISSUE',
  date: 'AUTUMN 2026',
  established: 'EST. MMXXVI',
  priceLine: '$165 / ISSUE',
};

export interface ContentsEntry {
  page: string;
  title: string;
  subtitle: string;
  route: string;
  image: string;
}

export const CONTENTS: ContentsEntry[] = [
  {
    page: '02',
    title: 'THE FEATURE',
    subtitle: 'Built to hold its form',
    route: '/#feature',
    image: '/images/campaign-contact-fabric.jpg',
  },
  {
    page: '04',
    title: 'THE DROP',
    subtitle: 'Capsule 001 — two pieces, one uniform',
    route: '/#drop',
    image: '/images/shorts-001-cutout.jpg',
  },
  {
    page: '06',
    title: 'THE EDIT',
    subtitle: 'The full catalog, live from the studio',
    route: '/shop',
    image: '/models/LM_P01_02_BLACK_BLACK_2.jpg',
  },
  {
    page: '10',
    title: 'THE PLATES',
    subtitle: 'Campaigns, gen effects, silver-gelatin stories',
    route: '/vault',
    image: '/images/campaign-hero-motion.jpg',
  },
  {
    page: '14',
    title: 'THE FEED',
    subtitle: 'Raw posts, tagged to the rack',
    route: '/telemetry',
    image: '/images/campaign-contact-stride.jpg',
  },
  {
    page: '18',
    title: 'THE MANIFESTO',
    subtitle: 'The brand document',
    route: '/about',
    image: '/models/LM_P01_02_GRAY_2.jpg',
  },
  {
    page: '20',
    title: 'COLOPHON',
    subtitle: 'Masthead, credits & private dispatch',
    route: '/#colophon',
    image: '/images/campaign-contact-hardware.jpg',
  },
];

/** Route → folio, for the running page chip and the page-turn label. */
export const routeFolio = (pathname: string): { page: string; title: string } => {
  if (pathname === '/' || pathname === '') return { page: '01', title: 'THE COVER' };
  if (pathname.startsWith('/shop/')) return { page: '08', title: 'THE SPECIMEN' };
  if (pathname.startsWith('/shop')) return { page: '06', title: 'THE EDIT' };
  if (pathname.startsWith('/vault')) return { page: '10', title: 'THE PLATES' };
  if (pathname.startsWith('/telemetry')) return { page: '14', title: 'THE FEED' };
  if (pathname.startsWith('/about')) return { page: '18', title: 'THE MANIFESTO' };
  if (pathname.startsWith('/checkout')) return { page: '19', title: 'THE COUNTER' };
  return { page: '01', title: 'THE COVER' };
};
