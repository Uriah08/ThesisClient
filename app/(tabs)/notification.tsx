import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import Notifications from '@/components/containers/notifications/Notifications'
import { useGetNotificationsQuery, useReadNotificationsMutation } from '@/store/notificationApi';
import { EllipsisVertical, MailOpen, Trash } from 'lucide-react-native';
import DeleteNotifications from '@/components/containers/dialogs/DeleteNotifications';

const Notification = () => {
  const { data, isLoading } = useGetNotificationsQuery();
  const [readNotifications] = useReadNotificationsMutation();
  const notifications = data || [];
  const [showDialog, setShowDialog] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const readAllNotifications = async () => {
    const ids = notifications.filter((notif) => !notif.read).map((notif) => notif.id)
    try {
      await readNotifications({ ids }).unwrap()
      setShowDialog(false)
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <View className='flex-1 bg-white'>
      <DeleteNotifications setVisible={setShowDelete} visible={showDelete} type='multiple' ids={notifications.map((notif) => notif.id)}/>
      <View className='flex-row justify-between items-center mt-10 p-5'>
        <Text className='text-3xl' style={{
              fontFamily: 'PoppinsBold'
            }}>Notifications</Text>
        <EllipsisVertical size={20} onPress={() => setShowDialog(!showDialog)}/>
          {showDialog && (
            <View style={{ top: 50, width: 200 }} className="absolute right-5 z-50 bg-white border gap-2 border-zinc-300 rounded-xl shadow-lg p-3">
              <Text className='text-zinc-800' style={{ fontFamily: 'PoppinsMedium' }}>Notifications</Text>
              <View className='rounded-lg overflow-hidden' style={{
                    backgroundColor: '#e4e4e7'
                  }}>
                <Pressable disabled={notifications.filter((notif) => !notif.read).length === 0} onPress={() => readAllNotifications()} android_ripple={{ color: '#71717a', borderless: false }}>
                  <View className='flex-row gap-2 items-center p-2 rounded-lg justify-center'>
                    <MailOpen size={15} color={notifications.filter((notif) => !notif.read).length === 0 ? '#8f8f8f' : '#000000'}/>
                    <Text style={{ fontFamily: 'PoppinsMedium', color: notifications.filter((notif) => !notif.read).length === 0 ? '#8f8f8f' : '#000000'}} className='text-sm'>Mark All as Read</Text>
                  </View>
              </Pressable>
              </View>
              <View className='rounded-lg overflow-hidden' style={{
                    backgroundColor: '#e4e4e7'
                  }}>
                <Pressable disabled={notifications.length === 0} onPress={() => {setShowDelete(true); setShowDialog(false)}} android_ripple={{ color: '#71717a', borderless: false }}>
                  <View className='flex-row gap-2 items-center p-2 rounded-lg justify-center'>
                    <Trash size={15} color={notifications.length === 0 ? '#8f8f8f' : '#000000'}/>
                    <Text style={{ fontFamily: 'PoppinsMedium', color: notifications.length === 0 ? '#8f8f8f' : '#000000'}} className={`text-sm`}>Delete All</Text>
                  </View>
              </Pressable>
              </View>
            </View>
          )}
      </View>
      <Notifications notifications={notifications} isLoading={isLoading}/>
    </View>
  )
}

export default Notification