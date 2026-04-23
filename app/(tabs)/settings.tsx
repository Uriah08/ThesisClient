import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, Switch } from 'react-native'
import React, { useEffect } from 'react'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import {
  CircleUserIcon, RotateCcwKey, CircleQuestionMark,
  HelpCircleIcon, FileTextIcon, InfoIcon, LogOutIcon, ChevronRight, Languages
} from 'lucide-react-native'
import { router } from 'expo-router'
import { useLogoutMutation } from '@/store/userApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'

type MenuItem = {
  icon: any
  label: string
  route: string
  iconBg: string
  iconColor: string
}

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
  const { t, i18n } = useTranslation()

  useEffect(() => {
    AsyncStorage.getItem('locale').then(saved => {
      if (saved) i18n.changeLanguage(saved)
    })
  }, [i18n])

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'fil' : 'en'
    i18n.changeLanguage(next)
    AsyncStorage.setItem('locale', next)
  }

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

  const accountMenu: MenuItem[] = [
    { icon: CircleUserIcon, label: t('settings_menu_profile'),         route: '/settings/profile',         iconBg: '#E6F1FB', iconColor: '#185FA5' },
    { icon: RotateCcwKey,   label: t('settings_menu_change_password'), route: '/settings/change-password', iconBg: '#E1F5EE', iconColor: '#0F6E56' },
  ]

  const supportMenu: MenuItem[] = [
    { icon: CircleQuestionMark, label: t('settings_menu_faq'),  route: '/settings/FAQ',         iconBg: '#FAEEDA', iconColor: '#854F0B' },
    { icon: HelpCircleIcon,     label: t('settings_menu_help'), route: '/settings/help-center', iconBg: '#FBEAF0', iconColor: '#993556' },
  ]

  const legalMenu: MenuItem[] = [
    { icon: FileTextIcon, label: t('settings_menu_terms'), route: '/settings/terms', iconBg: '#EEEDFE', iconColor: '#534AB7' },
    { icon: InfoIcon,     label: t('settings_menu_about'), route: '/settings/about', iconBg: '#F1EFE8', iconColor: '#5F5E5A' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Text style={{
        marginTop: 56, paddingHorizontal: 15, paddingBottom: 8,
        fontSize: 26, fontFamily: 'PoppinsBold', color: '#18181b',
      }}>
        {t('settings_title')}
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
            <Text style={{ fontSize: 12, fontFamily: 'PoppinsMedium', color: '#71717a' }}>
              {t('settings_edit')}
            </Text>
          </Pressable>
        </View>

        <MenuGroup title={t('settings_group_account')}     items={accountMenu} />
        <MenuGroup title={t('settings_group_support')}     items={supportMenu} />
        <MenuGroup title={t('settings_group_legal')}       items={legalMenu} />

        {/* Preferences */}
        <View style={{ gap: 8 }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 4,
          }}>
            {t('settings_group_preferences')}
          </Text>
          <View style={{
            borderRadius: 16, borderWidth: 0.5,
            borderColor: '#f4f4f5', overflow: 'hidden',
            backgroundColor: '#fafafa',
          }}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 14,
              padding: 14, paddingHorizontal: 16,
            }}>
              <View style={{
                width: 34, height: 34, borderRadius: 10,
                backgroundColor: '#E6F1FB',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Languages size={16} color="#185FA5" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium', color: '#18181b' }}>
                  {t('settings_language_label')}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa', marginTop: 1 }}>
                  {i18n.language === 'en' ? t('settings_language_value_en') : t('settings_language_value_fil')}
                </Text>
              </View>
              <Switch
                value={i18n.language === 'fil'}
                onValueChange={toggleLanguage}
                trackColor={{ false: '#e4e4e7', true: '#155183' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

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
            {t('settings_logout')}
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