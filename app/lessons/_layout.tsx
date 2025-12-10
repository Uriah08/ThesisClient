import { Stack } from "expo-router"

const LessonsLayout = () => {
  return (
    <Stack>
        <Stack.Screen
          name="lesson1"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="lesson2"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="lesson3"
          options={{
            headerShown: false,
          }}
        />
    </Stack>
  )
}

export default LessonsLayout