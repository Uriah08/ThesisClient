import { View, Text } from 'react-native'
import React from 'react'
import { useNotification } from '@/context/NotificationContext'
import { ThemedText } from '@/components/ThemedText';

const Test = () => {
  const { expoPushToken, notification, error} = useNotification();
  
  if(error) return <ThemedText>Error</ThemedText>

  return (
    <View className='flex-1 justify-center items-center'>
      <Text>Test</Text>
      <ThemedText type="subtitle" style={{ color: "red" }}>
          Your push token:
        </ThemedText>
        <ThemedText>{expoPushToken}</ThemedText>
        <ThemedText type="subtitle">Latest notification:</ThemedText>
        <ThemedText>{notification?.request.content.title}</ThemedText>
        <ThemedText>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </ThemedText>
    </View>
  )
}

export default Test