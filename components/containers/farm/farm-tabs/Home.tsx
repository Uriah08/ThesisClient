import { View, Text } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View className='flex-1 flex flex-col'>
      <Text className='text-xl text-zinc-700 mt-3 px-5' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>Home</Text>
    </View>
  )
}

export default Home