export const RedisKeys = {
    userById: (userId: string) => `user:${userId}`,
    userByEmail: (email: string) => `user:email:${email}`,
    googleAccountByUserId: (userId: string) => `google-account:${userId}`,

    oauthConsent: (transaction: string) => `oauth:consent:${transaction}`,
    oauthState: (state: string) => `oauth:state:${state}`,
    oauthAuthorizationCode: (codeHash: string) => `mcp:oauth:code:${codeHash}`,

    authSessionByToken: (tokenHash: string) => `auth:session:token:${tokenHash}`,
    authSessionById: (sessionId: string) => `auth:session:id:${sessionId}`,
} as const;
