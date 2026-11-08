import { z } from 'zod';

// Validate the folder ID for permanent deletion.
export const deleteFolderSchema = z.object({
    folderId: z.string().trim().min(1),
});
