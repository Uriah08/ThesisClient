import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog';
import { Dialog } from 'react-native-paper';
import { PanelsLeftRightIcon } from 'lucide-react-native';
import { useCreateFarmTrayMutation } from '@/store/farmTrayApi';
import Toast from 'react-native-toast-message';

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  farmId: number
};

const CreateTray = ({ setVisible, visible, farmId }: DialogsProps) => {
  const [createFarmTray, { isLoading }] = useCreateFarmTrayMutation()
  const [isFocused, setIsFocused] = useState('');
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      const response = await createFarmTray({ name, description, farm: farmId }).unwrap()
      Toast.show({ type: 'success', text1: response.detail });
      setVisible(false)
      setName('')
      setDescription('')
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({ type: 'error', text1: error.data.detail });
      }
      const serverErrors: { [key: string]: string } = {};
      if (error?.data) {
        for (const key in error.data) serverErrors[key] = error.data[key][0];
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
    }
  }

  const inputStyle = (field: string) => ({
    borderWidth: isFocused === field ? 1 : 0.5,
    borderColor: errors[field] ? '#ef4444' : isFocused === field ? PRIMARY : '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    color: '#18181b',
    backgroundColor: isFocused === field ? '#f4f8fc' : '#fafafa',
    fontFamily: 'PoppinsRegular',
  })

  return (
    <Dialogs onVisible={setVisible} visible={visible} title='Create Tray'>
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Tray Name */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Tray name <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={inputStyle('name')}
            onFocus={() => setIsFocused('name')}
            onBlur={() => setIsFocused('')}
            placeholder="e.g. Tray A"
            placeholderTextColor="#c4c4c8"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((p) => ({ ...p, name: '' })) }}
          />
          {errors.name ? (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.name}
            </Text>
          ) : null}
        </View>

        {/* Description */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Description{' '}
            <Text style={{ color: '#a1a1aa', fontSize: 11, fontWeight: '400' }}>(optional)</Text>
          </Text>
          <TextInput
            style={[inputStyle('description'), { minHeight: 76, textAlignVertical: 'top' }]}
            onFocus={() => setIsFocused('description')}
            onBlur={() => setIsFocused('')}
            placeholder="Add a short description…"
            placeholderTextColor="#c4c4c8"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: '#d4d4d8',
              backgroundColor:'#fafafa',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            className="bg-primary flex-row "
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" size={14} />
              : <PanelsLeftRightIcon color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff', marginTop: 2 }}>
              Create Tray
            </Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default CreateTray