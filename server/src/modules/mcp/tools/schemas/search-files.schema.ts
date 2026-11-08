import { z } from 'zod';

// Validate Google Drive file search input.
export const searchFilesSchema = z.object({
    query: z.string().trim().min(1).max(200),
    pageToken: z.string().optional(),
});