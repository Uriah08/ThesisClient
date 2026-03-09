import { Stack, useLocalSearchParams } from "expo-router"

const ProductionLayout = () => {
  const { id } = useLocalSearchParams();
  return (
    <Stack>
        <Stack.Screen
          name="production"
          options={{
            headerShown: false,
          }}
          initialParams={{ id }}
        />
    </Stack>
  )
}

export default ProductionLayout