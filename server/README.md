# Backend API and MCP guide

This guide supplements the root [README](../README.md) with backend implementation details.

## Service boundaries

- **Auth module:** Google sign-in, application sessions, refresh, logout, and current-user lookup.
- **Google integration module:** Connects a user's Google Drive identity and manages encrypted Google token material.
- **Google Drive module:** Contains the Drive API client and operations used by MCP tools.
- **MCP auth module:** Dynamic Client Registration, authorization, consent, token endpoints, OAuth metadata, and client access management.
- **MCP tools module:** Registers tool providers and checks per-client tool permissions.
- **Health module:** Liveness, database, Redis, and memory health indicators.
- **Users module:** User profile endpoints and response DTOs.

## OAuth metadata

The OAuth metadata controller exposes authorization-server metadata at the well-known paths implemented in `OAuthMetadataController`. The issuer and MCP resource are supplied by backend configuration.

The supported authorization-code security features visible in the metadata include:
- Authorization Code grant.
- Refresh Token grant.
- Public token endpoint authentication method (`none`).
- PKCE challenge method `S256`.

Always inspect the live metadata document for the exact deployed URLs and supported fields.

## Authorization sequence

1. Client sends a Dynamic Client Registration request.
2. Client starts authorization with its redirect URI, state, and PKCE challenge.
3. Drivebridge validates the request and redirects the user to Google.
4. Google callback creates a pending consent transaction.
5. The user approves or denies the request.
6. The client exchanges the returned code at the token endpoint.
7. The MCP resource verifies the bearer token.
8. Tool execution checks the active grant and the requested tool's enabled flag.

## Tool permission behavior

The registry constant at `src/modules/mcp/tools/constants/mcp-tools.constant.ts` is the source of truth for supported tool names. The access service:
- Requires an active user/client grant.
- Checks one permission per tool name.
- Caches grant and tool permission lookups in Redis for 30 seconds.
- Invalidates relevant cache entries when access settings change.

A missing permission record is treated as disabled until the registry sync creates the record.

## Tool inventory

There are 36 tool names in the checked-in registry:

- Files: `list_files`, `search_files`, `get_file`, `create_file`, `update_file`, `move_file`, `rename_file`, `trash_file`, `untrash_file`, `copy_file`, `delete_file`, `download_file`, `export_file`.
- Folders: `list_folders`, `create_folder`, `rename_folder`, `move_folder`, `trash_folder`, `untrash_folder`.
- Permissions: `create_permission`, `get_permission`, `list_permissions`, `update_permission`, `delete_permission`.
- Comments: `create_comment`, `get_comment`, `list_comments`, `update_comment`, `delete_comment`.
- Revisions: `list_revisions`, `get_revision`.
- Shared drives: `create_shared_drive`, `list_shared_drives`, `get_shared_drive`, `update_shared_drive`, `delete_shared_drive`.

## HTTP endpoints

The backend global prefix is `/api`. The root README documents commonly used routes. Use Swagger at `/api/docs` for the authoritative request/response schema of each REST endpoint.

## Database operations

Prisma 8 is configured in this repository. Read:
- [Prisma notes](../server/prisma-8.md)
- [Database workflow](../server/PRISMA_DATABASE_WORKFLOW.md)

Do not run destructive or production database commands without reviewing the migration plan and confirming the target environment.
