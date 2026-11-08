import { z } from 'zod';

// Validate the Google Workspace file ID and requested export format.
export const exportFileSchema = z.object({
    fileId: z.string().trim().min(1),
    mimeType: z.string().trim().min(1),
});
