import { FarmProduction } from "@/utils/types";
import { baseApi } from "./baseApi";

export const productionApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createProduction: build.mutation({
            query: (data) => ({
                url: "production/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Production"],
        }),
        getProductions: build.query<FarmProduction[], number>({
            query: (farmId) => ({
                url: `production/list/${farmId}/`,
                method: "GET",
            }),
            providesTags: ["Production"],
        }),
        getProduction: build.query<FarmProduction, number>({
            query: (productionId) => ({
                url:`production/retrieve/${productionId}/`,
                method: "GET",
            }),
            providesTags: ["Production"],
        }),
        updateProduction: build.mutation({
            query: ({ productionId, ...data }) => ({
                url: `production/update/${productionId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Production"],
        }),
        deleteProduction: build.mutation({
            query: (productionId) => ({
                url: `production/delete/${productionId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Production"],
        }),
    }),
    overrideExisting: true,
})

export const { 
    useCreateProductionMutation,
    useGetProductionsQuery,
    useGetProductionQuery,
    useUpdateProductionMutation,
    useDeleteProductionMutation,
} = productionApi