import { baseApi } from "./baseApi";

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSession: build.mutation({
      query: (sessionData) => ({
        url: "sessions/create/",
        method: "POST",
        body: sessionData,
      }),
      invalidatesTags: ["Session"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateSessionMutation } = sessionApi;