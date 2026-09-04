import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/docs/data/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int(),
    sources: z.array(z.string().url()).nonempty(),
    tableOfContents: z.object({
      minHeadingLevel: z.number().min(1).max(6).optional(),
      maxHeadingLevel: z.number().min(1).max(6).optional(),
    }).optional(),
  }),
});
export const collections = { docs };
