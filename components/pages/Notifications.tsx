import { View, Text, Image, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { useGetNotificationsQuery } from '@/store/api'
import SkeletonShimmer from '../containers/SkeletonPlaceholder';

const Notifications = () => {
  const { data, isLoading } = useGetNotificationsQuery();
  const notifications = data || [];

  if (isLoading) {
    return (
      <View className="flex gap-3 p-5">
        <SkeletonShimmer height={70} borderRadius={10} />
        <SkeletonShimmer height={70} borderRadius={10} />
        <SkeletonShimmer height={70} borderRadius={10} />
      </View>
    )
  }
  
  return (
    <ScrollView className='p-5'>
      <View className='flex-col gap-3'>
        {notifications.length === 0 ? (
          <View className='flex-1 justify-center items-center gap-1' style={{ marginTop: 150 }}>
            <Image source={require('@/assets/images/notification-icons/notification-cover.png')} style={{ width: 155, height: 155, opacity: 0.2}} resizeMode='contain'/>
            <Text className='text-primary text-2xl' style={{ fontFamily: 'PoppinsBold', opacity: 0.2}}>No Notifications Yet</Text>
          </View>
        ) : (
          notifications.map((notification) => (
          <View
          key={notification.id}
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#d4d4d8',
          }}
          className="w-full rounded-xl">
            <Pressable
            android_ripple={{ color: '#d3d3d3', borderless: false }}
            className='p-3 flex-row gap-3 relative'>
              <View style={{ height: 8, width: 8, borderRadius: 999, backgroundColor: '#0c5f1a', position: 'absolute', bottom: 15, right: 15}}></View>
              <Image source={require('@/assets/images/notification-icons/announcement.png')} style={{ width: 45, height: 45}} resizeMode='contain'/>
              <View className='flex-1'>
                  <View className='flex-row justify-between'>
                  <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14 }} className='text-[#626262]'>Announcement</Text>
                  <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: '#858585' }}>Today</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#858585'}}>Hello mga kabaranggay, meron k...</Text>
              </View>
            </Pressable>
          </View>
        ))
        )}
      </View>
    </ScrollView>
  )
}

export default Notifications