import { z } from 'zod';

// Validate the file and permission IDs.
export const getPermissionSchema = z.object({
  fileId: z.string().trim().min(1),
  permissionId: z.string().trim().min(1),
});
