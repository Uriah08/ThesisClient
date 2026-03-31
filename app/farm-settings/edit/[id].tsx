import { View, Text, ActivityIndicator, TextInput, Image, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useEditFarmMutation, useGetFarmQuery } from '@/store/farmApi'
import { ChevronLeft, ImagePlusIcon, LeafIcon } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message'
import { replaceImageInSupabase } from '@/utils/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ─── field wrapper ─────────────────────────────────────────────────────────────
type FieldProps = {
  label: string
  fieldKey: string
  isFocused: string
  error?: string
  children: React.ReactNode
}

const Field = ({ label, error, children }: FieldProps) => (
  <View style={{ marginTop: 16 }}>
    <Text style={{
      fontSize: 11, fontFamily: 'PoppinsMedium',
      color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 6,
    }}>
      {label}
    </Text>
    {children}
    {error && (
      <Text style={{
        fontSize: 11, fontFamily: 'PoppinsRegular',
        color: '#ef4444', marginTop: 4, marginLeft: 2,
      }}>
        {error}
      </Text>
    )}
  </View>
)

// ─── main screen ───────────────────────────────────────────────────────────────
const EditFarm = () => {
  const { id } = useLocalSearchParams()
  const { data, isLoading } = useGetFarmQuery(Number(id))

  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [isFocused, setIsFocused]     = useState('')
  const [image, setImage]             = useState<string | null>(null)
  const [errors, setErrors]           = useState<{ [key: string]: string }>({})
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [editFarm, { isLoading: isLoadingEdit }] = useEditFarmMutation()

  const inputStyle = (key: string) => ({
    borderRadius: 10,
    borderWidth: errors[key] ? 1.5 : isFocused === key ? 1.5 : 0.5,
    borderColor: errors[key] ? '#ef444480' : isFocused === key ? '#155183' : '#e4e4e7',
    backgroundColor: '#fafafa',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 13, fontFamily: 'PoppinsRegular',
    color: '#18181b',
  })

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      alert('Permission is required to access media library')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })
    if (!result.canceled) setImage(result.assets[0].uri)
  }

  const validate = () => {
    const e: { [key: string]: string } = {}
    if (!name.trim()) e.name = 'Farm name is required.'
    if (image) {
      const ext = image.split('.').pop()?.toLowerCase()
      if (!ext || !['jpg', 'jpeg', 'png'].includes(ext))
        e.image = 'Only JPEG or PNG images are allowed.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    let imageURL = ''
    try {
      if (image) {
        const uploaded = await replaceImageInSupabase(
          image, 'farm', data?.image_url || undefined, setSupabaseLoading
        )
        if (uploaded) imageURL = uploaded
      }
      const updatedFarm = await editFarm({
        id: data?.id, name, description,
        ...(imageURL && { image_url: imageURL }),
      }).unwrap()
      await AsyncStorage.setItem('farm', JSON.stringify({ farm: updatedFarm.farm }))
      setName(''); setDescription(''); setImage('')
      Toast.show({ type: 'success', text1: 'Farm updated successfully!' })
    } catch (error: any) {
      if (error?.data?.detail)
        Toast.show({ type: 'error', text1: error.data.detail })
      if (error?.data) {
        const serverErrors: { [key: string]: string } = {}
        for (const key in error.data) serverErrors[key] = error.data[key][0]
        setErrors(prev => ({ ...prev, ...serverErrors }))
      }
    }
  }

  if (isLoading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  const busy = isLoadingEdit || supabaseLoading

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          Edit Farm
        </Text>
      </View>

      {/* Subtitle chip */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#E1F5EE',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <LeafIcon size={13} color="#0F6E56" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Update your farm details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* Farm Name */}
        <Field label="Farm Name" fieldKey="name" isFocused={isFocused} error={errors.name}>
          <TextInput
            style={inputStyle('name')}
            placeholder={data?.name || 'Farm name'}
            placeholderTextColor="#d4d4d8"
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocused('name')}
            onBlur={() => setIsFocused('')}
          />
        </Field>

        {/* Farm Description */}
        <Field label="Farm Description" fieldKey="description" isFocused={isFocused} error={errors.description}>
          <TextInput
            style={[inputStyle('description'), { height: 90, textAlignVertical: 'top' }]}
            placeholder={data?.description || 'Describe your farm…'}
            placeholderTextColor="#d4d4d8"
            value={description}
            onChangeText={setDescription}
            onFocus={() => setIsFocused('description')}
            onBlur={() => setIsFocused('')}
            multiline
            numberOfLines={3}
          />
        </Field>

        {/* Farm Image */}
        <Field label="Farm Cover Image" fieldKey="image" isFocused={isFocused} error={errors.image}>
          <Pressable onPress={pickImage}>
            <View style={{
              borderStyle: 'dashed', borderWidth: 1.5,
              borderColor: image ? '#155183' : '#e4e4e7',
              borderRadius: 12, overflow: 'hidden',
              backgroundColor: '#fafafa',
              alignItems: 'center', justifyContent: 'center',
              minHeight: 110,
            }}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: '100%', height: 110 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ alignItems: 'center', gap: 6, paddingVertical: 28 }}>
                  <ImagePlusIcon size={22} color="#d4d4d8" />
                  <Text style={{
                    fontSize: 11, fontFamily: 'PoppinsMedium',
                    color: '#d4d4d8', letterSpacing: 0.6,
                    textTransform: 'uppercase',
                  }}>
                    Tap to upload cover image
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </Field>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={busy}
          android_ripple={{ color: '#ffffff20', borderless: false }}
          style={{
            marginTop: 28, backgroundColor: busy ? '#7bafd4' : '#155183',
            paddingVertical: 13, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
          {busy
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
                Save Changes
              </Text>
          }
        </Pressable>

      </ScrollView>
    </View>
  )
}

export default EditFarm