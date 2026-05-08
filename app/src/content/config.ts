import { defineCollection, z } from 'astro:content';

const signatories = defineCollection({
  type: 'data',
  schema: z.object({
    github: z.string().regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/, {
      message: 'github must be a valid GitHub handle (alphanumeric + hyphen, max 39 chars)',
    }),
    name: z.string().min(1).max(120),
    linkedin: z.string().url().optional(),
    affiliation: z.string().max(120).optional(),
    // YAML loaders auto-parse `YYYY-MM-DD` as a Date — accept both, normalize
    // back to ISO `YYYY-MM-DD` so consumers always see a string.
    signed_on: z
      .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()])
      .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v)),
    statement: z.string().max(280).optional(),
  }),
});

export const collections = { signatories };
