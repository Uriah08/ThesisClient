import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { AlertCircle, AlertTriangle, Trash } from 'lucide-react-native'
import { router } from 'expo-router'
import { useDeleteTrayMutation } from '@/store/trayApi'
import { useDeleteSessionMutation } from '@/store/sessionApi'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDeleteFarmTrayMutation } from '@/store/farmTrayApi'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  type: 'tray' | 'session' | 'farm-tray'
  trayId?: number
  sessionId?: number
  onBack?: () => void
}

const DeleteClass = ({
  setVisible,
  visible,
  type,
  trayId,
  sessionId,
  onBack,
}: DialogsProps) => {
  const [deleteTray, { isLoading: trayLoading }] = useDeleteTrayMutation()
  const [deleteSession, { isLoading: sessionLoading }] = useDeleteSessionMutation()
  const [deleteFarmTray, { isLoading: farmTrayLoading }] = useDeleteFarmTrayMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDeleteTray = async () => {
    try {
      setErrorMessage(null)
      if (type === 'session') {
        await deleteSession(sessionId).unwrap()
        setVisible(false)
        await AsyncStorage.removeItem('session')
        onBack?.()
      } else if (type === 'tray') {
        await deleteTray(trayId).unwrap()
        setVisible(false)
        router.push('/(tabs)/farm')
      } else if (type === 'farm-tray') {
        await deleteFarmTray(trayId).unwrap()
        setVisible(false)
        router.push('/(tabs)/farm')
      }
    } catch (error: any) {
      if (error?.data?.detail) {
        setErrorMessage(error.data.detail)
        Toast.show({
          type: 'error',
          text1: error.data.detail,
        })
      }
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title={`Delete ${(type === 'tray' || type === 'farm-tray') ? 'Tray' : 'Session'}`}>
      <Dialog.Content>
        <View className="flex-row gap-3 justify-center items-center bg-zinc-200 p-2 rounded-full mb-4">
          <AlertCircle color={'#b91c1c'} />
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>
            This process cannot be undone. {'\n'}All your changes will be lost.
          </Text>
        </View>

        <Text style={{ fontFamily: 'PoppinsRegular', marginBottom: 10 }}>
          Are you sure you want to delete this {(type === 'tray' || type === 'farm-tray') ? 'tray' : 'session'}?
        </Text>

        {errorMessage && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: '#fca5a5',
              backgroundColor: '#fef2f2',
              borderRadius: 6,
              marginBottom: 12,
            }}
          >
            <AlertTriangle color="#dc2626" size={16} style={{ marginRight: 6 }} />
            <Text
              style={{
                color: '#b91c1c',
                fontFamily: 'PoppinsRegular',
                fontSize: 13,
                flex: 1,
              }}
            >
              {errorMessage}
            </Text>
          </View>
        )}

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              borderWidth: 1,
              borderColor: '#d4d4d8',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text
              className="text-zinc-500"
              style={{
                fontFamily: 'PoppinsRegular',
              }}
            >
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDeleteTray}
            style={{
              backgroundColor: '#b91c1c',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
            disabled={trayLoading || sessionLoading || farmTrayLoading}
          >
            {trayLoading || sessionLoading || farmTrayLoading  ? (
              <ActivityIndicator size={15} color="#ffffff" />
            ) : (
              <Trash color={'#ffffff'} size={15} />
            )}
            <Text
              className="text-white"
              style={{
                fontFamily: 'PoppinsRegular',
              }}
            >
              Delete
            </Text>
          </Pressable>
        </View>
      </Dialog.Content>
    </Dialogs>
  )
}

export default DeleteClass
