import { z } from 'zod';

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
export const getCommentSchema = z.object({
  fileId: z.string().trim().min(1),
  commentId: z.string().trim().min(1),
});
export const listCommentsSchema = z.object({
  fileId: z.string().trim().min(1),
  pageToken: z.string().trim().min(1).optional(),
  includeDeleted: z.boolean().optional(),
});
export const updateCommentSchema = z.object({
  fileId: z.string().trim().min(1),
  commentId: z.string().trim().min(1),
  content: z.string().trim().min(1).optional(),
  resolved: z.boolean().optional(),
});
export const deleteCommentSchema = z.object({
  fileId: z.string().trim().min(1),
  commentId: z.string().trim().min(1),
});
