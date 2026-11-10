import { Module } from '@nestjs/common';
import { GoogleDriveModule } from '../../google-drive/google-drive.module.js';
import { McpToolAccessService } from './services/mcp-tool-access.service.js';
import { McpToolRegistryService } from './services/mcp-tool-registry.service.js';
import { HealthCheckTool } from './tools/health-check.tool.js';
import { CreateDocumentTool } from './tools/google-workspace/create-document.tool.js';
import { GetDocumentTool } from './tools/google-workspace/get-document.tool.js';
import { InsertDocumentTextTool } from './tools/google-workspace/insert-document-text.tool.js';
import { CreateSpreadsheetTool } from './tools/google-workspace/create-spreadsheet.tool.js';
import { GetSpreadsheetTool } from './tools/google-workspace/get-spreadsheet.tool.js';
import { GetSpreadsheetValuesTool } from './tools/google-workspace/get-spreadsheet-values.tool.js';
import { UpdateSpreadsheetValuesTool } from './tools/google-workspace/update-spreadsheet-values.tool.js';
import { BatchUpdateSpreadsheetTool } from './tools/google-workspace/batch-update-spreadsheet.tool.js';
import { CreatePresentationTool } from './tools/google-workspace/create-presentation.tool.js';
import { GetPresentationTool } from './tools/google-workspace/get-presentation.tool.js';
import { BatchUpdatePresentationTool } from './tools/google-workspace/batch-update-presentation.tool.js';
import { ReadDocxTool } from './tools/office-document-processing/read-docx.tool.js';
import { CreateDocxTool } from './tools/office-document-processing/create-docx.tool.js';
import { ReadXlsxTool } from './tools/office-document-processing/read-xlsx.tool.js';
import { CreateXlsxTool } from './tools/office-document-processing/create-xlsx.tool.js';
import { CreatePptxTool } from './tools/office-document-processing/create-pptx.tool.js';
import { CopyFileTool } from './tools/files/copy-file.tool.js';
import { CreateFileTool } from './tools/files/create-file.tool.js';
import { DeleteFileTool } from './tools/files/delete-file.tool.js';
import { DownloadFileTool } from './tools/files/download-file.tool.js';
import { ExportFileTool } from './tools/files/export-file.tool.js';
import { GetFileTool } from './tools/files/get-file.tool.js';
import { ListFilesTool } from './tools/files/list-files.tool.js';
import { MoveFileTool } from './tools/files/move-file.tool.js';
import { RenameFileTool } from './tools/files/rename-file.tool.js';
import { SearchFilesTool } from './tools/files/search-files.tool.js';
import { TrashFileTool } from './tools/files/trash-file.tool.js';
import { UntrashFileTool } from './tools/files/untrash-file.tool.js';
import { UpdateFileTool } from './tools/files/update-file.tool.js';
import { UploadFileTool } from './tools/files/upload-file.tool.js';
import { CreateFolderTool } from './tools/folders/create-folder.tool.js';
import { ListFoldersTool } from './tools/folders/list-folders.tool.js';
import { MoveFolderTool } from './tools/folders/move-folder.tool.js';
import { RenameFolderTool } from './tools/folders/rename-folder.tool.js';
import { TrashFolderTool } from './tools/folders/trash-folder.tool.js';
import { UntrashFolderTool } from './tools/folders/untrash-folder.tool.js';
import { CreatePermissionTool } from './tools/permissions/create-permission.tool.js';
import { DeletePermissionTool } from './tools/permissions/delete-permission.tool.js';
import { GetPermissionTool } from './tools/permissions/get-permission.tool.js';
import { ListPermissionsTool } from './tools/permissions/list-permissions.tool.js';
import { UpdatePermissionTool } from './tools/permissions/update-permission.tool.js';
import { CreateCommentTool } from './tools/comments/create-comment.tool.js';
import { DeleteCommentTool } from './tools/comments/delete-comment.tool.js';
import { GetCommentTool } from './tools/comments/get-comment.tool.js';
import { ListCommentsTool } from './tools/comments/list-comments.tool.js';
import { UpdateCommentTool } from './tools/comments/update-comment.tool.js';
import { GetRevisionTool } from './tools/revisions/get-revision.tool.js';
import { ListRevisionsTool } from './tools/revisions/list-revisions.tool.js';
import { CreateSharedDriveTool } from './tools/shared-drives/create-shared-drive.tool.js';
import { DeleteSharedDriveTool } from './tools/shared-drives/delete-shared-drive.tool.js';
import { GetSharedDriveTool } from './tools/shared-drives/get-shared-drive.tool.js';
import { ListSharedDrivesTool } from './tools/shared-drives/list-shared-drives.tool.js';
import { UpdateSharedDriveTool } from './tools/shared-drives/update-shared-drive.tool.js';

@Module({
  imports: [GoogleDriveModule],
  providers: [
    McpToolAccessService,
    McpToolRegistryService,
    HealthCheckTool,
    CreateDocumentTool,
    GetDocumentTool,
    InsertDocumentTextTool,
    CreateSpreadsheetTool,
    GetSpreadsheetTool,
    GetSpreadsheetValuesTool,
    UpdateSpreadsheetValuesTool,
    BatchUpdateSpreadsheetTool,
    CreatePresentationTool,
    GetPresentationTool,
    BatchUpdatePresentationTool,
    ReadDocxTool,
    CreateDocxTool,
    ReadXlsxTool,
    CreateXlsxTool,
    CreatePptxTool,
    CopyFileTool,
    CreateFileTool,
    DeleteFileTool,
    DownloadFileTool,
    ExportFileTool,
    GetFileTool,
    ListFilesTool,
    MoveFileTool,
    RenameFileTool,
    SearchFilesTool,
    TrashFileTool,
    UntrashFileTool,
    UpdateFileTool,
    UploadFileTool,
    CreateFolderTool,
    ListFoldersTool,
    MoveFolderTool,
    RenameFolderTool,
    TrashFolderTool,
    UntrashFolderTool,
    CreatePermissionTool,
    DeletePermissionTool,
    GetPermissionTool,
    ListPermissionsTool,
    UpdatePermissionTool,
    CreateCommentTool,
    DeleteCommentTool,
    GetCommentTool,
    ListCommentsTool,
    UpdateCommentTool,
    GetRevisionTool,
    ListRevisionsTool,
    CreateSharedDriveTool,
    DeleteSharedDriveTool,
    GetSharedDriveTool,
    ListSharedDrivesTool,
    UpdateSharedDriveTool,
  ],
  exports: [McpToolAccessService, McpToolRegistryService],
})
export class ToolsModule {}
