import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import React from 'react'
import Dialogs from './Dialog';
import { Dialog } from 'react-native-paper';
import { Trash2, TriangleAlert } from 'lucide-react-native';
import { useDeleteNotificationMutation } from '@/store/notificationApi';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  type: 'single' | 'multiple'
  ids: number[]
};

const DeleteNotifications = ({ setVisible, visible, type, ids }: DialogsProps) => {
  const [deleteNotification, { isLoading }] = useDeleteNotificationMutation();

  const isSingle = type === 'single';
  const title    = isSingle ? 'Delete Notification' : 'Delete Notifications';
  const warningText = isSingle
    ? 'This notification will be permanently removed. This action cannot be undone.'
    : 'All notifications will be permanently removed. This action cannot be undone.';

  const deleteNotifications = async () => {
    try {
      await deleteNotification({ ids }).unwrap();
      Toast.show({ type: 'success', text1: isSingle ? 'Notification deleted.' : 'All notifications deleted.' });
      setVisible(false);
      router.push('/(tabs)/notification');
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({ type: 'error', text1: error.data.detail });
      }
    }
  };

  return (
    <Dialogs onVisible={setVisible} visible={visible} title={title} subtitle="Danger zone">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Warning strip */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 8,
          backgroundColor: '#fef2f2',
          borderWidth: 0.5,
          borderColor: '#fecaca',
          borderRadius: 8,
          padding: 10,
        }}>
          <TriangleAlert size={15} color="#dc2626" style={{ marginTop: 1 }} />
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#7f1d1d', flex: 1, lineHeight: 18 }}>
            {warningText}
          </Text>
        </View>

        {/* Confirm message */}
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13.5, color: '#18181b', lineHeight: 21 }}>
          Are you sure you want to delete{' '}
          <Text style={{ fontFamily: 'PoppinsSemiBold', color: '#b91c1c' }}>
            {isSingle ? 'this notification' : 'all notifications'}
          </Text>?
        </Text>

        {/* Footer — row layout matching DeleteClass */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: '#d4d4d8',
              backgroundColor: '#fafafa',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={deleteNotifications}
            disabled={isLoading}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: '#b91c1c',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator size={14} color="#fff" />
              : <Trash2 size={14} color="#fff" />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>Delete</Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default DeleteNotifications