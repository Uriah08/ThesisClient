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
  const [confirmText, setConfirmText] = useState("")
  const [deleteFarm, { isLoading: deletingFarm }] = useDeleteFarmMutation()
  const [leaveFarmm, { isLoading: leavingFarm }] = useLeaveFarmMutation();
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      if(type === 'delete') await deleteFarm(farmId).unwrap()
      else await leaveFarmm(farmId).unwrap()
      await AsyncStorage.removeItem('farm')
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSelectedFarm(null)

      Toast.show({
        type: 'success',
        text1: type === 'delete' ? 'Farm Deleted' : 'Left Farm',
      })

      setVisible(false)
      setConfirmText("")
      router.push('/(tabs)/farm')
      setLoading(false)
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({
          type: 'error',
          text1: error.data.detail,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const isDelete = type === "delete"

  const title = isDelete ? "Delete Farm" : "Leave Farm"
  const keyword = isDelete ? "delete" : "leave"
  const actionLabel = isDelete ? "Delete Farm" : "Leave Farm"

  const warningTitle = isDelete
    ? "You’re about to delete this farm"
    : "You’re about to leave this farm"

  const warningText = isDelete
    ? "Deleting this farm will permanently remove all data, members, trays, sessions, and records associated with it. This action cannot be undone."
    : "Leaving this farm will permanently remove all your related data, including your tray information, session history, and any changes you've made. This action cannot be undone."

  // Button and ripple colors
  const actionColor = isDelete ? "#b91c1c" : "#f97316" // red for delete, orange for leave
  const rippleColor = isDelete ? "#7f1d1d" : "#c2410c" // darker orange for leave ripple

  const isAllowed = confirmText.trim().toLowerCase() === keyword

  return (
    <Dialogs visible={visible} onVisible={setVisible} title={title}>
      <Dialog.Content>

        {/* Warning Box */}
        <View
          className="flex flex-row items-start gap-3 mt-2 p-3 rounded-lg"
          style={{
            backgroundColor: isDelete ? "#fee2e2" : "#ffedd5", // light red or orange
            borderWidth: 1,
            borderColor: isDelete ? "#fca5a5" : "#fb923c", // border
          }}
        >
          <TriangleAlert size={18} color={isDelete ? "#b91c1c" : "#f97316"} />

          <View className="flex-1">
            <Text
              style={{
                fontFamily: "PoppinsMedium",
                fontSize: 13,
                color: isDelete ? "#7f1d1d" : "#9a3412", // dark red/orange
                marginBottom: 2,
              }}
            >
              {warningTitle}
            </Text>

            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: 12,
                color: isDelete ? "#7f1d1d" : "#9a3412",
              }}
            >
              {warningText}
            </Text>
          </View>
        </View>

        {/* Confirm Input */}
        <View className="mt-3">
          <Text
            style={{
              fontFamily: "PoppinsMedium",
              fontSize: 12,
              marginBottom: 5,
              color: "#6b7280",
            }}
          >
            Type &quot;{keyword}&quot; to confirm:
          </Text>

          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder={keyword}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#d4d4d8",
              borderRadius: 7,
              paddingVertical: 8,
              paddingHorizontal: 10,
              fontFamily: "PoppinsRegular",
            }}
          />
        </View>

        <View className="mt-5" style={{ overflow: "hidden", borderRadius: 7 }}>
          <Pressable
            onPress={handleDelete}
            android_ripple={isAllowed ? { color: rippleColor } : undefined}
            disabled={!isAllowed || deletingFarm || leavingFarm || loading}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 15,
              backgroundColor: actionColor,
              borderRadius: 7,
              opacity: isAllowed ? 1 : 0.5,
            }}
          >
            <Text
              className="text-center text-white"
              style={{ fontFamily: "PoppinsMedium" }}
            >
              {deletingFarm || leavingFarm || loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : actionLabel}
            </Text>
          </Pressable>
        </View>

        <View className="mt-3" style={{ overflow: "hidden", borderRadius: 7 }}>
          <Pressable
            onPress={() => {
              setConfirmText("")
              setVisible(false)
            }}
            android_ripple={{ color: "#a1a1aa" }}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 7,
              borderWidth: 1,
              borderColor: "#a1a1aa",
            }}
          >
            <Text
              className="text-center text-zinc-400"
              style={{ fontFamily: "PoppinsMedium" }}
            >
              Cancel
            </Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default DeleteFarm
