import { z } from 'zod';

// Validate the file ID and optional pagination token.
export const listPermissionsSchema = z.object({
  fileId: z.string().trim().min(1),
  pageToken: z.string().trim().min(1).optional(),
});
