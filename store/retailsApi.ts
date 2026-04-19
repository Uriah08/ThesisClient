import { Retail } from "@/utils/types";
import { baseApi } from "./baseApi";

export const retailsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createRetail: build.mutation({
            query: (data) => ({
                url: "retails/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Production"],
        }),
        getRetails: build.query<Retail[], number>({
            query: (farmId) => ({
                url: `retails/list/${farmId}/`,
                method: "GET",
            }),
            providesTags: ["Production"],
        }),
        getRetail: build.query<Retail, number>({
            query: (retailId) => ({
                url:`retails/retrieve/${retailId}/`,
                method: "GET",
            }),
            providesTags: ["Production"],
        }),
        updateRetail: build.mutation({
            query: ({ shop_id, ...data }) => ({
                url: `retails/update/${shop_id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Production"],
        }),
        deleteRetail: build.mutation({
            query: (retailId) => ({
                url: `retails/delete/${retailId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Production"],
        }),
    }),
    overrideExisting: true,
})

export const { 
    useCreateRetailMutation,
    useGetRetailsQuery,
    useGetRetailQuery,
    useUpdateRetailMutation,
    useDeleteRetailMutation,
} = retailsApi