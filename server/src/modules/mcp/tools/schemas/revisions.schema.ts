import { z } from 'zod';

export const listRevisionsSchema = z.object({
  fileId: z.string().trim().min(1),
  pageToken: z.string().trim().min(1).optional(),
});
export const getRevisionSchema = z.object({
  fileId: z.string().trim().min(1),
  revisionId: z.string().trim().min(1),
});
