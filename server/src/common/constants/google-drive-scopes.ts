export const GOOGLE_DRIVE_SCOPES = {
    DRIVE: 'https://www.googleapis.com/auth/drive',
    DRIVE_APPDATA: 'https://www.googleapis.com/auth/drive.appdata',
    DRIVE_APPS_READONLY: 'https://www.googleapis.com/auth/drive.apps.readonly',
    DRIVE_FILE: 'https://www.googleapis.com/auth/drive.file',
    DRIVE_MEET_READONLY: 'https://www.googleapis.com/auth/drive.meet.readonly',
    DRIVE_METADATA: 'https://www.googleapis.com/auth/drive.metadata',
    DRIVE_METADATA_READONLY: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    DRIVE_PHOTOS_READONLY: 'https://www.googleapis.com/auth/drive.photos.readonly',
    DRIVE_READONLY: 'https://www.googleapis.com/auth/drive.readonly',
    DRIVE_SCRIPTS: 'https://www.googleapis.com/auth/drive.scripts',
} as const;

export type GoogleDriveScope = keyof typeof GOOGLE_DRIVE_SCOPES;
