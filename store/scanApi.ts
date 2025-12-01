import { baseApi } from "./baseApi";

export const scanApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        scan: build.mutation({
            query: (data) => ({
                url: "scan/scan/",
                method: "POST",
                body: data,
            }),
        }),
    })
})

export const {
    useScanMutation
} = scanApi