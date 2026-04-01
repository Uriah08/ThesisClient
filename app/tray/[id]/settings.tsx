import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ChevronLeft, ChevronRight, Pen, Trash } from 'lucide-react-native'
import { useGetFarmTrayByIdQuery } from '@/store/farmTrayApi'
import DeleteClass from '@/components/containers/dialogs/Delete'
import RenameClass from '@/components/containers/dialogs/Rename'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'

type MenuItem = {
  icon: any
  label: string
  iconBg: string
  iconColor: string
  onPress: () => void
  danger?: boolean
}

// ── must be outside component ─────────────────────────────────────────────────
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
          onPress={item.onPress}
          android_ripple={{ color: '#e4e4e7', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            padding: 14, paddingHorizontal: 16,
            borderBottomWidth: i < items.length - 1 ? 0.5 : 0,
            borderBottomColor: '#f4f4f5',
          }}
        >
          <View style={{
            width: 34, height: 34, borderRadius: 10,
            backgroundColor: item.iconBg,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <item.icon size={16} color={item.iconColor} />
          </View>
          <Text style={{
            flex: 1, fontSize: 14,
            fontFamily: item.danger ? 'PoppinsSemiBold' : 'PoppinsMedium',
            color: item.danger ? '#A32D2D' : '#18181b',
          }}>
            {item.label}
          </Text>
          <ChevronRight size={14} color={item.danger ? '#fca5a5' : '#d4d4d8'} />
        </Pressable>
      ))}
    </View>
  </View>
)

// ── main screen ───────────────────────────────────────────────────────────────
const TraySettings = () => {
  const { user }   = useAuthRedirect()
  const { id }     = useLocalSearchParams()
  const { data, refetch } = useGetFarmTrayByIdQuery(Number(id))

  const [refreshing, setRefreshing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showRename, setShowRename] = useState(false)

  const isOwner = data?.farm_owner === user?.id

  const onRefresh = async () => {
    await refetch()
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const generalItems: MenuItem[] = [
    {
      icon: Pen,
      label: 'Rename Tray',
      iconBg: '#E6F1FB',
      iconColor: '#185FA5',
      onPress: () => setShowRename(true),
    },
  ]

  const dangerItems: MenuItem[] = isOwner ? [
    {
      icon: Trash,
      label: 'Delete Tray',
      iconBg: '#FCEBEB',
      iconColor: '#A32D2D',
      danger: true,
      onPress: () => setShowDelete(true),
    },
  ] : []

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <DeleteClass setVisible={setShowDelete} visible={showDelete} trayId={data?.id} type="farm-tray" />
      <RenameClass setVisible={setShowRename} visible={showRename} type="farm-tray" defaultValue={data?.name} trayId={data?.id} />

      {/* Header */}
      <View style={{
        paddingTop: 56, paddingBottom: 16, paddingHorizontal: 24,
        borderBottomWidth: 0.5, borderBottomColor: '#f4f4f5',
        flexDirection: 'row', alignItems: 'center', gap: 12,
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
        <View>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 17, color: '#18181b' }}>
            Settings
          </Text>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa', marginTop: 1 }}>
            {data?.name}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 24, gap: 24 }}
      >
        <MenuGroup title="General" items={generalItems} />

        {dangerItems.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#fca5a5', letterSpacing: 0.8,
              textTransform: 'uppercase', marginBottom: 4,
            }}>
              Danger Zone
            </Text>
            <View style={{
              borderRadius: 16, borderWidth: 0.5,
              borderColor: '#fee2e2', overflow: 'hidden',
              backgroundColor: '#fff5f5',
            }}>
              {dangerItems.map((item, i) => (
                <Pressable
                  key={i}
                  onPress={item.onPress}
                  android_ripple={{ color: '#fee2e2', borderless: false }}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 14,
                    padding: 14, paddingHorizontal: 16,
                  }}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: 10,
                    backgroundColor: '#FCEBEB',
                    alignItems: 'center', justifyContent: 'center',
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
        )}
      </ScrollView>
    </View>
  )
}

export default TraySettings