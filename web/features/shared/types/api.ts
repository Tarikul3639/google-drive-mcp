export type UserProfile = {
  id: string
  email: string
  name: string | null
  picture: string | null
  createdAt: string
  updatedAt: string
}

export type UpdateUserInput = {
  name: string
}

export type GoogleDriveStatus = {
  connected?: boolean
  isConnected?: boolean
  status?: string
  connectionStatus?: string
  email?: string
  accountEmail?: string
  googleEmail?: string
  account?: { email?: string }
}

export type GoogleDriveConnection = {
  connected: boolean | null
  email: string | null
}

export type McpToolPermission = {
  toolName: string
  isEnabled: boolean
}

export type AuthorizedMcpClient = {
  clientId: string
  name: string
  grantedAt: string
  tools: McpToolPermission[]
}
