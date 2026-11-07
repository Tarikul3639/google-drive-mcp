export interface OAuthClient {
    client_id: string;
    client_name: string;
    redirect_uris: readonly string[];
    grant_types: readonly string[];
    response_types: readonly string[];
    token_endpoint_auth_method: string;
    scope: string;
}