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
    }),
    overrideExisting: true,
})

export const { 
    useCreateFarmTrayMutation,
    useGetFarmTraysQuery
} = farmTrayApi;