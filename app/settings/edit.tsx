import {
  View, Text, ScrollView, Image,
  Pressable, TextInput, ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, Pencil, UserIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import * as ImagePicker from 'expo-image-picker'
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'
import Toast from 'react-native-toast-message'
import { useUpdateProfileMutation } from '@/store/userApi'
import { replaceImageInSupabase } from '@/utils/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ─── text field ────────────────────────────────────────────────────────────────
type FieldProps = {
  label: string
  fieldKey: string
  value: string
  onChange: (v: string) => void
  error?: string
  isFocused: string
  onFocus: () => void
  onBlur: () => void
  placeholder?: string
  keyboardType?: any
  textContentType?: any
}
const Field = ({
  label, fieldKey, value, onChange, error,
  isFocused, onFocus, onBlur, placeholder, keyboardType, textContentType,
}: FieldProps) => {
  const focused = isFocused === fieldKey
  const hasError = !!error
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{
        fontSize: 11, fontFamily: 'PoppinsMedium',
        color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 6,
      }}>
        {label}
      </Text>
      <TextInput
        style={{
          borderRadius: 10,
          borderWidth: hasError ? 1.5 : focused ? 1.5 : 0.5,
          borderColor: hasError ? '#ef444480' : focused ? '#155183' : '#e4e4e7',
          backgroundColor: '#fafafa',
          paddingHorizontal: 14, paddingVertical: 12,
          fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b',
        }}
        placeholder={placeholder}
        placeholderTextColor="#d4d4d8"
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize="none"
      />
      {hasError && (
        <Text style={{
          fontSize: 11, fontFamily: 'PoppinsRegular',
          color: '#ef4444', marginTop: 4, marginLeft: 2,
        }}>
          {error}
        </Text>
      )}
    </View>
  )
}

