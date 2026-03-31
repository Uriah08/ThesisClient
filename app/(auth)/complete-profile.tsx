import {
  View, Text, ActivityIndicator, BackHandler,
  Image, Pressable, TextInput, Platform, ScrollView
} from 'react-native'
import { useState, useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { useCompleteProfileMutation } from '@/store/userApi'
import { Pencil, Calendar } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import { Checkbox } from 'expo-checkbox'
import Toast from 'react-native-toast-message'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { uploadImageToSupabase } from '@/utils/lib/supabase'
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'

// ─── field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <View style={{ marginTop: 16, width: '100%' }}>
    <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 6 }}>
      {label}
    </Text>
    {children}
    {error && (
      <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#ef4444', marginTop: 4, marginLeft: 2 }}>
        {error}
      </Text>
    )}
  </View>
)

// ─── main screen ───────────────────────────────────────────────────────────────
const CompleteProfile = () => {
  const { checking, user } = useAuthRedirect()

  const [isFocused, setIsFocused]   = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [isChecked, setChecked]     = useState(false)
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [completeProfile, { isLoading }] = useCompleteProfileMutation()

  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [address]                   = useState('Labac')
  const [date, setDate]             = useState<Date | null>(null)
  const [image, setImage]           = useState<string | null>(null)
  const [errors, setErrors]         = useState<{ [key: string]: string }>({})

  const [countryCode, setCountryCode] = useState<CountryCode>('PH')
  const [callingCode, setCallingCode] = useState('+63')
  const [pickerVisible, setPickerVisible] = useState(false)

  const formattedDate = date ? new Date(date).toISOString().split('T')[0] : ''

  const inputStyle = (key: string) => ({
    borderRadius: 10,
    borderWidth: errors[key] ? 1.5 : isFocused === key ? 1.5 : 0.5,
    borderColor: errors[key] ? '#ef444480' : isFocused === key ? '#155183' : '#e4e4e7',
    backgroundColor: '#fafafa',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 13, fontFamily: 'PoppinsRegular',
    color: '#18181b',
  })

  useFocusEffect(
    useCallback(() => {
      const handler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => handler.remove()
    }, [])
  )

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) { alert('Permission is required'); return }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 1 })
    if (!result.canceled) setImage(result.assets[0].uri)
  }

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false)
    if (selectedDate) setDate(selectedDate)
  }

  const validate = () => {
    const e: { [key: string]: string } = {}
    const nameRegex = /^[A-Za-z\s'-]+$/
    if (!firstName.trim())            e.firstName = 'First name is required.'
    else if (!nameRegex.test(firstName)) e.firstName = 'No numbers or special characters.'
    if (!lastName.trim())             e.lastName  = 'Last name is required.'
    else if (!nameRegex.test(lastName))  e.lastName  = 'No numbers or special characters.'
    if (!mobileNumber.trim())         e.mobileNumber = 'Mobile number is required.'
    if (!date)                        e.birthday  = 'Birthday is required.'
    if (!address.trim())              e.address   = 'Address is required.'
    if (!isChecked)                   e.agreement = 'You must agree to the terms.'
    if (image) {
      const ext = image.split('.').pop()?.toLowerCase()
      if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) e.profilePicture = 'Only JPEG or PNG allowed.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleComplete = async () => {
    if (!validate()) return
    let imageURL = ''
    try {
      if (image) {
        const uploaded = await uploadImageToSupabase(image, 'profile', setSupabaseLoading)
        if (uploaded) imageURL = uploaded
      }
      const response = await completeProfile({
        first_name: firstName, last_name: lastName,
        birthday: formattedDate, mobile_number: callingCode + mobileNumber,
        address, ...(imageURL && { profile_picture: imageURL }),
      }).unwrap()
      Toast.show({ type: 'success', text1: 'Profile Updated Successfully!' })
      await AsyncStorage.setItem('user', JSON.stringify({
        username: response.username, email: response.email || '',
        id: response.id || '', first_name: response.first_name || '',
        last_name: response.last_name || '', birthday: response.birthday || '',
        address: response.address || '', is_complete: response.is_complete || false,
        profile_picture: response.profile_picture || '', mobile_number: response.mobile_number || '',
      }))
      router.replace('/(tabs)/home')
    } catch (error: any) {
      if (error?.data?.detail) Toast.show({ type: 'error', text1: error.data.detail })
      if (error?.data) {
        const s: { [key: string]: string } = {}
        for (const k in error.data) s[k] = error.data[k][0]
        setErrors(prev => ({ ...prev, ...s }))
      }
    } finally {
      setSupabaseLoading(false)
    }
  }

  if (checking) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  const busy = isLoading || supabaseLoading

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Heading */}
        <Text style={{ marginTop: 80, fontSize: 28, fontFamily: 'PoppinsBold', color: '#18181b' }}>
          Hello, {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : ''}!
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'PoppinsRegular', color: '#a1a1aa', marginTop: 4, marginBottom: 32 }}>
          Complete your profile to proceed
        </Text>

        {/* Avatar picker */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <View style={{
            borderWidth: 2, borderColor: '#155183', borderRadius: 999,
            padding: 3, position: 'relative',
          }}>
            <Image
              source={image ? { uri: image } : require('@/assets/images/default-profile.png')}
              style={{ width: 80, height: 80, borderRadius: 999 }}
              resizeMode="cover"
            />
            <Pressable
              onPress={pickImage}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: 999,
                backgroundColor: '#E6F1FB',
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Pencil size={13} color="#155183" />
            </Pressable>
          </View>
          {errors.profilePicture && (
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#ef4444', marginTop: 4 }}>
              {errors.profilePicture}
            </Text>
          )}
        </View>

        {/* First Name */}
        <Field label="First Name" error={errors.firstName}>
          <TextInput
            style={[inputStyle('firstName'), { width: '100%' as const }]}
            placeholder="Enter your first name"
            placeholderTextColor="#d4d4d8"
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setIsFocused('firstName')}
            onBlur={() => setIsFocused('')}
          />
        </Field>

        {/* Last Name */}
        <Field label="Last Name" error={errors.lastName}>
          <TextInput
            style={[inputStyle('lastName'), { width: '100%' as const }]}
            placeholder="Enter your last name"
            placeholderTextColor="#d4d4d8"
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setIsFocused('lastName')}
            onBlur={() => setIsFocused('')}
          />
        </Field>

        {/* Birthday */}
        <Field label="Birthday" error={errors.birthday}>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              borderRadius: 10, borderWidth: 0.5, borderColor: '#e4e4e7',
              backgroundColor: '#fafafa', paddingHorizontal: 14, paddingVertical: 12,
            }}>
            <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: date ? '#18181b' : '#d4d4d8' }}>
              {date ? dayjs(date).format('MMM D, YYYY') : 'Select your birthday'}
            </Text>
            <Calendar size={14} color="#a1a1aa" />
          </Pressable>
        </Field>

        {showPicker && (
          <DateTimePicker
            value={date || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={handleChange}
          />
        )}

        {/* Mobile Number */}
        <Field label="Mobile Number" error={errors.mobileNumber}>
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            borderRadius: 10, borderWidth: 0.5, borderColor: isFocused === 'mobile' ? '#155183' : '#e4e4e7',
            backgroundColor: '#fafafa', paddingHorizontal: 14, paddingVertical: 4,
          }}>
            <Pressable
              onPress={() => setPickerVisible(true)}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CountryPicker
                withFilter withFlag withCallingCode withEmoji withModal
                countryCode={countryCode}
                visible={pickerVisible}
                onSelect={(country: Country) => {
                  setCountryCode(country.cca2)
                  setCallingCode('+' + country.callingCode[0])
                  setPickerVisible(false)
                }}
                onClose={() => setPickerVisible(false)}
              />
              <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b' }}>{callingCode}</Text>
            </Pressable>
            <View style={{ width: 0.5, height: 20, backgroundColor: '#e4e4e7', marginHorizontal: 10 }} />
            <TextInput
              style={{ flex: 1, fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b', paddingVertical: 8 }}
              placeholder="912 345 6789"
              placeholderTextColor="#d4d4d8"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              onFocus={() => setIsFocused('mobile')}
              onBlur={() => setIsFocused('')}
            />
          </View>
        </Field>

        {/* Barangay (read-only) */}
        <Field label="Barangay" error={errors.address}>
          <TextInput
            style={[inputStyle('address'), { width: '100%' as const, color: '#a1a1aa' }]}
            editable={false}
            value={address}
          />
        </Field>

        {/* Terms */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24 }}>
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#155183' : undefined}
            style={{ borderColor: '#155183' }}
          />
          <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#71717a', flex: 1 }}>
            I agree to the{' '}
            <Text
              onPress={() => router.push('/(auth)/terms')}
              style={{ color: '#155183', fontFamily: 'PoppinsMedium' }}>
              Terms of Service
            </Text>
          </Text>
        </View>
        {errors.agreement && (
          <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#ef4444', marginTop: 4, marginLeft: 2 }}>
            {errors.agreement}
          </Text>
        )}

        {/* Submit */}
        <Pressable
          onPress={handleComplete}
          disabled={busy}
          android_ripple={{ color: '#ffffff20', borderless: false }}
          style={{
            marginTop: 24,
            backgroundColor: busy ? '#7bafd4' : !isChecked ? '#d4d4d8' : '#155183',
            paddingVertical: 13, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
          {busy
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>Get Started</Text>
          }
        </Pressable>

      </ScrollView>
    </View>
  )
}

export default CompleteProfile