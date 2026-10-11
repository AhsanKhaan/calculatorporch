/**
 * Programmatic SEO families (docs/10 §5). An instance page is built from its family + slug and must carry unique
 * computed content: answer, steps, a neighbouring-values table and 2–3 FAQs. The schema below fails the build for
 * thin or malformed instances. Instances publish only when their registry row is `launch` + `green` and the parent
 * calculator is published (the demand gate).
 */
import { z } from 'zod';
import { FaqSchema } from '@/content/schema';
import { wordCount } from '@/lib/format';

export const InstanceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(3),
  title: z.string().min(15).max(60),
  description: z.string().min(70).max(155),
  h1: z.string().min(3).max(70),
  directAnswer: z.string().refine((s) => wordCount(s) >= 40 && wordCount(s) <= 60, 'directAnswer must be 40–60 words'),
  answer: z.object({ label: z.string(), value: z.string() }),
  /** True when the answer depends on today's date: the page shows the build-date answer and the island updates it. */
  dateDependent: z.boolean().default(false),
  steps: z.array(z.string()).min(1),
  table: z.object({ caption: z.string(), columns: z.array(z.string()).min(2), rows: z.array(z.array(z.union([z.string(), z.number()]))).min(3) }),
  faqs: z.array(FaqSchema).min(2).max(3),
  island: z.object({ id: z.string(), initial: z.record(z.string(), z.string()) }),
});
export type InstancePage = z.infer<typeof InstanceSchema>;

export interface Family {
  id: string;
  /** Build an instance page for a slug, or null if this family doesn't define that slug. */
  build: (slug: string, ctx: { today: string }) => z.input<typeof InstanceSchema> | null;
}
