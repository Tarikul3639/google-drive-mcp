import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service.js';
import { GoogleClientService } from './google-client.service.js';

@Module({
  providers: [GoogleAuthService, GoogleClientService],
  exports: [GoogleAuthService, GoogleClientService],
})
export class GoogleModule {}
