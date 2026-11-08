import { z } from 'zod';

// Validate file and comment IDs for comment deletion.
export const deleteCommentSchema = z.object({
    fileId: z.string().trim().min(1),
    commentId: z.string().trim().min(1),
});