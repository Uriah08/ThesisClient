import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseQueryWithAsyncAuth = () => {
  const rawBaseQuery = fetchBaseQuery({
    // baseUrl: `http://10.192.136.217:8000/api/`,
    baseUrl: `http://192.168.43.157:8000/api/`, // MOBILE HOTSPOT
  });

  return async (args: any, api: any, extraOptions: any) => {
    const token = await AsyncStorage.getItem('authToken');

    const modifiedArgs =
      typeof args === 'string'
        ? { url: args }
        : {
            ...args,
            headers: {
              ...(args.headers || {}),
              Authorization: token ? `Token ${token}` : '',
            },
          };

    return rawBaseQuery(modifiedArgs, api, extraOptions);
  };
};