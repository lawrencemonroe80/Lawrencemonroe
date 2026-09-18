/**
 * SANITY STUDIO SCHEMAS — Lawrence Monroe editorial vault
 * --------------------------------------------------------
 * Reference schema definitions for the Sanity Studio that powers /vault.
 *
 * Setup (one-time, on the owner's machine or hosted):
 *   1. npx create-sanity@latest --env ... or add to this repo as a
 *      `studio/` workspace (npm i sanity @sanity/cli)
 *   2. Copy these definitions into studio/schemas/
 *   3. Point VITE_SANITY_PROJECT_ID / VITE_SANITY_DATASET at the project
 *
 * Publishing a `lookbookStory` fires the Sanity webhook →
 * POST /api/revalidate (see api/revalidate.ts) → fresh content on the
 * next page load (SPA equivalent of Next.js On-Demand ISR).
 */

import { defineType, defineField } from 'sanity';

export const lookbookStory = defineType({
  name: 'lookbookStory',
  title: 'Lookbook Story',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(96),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Campaign', value: 'CAMPAIGN' },
          { title: 'Gen Effects', value: 'GEN EFFECTS' },
          { title: 'Silver-Gelatin', value: 'SILVER-GELATIN' },
        ],
        layout: 'radio',
      },
      initialValue: 'CAMPAIGN',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'caption', title: 'Caption', type: 'string' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Plates',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [{ name: 'caption', title: 'Plate Label', type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'linkedSquareItemIds',
      title: 'Linked Square Items (SHOP THE STORY)',
      description:
        'Square Item IDs from the Square Dashboard (Items → item → .../item/ITEM_ID). Each id renders a purchase chip on the story.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Dossier',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
});

/**
 * Curated community posts for THE TELEMETRY fallback rail (rendered
 * alongside the live Instagram feed). Official posts come from the
 * Instagram Graph API; this type is for community frames the studio
 * wants pinned into the feed.
 */
export const curatedTelemetryPost = defineType({
  name: 'curatedTelemetryPost',
  title: 'Curated Telemetry Post',
  type: 'document',
  fields: [
    defineField({ name: 'handle', title: 'Community Handle', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'image', title: 'Frame', type: 'image', options: { hotspot: true }, validation: (R) => R.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'text', rows: 3 }),
    defineField({ name: 'postedAt', title: 'Posted At', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({
      name: 'linkedSquareItemIds',
      title: 'SHOP THE LOOK — Square Item IDs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: { select: { title: 'handle', media: 'image' } },
});

/** Site-wide editorial settings singleton. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'vaultIntro', title: 'Vault Intro Line', type: 'string' }),
    defineField({ name: 'telemetryIntro', title: 'Telemetry Intro Line', type: 'string' }),
  ],
});

export const schemaTypes = [lookbookStory, curatedTelemetryPost, siteSettings];
