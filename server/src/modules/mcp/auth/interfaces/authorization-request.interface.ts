export interface AuthorizationRequest {
  client_id: string;
  redirect_uri: string;
  response_type: 'code';
  resource?: string;
  state?: string;
  code_challenge: string;
  code_challenge_method: 'S256';
}
