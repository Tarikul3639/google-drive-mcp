// Keep all registered MCP tool names in one place.
export const MCP_TOOLS = {
  // Files
  LIST_FILES: 'list_files',
  SEARCH_FILES: 'search_files',
  GET_FILE: 'get_file',
  CREATE_FILE: 'create_file',
  UPLOAD_FILE: 'upload_file',
  UPDATE_FILE: 'update_file',
  MOVE_FILE: 'move_file',
  RENAME_FILE: 'rename_file',
  TRASH_FILE: 'trash_file',
  UNTRASH_FILE: 'untrash_file',
  COPY_FILE: 'copy_file',
  DELETE_FILE: 'delete_file',
  DOWNLOAD_FILE: 'download_file',
  EXPORT_FILE: 'export_file',

  // Folders
  LIST_FOLDERS: 'list_folders',
  CREATE_FOLDER: 'create_folder',
  RENAME_FOLDER: 'rename_folder',
  MOVE_FOLDER: 'move_folder',
  TRASH_FOLDER: 'trash_folder',
  UNTRASH_FOLDER: 'untrash_folder',

  // Permissions
  CREATE_PERMISSION: 'create_permission',
  GET_PERMISSION: 'get_permission',
  LIST_PERMISSIONS: 'list_permissions',
  UPDATE_PERMISSION: 'update_permission',
  DELETE_PERMISSION: 'delete_permission',

  // Comments
  CREATE_COMMENT: 'create_comment',
  GET_COMMENT: 'get_comment',
  LIST_COMMENTS: 'list_comments',
  UPDATE_COMMENT: 'update_comment',
  DELETE_COMMENT: 'delete_comment',

  // Revisions
  LIST_REVISIONS: 'list_revisions',
  GET_REVISION: 'get_revision',

  // Shared Drives
  CREATE_SHARED_DRIVE: 'create_shared_drive',
  LIST_SHARED_DRIVES: 'list_shared_drives',
  GET_SHARED_DRIVE: 'get_shared_drive',
  UPDATE_SHARED_DRIVE: 'update_shared_drive',
  DELETE_SHARED_DRIVE: 'delete_shared_drive',
} as const;

// Derive the tool name type from the registry.
export type McpToolName = (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS];

// Get all registered tool names for permission synchronization.
export const MCP_TOOL_NAMES = Object.values(MCP_TOOLS);
