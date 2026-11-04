import { Injectable, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class GoogleClientService {
  assertConfigured(): void {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new ServiceUnavailableException(
        'Google OAuth credentials are not configured.',
      );
    }
  }
}
