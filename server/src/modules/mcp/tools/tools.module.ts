import { Module } from '@nestjs/common';
import { GoogleDriveModule } from '../../google-drive/google-drive.module.js';
import { McpToolAccessService } from './services/mcp-tool-access.service.js';
import { McpToolRegistryService } from './services/mcp-tool-registry.service.js';
import { HealthCheckTool } from './health-check.tool.js';
import { CreateDocumentTool } from './google-workspace/create-document.tool.js';
import { GetDocumentTool } from './google-workspace/get-document.tool.js';
import { InsertDocumentTextTool } from './google-workspace/insert-document-text.tool.js';
import { CreateSpreadsheetTool } from './google-workspace/create-spreadsheet.tool.js';
import { GetSpreadsheetTool } from './google-workspace/get-spreadsheet.tool.js';
import { GetSpreadsheetValuesTool } from './google-workspace/get-spreadsheet-values.tool.js';
import { UpdateSpreadsheetValuesTool } from './google-workspace/update-spreadsheet-values.tool.js';
import { BatchUpdateSpreadsheetTool } from './google-workspace/batch-update-spreadsheet.tool.js';
import { CreatePresentationTool } from './google-workspace/create-presentation.tool.js';
import { GetPresentationTool } from './google-workspace/get-presentation.tool.js';
import { BatchUpdatePresentationTool } from './google-workspace/batch-update-presentation.tool.js';
import { ReadDocxTool } from './office-document-processing/read-docx.tool.js';
import { CreateDocxTool } from './office-document-processing/create-docx.tool.js';
import { ReadXlsxTool } from './office-document-processing/read-xlsx.tool.js';
import { CreateXlsxTool } from './office-document-processing/create-xlsx.tool.js';
import { CreatePptxTool } from './office-document-processing/create-pptx.tool.js';
import { CopyFileTool } from './files/copy-file.tool.js';
import { CreateFileTool } from './files/create-file.tool.js';
import { DeleteFileTool } from './files/delete-file.tool.js';
import { DownloadFileTool } from './files/download-file.tool.js';
import { ExportFileTool } from './files/export-file.tool.js';
import { GetFileTool } from './files/get-file.tool.js';
import { ListFilesTool } from './files/list-files.tool.js';
import { MoveFileTool } from './files/move-file.tool.js';
import { RenameFileTool } from './files/rename-file.tool.js';
import { SearchFilesTool } from './files/search-files.tool.js';
import { TrashFileTool } from './files/trash-file.tool.js';
import { UntrashFileTool } from './files/untrash-file.tool.js';
import { UpdateFileTool } from './files/update-file.tool.js';
import { UploadFileTool } from './files/upload-file.tool.js';
import { CreateFolderTool } from './folders/create-folder.tool.js';
import { ListFoldersTool } from './folders/list-folders.tool.js';
import { MoveFolderTool } from './folders/move-folder.tool.js';
import { RenameFolderTool } from './folders/rename-folder.tool.js';
import { TrashFolderTool } from './folders/trash-folder.tool.js';
import { UntrashFolderTool } from './folders/untrash-folder.tool.js';
import { CreatePermissionTool } from './permissions/create-permission.tool.js';
import { DeletePermissionTool } from './permissions/delete-permission.tool.js';
import { GetPermissionTool } from './permissions/get-permission.tool.js';
import { ListPermissionsTool } from './permissions/list-permissions.tool.js';
import { UpdatePermissionTool } from './permissions/update-permission.tool.js';
import { CreateCommentTool } from './comments/create-comment.tool.js';
import { DeleteCommentTool } from './comments/delete-comment.tool.js';
import { GetCommentTool } from './comments/get-comment.tool.js';
import { ListCommentsTool } from './comments/list-comments.tool.js';
import { UpdateCommentTool } from './comments/update-comment.tool.js';
import { GetRevisionTool } from './revisions/get-revision.tool.js';
import { ListRevisionsTool } from './revisions/list-revisions.tool.js';
import { CreateSharedDriveTool } from './shared-drives/create-shared-drive.tool.js';
import { DeleteSharedDriveTool } from './shared-drives/delete-shared-drive.tool.js';
import { GetSharedDriveTool } from './shared-drives/get-shared-drive.tool.js';
import { ListSharedDrivesTool } from './shared-drives/list-shared-drives.tool.js';
import { UpdateSharedDriveTool } from './shared-drives/update-shared-drive.tool.js';

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
