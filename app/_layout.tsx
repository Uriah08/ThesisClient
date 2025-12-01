//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

import { Stack } from "expo-router";
import './globals.css';
import StoreProvider from "@/provider/provider";

export default function RootLayout() {
  return (
    <StoreProvider>
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
      </Stack>
    </StoreProvider>
  );
}
