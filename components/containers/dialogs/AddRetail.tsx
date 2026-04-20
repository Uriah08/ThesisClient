import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { StoreIcon } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { useCreateRetailMutation } from '@/store/retailsApi'

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  farmId?: number
}

const AddRetail = ({ setVisible, visible, farmId }: DialogsProps) => {
  const [createRetail, { isLoading }] = useCreateRetailMutation();
  const [isFocused, setIsFocused] = useState('')
  const [storeName, setStoreName] = useState('')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!storeName.trim()) newErrors.storeName = 'Store name is required.'
    if (!location.trim()) newErrors.location = 'Location is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      await createRetail({ farm: Number(farmId), store_name: storeName, location, contact })
      Toast.show({ type: 'success', text1: 'Retail shop added successfully.' })
      setVisible(false)
      setStoreName('')
      setLocation('')
      setContact('')
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({ type: 'error', text1: error.data.detail })
      }
      const serverErrors: { [key: string]: string } = {}
      if (error?.data) {
        for (const key in error.data) serverErrors[key] = error.data[key][0]
        setErrors((prev) => ({ ...prev, ...serverErrors }))
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
    <Dialogs onVisible={setVisible} visible={visible} title="Add Retail Shop">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Store Name */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Store name <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={inputStyle('storeName')}
            onFocus={() => setIsFocused('storeName')}
            onBlur={() => setIsFocused('')}
            placeholder="e.g. Naic Market"
            placeholderTextColor="#c4c4c8"
            value={storeName}
            onChangeText={(t) => { setStoreName(t); setErrors((p) => ({ ...p, storeName: '' })) }}
          />
          {errors.storeName ? (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.storeName}
            </Text>
          ) : null}
        </View>

        {/* Location */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Location <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={inputStyle('location')}
            onFocus={() => setIsFocused('location')}
            onBlur={() => setIsFocused('')}
            placeholder="e.g. Brgy. Latoria Naic Cavite"
            placeholderTextColor="#c4c4c8"
            value={location}
            onChangeText={(t) => { setLocation(t); setErrors((p) => ({ ...p, location: '' })) }}
          />
          {errors.location ? (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.location}
            </Text>
          ) : null}
        </View>

        {/* Contact */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Contact{' '}
            <Text style={{ color: '#a1a1aa', fontSize: 11, fontWeight: '400' }}>(optional)</Text>
          </Text>
          <TextInput
            style={inputStyle('contact')}
            onFocus={() => setIsFocused('contact')}
            onBlur={() => setIsFocused('')}
            placeholder="e.g. +63 912 345 6789"
            placeholderTextColor="#c4c4c8"
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
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
              backgroundColor: '#fafafa',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: PRIMARY,
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" size={14} />
              : <StoreIcon color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff', marginTop: 2 }}>
              Add Shop
            </Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default AddRetail