import { baseApi } from "@/features/shared/api/base-api"

import type { UserProfile } from "@/features/shared/types/api"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<unknown, void>({
      query: () => "/auth/me",
      providesTags: ["Auth", "User"],
    }),
    getProfile: builder.query<unknown, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<UserProfile, { name: string }>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi
