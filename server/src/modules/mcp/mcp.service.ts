import { Injectable } from '@nestjs/common';
@Injectable()
export class McpService {
  getServerInfo() {
    return { name: 'google-drive-mcp', version: '0.1.0' };
  }
}
