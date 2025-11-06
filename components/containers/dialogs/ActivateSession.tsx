import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Dialogs from './Dialog'
import { ActivityIndicator, Dialog } from 'react-native-paper'
import { AlertCircle, CheckCircle, Play } from 'lucide-react-native';
import { useActivateSessionMutation } from '@/store/sessionApi';
import Toast from 'react-native-toast-message';

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  sessionId: number;
  sessionStatus: string;
};

const ActivateSession = ({ setVisible, visible, sessionId, sessionStatus }: DialogsProps) => {
    const [activateSession, { isLoading }] = useActivateSessionMutation();

    const handleActivateSession = async () => {
        try {
            await activateSession(sessionId).unwrap();
            Toast.show({
                type: 'success',
                text1: 'Session Activated Successfully',
            });
            setVisible(false);
        } catch (error: any) {
            console.log(error);
                  
            if (error?.data?.detail) {
            Toast.show({
                type: 'error',
                text1: error.data.detail,
            });
            }
        }
    }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title={sessionStatus === 'inactive' ? 'Activate Session' : 'Finish Session'}>
        <Dialog.Content>
            <View className='flex-row gap-3 justify-center items-center bg-zinc-200 p-2 rounded-full' style={{ marginBottom: 15 }}>
                <AlertCircle color={'#155183'}/>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>This process cannot be undone.</Text>
            </View>
            <Text style={{ fontFamily: 'PoppinsRegular' }}>
                Are you sure you want to {sessionStatus === 'inactive' ? 'activate' : 'finish'} this session?
                {sessionStatus === 'active' ? ' All your trays will be harvested.' : ''}
            </Text>

            <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
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
                onPress={handleActivateSession}
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
                disabled={isLoading}
                >
                {isLoading ? (
                    <ActivityIndicator size={15} color="#ffffff" />
                ) : sessionStatus === 'inactive' ? (
                    <Play color={'#ffffff'} size={15} />
                ) : (
                    <CheckCircle color={'#ffffff'} size={15} />
                )}
                <Text
                    className="text-white"
                    style={{
                        fontFamily: 'PoppinsRegular',
                    }}
                    >
                    {sessionStatus === 'inactive' ? 'Activate': 'Finish'}
                    </Text>
                </Pressable>
            </View>
        </Dialog.Content>
    </Dialogs>
  )
}

export default ActivateSession