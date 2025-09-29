import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAsyncAuth } from "@/utils/lib/baseQueryAsyncAuth";
import { Farm, Recipient, WeatherData } from "@/utils/types";

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.43.157:8000/api/users/',
  }),
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: build.mutation({
      query: (userData: { username: string; email: string; password: string; confirm_password: string }) => ({
        url: 'register/',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const api = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAsyncAuth('users'),
  endpoints: (build) => ({
    completeProfile: build.mutation({
      query: (profileData) => ({
        url: 'complete-profile/',
        method: 'PUT',
        body: profileData,
      }),
    }),
    logout: build.mutation({
      query: (data) => ({
        url: 'logout/',
        method: 'POST',
        body: data
      }),
    }),
    changePassword: build.mutation({
      query: (passwordData) => ({
        url: 'change-password/',
        method: 'PUT',
        body: passwordData
      })
    })
  }),
});

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: baseQueryWithAsyncAuth('weather'),
  endpoints: (build) => ({
    getWeatherForecast: build.query<WeatherData, void>({
      query: () => ({
        url: 'forecast/',
        method: 'GET',
      })
    }),
  }),
})

export const farmApi = createApi({
  reducerPath: 'farmApi',
  baseQuery: baseQueryWithAsyncAuth('farms'),
  tagTypes: ['Farm'],
  endpoints: (build) => ({
    createFarm: build.mutation({
      query: (farmData) => ({
        url: 'create/',
        method: 'POST',
        body: farmData
      }),
      invalidatesTags: ['Farm']
    }),
    joinFarm: build.mutation({
      query: (farmData) => ({
        url: 'join/',
        method: 'POST',
        body: farmData
      }),
      invalidatesTags: ['Farm']
    }),
    getFarms: build.query<Farm[], void>({
      query: () => ({
        url: 'mine/',
        method: 'GET',
      }),
      providesTags: ['Farm']
    }),
    getFarm: build.query<Farm, number>({
      query: (id) => ({
        url: `farm/${id}/`,
        method: "GET"
      }),
      providesTags: ['Farm']
    })
  }),
})

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithAsyncAuth('notifications'),
  tagTypes: ['Notification'],
  endpoints: (build) => ({
    registerDeviceToken: build.mutation({
      query: (data) => ({
        url: 'register-token/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Notification']
    }),
    getNotifications: build.query<Recipient[], void>({
      query: () => ({
        url: 'my-notifications/',
        method: 'GET'
      }),
      providesTags: ['Notification']
    }),
    getNotification: build.query<Recipient, number>({
      query: (id) => ({
        url: `my-notification?id=${id}`,
        method: 'GET'
      }),
      providesTags: ['Notification']
    }),
    readNotifications: build.mutation({
      query: ({ ids }) => ({
        url: `read-notifications/`,
        method: 'POST',
        body: { ids }
      }),
      invalidatesTags: ['Notification']
    }),
    deleteNotification: build.mutation({
      query: ({ ids }) => ({
        url: 'delete-notifications/',
        method: 'DELETE',
        body: { ids }
      }),
      invalidatesTags: ['Notification']
    })
  })
})

export const {
  useCreateFarmMutation,
  useJoinFarmMutation,
  useGetFarmsQuery,
  useGetFarmQuery
} = farmApi

export const {
  useGetWeatherForecastQuery
} = weatherApi;

export const {
  useLoginMutation,
  useRegisterMutation
} = authApi;

export const {
  useRegisterDeviceTokenMutation,
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useReadNotificationsMutation,
  useDeleteNotificationMutation
} = notificationApi;

export const {
  useCompleteProfileMutation,
  useLogoutMutation,
  useChangePasswordMutation
} = api;