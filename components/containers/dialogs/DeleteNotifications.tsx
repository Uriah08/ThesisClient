import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import React from 'react'
import Dialogs from './Dialog';
import { Dialog } from 'react-native-paper';
import { Trash } from 'lucide-react-native';
import { useDeleteNotificationMutation } from '@/store/api';
import { router } from 'expo-router';

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  type: 'single' | 'multiple'
  ids: number[]
};

const DeleteNotifications = ({setVisible, visible, type, ids}: DialogsProps) => {
    const [deleteNotification, { isLoading}] = useDeleteNotificationMutation();

    const deleteNotifications = async () => {
        try {
            await deleteNotification({ ids }).unwrap()
            setVisible(false)
            router.push('/(tabs)/notification')
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title={type === 'single' ? 'Delete Notification' : 'Delete Notifications'}>
        <Dialog.Content>
            <Text style={{ fontFamily: 'PoppinsRegular' }}>{type === 'single' ? 'Are you sure you want to delete this notification?' : 'Are you sure you want to delete all notifications?'}</Text>
            <View className='flex-row gap-3 mt-2 justify-end'>
                <View className='rounded-lg' style={{ borderWidth: 1, borderColor: '#d4d4d8'}}>
                    <Pressable onPress={() => setVisible(false)} android_ripple={{ color: '#a1a1aa'}} className='flex-row gap-2 items-center' style={{ paddingVertical: 8, paddingHorizontal: 10}}>
                        <Text >Cancel</Text>
                    </Pressable>
                </View>
                <View className='bg-red-700 rounded-lg' style={{ backgroundColor: '#b91c1c', paddingVertical: 8, paddingHorizontal: 10}}>
                    <Pressable onPress={() => deleteNotifications()} className='flex-row gap-2 items-center'>
                        {isLoading ? (
                            <ActivityIndicator size={15} color={'#ffffff'}/>
                        ) : (
                            <Trash size={15} color={'#ffffff'}/>
                        )}
                        <Text className='text-white'>Delete</Text>
                    </Pressable>
                </View>
            </View>
        </Dialog.Content>
    </Dialogs>
  )
}

export default DeleteNotifications