import { z } from 'zod';

// Validate file and comment IDs.
export const getCommentSchema = z.object({
  fileId: z.string().trim().min(1),
  commentId: z.string().trim().min(1),
});
