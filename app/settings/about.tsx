import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { ChevronLeft, BellIcon, GridIcon, SearchIcon, SunIcon } from 'lucide-react-native'
import { router } from 'expo-router'

type Feature = {
  icon: any
  label: string
  description: string
  iconBg: string
  iconColor: string
}

const features: Feature[] = [
  {
    icon: SunIcon,
    label: 'Weather Alerts',
    description: 'Real-time drying recommendations based on forecast data',
    iconBg: '#FAEEDA', iconColor: '#854F0B',
  },
  {
    icon: GridIcon,
    label: 'Tray Management',
    description: 'Drying area and tray tracking with role-based access',
    iconBg: '#E1F5EE', iconColor: '#0F6E56',
  },
  {
    icon: SearchIcon,
    label: 'Image Scanning',
    description: 'Quality assessment of dried fish via image analysis',
    iconBg: '#EEEDFE', iconColor: '#534AB7',
  },
  {
    icon: BellIcon,
    label: 'Notifications',
    description: 'Alerts for drying activities and announcements',
    iconBg: '#E6F1FB', iconColor: '#185FA5',
  },
]

const About = () => {
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
          About
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
            <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>Version 1.0.0</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ backgroundColor: '#E6F1FB', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#185FA5' }}>Tuyo Management</Text>
            </View>
            <View style={{ backgroundColor: '#E1F5EE', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#0F6E56' }}>Fish Drying</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 22 }}>
          Designed to assist tuyo producers in monitoring, managing, and improving the sun-drying process through
          data-driven tools and intelligent analysis. Integrates weather forecasting, drying area management,
          and image-based scanning to help users make informed decisions.
        </Text>

        <View style={{ height: 0.5, backgroundColor: '#f4f4f5' }} />

        {/* Features */}
        <View style={{ gap: 8 }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 4,
          }}>
            Key Features
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
            Contact
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 22 }}>
            For issues not covered in the Help Center or feedback about the app, contact the developer through the official project channels.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default About