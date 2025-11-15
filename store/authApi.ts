import { apiUrl } from "@/constants/Colors";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${apiUrl}:8000/api/`,
  }),
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
});

export const { useLoginMutation, useRegisterMutation } = authApi;
