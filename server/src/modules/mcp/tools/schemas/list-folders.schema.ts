import { z } from 'zod';

// Validate optional pagination token for folder listing.
export const listFoldersSchema = z.object({
    pageToken: z.string().trim().min(1).optional(),
});
