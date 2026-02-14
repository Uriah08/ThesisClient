import { baseApi } from "./baseApi";

export const testApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTest: build.query<string, void>({
      query: () => ({
        url: "test/",
        method: "GET",
      }),
    }),

    postTest: build.mutation({
      query: (data) => ({
        url: "test/",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
})

export const { useGetTestQuery, usePostTestMutation } = testApi;
