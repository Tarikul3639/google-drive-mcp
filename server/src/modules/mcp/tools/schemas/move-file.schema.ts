import { z } from 'zod';

// Validate the file and destination folder IDs for a move operation.
export const moveFileSchema = z.object({
  fileId: z.string().trim().min(1),
  parentId: z.string().trim().min(1),
});
