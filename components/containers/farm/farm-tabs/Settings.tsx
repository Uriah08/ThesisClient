import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ChevronRight, Megaphone, Pen, RotateCcwKey, Smartphone, StoreIcon, Trash } from 'lucide-react-native'
import { router } from 'expo-router'
import DeleteFarm from '../../dialogs/DeleteFarm'
import { Farm } from '@/utils/types'

type Menu = {
  icon: any
  label: string
  // Added the retail-outlets route here
  route?: 
    | '/farm-settings/edit/[id]' 
    | '/farm-settings/announcement/[id]' 
    | '/farm-settings/change/[id]' 
    | '/farm-settings/block/[id]' 
    | '/farm-settings/retail-outlets/[id]'
  iconBg: string
  iconColor: string
}

type Props = {
  farmId: number
  owner: boolean
  setSelectedFarm: (farm: Farm | null) => void
  onBack: () => void
}

const MenuGroup = ({
  title,
  items,
  farmId,
  onItemPress,
}: {
  title: string
  items: Menu[]
  farmId: number
  onItemPress?: (item: Menu) => void
}) => (
  <View style={{ gap: 8 }}>
    <Text style={{
      fontSize: 11,
      fontFamily: 'PoppinsMedium',
      color: '#a1a1aa',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 4,
    }}>
      {title}
    </Text>
    <View style={{
      borderRadius: 16,
      borderWidth: 0.5,
      borderColor: '#f4f4f5',
      overflow: 'hidden',
      backgroundColor: '#fafafa',
    }}>
      {items.map((item, i) => (
        <Pressable
          key={i}
          onPress={() => {
            if (onItemPress) {
              onItemPress(item)
            } else if (item.route) {
              router.push({ pathname: item.route, params: { id: farmId.toString() } })
            }
          }}
          android_ripple={{ color: '#e4e4e7', borderless: false }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 14,
            paddingHorizontal: 16,
            borderBottomWidth: i < items.length - 1 ? 0.5 : 0,
            borderBottomColor: '#f4f4f5',
          }}
        >
          <View style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: item.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
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

const Settings = ({ farmId, owner, setSelectedFarm, onBack }: Props) => {
  const [showDelete, setShowDelete] = useState(false)

  const generalMenu: Menu[] = [
    {
      icon: Megaphone,
      label: 'Announcements',
      route: '/farm-settings/announcement/[id]',
      iconBg: '#FAEEDA',
      iconColor: '#854F0B',
    },
    ...(owner
      ? [
          {
            icon: Pen,
            label: 'Edit Farm',
            route: '/farm-settings/edit/[id]' as const,
            iconBg: '#E6F1FB',
            iconColor: '#185FA5',
          },
          {
            icon: RotateCcwKey,
            label: 'Change Password',
            route: '/farm-settings/change/[id]' as const,
            iconBg: '#E1F5EE',
            iconColor: '#0F6E56',
          },
          {
            icon: StoreIcon,
            label: 'Retail Outlets',
            route: '/farm-settings/retail-outlets/[id]' as const,
            iconBg: '#F0E7FF',
            iconColor: '#5B21B6',
          },
        ]
      : []),
  ]

  const dangerMenu: Menu[] = [
    {
      icon: Trash,
      label: owner ? 'Delete Farm' : 'Leave Farm',
      iconBg: '#FCEBEB',
      iconColor: '#A32D2D',
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <DeleteFarm
        visible={showDelete}
        setVisible={setShowDelete}
        farmId={farmId}
        type={owner ? 'delete' : 'leave'}
        setSelectedFarm={setSelectedFarm}
        onBack={onBack}
      />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 8,
      }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}>Settings</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f4f4f5',
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 20,
          gap: 4,
        }}>
          <Smartphone size={11} color="#71717a" />
          <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a' }}>
            Farm ID:{' '}
            <Text style={{ fontFamily: 'PoppinsSemiBold', color: '#3f3f46' }}>{farmId}</Text>
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 15, gap: 24 }}
      >
        <MenuGroup
          title="General"
          items={generalMenu}
          farmId={farmId}
        />

        {/* Danger Zone */}
        <View style={{ gap: 8 }}>
          <Text style={{
            fontSize: 11,
            fontFamily: 'PoppinsMedium',
            color: '#fca5a5',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            Danger Zone
          </Text>
          <View style={{
            borderRadius: 16,
            borderWidth: 0.5,
            borderColor: '#fee2e2',
            overflow: 'hidden',
            backgroundColor: '#fff5f5',
          }}>
            {dangerMenu.map((item, i) => (
              <Pressable
                key={i}
                onPress={() => setShowDelete(true)}
                android_ripple={{ color: '#fee2e2', borderless: false }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  padding: 14,
                  paddingHorizontal: 16,
                }}
              >
                <View style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#FCEBEB',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <item.icon size={16} color="#A32D2D" />
                </View>
                <Text style={{ flex: 1, fontSize: 14, fontFamily: 'PoppinsSemiBold', color: '#A32D2D' }}>
                  {item.label}
                </Text>
                <ChevronRight size={14} color="#fca5a5" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Settings