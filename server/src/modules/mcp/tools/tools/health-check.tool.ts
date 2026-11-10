import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';

@Injectable()
export class HealthCheckTool {
  @Tool({
    name: 'health_check',
    description: 'Check the health of the MCP server.',
    annotations: {
      readOnlyHint: true,
    },
  })
  async check() {
    return {
      status: 'ok',
      message: 'MCP server is healthy.',
    };
  }
}
