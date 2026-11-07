import { McpScope } from './prisma-enums.js';
import type { McpScope as McpScopeType } from './prisma-enums.js';

export const MCP_SCOPE_MAP: Record<McpScopeType, string> = {
  [McpScope.DRIVE_READ]: 'drive:read',
  [McpScope.DRIVE_WRITE]: 'drive:write',
};

export type { McpScopeType as McpScope };

const OAUTH_SCOPE_MAP = {
  'drive:read': McpScope.DRIVE_READ,
  'drive:write': McpScope.DRIVE_WRITE,
} as const satisfies Record<(typeof MCP_SCOPE_MAP)[McpScopeType], McpScopeType>;

export function toMcpScopes(scope: string): McpScopeType[] {
  return scope
    .split(/\s+/)
    .filter(Boolean)
    .map((value) => {
      if (!(value in OAUTH_SCOPE_MAP)) {
        throw new Error(`Unsupported MCP scope: ${value}`);
      }

      return OAUTH_SCOPE_MAP[value as keyof typeof OAUTH_SCOPE_MAP];
    });
}

export function toOAuthScope(scopes: readonly McpScopeType[]): string {
  return scopes.map((scope) => MCP_SCOPE_MAP[scope]).join(' ');
}
