import { z } from 'zod';

// Validate the source file ID and optional copy details.
export const copyFileSchema = z.object({
  fileId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255).optional(),
  parentId: z.string().trim().min(1).optional(),
});
