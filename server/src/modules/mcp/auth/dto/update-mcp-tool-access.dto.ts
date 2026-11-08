import { IsBoolean, IsIn } from 'class-validator';

import { MCP_TOOL_NAMES } from '../../tools/constants/mcp-tools.constant.js';
import type { McpToolName } from '../../tools/constants/mcp-tools.constant.js';

export class UpdateMcpToolAccessDto {
    @IsIn(MCP_TOOL_NAMES)
    toolName!: McpToolName;

    @IsBoolean()
    isEnabled!: boolean;
}
