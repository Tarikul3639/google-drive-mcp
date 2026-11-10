import { z } from 'zod';

export const createSharedDriveSchema = z.object({
  name: z.string().trim().min(1).max(255),
  requestId: z.string().trim().min(1).optional(),
});
export const getSharedDriveSchema = z.object({
  driveId: z.string().trim().min(1),
});
export const listSharedDrivesSchema = z.object({
  pageToken: z.string().trim().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});
export const updateSharedDriveSchema = z.object({
  driveId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255),
});
export const deleteSharedDriveSchema = z.object({
  driveId: z.string().trim().min(1),
});
