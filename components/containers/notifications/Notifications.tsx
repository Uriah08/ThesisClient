import { View, Text, Image, Pressable, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
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
    future: 'in %s', past: '%s ago', s: '1s', ss: '%ds', m: '1m',
    mm: '%dm', h: '1h', hh: '%dh', d: '1d', dd: '%dd',
    M: '1mo', MM: '%dmo', y: '1y', yy: '%dy',
  },
});

const formatTimeAgo = (dateString: string) => dayjs(dateString).fromNow();

type NotificationProps = {
  notifications: Recipient[],
  isLoading: boolean
  refetch: () => void
}

const Notifications = ({ notifications, isLoading, refetch }: NotificationProps) => {
  const [readNotifications] = useReadNotificationsMutation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleRead = async (ids: number[], read: boolean) => {
    try {
      if (!read) await readNotifications({ ids }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ padding: 15, gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <SkeletonShimmer key={i} height={80} borderRadius={16} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      refreshControl={
        <RefreshControl tintColor="#185FA5" refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ gap: 10 }}>
        {notifications.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 120, gap: 16 }}>
            <Image
              source={require('@/assets/images/hero-image.png')}
              style={{ width: 160, height: 160, opacity: 0.2 }}
              resizeMode="contain"
            />
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 16, fontFamily: 'PoppinsSemiBold', color: '#a1a1aa' }}>
                All caught up!
              </Text>
              <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#d4d4d8' }}>
                No new notifications found.
              </Text>
            </View>
          </View>
        ) : (
          notifications.map((notification) => {
            const isRead = notification.read;
            
            return (
              <View
                key={notification.id}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: isRead ? '#ffffff' : '#F8FAFC', // Very slight blue-ish tint for unread
                  borderWidth: 0.5,
                  borderColor: isRead ? '#f4f4f5' : '#E2E8F0',
                }}
              >
                <Pressable
                  onPress={() => {
                    handleRead([notification.id], isRead);
                    router.push({ pathname: "/notification/[id]", params: { id: notification.id.toString() } });
                  }}
                  android_ripple={{ color: '#f1f5f9' }}
                  style={{ flexDirection: 'row', padding: 14, gap: 12, alignItems: 'center' }}
                >
                  {/* Icon Container */}
                  <View style={{ position: 'relative' }}>
                    <NotificationIcon iconCode={notification.notification.type} />
                    {!isRead && (
                      <View 
                        style={{ 
                          height: 10, width: 10, borderRadius: 5, 
                          backgroundColor: '#10b981', // Clean emerald green
                          position: 'absolute', top: -2, right: -2,
                          borderWidth: 2, borderColor: '#F8FAFC'
                        }} 
                      />
                    )}
                  </View>

                  {/* Text Content */}
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text 
                        numberOfLines={1}
                        style={{ 
                          fontSize: 14, 
                          fontFamily: isRead ? 'PoppinsMedium' : 'PoppinsSemiBold', 
                          color: isRead ? '#52525b' : '#18181b',
                          flex: 1, marginRight: 8
                        }}
                      >
                        {notification.notification.title}
                      </Text>
                      <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
                        {formatTimeAgo(notification.notification.created_at)}
                      </Text>
                    </View>

                    <Text 
                      numberOfLines={1} 
                      style={{ 
                        fontSize: 12, 
                        fontFamily: 'PoppinsRegular', 
                        color: isRead ? '#a1a1aa' : '#71717a',
                        lineHeight: 18
                      }}
                    >
                      {notification.notification.body}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

export default Notifications;