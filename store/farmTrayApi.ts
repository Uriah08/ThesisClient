import { FarmTray } from "@/utils/types";
import { baseApi } from "./baseApi";

export const farmTrayApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createFarmTray: builder.mutation({
            query: (data) => ({
                url: "tray/create/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Tray"],
        }),
        getFarmTrays: builder.query<FarmTray[], number>({
            query: (farmId) => ({
                url: `tray/get/${farmId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        }),
        getFarmTrayById: builder.query<FarmTray, number>({
            query: (trayId) => ({
                url: `tray/get/tray/${trayId}/`,
                method: "GET",
            }),
            providesTags: ["Tray"],
        }),
        maintenance: builder.mutation({
            query: (trayId) => ({
                url: `tray/maintenance/${trayId}/`,
                method: "PATCH",
            }),
            invalidatesTags: ["Tray"],
        }),
        renameFarmTray: builder.mutation({
            query: ({ name, trayId }) => ({
                url: `tray/rename/${trayId}/`,
                method: 'PATCH',
                body: { name },
            }),
            invalidatesTags: ["Tray"]
        }),
        deleteFarmTray: builder.mutation({
            query: (trayId) => ({
                url: `tray/delete/${trayId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Tray"],
        }),
    }),
    overrideExisting: true,
})

export const { 
    useCreateFarmTrayMutation,
    useGetFarmTraysQuery,
    useGetFarmTrayByIdQuery,
    useMaintenanceMutation,
    useDeleteFarmTrayMutation,
    useRenameFarmTrayMutation
} = farmTrayApi;