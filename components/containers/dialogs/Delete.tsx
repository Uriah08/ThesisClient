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
import { useDeleteAnnouncementMutation } from '@/store/farmApi'
import { useDeleteProductionMutation } from '@/store/productionApi'
import { useDeleteRetailMutation } from '@/store/retailsApi'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  type: 'tray' | 'session' | 'farm-tray' | 'announcement' | 'production' | 'retail'
  trayId?: number
  sessionId?: number
  announcementId?: number
  productionId?: number
  retailId?: number
  onBack?: () => void
}

const typeLabel = (type: DialogsProps['type']) => {
  if (type === 'tray' || type === 'farm-tray') return 'tray'
  if (type === 'announcement') return 'announcement'
  if (type === 'production') return 'record'
  if (type === 'retail') return 'retail'
  return 'session'
}

const DeleteClass = ({
  setVisible,
  visible,
  type,
  trayId,
  sessionId,
  onBack,
  announcementId,
  productionId,
  retailId
}: DialogsProps) => {
  const [deleteTray, { isLoading: trayLoading }]               = useDeleteTrayMutation()
  const [deleteSession, { isLoading: sessionLoading }]         = useDeleteSessionMutation()
  const [deleteFarmTray, { isLoading: farmTrayLoading }]       = useDeleteFarmTrayMutation()
  const [deleteAnnouncement, { isLoading: announcementLoading }] = useDeleteAnnouncementMutation()
  const [deleteProduction, { isLoading: productionLoading }]   = useDeleteProductionMutation()
  const [deleteRetail, { isLoading: retailLoading }]   = useDeleteRetailMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isBusy = trayLoading || sessionLoading || farmTrayLoading || announcementLoading || productionLoading || retailLoading
  const label  = typeLabel(type)
  const title  = `Delete ${label.charAt(0).toUpperCase() + label.slice(1)}`

  const handleDelete = async () => {
    setErrorMessage(null)
    try {
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
      } else if (type === 'announcement') {
        await deleteAnnouncement(announcementId).unwrap()
        setVisible(false)
      } else if (type === 'retail') {
        await deleteRetail(retailId)
        setVisible(false)
      } else if (type === 'production') {
        try {
          await deleteProduction(productionId).unwrap()
        } catch (error: unknown) {
          if ((error as { status?: string })?.status === 'FETCH_ERROR') {
            setVisible(false)
            router.back()
          }
        }
      }
    } catch (error: any) {
      if (error?.data?.detail) {
        setErrorMessage(error.data.detail)
        Toast.show({ type: 'error', text1: error.data.detail })
      }
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title={title} subtitle="Danger zone">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Warning strip — shown for non-announcement types */}
        {type !== 'announcement' && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#fef2f2',
            borderWidth: 0.5,
            borderColor: '#fecaca',
            borderRadius: 8,
            padding: 10,
          }}>
            <AlertCircle color="#dc2626" size={15} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#7f1d1d', flex: 1, lineHeight: 18 }}>
              This action cannot be undone. All associated data will be permanently lost.
            </Text>
          </View>
        )}

        {/* Confirm message */}
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13.5, color: '#18181b', lineHeight: 21 }}>
          Are you sure you want to delete this{' '}
          <Text style={{ fontFamily: 'PoppinsSemiBold', color: '#b91c1c' }}>{label}</Text>?
        </Text>

        {/* Inline error */}
        {errorMessage && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#fef2f2',
            borderWidth: 0.5,
            borderColor: '#fecaca',
            borderRadius: 8,
            padding: 10,
          }}>
            <AlertTriangle color="#dc2626" size={15} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#7f1d1d', flex: 1 }}>
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Footer */}
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
            onPress={handleDelete}
            disabled={isBusy}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: '#b91c1c',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: isBusy ? 0.75 : 1,
            }}
          >
            {isBusy
              ? <ActivityIndicator size={14} color="#fff" />
              : <Trash color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>Delete</Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default DeleteClass