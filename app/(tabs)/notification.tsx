import { View, Text } from 'react-native'
import React from 'react'
import Notifications from '@/components/pages/Notifications'

const Notification = () => {
  
  return (
    <View className='flex-1 bg-white'>
      <Text className='mt-10 text-3xl p-5' style={{
              fontFamily: 'PoppinsBold'
            }}>Notifications</Text>
      <Notifications/>
    </View>
  )
}

export default Notification