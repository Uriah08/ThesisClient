import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    completeProfile: build.mutation({
      query: (profileData) => ({
        url: "users/complete-profile/",
        method: "PUT",
        body: profileData,
      }),
    }),
    logout: build.mutation({
      query: (data) => ({
        url: "users/logout/",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: build.mutation({
      query: (passwordData) => ({
        url: "users/change-password/",
        method: "PUT",
        body: passwordData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCompleteProfileMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = userApi;