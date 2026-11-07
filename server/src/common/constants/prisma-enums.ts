export const GoogleDriveScope = {
    DRIVE: 'DRIVE',
    DRIVE_APPDATA: 'DRIVE_APPDATA',
    DRIVE_APPS_READONLY: 'DRIVE_APPS_READONLY',
    DRIVE_FILE: 'DRIVE_FILE',
    DRIVE_MEET_READONLY: 'DRIVE_MEET_READONLY',
    DRIVE_METADATA: 'DRIVE_METADATA',
    DRIVE_METADATA_READONLY: 'DRIVE_METADATA_READONLY',
    DRIVE_PHOTOS_READONLY: 'DRIVE_PHOTOS_READONLY',
    DRIVE_READONLY: 'DRIVE_READONLY',
    DRIVE_SCRIPTS: 'DRIVE_SCRIPTS',
} as const;

export type GoogleDriveScope =
    (typeof GoogleDriveScope)[keyof typeof GoogleDriveScope];

export const McpScope = {
    DRIVE_READ: 'DRIVE_READ',
    DRIVE_WRITE: 'DRIVE_WRITE',
} as const;

export type McpScope = (typeof McpScope)[keyof typeof McpScope];
