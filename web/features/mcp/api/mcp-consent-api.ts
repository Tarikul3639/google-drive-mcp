import { baseApi } from "@/features/shared/api/base-api"

type ConsentDecision = "allow" | "deny"

export const mcpConsentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConsent: builder.query<unknown, string>({
      query: (transaction) => ({
        url: "/mcp/oauth/consent",
        params: { transaction },
      }),
      providesTags: ["McpConsent"],
    }),
    submitConsent: builder.mutation<
      { redirectUrl: string },
      { transaction: string; decision: ConsentDecision }
    >({
      query: (body) => ({
        url: "/mcp/oauth/consent",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const {
  useGetConsentQuery,
  useLazyGetConsentQuery,
  useSubmitConsentMutation,
} = mcpConsentApi
