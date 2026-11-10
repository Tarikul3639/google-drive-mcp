import { z } from 'zod';

// Validate Google Drive file ID.
export const getFileSchema = z.object({
  fileId: z.string().trim().min(1),
});
