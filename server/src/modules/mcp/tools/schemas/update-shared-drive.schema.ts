import { z } from 'zod';

// Validate shared drive metadata updates.
export const updateSharedDriveSchema = z.object({
  driveId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255),
});
