import { z } from 'zod';

export const readDocxSchema = z.object({ dataBase64: z.string().min(4) });
export const createDocxSchema = z.object({ paragraphs: z.array(z.string()) });
export const readXlsxSchema = z.object({ dataBase64: z.string().min(4) });
export const createXlsxSchema = z.object({
  sheets: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(31),
        rows: z.array(
          z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
        ),
      }),
    )
    .min(1),
});
export const createPptxSchema = z.object({
  title: z.string().trim().min(1),
  slides: z
    .array(
      z.object({ title: z.string().optional(), body: z.string().optional() }),
    )
    .min(1),
});
