import { z } from 'zod';

export const createPermissionSchema = z.object({
  fileId: z.string().trim().min(1),
  type: z.enum(['user', 'group', 'domain', 'anyone']),
  role: z.enum([
    'owner',
    'organizer',
    'fileOrganizer',
    'writer',
    'commenter',
    'reader',
  ]),
  emailAddress: z.string().email().optional(),
  domain: z.string().trim().min(1).optional(),
  sendNotificationEmail: z.boolean().optional(),
  emailMessage: z.string().optional(),
  expirationTime: z.string().datetime().optional(),
  allowFileDiscovery: z.boolean().optional(),
});
export const getPermissionSchema = z.object({
  fileId: z.string().trim().min(1),
  permissionId: z.string().trim().min(1),
});
export const listPermissionsSchema = z.object({
  fileId: z.string().trim().min(1),
  pageToken: z.string().trim().min(1).optional(),
});
export const updatePermissionSchema = z.object({
  fileId: z.string().trim().min(1),
  permissionId: z.string().trim().min(1),
  role: z.enum(['organizer', 'fileOrganizer', 'writer', 'commenter', 'reader']),
  expirationTime: z.string().datetime().optional(),
});
export const deletePermissionSchema = z.object({
  fileId: z.string().trim().min(1),
  permissionId: z.string().trim().min(1),
});
