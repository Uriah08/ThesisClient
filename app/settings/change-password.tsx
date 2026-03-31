import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ChevronLeft, LockIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import { useChangePasswordMutation } from '@/store/userApi'
import Toast from 'react-native-toast-message'

// ─── password field ────────────────────────────────────────────────────────────
type PasswordFieldProps = {
  label: string
  fieldKey: string
  value: string
  onChange: (v: string) => void
  error?: string
  isFocused: string
  onFocus: () => void
  onBlur: () => void
}
const PasswordField = ({
  label, fieldKey, value, onChange,
  error, isFocused, onFocus, onBlur,
}: PasswordFieldProps) => {
  const focused = isFocused === fieldKey
  const hasError = !!error

  return (
    <View style={{ marginTop: 16 }}>
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
          fontSize: 13, fontFamily: 'PoppinsRegular',
          color: '#18181b',
        }}
        placeholder="••••••••"
        placeholderTextColor="#d4d4d8"
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        secureTextEntry
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
const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [isFocused, setIsFocused]         = useState('')
  const [errors, setErrors]               = useState<{ [key: string]: string }>({})
  const [oldPassword, setOldPassword]     = useState('')
  const [newPassword, setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validate = () => {
    const e: { [key: string]: string } = {}
    if (!oldPassword.trim())        e.old     = 'Old password is required.'
    else if (oldPassword.length < 8) e.old    = 'Must be at least 8 characters.'
    if (!newPassword.trim())         e.new    = 'New password is required.'
    else if (newPassword.length < 8) e.new    = 'Must be at least 8 characters.'
    if (!confirmPassword.trim())     e.confirm = 'Please confirm your new password.'
    else if (confirmPassword !== newPassword) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap()
      Toast.show({ type: 'success', text1: 'Password changed successfully!' })
      router.push('/(tabs)/settings')
      setOldPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({ type: 'error', text1: error.data.detail })
      }
      if (error?.data) {
        const serverErrors: { [key: string]: string } = {}
        for (const key in error.data) serverErrors[key] = error.data[key][0]
        setErrors(prev => ({ ...prev, ...serverErrors }))
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          Change Password
        </Text>
      </View>

      {/* subtitle chip */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#EEEDFE',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <LockIcon size={13} color="#534AB7" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Keep your account secure
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, flex: 1 }}>

        {/* hint card */}
        <View style={{
          padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
          marginBottom: 8,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 4,
          }}>
            Requirements
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#71717a', lineHeight: 20 }}>
            Your new password must be at least 8 characters long and different from your current password.
          </Text>
        </View>

        {/* fields */}
        <PasswordField
          label="Old Password" fieldKey="old"
          value={oldPassword} onChange={setOldPassword}
          error={errors.old} isFocused={isFocused}
          onFocus={() => setIsFocused('old')} onBlur={() => setIsFocused('')}
        />
        <PasswordField
          label="New Password" fieldKey="new"
          value={newPassword} onChange={setNewPassword}
          error={errors.new} isFocused={isFocused}
          onFocus={() => setIsFocused('new')} onBlur={() => setIsFocused('')}
        />
        <PasswordField
          label="Confirm New Password" fieldKey="confirm"
          value={confirmPassword} onChange={setConfirmPassword}
          error={errors.confirm} isFocused={isFocused}
          onFocus={() => setIsFocused('confirm')} onBlur={() => setIsFocused('')}
        />

        {/* submit */}
        <Pressable
          onPress={handleSubmit}
          android_ripple={{ color: '#ffffff20', borderless: false }}
          style={{
            marginTop: 28, backgroundColor: '#155183',
            paddingVertical: 13, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
          {isLoading
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
                Change Password
              </Text>
          }
        </Pressable>

      </View>
    </View>
  )
}

export default ChangePassword