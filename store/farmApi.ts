import { baseApi } from "./baseApi";
import { Farm } from "@/utils/types";

export const farmApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createFarm: build.mutation({
      query: (farmData) => ({
        url: "farms/create/",
        method: "POST",
        body: farmData,
      }),
      invalidatesTags: ["Farm"],
    }),
    joinFarm: build.mutation({
      query: (farmData) => ({
        url: "farms/join/",
        method: "POST",
        body: farmData,
      }),
      invalidatesTags: ["Farm"],
    }),
    getFarms: build.query<Farm[], void>({
      query: () => ({
        url: "farms/mine/",
        method: "GET",
      }),
      providesTags: ["Farm"],
    }),
    getFarm: build.query<Farm, number>({
      query: (id) => ({
        url: `farms/farm/${id}/`,
        method: "GET",
      }),
      providesTags: ["Farm"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateFarmMutation,
  useJoinFarmMutation,
  useGetFarmsQuery,
  useGetFarmQuery,
} = farmApi;