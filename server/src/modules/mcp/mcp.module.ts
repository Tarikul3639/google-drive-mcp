import { Module } from '@nestjs/common';
import { McpService } from './mcp.service.js';
import { McpTransport } from './mcp.transport.js';
@Module({ providers: [McpService, McpTransport], exports: [McpService] })
export class McpModule {}
