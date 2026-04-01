import { View, Text, TextInput, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { Eye, EyeClosed, ImagePlusIcon, MapPlusIcon } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import { useCreateFarmMutation } from '@/store/farmApi'
import { uploadImageToSupabase } from '@/utils/lib/supabase'
import Toast from 'react-native-toast-message'
import { Farm } from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  onSelect: (farm: Farm) => void
}

const CreateFarm = ({ setVisible, visible, onSelect }: DialogsProps) => {
  const [isFocused, setIsFocused]                     = useState('')
  const [createFarm, { isLoading }]                   = useCreateFarmMutation()
  const [showPassword, setShowPassword]               = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName]                               = useState('')
  const [description, setDescription]                 = useState('')
  const [password, setPassword]                       = useState('')
  const [confirmPassword, setConfirmPassword]         = useState('')
  const [image, setImage]                             = useState<string | null>(null)
  const [supabaseLoading, setSupabaseLoading]         = useState(false)
  const [errors, setErrors]                           = useState<{ [key: string]: string }>({})

  const isBusy = isLoading || supabaseLoading

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

  const clearError = (field: string) =>
    setErrors((p) => ({ ...p, [field]: '' }))

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      alert('Permission is required to access media library')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 2],
      quality: 1,
    })
    if (!result.canceled) setImage(result.assets[0].uri)
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!name.trim()) newErrors.name = 'Area name is required.'
    if (!password) newErrors.password = 'Password is required.'
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.'
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password.'
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match.'
    if (image) {
      const ext = image.split('.').pop()?.toLowerCase()
      if (!ext || !['jpg', 'jpeg', 'png'].includes(ext))
        newErrors.image = 'Only JPEG or PNG images are allowed.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    let imageURL = ''
    try {
      if (image) {
        const uploaded = await uploadImageToSupabase(image, 'farm', setSupabaseLoading)
        if (uploaded) imageURL = uploaded
      }
      const newFarm = await createFarm({
        name,
        description,
        password,
        ...(imageURL && { image_url: imageURL }),
      }).unwrap()
      await AsyncStorage.setItem('farm', JSON.stringify({ farm: newFarm.farm }))
      const stored = await AsyncStorage.getItem('farm')
      if (stored) onSelect(JSON.parse(stored).farm)
      setName(''); setDescription(''); setImage(null)
      setPassword(''); setConfirmPassword('')
      setVisible(false)
    } catch (error: any) {
      if (error?.data?.detail) Toast.show({ type: 'error', text1: error.data.detail })
      if (error?.data) {
        const serverErrors: { [key: string]: string } = {}
        for (const key in error.data) serverErrors[key] = error.data[key][0]
        setErrors((prev) => ({ ...prev, ...serverErrors }))
      }
    } finally {
      setSupabaseLoading(false)
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title="Create Drying Area" subtitle="New area">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Area Name */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Area Name <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={inputStyle('name')}
            onFocus={() => setIsFocused('name')}
            onBlur={() => setIsFocused('')}
            placeholder="e.g. North Field"
            placeholderTextColor="#c4c4c8"
            value={name}
            onChangeText={(t) => { setName(t); clearError('name') }}
          />
          {errors.name && (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.name}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Description{' '}
            <Text style={{ color: '#a1a1aa', fontSize: 11, fontWeight: '400' }}>(optional)</Text>
          </Text>
          <TextInput
            style={inputStyle('description')}
            onFocus={() => setIsFocused('description')}
            onBlur={() => setIsFocused('')}
            placeholder="Add a short description…"
            placeholderTextColor="#c4c4c8"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Image picker */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Cover Image{' '}
            <Text style={{ color: '#a1a1aa', fontSize: 11, fontWeight: '400' }}>(optional)</Text>
          </Text>
          <Pressable onPress={pickImage}>
            <View style={{
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: errors.image ? '#ef4444' : '#d4d4d8',
              borderRadius: 8,
              overflow: 'hidden',
              height: 90,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fafafa',
            }}>
              {image ? (
                <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <ImagePlusIcon color="#c4c4c8" size={20} />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#c4c4c8' }}>
                    Tap to upload a cover image
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
          {errors.image && (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.image}
            </Text>
          )}
        </View>

        {/* Private section divider */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#18181b' }}>
            Private Section
          </Text>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa', lineHeight: 16 }}>
            Protects your area from unauthorized access.
          </Text>
          <View style={{ height: 0.5, backgroundColor: '#e4e4e7', marginTop: 4 }} />
        </View>

        {/* Password */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Password <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <View>
            <TextInput
              style={{ ...inputStyle('password'), paddingRight: 40 }}
              secureTextEntry={!showPassword}
              onFocus={() => setIsFocused('password')}
              onBlur={() => setIsFocused('')}
              placeholder="Password"
              placeholderTextColor="#c4c4c8"
              value={password}
              onChangeText={(t) => { setPassword(t); clearError('password') }}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: 10 }}
            >
              {showPassword ? <Eye size={16} color="#a1a1aa" /> : <EyeClosed size={16} color="#a1a1aa" />}
            </Pressable>
          </View>
          {errors.password && (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.password}
            </Text>
          )}
        </View>

        {/* Confirm Password */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Confirm Password <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <View>
            <TextInput
              style={{ ...inputStyle('confirmPassword'), paddingRight: 40 }}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setIsFocused('confirmPassword')}
              onBlur={() => setIsFocused('')}
              placeholder="Confirm Password"
              placeholderTextColor="#c4c4c8"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword') }}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: 12, top: 10 }}
            >
              {showConfirmPassword ? <Eye size={16} color="#a1a1aa" /> : <EyeClosed size={16} color="#a1a1aa" />}
            </Pressable>
          </View>
          {errors.confirmPassword && (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.confirmPassword}
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
              backgroundColor: '#fafafa',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isBusy}
            style={{
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
              backgroundColor: PRIMARY,
              flexDirection: 'row', alignItems: 'center', gap: 6,
              opacity: isBusy ? 0.75 : 1,
            }}
          >
            {isBusy
              ? <ActivityIndicator color="#fff" size={14} />
              : <MapPlusIcon color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>Create Area</Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default CreateFarm