import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { useRegisterMutation } from '@/store/authApi'
import Toast from 'react-native-toast-message'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import { ChevronLeft } from 'lucide-react-native'

// ─── must be outside component — defining inside causes remount on every keystroke ──
const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <View style={{ marginTop: 16 }}>
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

const inputStyle = (focused: boolean, hasError: boolean) => ({
  borderRadius: 10,
  borderWidth: hasError ? 1.5 : focused ? 1.5 : 0.5,
  borderColor: hasError ? '#ef444480' : focused ? '#155183' : '#e4e4e7',
  backgroundColor: '#fafafa',
  paddingHorizontal: 14, paddingVertical: 12,
  fontSize: 13, fontFamily: 'PoppinsRegular',
  color: '#18181b',
})

// ─── main screen ───────────────────────────────────────────────────────────────
const Register = () => {
  const { checking }  = useAuthRedirect()
  const [isFocused, setIsFocused]             = useState('')
  const [username, setUsername]               = useState('')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors]                   = useState<{ [key: string]: string }>({})
  const [register, { isLoading }]             = useRegisterMutation()

  const validate = async () => {
    const e: { [key: string]: string } = {}
    if (!username.trim())  e.username = 'Username is required.'
    if (!email.trim())     e.email    = 'Email is required.'
    if (!password)         e.password = 'Password is required.'
    else if (password.length < 8) e.password = 'Must be at least 8 characters.'
    if (!confirmPassword)  e.confirmPassword = 'Confirm your password.'
    else if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleRegister = async () => {
    if (!await validate()) return
    try {
      await register({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password, confirm_password: confirmPassword,
      }).unwrap()
      Toast.show({ type: 'success', text1: 'User Registered Successfully!' })
      setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('')
      router.push('/(auth)/login')
    } catch (error: any) {
      if (error?.data) {
        const s: { [key: string]: string } = {}
        for (const k in error.data) s[k] = error.data[k][0]
        setErrors(prev => ({ ...prev, ...s }))
      }
    }
  }

  if (checking) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ChevronLeft onPress={() => router.push('/')} style={{ marginTop: 48, marginLeft: 24 }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ marginTop: 20, fontSize: 28, fontFamily: 'PoppinsBold', color: '#18181b' }}>
          Create account.
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'PoppinsRegular', color: '#a1a1aa', marginTop: 4, marginBottom: 40 }}>
          Register to get started
        </Text>

        <Field label="Username" error={errors.username}>
          <TextInput
            style={inputStyle(isFocused === 'username', !!errors.username)}
            placeholder="Choose a username"
            placeholderTextColor="#d4d4d8"
            value={username}
            onChangeText={setUsername}
            onFocus={() => setIsFocused('username')}
            onBlur={() => setIsFocused('')}
            autoCapitalize="none"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <TextInput
            style={inputStyle(isFocused === 'email', !!errors.email)}
            placeholder="you@example.com"
            placeholderTextColor="#d4d4d8"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocused('email')}
            onBlur={() => setIsFocused('')}
            textContentType="emailAddress"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <TextInput
            style={inputStyle(isFocused === 'password', !!errors.password)}
            placeholder="••••••••"
            placeholderTextColor="#d4d4d8"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setIsFocused('password')}
            onBlur={() => setIsFocused('')}
            secureTextEntry
            textContentType="password"
          />
        </Field>

        <Field label="Confirm Password" error={errors.confirmPassword}>
          <TextInput
            style={inputStyle(isFocused === 'confirmPassword', !!errors.confirmPassword)}
            placeholder="••••••••"
            placeholderTextColor="#d4d4d8"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setIsFocused('confirmPassword')}
            onBlur={() => setIsFocused('')}
            secureTextEntry
            textContentType="password"
          />
        </Field>

        <Pressable
          onPress={handleRegister}
          disabled={isLoading}
          android_ripple={{ color: '#ffffff20', borderless: false }}
          style={{
            marginTop: 28, backgroundColor: isLoading ? '#7bafd4' : '#155183',
            paddingVertical: 13, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
          {isLoading
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>Register</Text>
          }
        </Pressable>

        <Text
          style={{ textAlign: 'center', marginTop: 16, fontSize: 13, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}
          onPress={() => router.push('/(auth)/login')}
        >
          Already have an account?{' '}
          <Text style={{ color: '#155183', fontFamily: 'PoppinsMedium' }}>Sign in</Text>
        </Text>

      </ScrollView>
    </View>
  )
}

export default Register