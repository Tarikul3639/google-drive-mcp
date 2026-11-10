import { Module } from '@nestjs/common';
import { GoogleDriveModule } from '../../google-drive/google-drive.module.js';
import { McpToolAccessService } from './services/mcp-tool-access.service.js';
import { McpToolRegistryService } from './services/mcp-tool-registry.service.js';
import { HealthCheckTool } from './tools/health-check.tool.js';
import { ListFilesTool } from './tools/list-files.tool.js';
import { SearchFilesTool } from './tools/search-files.tool.js';
import { GetFileTool } from './tools/get-file.tool.js';
import { CreateFileTool } from './tools/create-file.tool.js';
import { UploadFileTool } from './tools/upload-file.tool.js';
import { UpdateFileTool } from './tools/update-file.tool.js';
import { MoveFileTool } from './tools/move-file.tool.js';
import { RenameFileTool } from './tools/rename-file.tool.js';
import { TrashFileTool } from './tools/trash-file.tool.js';
import { UntrashFileTool } from './tools/untrash-file.tool.js';
import { CopyFileTool } from './tools/copy-file.tool.js';
import { DeleteFileTool } from './tools/delete-file.tool.js';
import { DownloadFileTool } from './tools/download-file.tool.js';
import { ExportFileTool } from './tools/export-file.tool.js';
import { ListFoldersTool } from './tools/list-folders.tool.js';
import { CreateFolderTool } from './tools/create-folder.tool.js';
import { RenameFolderTool } from './tools/rename-folder.tool.js';
import { MoveFolderTool } from './tools/move-folder.tool.js';
import { TrashFolderTool } from './tools/trash-folder.tool.js';
import { UntrashFolderTool } from './tools/untrash-folder.tool.js';
import { CreatePermissionTool } from './tools/create-permission.tool.js';
import { GetPermissionTool } from './tools/get-permission.tool.js';
import { ListPermissionsTool } from './tools/list-permissions.tool.js';
import { UpdatePermissionTool } from './tools/update-permission.tool.js';
import { DeletePermissionTool } from './tools/delete-permission.tool.js';
import { CreateCommentTool } from './tools/create-comment.tool.js';
import { GetCommentTool } from './tools/get-comment.tool.js';
import { ListCommentsTool } from './tools/list-comments.tool.js';
import { UpdateCommentTool } from './tools/update-comment.tool.js';
import { DeleteCommentTool } from './tools/delete-comment.tool.js';
import { ListRevisionsTool } from './tools/list-revisions.tool.js';
import { GetRevisionTool } from './tools/get-revision.tool.js';
import { CreateSharedDriveTool } from './tools/create-shared-drive.tool.js';
import { ListSharedDrivesTool } from './tools/list-shared-drives.tool.js';
import { GetSharedDriveTool } from './tools/get-shared-drive.tool.js';
import { UpdateSharedDriveTool } from './tools/update-shared-drive.tool.js';
import { DeleteSharedDriveTool } from './tools/delete-shared-drive.tool.js';

@Module({
  imports: [GoogleDriveModule],
  providers: [
    McpToolAccessService,
    McpToolRegistryService,
    // Drive Tools
    HealthCheckTool,
    ListFilesTool,
    SearchFilesTool,
    GetFileTool,
    CreateFileTool,
    UploadFileTool,
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
  exports: [McpToolAccessService, McpToolRegistryService],
})
export class ToolsModule {}
