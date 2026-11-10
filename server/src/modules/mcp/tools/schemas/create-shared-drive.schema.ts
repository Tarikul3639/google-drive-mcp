import { z } from 'zod';

// Validate shared drive creation details.
export const createSharedDriveSchema = z.object({
  name: z.string().trim().min(1).max(255),
  requestId: z.string().trim().min(1).optional(),
});
