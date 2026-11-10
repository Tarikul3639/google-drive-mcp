import { UnauthorizedException } from '@nestjs/common';
import type { McpContext } from '@nestjs/mcp';
import { McpToolAccessService } from './services/mcp-tool-access.service.js';
import type { McpToolName } from './constants/mcp-tools.constant.js';

export abstract class ToolAuthorizerBase {
  protected constructor(private readonly access: McpToolAccessService) {}

  protected async authorize(
    ctx: McpContext,
    toolName: McpToolName,
  ): Promise<string> {
    const userId = ctx.authInfo?.extra?.userId;
    const clientId = ctx.authInfo?.clientId;

    if (
      typeof userId !== 'string' ||
      !userId ||
      typeof clientId !== 'string' ||
      !clientId
    ) {
      throw new UnauthorizedException('Authentication required.');
    }

    await this.access.verifyToolAccess(userId, clientId, toolName);
    return userId;
  }
}
