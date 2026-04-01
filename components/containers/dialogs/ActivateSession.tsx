import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Dialogs from './Dialog'
import { ActivityIndicator, Dialog } from 'react-native-paper'
import { AlertCircle, CheckCircle, Play } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useCreateTrayMutation } from '@/store/trayApi';

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  trayId: number
  active: boolean
};

const ActivateSession = ({ setVisible, visible, trayId, active }: DialogsProps) => {
  const [createTray, { isLoading }] = useCreateTrayMutation();

  const handleActivateSession = async () => {
    try {
      await createTray({ tray_id: trayId }).unwrap();
      Toast.show({
        type: 'success',
        text1: active ? 'Drying session finished.' : 'Drying session started.',
      });
      setVisible(false);
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({ type: 'error', text1: error.data.detail });
      }
    }
  }

  return (
    <Dialogs
      onVisible={setVisible}
      visible={visible}
      title={active ? 'Finish Drying' : 'Start Drying'}
    >
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, marginTop: 10 }}>

        {/* Notice strip */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#f4f8fc',
          borderWidth: 0.5,
          borderColor: '#d4d4d8',
          borderRadius: 8,
          padding: 10,
          marginBottom: 14,
        }}>
          <AlertCircle color={PRIMARY} size={15} />
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#52525b', flex: 1 }}>
            This action cannot be undone once confirmed.
          </Text>
        </View>

        {/* Confirm message */}
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13.5, color: '#18181b', lineHeight: 21 }}>
          Are you sure you want to{' '}
          <Text style={{ fontFamily: 'PoppinsMedium', color: PRIMARY }}>
            {active ? 'finish drying' : 'start drying'}
          </Text>
          {' '}on this tray?
          {active ? ' The session will be closed and locked.' : ' The session will begin immediately.'}
        </Text>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 20 }}>
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
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={handleActivateSession}
            disabled={isLoading}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: PRIMARY,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator size={14} color="#fff" />
              : active
                ? <CheckCircle color="#fff" size={14} />
                : <Play color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>
              {active ? 'Finish Drying' : 'Start Drying'}
            </Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default ActivateSession