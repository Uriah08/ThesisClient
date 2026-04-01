import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { TriangleAlert } from 'lucide-react-native'
import { useDeleteFarmMutation, useLeaveFarmMutation } from '@/store/farmApi'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Farm } from '@/utils/types'

type DialogProps = {
  visible: boolean
  setVisible: (visible: boolean) => void
  farmId: number
  type: 'delete' | 'leave'
  setSelectedFarm: (farm: Farm | null) => void
  onBack: () => void
}

const DeleteFarm = ({ visible, setVisible, farmId, type, setSelectedFarm, onBack }: DialogProps) => {
  const [confirmText, setConfirmText] = useState('')
  const [deleteFarm, { isLoading: deletingFarm }] = useDeleteFarmMutation()
  const [leaveFarmm, { isLoading: leavingFarm }] = useLeaveFarmMutation()
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      if (type === 'delete') await deleteFarm(farmId).unwrap()
      else await leaveFarmm(farmId).unwrap()
      await AsyncStorage.removeItem('farm')
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSelectedFarm(null)
      Toast.show({ type: 'success', text1: type === 'delete' ? 'Farm deleted.' : 'Left farm.' })
      setVisible(false)
      setConfirmText('')
      router.push('/(tabs)/farm')
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({ type: 'error', text1: error.data.detail })
      }
    } finally {
      setLoading(false)
    }
  }

  const isDelete = type === 'delete'
  const keyword   = isDelete ? 'delete' : 'leave'
  const title     = isDelete ? 'Delete Farm' : 'Leave Farm'
  const subtitle  = isDelete ? 'Danger zone' : 'Confirm action'

  const warningText = isDelete
    ? 'Deleting this farm will permanently remove all data, members, trays, sessions, and records. This cannot be undone.'
    : 'Leaving this farm will permanently remove your tray info, session history, and all related changes. This cannot be undone.'

  // delete = red, leave = orange
  const accentBg     = isDelete ? '#fef2f2' : '#fff7ed'
  const accentBorder = isDelete ? '#fecaca' : '#fed7aa'
  const accentIcon   = isDelete ? '#dc2626' : '#f97316'
  const accentText   = isDelete ? '#7f1d1d' : '#7c2d12'
  const actionBg     = isDelete ? '#b91c1c' : '#ea580c'
  const actionPress  = isDelete ? '#991b1b' : '#c2410c'

  const isBusy    = deletingFarm || leavingFarm || loading
  const isAllowed = confirmText.trim().toLowerCase() === keyword

  return (
    <Dialogs visible={visible} onVisible={setVisible} title={title} subtitle={subtitle}>
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Warning strip */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          backgroundColor: accentBg,
          borderWidth: 0.5,
          borderColor: accentBorder,
          borderRadius: 10,
          padding: 12,
        }}>
          <TriangleAlert size={15} color={accentIcon} style={{ marginTop: 1 }} />
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: accentText, flex: 1, lineHeight: 18 }}>
            {warningText}
          </Text>
        </View>

        {/* Confirm input */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Type{' '}
            <Text style={{ fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>&quot;{keyword}&quot;</Text>
            {' '}to confirm
          </Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder={keyword}
            autoCapitalize="none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              borderWidth: isFocused ? 1 : 0.5,
              borderColor: isFocused ? accentIcon : '#e4e4e7',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 9,
              fontSize: 13.5,
              color: '#18181b',
              backgroundColor: isFocused ? (isDelete ? '#fef2f2' : '#fff7ed') : '#fafafa',
              fontFamily: 'PoppinsRegular',
            }}
          />
        </View>

        {/* Action button */}
        <View style={{ gap: 8, marginTop: 2 }}>
          <Pressable
            onPress={handleDelete}
            disabled={!isAllowed || isBusy}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
              backgroundColor: isAllowed ? actionPress : actionBg,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isAllowed ? 1 : 0.4,
            }}
          >
            {isBusy
              ? <ActivityIndicator size={15} color="#fff" />
              : <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>{title}</Text>
            }
          </Pressable>

          <Pressable
            onPress={() => { setConfirmText(''); setVisible(false) }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: '#d4d4d8',
              backgroundColor: '#fafafa',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Cancel</Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default DeleteFarm