import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getStatus() {
    return {
      authenticated: false,
      provider: 'google',
      configured: Boolean(process.env.GOOGLE_CLIENT_ID),
    };
  }
}
