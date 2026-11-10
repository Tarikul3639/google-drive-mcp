import { z } from 'zod';

// Validate the folder ID for moving the folder to or restoring it from trash.
export const untrashFolderSchema = z.object({
  folderId: z.string().trim().min(1),
});
