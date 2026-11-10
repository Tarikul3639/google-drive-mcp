import { z } from 'zod';

// Validate shared drive ID for deletion.
export const deleteSharedDriveSchema = z.object({
  driveId: z.string().trim().min(1),
});
