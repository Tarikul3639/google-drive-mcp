import { z } from 'zod';

// Validate the folder ID and destination parent folder ID.
export const moveFolderSchema = z.object({
    folderId: z.string().trim().min(1),
    parentId: z.string().trim().min(1),
});
