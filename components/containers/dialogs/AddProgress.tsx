import { View, Text, Pressable, TextInput, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { ImagePlusIcon, Plus, ScanLine } from 'lucide-react-native'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import { uploadImageToSupabase } from '@/utils/lib/supabase'
import { useCreateTrayProgressMutation } from '@/store/trayApi'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  setFocus: (focus: string) => void
  focus: string
  trayId?: number
  activetrayId?: number
}

const AddProgress = ({ setVisible, visible, setFocus, focus, trayId, activetrayId }: DialogsProps) => {
  useEffect(() => {
    const store = async () => {
      await AsyncStorage.setItem('active_tray_id', activetrayId?.toString() || '')
    }
    store()
  }, [activetrayId])

  const [isFocused, setIsFocused]                   = useState('')
  const [title, setTitle]                           = useState('Tray Timeline')
  const [description, setDescription]               = useState('')
  const [image, setImage]                           = useState<string | null>(null)
  const [supabaseLoading, setSupabaseLoading]       = useState(false)
  const [errors, setErrors]                         = useState<{ [key: string]: string }>({})
  const [createTrayProgress, { isLoading }]         = useCreateTrayProgressMutation()

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

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) { alert('Permission is required to access media library'); return }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, quality: 1,
    })
    if (!result.canceled) setImage(result.assets[0].uri)
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = 'Progress title is required.'
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
        const uploaded = await uploadImageToSupabase(image, 'tray', setSupabaseLoading)
        if (uploaded) imageURL = uploaded
      }
      await createTrayProgress({ title, description, image: imageURL, tray: activetrayId }).unwrap()
      setVisible(false)
      setIsFocused('')
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
    <Dialogs onVisible={setVisible} visible={visible} title="Add Timeline" subtitle="Tray progress">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {focus === 'custom' ? (
          <>
            {/* Title */}
            <View style={{ gap: 5 }}>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
                Progress Title <Text style={{ color: '#ef4444' }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle('title')}
                onFocus={() => setIsFocused('title')}
                onBlur={() => setIsFocused('')}
                placeholder="e.g. Day 3 Check"
                placeholderTextColor="#c4c4c8"
                value={title}
                onChangeText={(t) => { setTitle(t); setErrors((p) => ({ ...p, title: '' })) }}
              />
              {errors.title && (
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
                  {errors.title}
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
                Image{' '}
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
                        Tap to upload an image
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

            {/* Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <Pressable
                onPress={() => { setVisible(false); setFocus('') }}
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
                  ? <ActivityIndicator size={14} color="#fff" />
                  : <Plus color="#fff" size={14} />
                }
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>Add</Text>
              </Pressable>
            </View>
          </>
        ) : (
          /* Action picker */
          <View style={{ gap: 10 }}>
            <Pressable
              onPress={() => setFocus('custom')}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: '#bfdbfe',
                backgroundColor: '#eff6ff',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: PRIMARY,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus color="#fff" size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#1e3a5f' }}>
                  Add Custom Timeline
                </Text>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#6b8aaa', marginTop: 1 }}>
                  Manually enter progress details
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                if (!trayId) return
                setVisible(false)
                router.push({ pathname: '/tray/[id]/scan', params: { id: trayId.toString() } })
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: '#bfdbfe',
                backgroundColor: '#eff6ff',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: PRIMARY,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <ScanLine color="#fff" size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#1e3a5f' }}>
                  Camera Scan
                </Text>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#6b8aaa', marginTop: 1 }}>
                  Scan tray using your camera
                </Text>
              </View>
            </Pressable>
          </View>
        )}

      </Dialog.Content>
    </Dialogs>
  )
}

export default AddProgress