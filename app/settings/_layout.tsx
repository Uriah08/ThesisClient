import { Stack } from "expo-router"

const SettingsLayput = () => {
  return (
    <Stack>
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FAQ"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="help-center"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerShown: false,
          }}
        />
    </Stack>
  )
}

export default SettingsLayput