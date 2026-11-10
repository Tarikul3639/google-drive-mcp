import { z } from 'zod';

// Validate the file ID for permanent deletion.
export const deleteFileSchema = z.object({
  fileId: z.string().trim().min(1),
});
