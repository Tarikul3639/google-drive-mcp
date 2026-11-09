import { baseApi } from "@/features/shared/api/base-api"

export const googleDriveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDriveStatus: builder.query<unknown, void>({
      query: () => "/google-integration/status",
      providesTags: ["Drive"],
    }),
    disconnectDrive: builder.mutation<void, void>({
      query: () => ({
        url: "/google-integration/disconnect",
        method: "DELETE",
      }),
      invalidatesTags: ["Drive"],
    }),
  }),
})

export const {
  useGetDriveStatusQuery,
  useLazyGetDriveStatusQuery,
  useDisconnectDriveMutation,
} = googleDriveApi

export const driveConnectUrl = "/api/google-integration/connect"
