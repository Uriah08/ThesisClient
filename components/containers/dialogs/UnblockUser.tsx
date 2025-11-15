import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { Unlock } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { useUnblockUserMutation } from '@/store/farmApi'

type DialogProps = {
    visible: boolean
    setVisible: (visible: boolean) => void
    userId?: number
    farmId?: number
}

const UnblockUser = ({ visible, setVisible, userId, farmId }: DialogProps) => {
    const [unblockUser, { isLoading: unblockLoading }] = useUnblockUserMutation();
    const handleUnblock = async () => {
        try {
            const payload = {
                farm: farmId,
                user_id: userId,
            }

            await unblockUser(payload).unwrap()

            Toast.show({
                type: 'success',
                text1: 'User Unblocked',
            })
            setVisible(false)
        } catch (error: any) {
            if (error?.data?.detail) {
            Toast.show({
                type: 'error',
                text1: error.data.detail,
            })
            }
        }
    }

  return (
    <Dialogs visible={visible} onVisible={setVisible} title='Unblock User'>
        <Dialog.Content>
            <Text style={{ fontFamily: 'PoppinsRegular', marginBottom: 10 }}>
                Are you sure you want to unblock this user?
            </Text>
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
                <Pressable onPress={() => setVisible(false)} className='border border-zinc-300 p-2 rounded-lg'
                style={{
                    borderWidth: 1,
                    borderColor: '#d4d4d8',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                }}>
                <Text className='text-zinc-500' style={{
                fontFamily: 'PoppinsRegular'
                }}>Cancel</Text>
                </Pressable>
                <Pressable
                onPress={handleUnblock}
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
                >
                {unblockLoading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                <Unlock color={'#ffffff'} size={15}/>
                )}
                <Text
                    className="text-white"
                    style={{
                    fontFamily: 'PoppinsRegular',
                    }}
                >
                    Unblock
                </Text>
            </Pressable>
            </View>
        </Dialog.Content>
    </Dialogs>
  )
}

export default UnblockUser