/**
 * THE MAGAZINE MODEL — single source of truth for the issue structure.
 * ---------------------------------------------------------------
 * The whole site reads as one printed issue: every route is a "page"
 * with a folio number, the nav overlay is the contents spread, and the
 * cover lines on the index reference these page numbers.
 *
 * Consumed by: Navigation (contents overlay), MagazineFolio (running folio).
 *
 * v7 — trimmed to four pages: Cover, The Drop, The Feed, Contact.
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
    page: '01',
    title: 'THE COVER',
    subtitle: 'Lawrence Monroe — Issue 001',
    route: '/',
    image: '/images/campaign-hero-motion.jpg',
  },
  {
    page: '02',
    title: 'THE DROP',
    subtitle: 'Two pieces, one uniform',
    route: '/drop',
    image: '/images/LM_P01_02_BLACK_BLACK_2.jpg',
  },
  {
    page: '03',
    title: 'THE FEED',
    subtitle: 'Raw posts, tagged to the rack',
    route: '/feed',
    image: '/images/campaign-contact-stride.jpg',
  },
  {
    page: '04',
    title: 'CONTACT',
    subtitle: 'Dispatch & studio inquiries',
    route: '/contact',
    image: '/images/campaign-contact-hardware.jpg',
  },
];

/** Route → folio, for the running page chip and the page-turn label. */
export const routeFolio = (pathname: string): { page: string; title: string } => {
  if (pathname.startsWith('/drop/')) return { page: '02', title: 'THE SPECIMEN' };
  if (pathname.startsWith('/drop')) return { page: '02', title: 'THE DROP' };
  if (pathname.startsWith('/feed')) return { page: '03', title: 'THE FEED' };
  if (pathname.startsWith('/contact')) return { page: '04', title: 'CONTACT' };
  if (pathname.startsWith('/checkout')) return { page: '02.5', title: 'THE COUNTER' };
  return { page: '01', title: 'THE COVER' };
};
