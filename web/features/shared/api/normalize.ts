import type {
  GoogleDriveConnection,
  GoogleDriveStatus,
  UserProfile,
} from "../types/api"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function readUserProfile(value: unknown): UserProfile | null {
  if (!isRecord(value)) return null

  const candidate = isRecord(value.user) ? value.user : value
  if (typeof candidate.id !== "string" || typeof candidate.email !== "string") {
    return null
  }

  return {
    id: candidate.id,
    email: candidate.email,
    name: typeof candidate.name === "string" ? candidate.name : null,
    picture: typeof candidate.picture === "string" ? candidate.picture : null,
    createdAt:
      typeof candidate.createdAt === "string" ? candidate.createdAt : "",
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : "",
  }
}

export function readDriveConnection(value: unknown): GoogleDriveConnection {
  const response = isRecord(value) && isRecord(value.data) ? value.data : value
  if (!isRecord(response)) return { connected: null, email: null }

  const status = response as GoogleDriveStatus
  let connected: boolean | null = null
  if (typeof status.connected === "boolean") connected = status.connected
  else if (typeof status.isConnected === "boolean")
    connected = status.isConnected
  else if (typeof status.status === "string") {
    connected = status.status.toLowerCase() === "connected"
  } else if (typeof status.connectionStatus === "string") {
    connected = status.connectionStatus.toLowerCase() === "connected"
  }

  const email =
    status.email ??
    status.googleEmail ??
    status.accountEmail ??
    status.account?.email ??
    null

  return {
    connected,
    email: typeof email === "string" ? email : null,
  }
}
