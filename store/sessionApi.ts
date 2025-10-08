import { FarmSession } from "@/utils/types";
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
    getFarmSessions: build.query<FarmSession[], number>({
      query: (farmId) => ({
        url: `sessions/get/${farmId}/`,
        method: 'GET'
      }),
      providesTags: ["Session"],
    })
  }),
  overrideExisting: true,
});

export const { 
  useCreateSessionMutation,
  useGetFarmSessionsQuery
} = sessionApi;