import { z } from 'zod';

// Validate editable comment fields.
export const updateCommentSchema = z.object({
    fileId: z.string().trim().min(1),
    commentId: z.string().trim().min(1),
    content: z.string().trim().min(1).optional(),
    resolved: z.boolean().optional(),
});