import { Tray, TrayProgress, TrayResponse } from "@/utils/types";
import { baseApi } from "./baseApi";

export const trayApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createTray: builder.mutation({
            query: (data) => ({
                url: "trays/create/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Tray", "Session"],
        }),
        getSessionTray: builder.query<Tray[], number>({
            query: (sessionId) => ({
                url: `trays/get/${sessionId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        }),
        getTrayById: builder.query<TrayResponse, number | undefined>({
            query: (trayId) => ({
                url: `trays/get/tray/${trayId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        }),
        createTrayProgress: builder.mutation({
            query: (data) => ({
                url: "trays/progress/create/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Tray"],
        }),
        getTrayProgress: builder.query<TrayProgress[], number | undefined>({
            query: (trayId) => ({
                url: `trays/progress/get/${trayId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        }),
        harvestTray: builder.mutation({
            query: (trayId) => ({
                url: `trays/harvest/${trayId}/`,
                method: 'POST'
            }),
            invalidatesTags: ["Tray"]
        }),
        renameTray: builder.mutation({
            query: ({ name, trayId }) => ({
                url: `trays/rename/${trayId}/`,
                method: 'PATCH',
                body: { name },
            }),
            invalidatesTags: ["Tray"]
        }),
        deleteTray: builder.mutation({
            query: (trayId) => ({
                url: `trays/delete/${trayId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Tray"],
        }),
        getFarmTrayHistory: builder.query<Tray[], number>({
            query: (trayId) => ({
                url: `trays/get/history/${trayId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        }),
    }),
    overrideExisting: true,
})

export const { 
    useCreateTrayMutation,
    useGetSessionTrayQuery,
    useGetTrayByIdQuery,
    useCreateTrayProgressMutation,
    useGetTrayProgressQuery,
    useLazyGetTrayProgressQuery,
    useHarvestTrayMutation,
    useDeleteTrayMutation,
    useGetFarmTrayHistoryQuery
} = trayApi;