export interface GoogleDriveAuthResult {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    scope?: string;
}