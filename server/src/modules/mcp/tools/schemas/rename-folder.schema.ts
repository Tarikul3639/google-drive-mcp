import { z } from 'zod';

// Validate the folder ID and its new name.
export const renameFolderSchema = z.object({
  folderId: z.string().trim().min(1),
  newName: z.string().trim().min(1).max(255),
});
