import { z } from 'zod';

// Validate permission updates.
export const updatePermissionSchema = z.object({
  fileId: z.string().trim().min(1),
  permissionId: z.string().trim().min(1),
  role: z.enum(['organizer', 'fileOrganizer', 'writer', 'commenter', 'reader']),
  expirationTime: z.string().datetime().optional(),
});
