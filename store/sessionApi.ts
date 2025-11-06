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
    }),
    getSessionById: build.query<FarmSession, number>({
      query: (id) => ({
        url: `sessions/get/id/${id}/`,
        method: 'GET'
      }),
      providesTags: ["Session"],
    }),
    activateSession: build.mutation({
      query: (id) => ({
        url: `sessions/status/${id}/`,
        method: "POST",
      }),
      invalidatesTags: ["Session","Tray"],
    }),
    renameSession: build.mutation({
      query: ({ name, sessionId }) => ({
          url: `sessions/rename/${sessionId}/`,
          method: 'PATCH',
          body: { name },
      }),
      invalidatesTags: ["Session"]
    }),
    deleteSession: build.mutation({
      query: (sessionId) => ({
        url: `sessions/delete/${sessionId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Session"],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useCreateSessionMutation,
  useGetFarmSessionsQuery,
  useGetSessionByIdQuery,
  useActivateSessionMutation,
  useRenameSessionMutation,
  useDeleteSessionMutation
} = sessionApi;