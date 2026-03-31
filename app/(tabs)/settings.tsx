import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import {
  CircleUserIcon, RotateCcwKey, CircleQuestionMark,
  HelpCircleIcon, FileTextIcon, InfoIcon, LogOutIcon, ChevronRight
} from 'lucide-react-native'
import { router } from 'expo-router'
import { useLogoutMutation } from '@/store/userApi'
import AsyncStorage from '@react-native-async-storage/async-storage'

type MenuItem = {
  icon: any
  label: string
  route: string
  iconBg: string
  iconColor: string
}

const accountMenu: MenuItem[] = [
  { icon: CircleUserIcon,  label: 'User Profile',      route: '/settings/profile',         iconBg: '#E6F1FB', iconColor: '#185FA5' },
  { icon: RotateCcwKey,    label: 'Change Password',   route: '/settings/change-password', iconBg: '#E1F5EE', iconColor: '#0F6E56' },
]

const supportMenu: MenuItem[] = [
  { icon: CircleQuestionMark, label: 'FAQ',         route: '/settings/FAQ',         iconBg: '#FAEEDA', iconColor: '#854F0B' },
  { icon: HelpCircleIcon,     label: 'Help Center', route: '/settings/help-center', iconBg: '#FBEAF0', iconColor: '#993556' },
]

const legalMenu: MenuItem[] = [
  { icon: FileTextIcon, label: 'Terms of Service', route: '/settings/terms', iconBg: '#EEEDFE', iconColor: '#534AB7' },
  { icon: InfoIcon,     label: 'About',            route: '/settings/about', iconBg: '#F1EFE8', iconColor: '#5F5E5A' },
]

const MenuGroup = ({ title, items }: { title: string; items: MenuItem[] }) => (
  <View style={{ gap: 8 }}>
    <Text style={{
      fontSize: 11, fontFamily: 'PoppinsMedium',
      color: '#a1a1aa', letterSpacing: 0.8,
      textTransform: 'uppercase', marginBottom: 4,
    }}>
      {title}
    </Text>
    <View style={{
      borderRadius: 16, borderWidth: 0.5,
      borderColor: '#f4f4f5', overflow: 'hidden',
      backgroundColor: '#fafafa',
    }}>
      {items.map((item, i) => (
        <Pressable
          key={i}
          onPress={() => router.push(item.route as any)}
          android_ripple={{ color: '#e4e4e7', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            padding: 14, paddingHorizontal: 16,
            borderBottomWidth: i < items.length - 1 ? 0.5 : 0,
            borderBottomColor: '#f4f4f5',
          }}>
          <View style={{
            width: 34, height: 34, borderRadius: 10,
            backgroundColor: item.iconBg,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <item.icon size={16} color={item.iconColor} />
          </View>
          <Text style={{ flex: 1, fontSize: 14, fontFamily: 'PoppinsMedium', color: '#18181b' }}>
            {item.label}
          </Text>
          <ChevronRight size={14} color="#d4d4d8" />
        </Pressable>
      ))}
    </View>
  </View>
)

const Settings = () => {
  const { user } = useAuthRedirect()
  const [logout, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      const expoToken = await AsyncStorage.getItem('expoPushToken')
      await logout({ token: expoToken }).unwrap()
      await AsyncStorage.multiRemove(['user', 'authToken', 'farm', 'session'])
      router.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{
        marginTop: 56, paddingHorizontal: 15, paddingBottom: 8,
        fontSize: 26, fontFamily: 'PoppinsBold', color: '#18181b',
      }}>
        Settings
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 15, gap: 24 }}>

        {/* Profile card */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 14,
          paddingVertical: 16,
          borderBottomWidth: 0.5, borderBottomColor: '#f4f4f5',
        }}>
          <Image
            source={user?.profile_picture
              ? { uri: user.profile_picture }
              : require('@/assets/images/default-profile.png')}
            style={{ width: 52, height: 52, borderRadius: 999 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
              {user?.username
                ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                : ''}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#71717a', marginTop: 2 }}>
              {user?.email}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/settings/profile' as any)}
            style={{
              paddingHorizontal: 14, paddingVertical: 6,
              borderRadius: 20, borderWidth: 0.5, borderColor: '#e4e4e7',
            }}>
            <Text style={{ fontSize: 12, fontFamily: 'PoppinsMedium', color: '#71717a' }}>Edit</Text>
          </Pressable>
        </View>

        <MenuGroup title="Account" items={accountMenu} />
        <MenuGroup title="Support" items={supportMenu} />
        <MenuGroup title="Legal" items={legalMenu} />

        {/* Logout */}
        <Pressable
          disabled={isLoading}
          onPress={handleLogout}
          android_ripple={{ color: '#fee2e2', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            padding: 14, paddingHorizontal: 16,
            borderRadius: 16, borderWidth: 0.5,
            borderColor: '#fee2e2', backgroundColor: '#fff5f5',
          }}>
          <View style={{
            width: 34, height: 34, borderRadius: 10,
            backgroundColor: '#FCEBEB',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {isLoading
              ? <ActivityIndicator size={16} color="#A32D2D" />
              : <LogOutIcon size={16} color="#A32D2D" />
            }
          </View>
          <Text style={{ fontSize: 14, fontFamily: 'PoppinsSemiBold', color: '#A32D2D' }}>
            Logout
          </Text>
        </Pressable>

        <Text style={{ textAlign: 'center', fontSize: 11, color: '#d4d4d8', fontFamily: 'PoppinsRegular' }}>
          v1.0.0
        </Text>

      </ScrollView>
    </View>
  )
}

export default Settings