export interface AccessTokenPayload {
    sub: string;
    sid: string;
}

export interface RefreshTokenData {
    token: string;
    hash: string;
    expiresAt: Date;
}