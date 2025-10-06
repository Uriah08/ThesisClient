import { View, Text, Image, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { useReadNotificationsMutation } from '@/store/notificationApi';
import SkeletonShimmer from '../SkeletonPlaceholder';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import NotificationIcon from './NotificationIcon';
import { router } from 'expo-router';
import { Recipient } from '@/utils/types';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '1 sec',
    ss: '%d sec',
    m: '1 min',
    mm: '%d min',
    h: '1 hr',
    hh: '%d hr',
    d: '1 d',
    dd: '%d d',
    M: '1 mo',
    MM: '%d mo',
    y: '1 yr',
    yy: '%d yr',
  },
});

const formatTimeAgo = (dateString: string) => {
  return dayjs(dateString).fromNow();
};

type NotificationProps = {
  notifications: Recipient[],
  isLoading: boolean
}

const Notifications = ({ notifications, isLoading }: NotificationProps) => {
  const [ readNotifications ] = useReadNotificationsMutation();

  const readNotifcation = async (ids: number[], read: boolean) => {
    try {
      if(!read) {
        await readNotifications({ ids }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  }

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
            <Image
              source={require('@/assets/images/hero-image.png')}
              style={{ width: 200, height: 200, opacity: 0.5}}
              resizeMode={'contain'}
              />
              <Text style={{
                  fontSize: 20,
                  fontFamily: 'PoppinsExtraBold',
                  color: '#15518330'
              }}>NO NOTIFICATIONS FOUND</Text>
          </View>
        ) : (
          notifications.map((notification) => (
          <View
          key={notification.id}
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: notification.read ? '#d4d4d8' : '#a2a2a6',
            backgroundColor: notification.read ? '#ffffff' : '#f2f2f2',
          }}
          className="w-full rounded-xl">
            <Pressable
            onPress={() => {readNotifcation([notification.id],notification.read); router.push({ pathname: "/notification/[id]", params: { id: notification.id.toString() } });}}
            android_ripple={{ color: '#d3d3d3', borderless: false }}
            className='p-3 flex-row gap-3 relative'>
              {!notification.read && <View style={{ height: 8, width: 8, borderRadius: 999, backgroundColor: '#0c5f1a', position: 'absolute', bottom: 15, right: 15}}></View>}
              <NotificationIcon iconCode={notification.notification.type}/>
              <View className='flex-1'>
                  <View className='flex-row justify-between'>
                    <Text 
                      style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14 }} 
                      className='text-[#626262]'>
                      {notification.notification.title.length > 18 
                        ? notification.notification.title.slice(0, 18) + '...' 
                        : notification.notification.title}
                    </Text>
                  <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: '#858585' }}>{formatTimeAgo(notification.notification.created_at)}</Text>
              </View>
              <Text style={{ fontFamily: notification.read ? 'PoppinsRegular' :'PoppinsSemiBold', fontSize: 12, color: notification.read ? '#858585' : '#4a4a4a'}}>
                {notification.notification.body.length > 33
                 ? notification.notification.body.slice(0, 33) + '...' 
                 : notification.notification.body}
                </Text>
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