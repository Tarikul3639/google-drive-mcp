export interface McpAccessTokenPayload {
  sub: string;
  client_id: string;
  aud?: string | string[];
  exp?: number;
}
