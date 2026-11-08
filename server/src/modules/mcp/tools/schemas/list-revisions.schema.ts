import { z } from 'zod';

// Validate file ID and optional revision pagination.
export const listRevisionsSchema = z.object({
    fileId: z.string().trim().min(1),
    pageToken: z.string().trim().min(1).optional(),
});