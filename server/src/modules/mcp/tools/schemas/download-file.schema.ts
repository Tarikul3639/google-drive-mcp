import { z } from 'zod';

// Validate the file ID to download.
export const downloadFileSchema = z.object({
  fileId: z.string().trim().min(1),
});
