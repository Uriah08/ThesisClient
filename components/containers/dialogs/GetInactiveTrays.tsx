import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog, Checkbox } from 'react-native-paper'
import { useGetFarmTraysQuery } from '@/store/farmTrayApi'
import SkeletonShimmer from '../SkeletonPlaceholder'
import { PanelsLeftRightIcon } from 'lucide-react-native'
import { FarmTray } from '@/utils/types'
import { useCreateTrayMutation } from '@/store/trayApi'
import Toast from 'react-native-toast-message'

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  farmId: number;
  sessionId?: number
};

const InactiveTrays = ({ setVisible, visible, farmId, sessionId }: DialogsProps) => {
  const [createTray, { isLoading: isCreating }] = useCreateTrayMutation()
  const { data, isLoading } = useGetFarmTraysQuery(farmId)
  const [selectedTrays, setSelectedTrays] = useState<number[]>([])
  const [error, setError] = useState<string>('')

  const inactiveTrays = data?.filter((tray: FarmTray) => tray.status === 'inactive') || []

  const toggleTraySelection = (id: number) => {
    setSelectedTrays((prev) =>
      prev.includes(id) ? prev.filter((trayId) => trayId !== id) : [...prev, id]
    )
    setError('') // clear warning if user selects something
  }

  const handleAdd = async () => {
    if (selectedTrays.length === 0) {
      setError('Please select a tray.')
      return
    }

    try {
      const payload = {
        farm: farmId,
        session: sessionId,
        tray_ids: selectedTrays,
      }

      const response = await createTray(payload).unwrap()

      Toast.show({
        type: 'success',
        text1: 'Trays Added',
        text2: response.message || 'Trays added successfully.',
      })

      setSelectedTrays([])
      setVisible(false)
    } catch (error: any) {
      console.log('Error creating trays:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.data?.error || 'Failed to add trays. Please try again.',
      })
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title="Add Tray">
      <Dialog.Content>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          style={{ maxHeight: 260 }}
        >
          {isLoading ? (
            <View className="flex gap-2">
              <SkeletonShimmer style={{ height: 40, marginBottom: 10 }} />
              <SkeletonShimmer style={{ height: 40, marginBottom: 10 }} />
              <SkeletonShimmer style={{ height: 40, marginBottom: 10 }} />
            </View>
          ) : inactiveTrays.length > 0 ? (
            inactiveTrays.map((tray: any) => (
              <Pressable
                key={tray.id}
                onPress={() => toggleTraySelection(tray.id)}
                className="rounded-lg mb-4"
                style={{
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: selectedTrays.includes(tray.id)
                    ? '#155183'
                    : '#e4e4e7',
                }}
              >
                <View
                  className="bg-white shadow-sm flex-row items-center justify-between"
                  style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                >
                  <View className="flex-row items-center gap-2">
                    <View
                      style={{
                        backgroundColor: '#155183',
                        borderRadius: 9999,
                        padding: 5,
                      }}
                    >
                      <PanelsLeftRightIcon color={'#ffffff'} size={14} />
                    </View>
                    <Text
                      className="text-zinc-800"
                      style={{
                        fontFamily: 'PoppinsSemiBold',
                        color: '#3f3f46',
                        fontSize: 14,
                      }}
                    >
                      {tray.name?.length > 10
                        ? `${tray.name.slice(0, 10)}...`
                        : tray.name}
                    </Text>
                  </View>

                  <Checkbox
                    status={
                      selectedTrays.includes(tray.id) ? 'checked' : 'unchecked'
                    }
                    onPress={() => toggleTraySelection(tray.id)}
                    color="#155183"
                  />
                </View>
              </Pressable>
            ))
          ) : (
            <Text
              className="text-center text-zinc-500"
              style={{ fontFamily: 'PoppinsRegular', marginTop: 20 }}
            >
              No inactive trays found.
            </Text>
          )}
        </ScrollView>

        {error ? (
          <Text
            style={{
              color: '#dc2626',
              fontFamily: 'PoppinsRegular',
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        ) : null}

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
            className="border border-zinc-300 p-2 rounded-lg"
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
            onPress={handleAdd}
            style={{
              backgroundColor: '#155183',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
            disabled={isLoading || isCreating}
          >
            {isCreating ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <PanelsLeftRightIcon color={'#ffffff'} size={15} />
                )}
            <Text
              className="text-white"
              style={{
                fontFamily: 'PoppinsRegular',
              }}
            >
              Add
            </Text>
          </Pressable>
        </View>
      </Dialog.Content>
    </Dialogs>
  )
}

export default InactiveTrays
