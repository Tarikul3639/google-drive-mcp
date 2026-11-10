import { z } from 'zod';

// Validate the new folder name and optional parent folder ID.
export const createFolderSchema = z.object({
  name: z.string().trim().min(1).max(255),
  parentId: z.string().trim().min(1).optional(),
});
