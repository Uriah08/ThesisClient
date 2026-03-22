import { Stack } from "expo-router";
import './globals.css';
import StoreProvider from "@/provider/provider";
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="trays/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="tray/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="lessons"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notification"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="farm-settings/edit/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="farm-settings/change/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="farm-settings/block/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="farm-settings/announcement"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="production/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </StoreProvider>
  );
}
