import { z } from 'zod';

// Validate optional shared drive pagination.
export const listSharedDrivesSchema = z.object({
    pageToken: z.string().trim().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
});