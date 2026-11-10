import { z } from 'zod';

// Validate the file and permission IDs for permission removal.
export const deletePermissionSchema = z.object({
  fileId: z.string().trim().min(1),
  permissionId: z.string().trim().min(1),
});
