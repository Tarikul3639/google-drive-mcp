import { z } from 'zod';

// Base64 is used because MCP tool inputs are JSON. The decoded file is capped at 10 MB.
export const uploadFileSchema = z.object({
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(255),
  dataBase64: z
    .string()
    .min(4)
    .max(14 * 1024 * 1024)
    .regex(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      'dataBase64 must be valid standard Base64.',
    ),
  parentId: z.string().trim().min(1).optional(),
});
