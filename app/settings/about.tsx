import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { ChevronLeft, BellIcon, GridIcon, SearchIcon, SunIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: SunIcon,
      label: t('about_feature_weather_label'),
      description: t('about_feature_weather_desc'),
      iconBg: '#FAEEDA', iconColor: '#854F0B',
    },
    {
      icon: GridIcon,
      label: t('about_feature_tray_label'),
      description: t('about_feature_tray_desc'),
      iconBg: '#E1F5EE', iconColor: '#0F6E56',
    },
    {
      icon: SearchIcon,
      label: t('about_feature_scan_label'),
      description: t('about_feature_scan_desc'),
      iconBg: '#EEEDFE', iconColor: '#534AB7',
    },
    {
      icon: BellIcon,
      label: t('about_feature_notif_label'),
      description: t('about_feature_notif_desc'),
      iconBg: '#E6F1FB', iconColor: '#185FA5',
    },
  ]

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
          {t('about_title')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, gap: 20 }}>

        {/* App identity card */}
        <View style={{
          alignItems: 'center', gap: 12, padding: 28,
          backgroundColor: '#fafafa', borderRadius: 20,
          borderWidth: 0.5, borderColor: '#f4f4f5',
        }}>
          <View style={{
            width: 64, height: 64, borderRadius: 18,
            backgroundColor: '#E6F1FB',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <SunIcon size={30} color="#185FA5" />
          </View>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Text style={{ fontSize: 16, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>FiScan</Text>
            <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>{t('about_version')}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ backgroundColor: '#E6F1FB', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#185FA5' }}>{t('about_tag_tuyo')}</Text>
            </View>
            <View style={{ backgroundColor: '#E1F5EE', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#0F6E56' }}>{t('about_tag_drying')}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 22 }}>
          {t('about_description')}
        </Text>

        <View style={{ height: 0.5, backgroundColor: '#f4f4f5' }} />

        {/* Features */}
        <View style={{ gap: 8 }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 4,
          }}>
            {t('about_features_title')}
          </Text>
          {features.map((f, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'flex-start', gap: 12,
              padding: 12, paddingHorizontal: 14,
              backgroundColor: '#fafafa', borderRadius: 12,
              borderWidth: 0.5, borderColor: '#f4f4f5',
            }}>
              <View style={{
                width: 30, height: 30, borderRadius: 8,
                backgroundColor: f.iconBg,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={14} color={f.iconColor} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#18181b' }}>{f.label}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#71717a', lineHeight: 18 }}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 0.5, backgroundColor: '#f4f4f5' }} />

        {/* Contact */}
        <View style={{
          padding: 16, backgroundColor: '#fafafa',
          borderRadius: 14, borderWidth: 0.5, borderColor: '#f4f4f5',
          gap: 6,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase',
          }}>
            {t('about_contact_title')}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 22 }}>
            {t('about_contact_body')}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default About