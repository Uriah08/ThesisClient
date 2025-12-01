import { View, Text, ScrollView, Image, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { useBlockUserMutation, useGetMembersQuery } from '@/store/farmApi'
import SkeletonShimmer from '../SkeletonPlaceholder'
import { UserLock, CheckCircle, Circle, Search } from 'lucide-react-native'
import Toast from 'react-native-toast-message'

type DialogProps = {
  visible: boolean
  setVisible: (visible: boolean) => void
  farmId: number
  ownerId?: number
}

const BlockUser = ({ visible, setVisible, farmId, ownerId }: DialogProps) => {
  const { data, isLoading } = useGetMembersQuery(farmId)
  const members = data?.filter((member) => member.id !== ownerId)
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation()

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [error, setError] = useState<string>('')

  const toggleSelect = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
    setError('')
  }

  const handleBlock = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select user.')
      return
    }
    try {
      const payload = {
        farm: farmId,
        user_ids: selectedUsers
      }

      await blockUser(payload).unwrap()

      Toast.show({
        type: 'success',
        text1: 'User Blocked',
      })

      setSelectedUsers([])
      setVisible(false)
    } catch (error: any) {
      console.log('Error blocking users:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.data?.error || 'Failed to block users. Please try again.',
      })
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title="Block User">
      <Dialog.Content>
        <View className='relative'>
          <TextInput
            style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
            className='rounded-full pl-12 text-base text-black border'
            placeholder='Search user...'
          />
          <Search
            style={{ position: 'absolute', top: 8, left: 14 }}
            color={'#d4d4d8'}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 mt-5"
          style={{ maxHeight: 260 }}
          keyboardShouldPersistTaps="handled" // <-- fixes button press issue
        >
          {isLoading ? (
            <>
              <View className='flex flex-row items-center gap-3 mt-3'>
                <SkeletonShimmer style={{ width: 50, height: 50, borderRadius: 999 }} />
                <View className='flex flex-col'>
                  <SkeletonShimmer style={{ width: 100, height: 15, borderRadius: 4 }} />
                  <SkeletonShimmer style={{ width: 150, height: 15, borderRadius: 4, marginTop: 8 }} />
                </View>
              </View>
              <View className='flex flex-row items-center gap-3 mt-3'>
                <SkeletonShimmer style={{ width: 50, height: 50, borderRadius: 999 }} />
                <View className='flex flex-col'>
                  <SkeletonShimmer style={{ width: 100, height: 15, borderRadius: 4 }} />
                  <SkeletonShimmer style={{ width: 150, height: 15, borderRadius: 4, marginTop: 8 }} />
                </View>
              </View>
            </>
          ) : (
            members?.map((member, i) => {
              const isSelected = selectedUsers.includes(member.id)
              return (
                <Pressable
                  key={member.id}
                  onPress={() => toggleSelect(member.id)}
                  className='flex flex-row items-center gap-3 mt-3'
                  style={{ marginTop: i !== 0 ? 12 : 0 }}
                >
                  <Image
                    source={
                      member?.profile_picture
                        ? { uri: member?.profile_picture }
                        : require('@/assets/images/default-profile.png')
                    }
                    style={{ width: 50, height: 50, borderRadius: 999 }}
                    resizeMode="cover"
                  />
                  <View className="flex flex-col flex-1">
                    <Text
                      className='text-zinc-600'
                      style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13 }}
                    >
                      {member?.first_name && member?.first_name[0].toUpperCase() + member?.first_name.slice(1)}{' '}
                      {member?.last_name && member?.last_name[0].toUpperCase() + member?.last_name.slice(1)}
                    </Text>
                    <Text className='text-zinc-400' style={{ fontSize: 12, fontFamily: 'PoppinsRegular' }}>
                      {member?.email}
                    </Text>
                  </View>
                  {isSelected ? (
                    <CheckCircle color="#155183" size={20} />
                  ) : (
                    <Circle color="#9ca3af" size={20} />
                  )}
                </Pressable>
              )
            })
          )}
        </ScrollView>

        {/* ERROR MESSAGE */}
        {error.length > 0 && (
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
            className="border border-zinc-300 p-2 rounded-lg"
            style={{
              borderWidth: 1,
              borderColor: '#d4d4d8',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text className="text-zinc-500" style={{ fontFamily: 'PoppinsRegular' }}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleBlock}
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
            disabled={isLoading || isBlocking}
          >
            {isBlocking ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <UserLock color={'#ffffff'} size={15} />
            )}
            <Text className="text-white" style={{ fontFamily: 'PoppinsRegular' }}>Block</Text>
          </Pressable>
        </View>
      </Dialog.Content>
    </Dialogs>
  )
}

export default BlockUser
