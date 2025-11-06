import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { Pen } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useRenameSessionMutation } from '@/store/sessionApi';

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  type: 'tray' | 'session'
  defaultValue?: string
  trayId?: number
  sessionId?: number
};

const RenameClass = ({ setVisible, visible, type, defaultValue, trayId, sessionId }: DialogsProps) => {
    const [renameSession, { isLoading}] = useRenameSessionMutation();
    const [name, setName] = useState(defaultValue)
    const [isFocused, setIsFocused] = useState('')

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleRename = async () => {
        if(!validate()) return
        try {
            await renameSession({name, sessionId}).unwrap()
            setName('')
            setVisible(false)
        } catch (error: any) {
            console.log(error?.data?.detail);
                
            if (error?.data?.detail) {
            Toast.show({
                type: 'error',
                text1: error.data.detail,
            });
            }
                
            const serverErrors: { [key: string]: string } = {};
            if (error?.data) {
            for (const key in error.data) {
                serverErrors[key] = error.data[key][0];
            }
            setErrors((prev) => ({ ...prev, ...serverErrors }));
            } else {
            console.log('Unexpected error:', error);
            }  
        }
    }
    
      const validate = () => {
        const newErrors: { [key: string]: string } = {};
    
        if (!name?.trim()) {
          newErrors.name = 'Name is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

  return (
    <Dialogs onVisible={setVisible} visible={visible} title={type === 'tray' ? 'Rename Tray' : 'Rename Session'}>
      <Dialog.Content>
        <TextInput
            className={`rounded-md p-3 text-base text-black ${ 
            isFocused === 'name' ? 'border-[2px] border-black' : 'border border-zinc-300'
            }`}
            onFocus={() => setIsFocused('name')}
            onBlur={() => setIsFocused('')}
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
        />
        {errors.ID && (
            <Text className="text-error mt-1 ml-1 text-sm">{errors.ID}</Text>
        )}
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
              onPress={handleRename}
              disabled={isLoading}
              >
                {isLoading ? (
                    <ActivityIndicator size={15} color="#ffffff" />
                ) : (
                     <Pen color={'#ffffff'} size={15} />
                )}
              <Text
                  className="text-white"
                  style={{
                      fontFamily: 'PoppinsRegular',
                  }}
                  >
                  Rename
                  </Text>
              </Pressable>
          </View>
      </Dialog.Content>
    </Dialogs>
  )
}

export default RenameClass