export interface CreateSessionInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface RotateRefreshTokenInput {
  oldTokenHash: string;
  newTokenHash: string;
  expiresAt: Date;
}
