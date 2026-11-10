import type { drive_v3 } from 'googleapis';

// Keeps Drive API field masks aligned with the generated Google API resource types.
export const driveFileFields = (
  ...fields: Array<keyof drive_v3.Schema$File>
): string => fields.join(', ');

export const driveFileListFields = (
  ...fields: Array<keyof drive_v3.Schema$FileList>
): string => fields.join(', ');

export const driveCommentFields = (
  ...fields: Array<keyof drive_v3.Schema$Comment>
): string => fields.join(', ');

export const driveCommentListFields = (
  ...fields: Array<keyof drive_v3.Schema$CommentList>
): string => fields.join(', ');

export const drivePermissionFields = (
  ...fields: Array<keyof drive_v3.Schema$Permission>
): string => fields.join(', ');

export const drivePermissionListFields = (
  ...fields: Array<keyof drive_v3.Schema$PermissionList>
): string => fields.join(', ');

export const driveRevisionFields = (
  ...fields: Array<keyof drive_v3.Schema$Revision>
): string => fields.join(', ');

export const driveRevisionListFields = (
  ...fields: Array<keyof drive_v3.Schema$RevisionList>
): string => fields.join(', ');

export const sharedDriveFields = (
  ...fields: Array<keyof drive_v3.Schema$Drive>
): string => fields.join(', ');

export const sharedDriveListFields = (
  ...fields: Array<keyof drive_v3.Schema$DriveList>
): string => fields.join(', ');
