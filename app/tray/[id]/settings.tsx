import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const Settings = () => {
  const { id } = useLocalSearchParams();
  return (
    <View className='flex-1 bg-white'>
        <View className='flex-row justify-between items-center mt-10 p-5'>
            <Text className='text-3xl' style={{
                fontFamily: 'PoppinsBold'
            }}>Settings</Text>
        </View>
    </View>
  )
}

export default Settings