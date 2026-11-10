import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z.string().trim().min(1).max(255),
  parentId: z.string().trim().min(1).optional(),
});
export const listFoldersSchema = z.object({
  pageToken: z.string().trim().min(1).optional(),
});
export const moveFolderSchema = z.object({
  folderId: z.string().trim().min(1),
  parentId: z.string().trim().min(1),
});
export const renameFolderSchema = z.object({
  folderId: z.string().trim().min(1),
  newName: z.string().trim().min(1).max(255),
});
export const trashFolderSchema = z.object({
  folderId: z.string().trim().min(1),
});
export const untrashFolderSchema = z.object({
  folderId: z.string().trim().min(1),
});
