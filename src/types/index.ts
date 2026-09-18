export type Size = 'S' | 'M' | 'L' | 'XL';

export type ProductColor = {
  name: string;
  code: string;
  hex: string;
  borderHex?: string;
};

export interface ProductGalleryItem {
  id: string;
  url: string;
  label: 'Front' | 'Back' | 'Detail' | 'On Body' | 'Fabric';
  alt: string;
  type?: 'cutout' | 'lifestyle' | 'detail' | 'macro';
}

export interface Product {
  id: string;
  slug: string;
  code: string;
  name: string;
  release: string;
  price: number;
  currency: string;
  status: 'ACTIVE' | 'LOW STOCK' | 'SOLD OUT' | 'UNRELEASED';
  stockCount: number;
  colors: ProductColor[];
  selectedColorDefault: string;
  sizes: {
    size: Size;
    available: boolean;
    stock: number;
  }[];
  shortDescription: string;
  story: string;
  fit: string[];
  construction: string[];
  fabricAndCare: string[];
  shippingAndReturns: string[];
  images: ProductGalleryItem[];
  heroImage: string;
  cutoutImage: string;
  badge?: string;
}

export interface CartItem {
  cartItemId: string; // composite key: id-color-size
  productId: string;
  slug: string;
  name: string;
  code: string;
  color: string;
  size: Size;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

export interface ContactFrame {
  id: string;
  frameNumber: string;
  label: string;
  title: string;
  category: string;
  image: string;
  ratio: string;
  caption: string;
  metadata: {
    lens?: string;
    exposure?: string;
    treatment?: string;
    release?: string;
  };
  isUnreleased?: boolean;
}

export interface ArchiveItem {
  id: string;
  code: string;
  name: string;
  category: 'SHIRT' | 'HEADWEAR' | 'OUTERWEAR';
  releaseTarget: string;
  status: 'UNRELEASED' | 'ARCHIVE NEXT' | 'IN DEVELOPMENT';
  image: string;
  description: string;
  details: string[];
}

export interface OrderCustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  suite?: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
  shippingOption: 'standard' | 'express';
}

export interface OrderResult {
  orderId: string;
  paymentId: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  totalAmount: number;
  currency: string;
  items: CartItem[];
  customer: OrderCustomerInfo;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* E-COMMERCE ARCHITECTURE TYPES (Square / CMS / Raw Feeds)           */
/* ------------------------------------------------------------------ */

/** Where the catalog feed came from. */
export type CatalogSource = 'square' | 'local';

export interface CatalogVariation {
  variationId: string;
  name: string;
  priceCents: number;
  available: boolean;
  stock: number;
}

/** Normalized Square catalog item (mirrors netlify/functions/lib/square.ts). */
export interface CatalogItem {
  squareItemId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  available: boolean;
  maxStock: number;
  minPriceCents: number;
  variations: CatalogVariation[];
}

export interface CatalogFeed {
  source: CatalogSource;
  generatedAt: string;
  items: CatalogItem[];
}

/** "SHOP THE LOOK" tag — links a social post to a purchasable Square item. */
export interface ShopTheLookTag {
  squareItemId: string;
  name: string;
  priceCents?: number;
  /** Storefront route slug (local product page) if one exists. */
  slug?: string;
}

export type FeedAspect = 'tall' | 'wide' | 'square';

export interface RawFeedPost {
  id: string;
  handle: string;
  isOfficial: boolean;
  image: string;
  alt: string;
  caption: string;
  postedAt: string; // ISO
  likes?: number;
  permalink?: string;
  aspect: FeedAspect;
  tags: ShopTheLookTag[];
}

export type VaultCategory = 'CAMPAIGN' | 'GEN EFFECTS' | 'SILVER-GELATIN';

export interface VaultGalleryItem {
  src: string;
  label: string;
}

export interface VaultStory {
  id: string;
  slug: string;
  title: string;
  category: VaultCategory;
  summary: string;
  coverImage: string;
  gallery: VaultGalleryItem[];
  publishedAt: string; // ISO
  credits: string[];
  linkedSquareItemIds: string[];
  featured?: boolean;
}
