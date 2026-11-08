import { z } from 'zod';

// Validate permission details for a Drive file or folder.
export const createPermissionSchema = z.object({
    fileId: z.string().trim().min(1),
    type: z.enum(['user', 'group', 'domain', 'anyone']),
    role: z.enum(['owner', 'organizer', 'fileOrganizer', 'writer', 'commenter', 'reader']),
    emailAddress: z.string().email().optional(),
    domain: z.string().trim().min(1).optional(),
    sendNotificationEmail: z.boolean().optional(),
    emailMessage: z.string().optional(),
    expirationTime: z.string().datetime().optional(),
    allowFileDiscovery: z.boolean().optional(),
});