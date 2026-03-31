import { View, Text, TextInput, Pressable, ActivityIndicator, BackHandler, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { useLoginMutation } from '@/store/authApi'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import { ChevronLeft } from 'lucide-react-native'

const Login = () => {
  const { checking } = useAuthRedirect()
  const [isFocused, setIsFocused] = useState('')
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [errors, setErrors]       = useState<{ [key: string]: string }>({})
  const [login, { isLoading }]    = useLoginMutation()

  useFocusEffect(
    useCallback(() => {
      const handler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => handler.remove()
    }, [])
  )

  const inputStyle = (key: string) => ({
    borderRadius: 10,
    borderWidth: errors[key] ? 1.5 : isFocused === key ? 1.5 : 0.5,
    borderColor: errors[key] ? '#ef444480' : isFocused === key ? '#155183' : '#e4e4e7',
    backgroundColor: '#fafafa',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 13, fontFamily: 'PoppinsRegular',
    color: '#18181b',
  })

  const validate = () => {
    const e: { [key: string]: string } = {}
    if (!username.trim())  e.username = 'Username is required.'
    if (!password)         e.password = 'Password is required.'
    else if (password.length < 8) e.password = 'Must be at least 8 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    try {
      const response = await login({
        username: username.trim().toLowerCase(), password,
      }).unwrap()
      await AsyncStorage.setItem('user', JSON.stringify({
        username: response.username, email: response.email || '',
        id: response.id || '', first_name: response.first_name || '',
        last_name: response.last_name || '', birthday: response.birthday || '',
        address: response.address || '', is_complete: response.is_complete || false,
        profile_picture: response.profile_picture || '', mobile_number: response.mobile_number || '',
      }))
      await AsyncStorage.setItem('authToken', response.token)
      Toast.show({ type: 'success', text1: 'User Login Successfully!' })
      setUsername(''); setPassword('')
      router.replace(response.is_complete ? '/(tabs)/home' : '/(auth)/complete-profile')
    } catch (error: any) {
      if (error?.data?.detail) Toast.show({ type: 'error', text1: error.data.detail })
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
        {/* Heading */}
        <Text style={{
          marginTop: 96, fontSize: 28, fontFamily: 'PoppinsBold', color: '#18181b',
        }}>
          Welcome back.
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'PoppinsRegular', color: '#a1a1aa', marginTop: 4, marginBottom: 40 }}>
          Sign in to continue
        </Text>

        {/* Username */}
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 6 }}>
          Username
        </Text>
        <TextInput
          style={inputStyle('username')}
          placeholder="Enter your username"
          placeholderTextColor="#d4d4d8"
          value={username}
          onChangeText={setUsername}
          onFocus={() => setIsFocused('username')}
          onBlur={() => setIsFocused('')}
          autoCapitalize="none"
        />
        {errors.username && (
          <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#ef4444', marginTop: 4, marginLeft: 2 }}>
            {errors.username}
          </Text>
        )}

        {/* Password */}
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 6, marginTop: 16 }}>
          Password
        </Text>
        <TextInput
          style={inputStyle('password')}
          placeholder="••••••••"
          placeholderTextColor="#d4d4d8"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsFocused('password')}
          onBlur={() => setIsFocused('')}
          secureTextEntry
          textContentType="password"
        />
        {errors.password && (
          <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#ef4444', marginTop: 4, marginLeft: 2 }}>
            {errors.password}
          </Text>
        )}

        {/* Submit */}
        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          android_ripple={{ color: '#ffffff20', borderless: false }}
          style={{
            marginTop: 28, backgroundColor: isLoading ? '#7bafd4' : '#155183',
            paddingVertical: 13, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
          {isLoading
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>Login</Text>
          }
        </Pressable>

        {/* Footer */}
        <Text
          style={{ textAlign: 'center', marginTop: 16, fontSize: 13, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}
          onPress={() => router.push('/(auth)/register')}
        >
          Don&apos;t have an account?{' '}
          <Text style={{ color: '#155183', fontFamily: 'PoppinsMedium' }}>Sign up</Text>
        </Text>

      </ScrollView>
    </View>
  )
}

export default Login