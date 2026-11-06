export const RedisKeys = {
    userById: (userId: string) => `user:${userId}`,
    userByEmail: (email: string) => `user:email:${email}`,
    googleAccountByUserId: (userId: string) => `google-account:${userId}`,
    oauthState: (state: string) => `oauth:state:${state}`,
    authSessionByToken: (tokenHash: string) => `auth:session:token:${tokenHash}`,
    authSessionById: (sessionId: string) => `auth:session:id:${sessionId}`,
} as const;
