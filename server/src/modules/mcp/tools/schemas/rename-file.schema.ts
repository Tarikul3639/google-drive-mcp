import { z } from 'zod';

// Validate the file ID and its new name.
export const renameFileSchema = z.object({
    fileId: z.string().trim().min(1),
    newName: z.string().trim().min(1).max(255),
});
