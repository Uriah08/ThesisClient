import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { useCreateTrayProgressMutation } from '@/store/trayApi'
import { uploadImageToSupabase } from '@/utils/lib/supabase'
import Toast from 'react-native-toast-message'
import { Plus } from 'lucide-react-native'
import { router } from 'expo-router'
import * as FileSystem from 'expo-file-system'

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  trayId: number
  image: string | undefined
  defaultDescription?: string
  rejects?: number
  detected?: number
  activetrayId: number
  dry?: number
  undried?: number
}

const AddCameraProgress = ({
  setVisible, visible, trayId, image,
  defaultDescription, rejects, detected, activetrayId, dry, undried,
}: DialogsProps) => {
  const [isFocused, setIsFocused]             = useState('')
  const [title, setTitle]                     = useState('Tray Status')
  const [description, setDescription]         = useState(defaultDescription || '')
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [errors, setErrors]                   = useState<{ [key: string]: string }>({})
  const [createTrayProgress, { isLoading }]   = useCreateTrayProgressMutation()

  const isBusy = isLoading || supabaseLoading

  useEffect(() => {
    if (defaultDescription) setDescription(defaultDescription)
  }, [defaultDescription])

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
    if (!title.trim()) newErrors.title = 'Progress title is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    let imageURL = ''
    try {
      if (image) {
        setSupabaseLoading(true)
        let localPath = image

        if (image.startsWith('http')) {
          const date = new Date()
          const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`
          const fileUri = `${FileSystem.cacheDirectory}_${timestamp}temp_image.jpg`
          const downloaded = await FileSystem.downloadAsync(image, fileUri)
          localPath = downloaded.uri
        }

        const uploaded = await uploadImageToSupabase(localPath, 'tray', setSupabaseLoading)
        if (uploaded) imageURL = uploaded
        setSupabaseLoading(false)
      }

      await createTrayProgress({ title, description, image: imageURL, tray: activetrayId, rejects, detected, dry, undried }).unwrap()
      setVisible(false)
      setIsFocused('')
      router.push({ pathname: '/tray/[id]/timeline', params: { id: trayId.toString() } })
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
    <Dialogs onVisible={setVisible} visible={visible} title="Add Progress" subtitle="Camera scan">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Title */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Progress Title <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={inputStyle('title')}
            onFocus={() => setIsFocused('title')}
            onBlur={() => setIsFocused('')}
            placeholder="e.g. Tray Status"
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
            style={[inputStyle('description'), { minHeight: 90, textAlignVertical: 'top' }]}
            onFocus={() => setIsFocused('description')}
            onBlur={() => setIsFocused('')}
            placeholder="Add notes or observations…"
            placeholderTextColor="#c4c4c8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
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
              backgroundColor:  PRIMARY,
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

      </Dialog.Content>
    </Dialogs>
  )
}

export default AddCameraProgress