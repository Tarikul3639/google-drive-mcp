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
import { TrashFolderTool } from './drive/trash-folder.tool.js';
import { UntrashFolderTool } from './drive/untrash-folder.tool.js';
import { CreatePermissionTool } from './drive/create-permission.tool.js';
import { GetPermissionTool } from './drive/get-permission.tool.js';
import { ListPermissionsTool } from './drive/list-permissions.tool.js';
import { UpdatePermissionTool } from './drive/update-permission.tool.js';
import { DeletePermissionTool } from './drive/delete-permission.tool.js';
import { CreateCommentTool } from './drive/create-comment.tool.js';
import { GetCommentTool } from './drive/get-comment.tool.js';
import { ListCommentsTool } from './drive/list-comments.tool.js';
import { UpdateCommentTool } from './drive/update-comment.tool.js';
import { DeleteCommentTool } from './drive/delete-comment.tool.js';
import { ListRevisionsTool } from './drive/list-revisions.tool.js';
import { GetRevisionTool } from './drive/get-revision.tool.js';
import { CreateSharedDriveTool } from './drive/create-shared-drive.tool.js';
import { ListSharedDrivesTool } from './drive/list-shared-drives.tool.js';
import { GetSharedDriveTool } from './drive/get-shared-drive.tool.js';
import { UpdateSharedDriveTool } from './drive/update-shared-drive.tool.js';
import { DeleteSharedDriveTool } from './drive/delete-shared-drive.tool.js';

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
        TrashFolderTool,
        UntrashFolderTool,
        CreatePermissionTool,
        GetPermissionTool,
        ListPermissionsTool,
        UpdatePermissionTool,
        DeletePermissionTool,
        CreateCommentTool,
        GetCommentTool,
        ListCommentsTool,
        UpdateCommentTool,
        DeleteCommentTool,
        ListRevisionsTool,
        GetRevisionTool,
        CreateSharedDriveTool,
        ListSharedDrivesTool,
        GetSharedDriveTool,
        UpdateSharedDriveTool,
        DeleteSharedDriveTool,
    ],
})
export class ToolsModule { }