import { z } from 'zod';

// Validate the file ID to restore from trash.
export const untrashFileSchema = z.object({
    fileId: z.string().trim().min(1),
});
