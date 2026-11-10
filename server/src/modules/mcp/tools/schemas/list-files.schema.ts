import { z } from 'zod';

export const listFilesSchema = z.object({
  pageToken: z
    .string()
    .min(1, {
      error: 'Need valid next page token',
    })
    .optional(),
});
