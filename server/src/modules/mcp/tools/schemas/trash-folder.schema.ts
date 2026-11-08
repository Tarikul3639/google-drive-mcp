import { z } from 'zod';

// Validate the folder ID for moving the folder to or restoring it from trash.
export const trashFolderSchema = z.object({
    folderId: z.string().trim().min(1),
});
