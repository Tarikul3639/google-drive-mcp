export const McpScope = {
    DRIVE_READ: 'DRIVE_READ',
    DRIVE_WRITE: 'DRIVE_WRITE',
} as const;

export type McpScope = (typeof McpScope)[keyof typeof McpScope];
