import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { MapPlusIcon } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { useJoinFarmMutation } from '@/store/farmApi'

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
}

const JoinFarm = ({ setVisible, visible }: DialogsProps) => {
  const [joinFarm, { isLoading }] = useJoinFarmMutation()
  const [isFocused, setIsFocused] = useState('')
  const [ID, setID]               = useState('')
  const [password, setPassword]   = useState('')
  const [errors, setErrors]       = useState<{ [key: string]: string }>({})

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

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!ID.trim())       newErrors.ID       = 'Farm ID is required.'
    if (!password.trim()) newErrors.password = 'Password is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      const response = await joinFarm({ farm_id: Number(ID), password }).unwrap()
      Toast.show({ type: 'success', text1: response.detail })
      setVisible(false)
      setID(''); setPassword('')
    } catch (error: any) {
      if (error?.data?.detail) Toast.show({ type: 'error', text1: error.data.detail })
      if (error?.data) {
        const serverErrors: { [key: string]: string } = {}
        for (const key in error.data) serverErrors[key] = error.data[key][0]
        setErrors((prev) => ({ ...prev, ...serverErrors }))
      }
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title="Join Farm" subtitle="Enter credentials">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Farm ID */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Farm ID <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={inputStyle('ID')}
            onFocus={() => setIsFocused('ID')}
            onBlur={() => setIsFocused('')}
            placeholder="Enter farm ID"
            placeholderTextColor="#c4c4c8"
            value={ID}
            onChangeText={(t) => { setID(t); setErrors((p) => ({ ...p, ID: '' })) }}
            keyboardType="numeric"
            inputMode="numeric"
          />
          {errors.ID && (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.ID}
            </Text>
          )}
        </View>

        {/* Password */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Password <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={inputStyle('password')}
            onFocus={() => setIsFocused('password')}
            onBlur={() => setIsFocused('')}
            placeholder="Enter password"
            placeholderTextColor="#c4c4c8"
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((p) => ({ ...p, password: '' })) }}
            secureTextEntry
          />
          {errors.password && (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.password}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
              borderWidth: 0.5, borderColor: '#d4d4d8',
              backgroundColor:'#fafafa',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={{
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
              backgroundColor: PRIMARY,
              flexDirection: 'row', alignItems: 'center', gap: 6,
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" size={14} />
              : <MapPlusIcon color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>Join Farm</Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default JoinFarm