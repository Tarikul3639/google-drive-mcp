import { z } from 'zod';

// Validate file and revision IDs.
export const getRevisionSchema = z.object({
    fileId: z.string().trim().min(1),
    revisionId: z.string().trim().min(1),
});