import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { ArrowLeft } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetFarmTrayByIdQuery } from '@/store/farmTrayApi'

const Dashboard = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading} = useGetFarmTrayByIdQuery(Number(id));
  console.log(data);
  

  if (isLoading) return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </View>
    );

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-row gap-5 items-center mt-10 p-5'>
        <View style={{ borderRadius: 999, overflow: 'hidden' }}>
            <Pressable
            android_ripple={{
                color: '#d4d4d8',
                borderless: false,
                radius: 9999, 
            }}
            style={{
                borderRadius: 99,
                padding: 3,
                overflow: 'hidden',
            }}
            onPress={() => router.back()}
            >
            <ArrowLeft color="#000" size={26} />
            </Pressable>
        </View>

        <Text
          className='text-3xl'
          style={{
            fontFamily: 'PoppinsBold',
          }}
        >
          Dashboard
        </Text>
      </View>
    </View>
  )
}

export default Dashboard
