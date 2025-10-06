import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAsyncAuth } from "@/utils/lib/baseQueryAsyncAuth";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAsyncAuth(),
  tagTypes: ["Farm", "Session", "Notification"],
  endpoints: () => ({}),
});