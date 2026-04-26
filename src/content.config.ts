import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    swlRange: z.string().optional(),
    types: z.array(z.string()).optional(),
    certifications: z.array(z.string()).default([]),
    specs: z.array(z.object({
      model: z.string(),
      holdingCapacity: z.number().optional(),
      bollardPull: z.number().optional(),
      chainDiaRange: z.string().optional(),
      jawOpening: z.string().optional(),
      dimensions: z.string().optional(),
      weight: z.string().optional(),
      hydraulicPressure: z.string().optional(),
      power: z.number().optional(),
    })).default([]),
    relatedProducts: z.array(z.string()).default([]),
    downloads: z.array(z.object({
      label: z.string(),
      file: z.string().nullable(),
      gated: z.boolean().default(false),
    })).default([]),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).default([]),
    lastUpdated: z.coerce.date().optional(),
    sortOrder: z.number().default(0),
  }),
});

const applications = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/applications' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    vesselTypes: z.array(z.string()).default([]),
    recommendedProducts: z.array(z.string()).default([]),
    lastUpdated: z.coerce.date().optional(),
    sortOrder: z.number().default(0),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.string().default('technical-guide'),
    tags: z.array(z.string()).default([]),
    relatedProducts: z.array(z.string()).default([]),
    readingTime: z.number().optional(),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).default([]),
  }),
});

export const collections = { products, applications, blog };
