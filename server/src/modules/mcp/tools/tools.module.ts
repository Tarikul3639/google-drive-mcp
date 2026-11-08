import { Module } from '@nestjs/common';
import { GoogleDriveModule } from '../../google-drive/google-drive.module.js';
import { McpToolAccessService } from './services/mcp-tool-access.service.js';
import { HealthCheckTool } from './drive/health-check.tool.js';
import { ListFilesTool } from './drive/list-files.tool.js';
import { SearchFilesTool } from './drive/search-files.tool.js';
import { GetFileTool } from './drive/get-file.tool.js';
import { CreateFileTool } from './drive/create-file.tool.js';
import { UpdateFileTool } from './drive/update-file.tool.js';
import { MoveFileTool } from './drive/move-file.tool.js';
import { RenameFileTool } from './drive/rename-file.tool.js';
import { TrashFileTool } from './drive/trash-file.tool.js';
import { UntrashFileTool } from './drive/untrash-file.tool.js';
import { CopyFileTool } from './drive/copy-file.tool.js';
import { DeleteFileTool } from './drive/delete-file.tool.js';
import { DownloadFileTool } from './drive/download-file.tool.js';
import { ExportFileTool } from './drive/export-file.tool.js';
import { ListFoldersTool } from './drive/list-folders.tool.js';
import { CreateFolderTool } from './drive/create-folder.tool.js';
import { RenameFolderTool } from './drive/rename-folder.tool.js';
import { MoveFolderTool } from './drive/move-folder.tool.js';
import { DeleteFolderTool } from './drive/delete-folder.tool.js';

@Module({
    imports: [
        GoogleDriveModule,
    ],
    providers: [
        McpToolAccessService,
        HealthCheckTool,
        ListFilesTool,
        SearchFilesTool,
        GetFileTool,
        CreateFileTool,
        UpdateFileTool,
        MoveFileTool,
        RenameFileTool,
        TrashFileTool,
        UntrashFileTool,
        CopyFileTool,
        DeleteFileTool,
        DownloadFileTool,
        ExportFileTool,
        ListFoldersTool,
        CreateFolderTool,
        RenameFolderTool,
        MoveFolderTool,
        DeleteFolderTool,
    ],
})
export class ToolsModule { }