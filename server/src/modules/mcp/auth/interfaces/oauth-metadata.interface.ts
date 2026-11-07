export type OAuthGrantType = 'authorization_code' | 'refresh_token';
export type OAuthResponseType = 'code';
export type OAuthTokenEndpointAuthMethod = 'none';
export type OAuthCodeChallengeMethod = 'S256';
export type OAuthScope = 'drive:read' | 'drive:write';

export interface OAuthAuthorizationServerMetadata {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    registration_endpoint: string;

    response_types_supported: readonly OAuthResponseType[];
    grant_types_supported: readonly OAuthGrantType[];
    token_endpoint_auth_methods_supported: readonly OAuthTokenEndpointAuthMethod[];
    code_challenge_methods_supported: readonly OAuthCodeChallengeMethod[];
    scopes_supported: readonly OAuthScope[];
}

export interface OpenIdConfiguration {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    registration_endpoint: string;

    response_types_supported: readonly OAuthResponseType[];
    subject_types_supported: readonly 'public'[];
    id_token_signing_alg_values_supported: readonly 'RS256'[];
    scopes_supported: readonly ('openid' | OAuthScope)[];
    token_endpoint_auth_methods_supported: readonly OAuthTokenEndpointAuthMethod[];
    code_challenge_methods_supported: readonly OAuthCodeChallengeMethod[];
}
