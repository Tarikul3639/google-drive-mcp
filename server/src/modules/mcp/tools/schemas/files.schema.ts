import { z } from 'zod';

export const copyFileSchema = z.object({
  fileId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255).optional(),
  parentId: z.string().trim().min(1).optional(),
});
export const createFileSchema = z.object({
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  parentId: z.string().trim().min(1).optional(),
});
export const deleteFileSchema = z.object({ fileId: z.string().trim().min(1) });
export const downloadFileSchema = z.object({
  fileId: z.string().trim().min(1),
});
export const exportFileSchema = z.object({
  fileId: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
});
export const getFileSchema = z.object({ fileId: z.string().trim().min(1) });
export const listFilesSchema = z.object({
  pageToken: z
    .string()
    .min(1, { error: 'Need valid next page token' })
    .optional(),
});
export const moveFileSchema = z.object({
  fileId: z.string().trim().min(1),
  parentId: z.string().trim().min(1),
});
export const renameFileSchema = z.object({
  fileId: z.string().trim().min(1),
  newName: z.string().trim().min(1).max(255),
});
export const searchFilesSchema = z.object({
  query: z.string().trim().min(1).max(200),
  pageToken: z.string().optional(),
});
export const trashFileSchema = z.object({ fileId: z.string().trim().min(1) });
export const untrashFileSchema = z.object({ fileId: z.string().trim().min(1) });
export const updateFileSchema = z
  .object({
    fileId: z.string().trim().min(1),
    name: z.string().trim().min(1).max(255).optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    mimeType: z.string().trim().min(1).optional(),
  })
  .refine(
    ({ name, description, content }) =>
      name !== undefined || description !== undefined || content !== undefined,
    { message: 'Provide at least one field to update.' },
  )
  .refine(
    ({ mimeType, content }) => mimeType === undefined || content !== undefined,
    { message: 'mimeType can only be provided when content is updated.' },
  );
export const uploadFileSchema = z.object({
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(255),
  dataBase64: z
    .string()
    .min(4)
    .max(100 * 1024 * 1024)
    .regex(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      'dataBase64 must be valid standard Base64.',
    ),
  parentId: z.string().trim().min(1).optional(),
});
