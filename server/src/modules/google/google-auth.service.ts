import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthService {
  getAuthorizationConfiguration() {
    return {
      clientIdConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
      redirectUriConfigured: Boolean(process.env.GOOGLE_REDIRECT_URI),
    };
  }
}
