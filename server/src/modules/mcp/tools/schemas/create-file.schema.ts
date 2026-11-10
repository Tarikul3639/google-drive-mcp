import { z } from 'zod';

// Validate metadata and optional text content for a new Drive file.
export const createFileSchema = z.object({
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  parentId: z.string().trim().min(1).optional(),
});
