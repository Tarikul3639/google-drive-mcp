import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"

import { logout } from "../store/slices/auth.slice"

const AUTH_EXEMPT_ENDPOINTS = [
  "/auth/refresh",
  "/auth/logout",
  "/mcp/oauth/consent",
]

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json")
    return headers
  },
})

let refreshPromise: Promise<boolean> | null = null

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  const url = typeof args === "string" ? args : args.url
  const isAuthExempt = AUTH_EXEMPT_ENDPOINTS.some((path) =>
    url.startsWith(path)
  )

  if (result.error?.status !== 401 || isAuthExempt) return result

  if (!refreshPromise) {
    refreshPromise = Promise.resolve(
      rawBaseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions)
    )
      .then((refreshResult) => Boolean(refreshResult.data))
      .finally(() => {
        refreshPromise = null
      })
  }

  const refreshed = await refreshPromise

  if (refreshed) {
    result = await rawBaseQuery(args, api, extraOptions)
  } else {
    api.dispatch(logout())
  }

  return result
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Drive", "McpClient", "McpConsent"],
  endpoints: () => ({}),
})