// ─── main screen ───────────────────────────────────────────────────────────────
const EditProfile = () => {
  const { user } = useAuthRedirect()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [isFocused, setIsFocused] = useState('')
  const [errors, setErrors]       = useState<{ [key: string]: string }>({})
  const [image, setImage]         = useState<string | null>(null)

  const [firstName, setFirstName]         = useState(user?.first_name || '')  // ← changed
  const [lastName, setLastName]           = useState(user?.last_name || '')   // ← changed
  const [mobileNumber, setMobileNumber]   = useState(
    user?.mobile_number ? user.mobile_number.replace(/^\+\d{1,3}/, '') : ''
  )
  const [countryCode, setCountryCode] = useState<CountryCode>('PH')
  const [callingCode, setCallingCode] = useState('+63')
  const [visible, setVisible]         = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '')   // ← changed
      setLastName(user.last_name || '')     // ← changed
      setMobileNumber(user.mobile_number ? user.mobile_number.replace(/^\+\d{1,3}/, '') : '')
    }
  }, [user])

  const validate = async () => {
    const e: { [key: string]: string } = {}
    if (!firstName.trim()) e.firstName = 'First name is required.'   // ← changed
    if (!lastName.trim())  e.lastName  = 'Last name is required.'    // ← changed
    if (!mobileNumber.trim()) e.mobileNumber = 'Mobile number is required.'
    if (image) {
      const ext = image.split('.').pop()?.toLowerCase()
      if (!ext || !['jpg', 'jpeg', 'png'].includes(ext))
        e.profilePicture = 'Only JPEG or PNG images are allowed.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    let imageURL = ''
    try {
      if (image) {
        const url = await replaceImageInSupabase(
          image, 'profile', user?.profile_picture || undefined, setSupabaseLoading
        )
        if (url) imageURL = url
      }
      const response = await updateProfile({
        first_name: firstName,   // ← changed
        last_name: lastName,     // ← changed
        mobile_number: callingCode + mobileNumber,
        ...(imageURL && { profile_picture: imageURL }),
      }).unwrap()

      await AsyncStorage.setItem('user', JSON.stringify({
        username: response.username,
        email: response.email || '',
        id: response.id || '',
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        birthday: response.birthday || '',
        address: response.address || '',
        is_complete: response.is_complete || false,
        profile_picture: response.profile_picture || '',
        mobile_number: response.mobile_number || '',
      }))

      Toast.show({ type: 'success', text1: 'Profile updated successfully!' })
    } catch (error: any) {
      if (error?.data?.detail) Toast.show({ type: 'error', text1: error.data.detail })
      if (error?.data) {
        const se: { [key: string]: string } = {}
        for (const key in error.data) se[key] = error.data[key][0]
        setErrors(prev => ({ ...prev, ...se }))
      }
    }
  }

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCallingCode('+' + country.callingCode[0])
    setVisible(false)
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) { alert('Permission required to access media library'); return }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, quality: 1,
    })
    if (!result.canceled) setImage(result.assets[0].uri)
  }

  const mobileFocused = isFocused === 'no'
  const mobileError   = !!errors.mobileNumber

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
          Edit Profile
        </Text>
      </View>

      {/* subtitle chip */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#E6F1FB',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <UserIcon size={13} color="#185FA5" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Update your account information
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
      >

        {/* Avatar card */}
        <View style={{
          alignItems: 'center', padding: 24, gap: 4,
          backgroundColor: '#fafafa', borderRadius: 16,
          borderWidth: 0.5, borderColor: '#f4f4f5',
          marginBottom: 16,
        }}>
          <View style={{ position: 'relative' }}>
            <View style={{
              padding: 3, borderRadius: 999,
              borderWidth: 2, borderColor: '#155183',
            }}>
              <Image
                source={
                  image ? { uri: image }
                  : user?.profile_picture ? { uri: user.profile_picture }
                  : require('@/assets/images/default-profile.png')
                }
                style={{ width: 72, height: 72, borderRadius: 999 }}
                resizeMode="cover"
              />
            </View>
            <Pressable
              onPress={pickImage}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: 13,
                backgroundColor: '#ffffff',
                borderWidth: 0.5, borderColor: '#e4e4e7',
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Pencil size={12} color="#155183" />
            </Pressable>
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa', marginTop: 8 }}>
            Tap the pencil to change photo
          </Text>
          {errors.profilePicture && (
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#ef4444' }}>
              {errors.profilePicture}
            </Text>
          )}
        </View>

        {/* fields card */}
        <View style={{
          backgroundColor: '#fafafa', borderRadius: 16,
          borderWidth: 0.5, borderColor: '#f4f4f5',
          padding: 14,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2,
          }}>
            Account Details
          </Text>

          {/* ← changed: First Name + Last Name fields */}
          <Field
            label="First Name" fieldKey="firstName"
            value={firstName} onChange={setFirstName}
            error={errors.firstName} isFocused={isFocused}
            onFocus={() => setIsFocused('firstName')} onBlur={() => setIsFocused('')}
            placeholder="Juan"
          />
          <Field
            label="Last Name" fieldKey="lastName"
            value={lastName} onChange={setLastName}
            error={errors.lastName} isFocused={isFocused}
            onFocus={() => setIsFocused('lastName')} onBlur={() => setIsFocused('')}
            placeholder="Dela Cruz"
          />

          {/* mobile number */}
          <View style={{ marginTop: 14 }}>
            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 6,
            }}>
              Mobile Number
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              borderRadius: 10,
              borderWidth: mobileError ? 1.5 : mobileFocused ? 1.5 : 0.5,
              borderColor: mobileError ? '#ef444480' : mobileFocused ? '#155183' : '#e4e4e7',
              backgroundColor: '#fafafa',
              paddingHorizontal: 12, paddingVertical: 4,
              gap: 8,
            }}>
              <Pressable
                onPress={() => setVisible(true)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <CountryPicker
                  withFilter withFlag withCallingCode withEmoji withModal
                  countryCode={countryCode}
                  visible={visible}
                  onSelect={onSelect}
                  onClose={() => setVisible(false)}
                />
                <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b' }}>
                  {callingCode}
                </Text>
              </Pressable>
              <View style={{ width: 0.5, height: 18, backgroundColor: '#e4e4e7' }} />
              <TextInput
                style={{ flex: 1, fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b', paddingVertical: 8 }}
                maxLength={10}
                onFocus={() => setIsFocused('no')}
                onBlur={() => setIsFocused('')}
                placeholder="912 345 6789"
                placeholderTextColor="#d4d4d8"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>
            {mobileError && (
              <Text style={{
                fontSize: 11, fontFamily: 'PoppinsRegular',
                color: '#ef4444', marginTop: 4, marginLeft: 2,
              }}>
                {errors.mobileNumber}
              </Text>
            )}
          </View>
        </View>

        {/* submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading || supabaseLoading}
          android_ripple={{ color: '#ffffff20', borderless: false }}
          style={{
            marginTop: 20, backgroundColor: '#155183',
            paddingVertical: 13, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
            opacity: isLoading || supabaseLoading ? 0.7 : 1,
          }}>
          {isLoading || supabaseLoading
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
                Update Profile
              </Text>
          }
        </Pressable>

      </ScrollView>
    </View>
  )
}

export default EditProfile