import axios, { type AxiosError } from "axios"

// Route API traffic through the frontend origin so auth cookies stay first-party.
export const apiClient = axios.create({
    baseURL: "/",
    withCredentials: true,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
})

let refreshRequest: Promise<void> | null = null

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const request = error.config
        const url = request?.url ?? ""
        const canRefresh =
            error.response?.status === 401 &&
            request &&
            !request._retry &&
            !url.includes("/api/auth/refresh") &&
            !url.includes("/api/auth/logout") &&
            !url.includes("/api/mcp/oauth/consent")

        if (!canRefresh) return Promise.reject(error)

        request._retry = true
        refreshRequest ??= axios
            .post("/api/auth/refresh", undefined, { withCredentials: true })
            .then(() => undefined)
            .finally(() => {
                refreshRequest = null
            })

        try {
            await refreshRequest
            return await apiClient(request)
        } catch (refreshError) {
            return Promise.reject(refreshError)
        }
    },
)

export const authApi = {
    getCurrentUser: () => apiClient.get<unknown>("/api/auth/me"),
    getProfile: () => apiClient.get<unknown>("/api/users/me"),
    updateProfile: (name: string) =>
        apiClient.patch<unknown>("/api/users/me", { name }),
    logout: () => apiClient.post<void>("/api/auth/logout"),
    loginUrl: "/api/auth/google",
}

export const googleDriveApi = {
    getStatus: () => apiClient.get<unknown>("/api/google-integration/status"),
    connectUrl: "/api/google-integration/connect",
    disconnect: () =>
        apiClient.delete<void>("/api/google-integration/disconnect"),
}

export const mcpAccessApi = {
    list: () => apiClient.get<unknown>("/api/mcp/oauth/authorized-clients"),
    revoke: (clientId: string) =>
        apiClient.delete<void>(
            `/api/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}`,
        ),
    deleteAccess: (clientId: string) =>
        apiClient.delete<void>(
            `/api/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}/access`,
        ),
    refreshTools: (clientId: string) =>
        apiClient.post<unknown>(
            `/api/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}/tools/refresh`,
        ),
    setToolAccess: (clientId: string, toolName: string, isEnabled: boolean) =>
        apiClient.patch<void>(
            `/api/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}/tools`,
            { toolName, isEnabled },
        ),
}

export const mcpConsentApi = {
    get: (transaction: string) =>
        apiClient.get<unknown>("/api/mcp/oauth/consent", {
            params: { transaction },
        }),
    submit: (transaction: string, decision: "allow" | "deny") =>
        apiClient.post<{ redirectUrl: string }>("/api/mcp/oauth/consent", {
            transaction,
            decision,
        }),
}
