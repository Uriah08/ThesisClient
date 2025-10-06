import { baseApi } from "./baseApi";
import { Recipient } from "@/utils/types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    registerDeviceToken: build.mutation({
      query: (data) => ({
        url: "notifications/register-token/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),
    getNotifications: build.query<Recipient[], void>({
      query: () => ({
        url: "notifications/my-notifications/",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    getNotification: build.query<Recipient, number>({
      query: (id) => ({
        url: `notifications/my-notification?id=${id}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    readNotifications: build.mutation({
      query: ({ ids }) => ({
        url: "notifications/read-notifications/",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: build.mutation({
      query: ({ ids }) => ({
        url: "notifications/delete-notifications/",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterDeviceTokenMutation,
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useReadNotificationsMutation,
  useDeleteNotificationMutation,
} = notificationApi;