/**
 * sanity.config.ts — reference configuration for a hosted Sanity Studio
 * (e.g. sanity.lawrencemonroe.com). Kept outside the app build; copy into
 * a `studio/` workspace when installing Studio:
 *
 *   npm create sanity@latest -- --template clean --dataset production
 *   # then move schemas.ts into studio/schemas/ and wire it in below
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'lawrence-monroe',
  title: 'LAWRENCE MONROE — Editorial Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!, // sanity.io project id
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Editorial')
          .items([
            S.documentTypeListItem('lookbookStory').title('Lookbook Stories'),
            S.documentTypeListItem('curatedTelemetryPost').title('Curated Telemetry'),
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
