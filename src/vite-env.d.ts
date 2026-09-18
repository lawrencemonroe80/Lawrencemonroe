/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Square Web Payments SDK — public app id (sandbox-sq0idb-… / sq0idp-…) */
  readonly VITE_SQUARE_APP_ID?: string;
  /** Square location id — public, paired with the app id */
  readonly VITE_SQUARE_LOCATION_ID?: string;
  /** 'sandbox' | 'production' */
  readonly VITE_SQUARE_ENVIRONMENT?: string;
  /** Sanity.io project id (public — Content Lake public dataset) */
  readonly VITE_SANITY_PROJECT_ID?: string;
  /** Sanity dataset, defaults to 'production' */
  readonly VITE_SANITY_DATASET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
