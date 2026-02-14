import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNotification } from '@/context/NotificationContext'
import { useGetTestQuery, usePostTestMutation } from '@/store/testApi'

const Test = () => {
  const { expoPushToken, notification, error: notifError } = useNotification()

  const { data, isLoading, refetch } = useGetTestQuery()
  const [postTest, { isLoading: isPosting }] = usePostTestMutation()

  const [input, setInput] = useState('')
  const [response, setResponse] = useState<any>(null)

  const handlePost = async () => {
    try {
      const res = await postTest({ message: input }).unwrap()
      setResponse(res)
      setInput('')
    } catch (err) {
      console.log(err)
    }
  }

  if (notifError) return <Text>Error</Text>

  return (
    <View className="flex-1 bg-white px-6 pt-12">

      {/* Notification Section */}
      <Text className="text-lg font-bold mb-2">Notifications</Text>
      <Text style={{ color: 'red' }}>Your push token:</Text>
      <Text className="mb-4">{expoPushToken}</Text>

      <Text>Latest notification:</Text>
      <Text>{notification?.request.content.title}</Text>
      <Text className="mb-6">
        {JSON.stringify(notification?.request.content.data, null, 2)}
      </Text>

      {/* GET API Section */}
      <Text className="text-lg font-bold mb-2">GET Test API</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text className="mb-2">
          {data ? JSON.stringify(data, null, 2) : 'No data yet'}
        </Text>
      )}

      <TouchableOpacity
        onPress={refetch}
        className="bg-blue-500 py-2 px-4 rounded mb-6"
      >
        <Text className="text-white text-center">Refetch</Text>
      </TouchableOpacity>

      {/* POST API Section */}
      <Text className="text-lg font-bold mb-2">POST Test API</Text>

      <TextInput
        placeholder="Enter message"
        value={input}
        onChangeText={setInput}
        className="border border-gray-300 rounded px-3 py-2 mb-3"
      />

      <TouchableOpacity
        onPress={handlePost}
        disabled={isPosting}
        className="bg-green-500 py-2 px-4 rounded mb-3"
      >
        <Text className="text-white text-center">
          {isPosting ? 'Sending...' : 'Send POST'}
        </Text>
      </TouchableOpacity>

      {response && (
        <Text>
          {JSON.stringify(response, null, 2)}
        </Text>
      )}

    </View>
  )
}

export default Test
