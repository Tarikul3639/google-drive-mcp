import { z } from 'zod';

// Validate file ID and optional comment pagination.
export const listCommentsSchema = z.object({
    fileId: z.string().trim().min(1),
    pageToken: z.string().trim().min(1).optional(),
    includeDeleted: z.boolean().optional(),
});