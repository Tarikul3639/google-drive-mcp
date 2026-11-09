import { baseApi } from "@/features/shared/api/base-api"

import type {
  AuthorizedMcpClient,
  McpToolPermission,
} from "@/features/shared/types/api"

export const mcpAccessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthorizedClients: builder.query<AuthorizedMcpClient[], void>({
      query: () => "/mcp/oauth/authorized-clients",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ clientId }) => ({
                type: "McpClient" as const,
                id: clientId,
              })),
              { type: "McpClient" as const, id: "LIST" },
            ]
          : [{ type: "McpClient" as const, id: "LIST" }],
    }),
    revokeClient: builder.mutation<void, string>({
      query: (clientId) => ({
        url: `/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, clientId) => [
        { type: "McpClient", id: clientId },
        { type: "McpClient", id: "LIST" },
      ],
    }),
    restoreClient: builder.mutation<void, string>({
      query: (clientId) => ({
        url: `/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, clientId) => [
        { type: "McpClient", id: clientId },
        { type: "McpClient", id: "LIST" },
      ],
    }),
    deleteClientAccess: builder.mutation<void, string>({
      query: (clientId) => ({
        url: `/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}/access`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "McpClient", id: "LIST" }],
    }),
    refreshClientTools: builder.mutation<McpToolPermission[], string>({
      query: (clientId) => ({
        url: `/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}/tools/refresh`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, clientId) => [
        { type: "McpClient", id: clientId },
      ],
    }),
    setClientToolAccess: builder.mutation<
      void,
      { clientId: string; toolName: string; isEnabled: boolean }
    >({
      query: ({ clientId, toolName, isEnabled }) => ({
        url: `/mcp/oauth/authorized-clients/${encodeURIComponent(clientId)}/tools`,
        method: "PATCH",
        body: { toolName, isEnabled },
      }),
      invalidatesTags: (_result, _error, { clientId }) => [
        { type: "McpClient", id: clientId },
      ],
    }),
  }),
})

export const {
  useGetAuthorizedClientsQuery,
  useRevokeClientMutation,
  useRestoreClientMutation,
  useDeleteClientAccessMutation,
  useRefreshClientToolsMutation,
  useSetClientToolAccessMutation,
} = mcpAccessApi
