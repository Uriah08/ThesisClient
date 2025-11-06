import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog';
import { Dialog } from 'react-native-paper';
import { PanelsLeftRightIcon } from 'lucide-react-native';
import { useCreateFarmTrayMutation } from '@/store/farmTrayApi';
import Toast from 'react-native-toast-message';

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  farmId: number
};

const CreateTray = ({setVisible, visible, farmId}: DialogsProps) => {
  const [createFarmTray, { isLoading }] = useCreateFarmTrayMutation()
  const [isFocused, setIsFocused] = useState('');
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if(!validate()) return
    try {
      const response = await createFarmTray({
        name, description, farm: farmId
      }).unwrap()
      Toast.show({
          type: 'success',
          text1: response.detail,
        });
      setVisible(false)
      setName('')
      setDescription('')
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
  
  return (
    <Dialogs onVisible={setVisible} visible={visible} title='Create Tray'>
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
        {errors.name && (
          <Text className="text-error mt-1 ml-1 text-sm">{errors.name}</Text>
        )}
        <TextInput
          className={`rounded-md p-3 mt-5 pr-10 text-base text-black ${
            isFocused === 'description'
              ? 'border-[2px] border-black'
              : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('description')}
          onBlur={() => setIsFocused('')}
          placeholder="Description"
          placeholderTextColor="#9ca3af"
          value={description}
          onChangeText={setDescription}
          secureTextEntry
        />
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
              onPress={handleSubmit}
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
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <PanelsLeftRightIcon color={'#ffffff'} size={15}/>
                )}
              <Text
                  className="text-white"
                  style={{
                    fontFamily: 'PoppinsRegular',
                  }}
                >
                  Create
                </Text>
            </Pressable>
            </View>
      </Dialog.Content>
    </Dialogs>
  )
}

export default CreateTray