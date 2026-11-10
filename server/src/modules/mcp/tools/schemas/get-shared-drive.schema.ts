import { z } from 'zod';

// Validate shared drive ID.
export const getSharedDriveSchema = z.object({
  driveId: z.string().trim().min(1),
});
