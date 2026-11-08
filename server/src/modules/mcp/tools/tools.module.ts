import { Module } from '@nestjs/common';
import { GoogleDriveModule } from '../../google-drive/google-drive.module.js';
import { McpToolAccessService } from './services/mcp-tool-access.service.js';
import { HealthCheckTool } from './drive/health-check.tool.js';
import { ListFilesTool } from './drive/list-files.tool.js';

@Module({
    imports: [
        GoogleDriveModule,
    ],
    providers: [
        McpToolAccessService,
        HealthCheckTool,
        ListFilesTool,
    ],
})
export class ToolsModule { }