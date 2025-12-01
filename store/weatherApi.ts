import { baseApi } from "./baseApi";
import { WeatherData } from "@/utils/types";

export const weatherApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWeatherForecast: build.query<WeatherData, void>({
      query: () => ({
        url: "weather/forecast/",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeatherForecastQuery } = weatherApi;