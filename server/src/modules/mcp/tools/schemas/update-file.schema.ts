import { z } from 'zod';

// Validate metadata changes and optional replacement text content.
export const updateFileSchema = z
  .object({
    fileId: z.string().trim().min(1),
    name: z.string().trim().min(1).max(255).optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    // MIME type is used only when uploading replacement content.
    mimeType: z.string().trim().min(1).optional(),
  })
  .refine(
    ({ name, description, content }) =>
      name !== undefined || description !== undefined || content !== undefined,
    { message: 'Provide at least one field to update.' },
  )
  .refine(
    ({ mimeType, content }) => mimeType === undefined || content !== undefined,
    { message: 'mimeType can only be provided when content is updated.' },
  );
