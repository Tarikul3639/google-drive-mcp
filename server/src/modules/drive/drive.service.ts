import { Injectable } from '@nestjs/common';
@Injectable()
export class DriveService {
  getStatus() {
    return { provider: 'google-drive', apiVersion: 'v3', implemented: false };
  }
}
