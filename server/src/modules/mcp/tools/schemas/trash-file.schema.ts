import { z } from 'zod';

// Validate the file ID to move to trash.
export const trashFileSchema = z.object({
    fileId: z.string().trim().min(1),
});
