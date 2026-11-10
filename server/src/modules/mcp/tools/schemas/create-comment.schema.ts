import { z } from 'zod';

// Validate comment content for a Drive file.
export const createCommentSchema = z.object({
  fileId: z.string().trim().min(1),
  content: z.string().trim().min(1),
  quotedFileContent: z
    .object({
      mimeType: z.string().trim().min(1),
      value: z.string(),
    })
    .optional(),
});
