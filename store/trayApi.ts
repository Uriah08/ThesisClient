import { Tray, TrayProgress } from "@/utils/types";
import { baseApi } from "./baseApi";

export const trayApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createTray: builder.mutation({
            query: (data) => ({
                url: "trays/create/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Tray"],
        }),
        getSessionTray: builder.query<Tray[], number>({
            query: (sessionId) => ({
                url: `trays/get/${sessionId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        }),
        getTrayById: builder.query<Tray, number>({
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
        getTrayProgress: builder.query<TrayProgress[], number>({
            query: (trayId) => ({
                url: `trays/progress/get/${trayId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        })
    }),
    overrideExisting: true,
})

export const { 
    useCreateTrayMutation,
    useGetSessionTrayQuery,
    useGetTrayByIdQuery,
    useCreateTrayProgressMutation,
    useGetTrayProgressQuery
} = trayApi;