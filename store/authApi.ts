import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: "users/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    register: build.mutation({
      query: (userData: {
        username: string;
        email: string;
        password: string;
        confirm_password: string;
      }) => ({
        url: "users/register/",
        method: "POST",
        body: userData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation } = authApi;