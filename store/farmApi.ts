import { baseApi } from "./baseApi";
import { Announcement, Farm, FarmDashboard, Members } from "@/utils/types";

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
    getMembers: build.query<Members[], number>({
      query: (id) => ({
        url: `farms/members/${id}/`,
        method: "GET",
      }),
      providesTags: ["Farm"],
    }),
    editFarm: build.mutation({
      query: (farmData) => ({
        url: "farms/edit/",
        method: "PATCH",
        body: farmData,
      }),
      invalidatesTags: ["Farm"],
    }),
    farmChangePassword: build.mutation({
      query: (farmData) => ({
        url: "farms/change-password/",
        method: "PATCH",
        body: farmData,
      }),
    }),
    createAnnouncement: build.mutation({
      query: (announcementData) => ({
        url: "announcements/create/",
        method: "POST",
        body: announcementData,
      }),
      invalidatesTags: ["Farm"],
    }),
    getAnnouncement: build.query<Announcement[], number>({
      query: (id) => ({
        url: `announcements/get/${id}/`,
        method: "GET",
      }),
      providesTags: ["Farm"],
    }),
    deleteAnnouncement: build.mutation({
      query: (id) => ({
        url: `announcements/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Farm"],
    }),
    blockUser: build.mutation({
      query: (data) => ({
        url: `farms/block-users/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Farm"],
    }),
    getBlockedUsers: build.query<Members[], number>({
      query: (id) => ({
        url: `farms/blocked-users/${id}/`,
        method: "GET",
      }),
      providesTags: ["Farm"],
    }),
    unblockUser: build.mutation({
      query: (data) => ({
        url: `farms/unblock-user/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Farm"],
    }),
    leaveFarm: build.mutation({
      query: (id) => ({
        url: `farms/leave/${id}/`,
        method: "POST",
      }),
      invalidatesTags: ["Farm"],
    }),
    deleteFarm: build.mutation({
      query: (id) => ({
        url: `farms/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Farm"],
    }),
    getFarmDashboard: build.query<FarmDashboard, number>({
      query: (id) => ({
        url: `farms/dashboard/${id}/`,
        method: "GET",
      }),
      providesTags: ["Farm", "Tray", "Session"],
    })
  }),
  overrideExisting: true,
});

export const {
  useCreateFarmMutation,
  useJoinFarmMutation,
  useGetFarmsQuery,
  useGetFarmQuery,
  useGetMembersQuery,
  useEditFarmMutation,
  useFarmChangePasswordMutation,
  useCreateAnnouncementMutation,
  useGetAnnouncementQuery,
  useDeleteAnnouncementMutation,
  useBlockUserMutation,
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
  useLeaveFarmMutation,
  useDeleteFarmMutation,
  useGetFarmDashboardQuery
} = farmApi;