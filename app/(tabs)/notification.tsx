import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import Notifications from '@/components/containers/notifications/Notifications'
import { useGetNotificationsQuery, useReadNotificationsMutation } from '@/store/notificationApi'
import { MailOpen, Trash, SlidersHorizontal } from 'lucide-react-native'
import DeleteNotifications from '@/components/containers/dialogs/DeleteNotifications'

const Notification = () => {
  const { data, isLoading, refetch } = useGetNotificationsQuery()
  const [readNotifications] = useReadNotificationsMutation()
  const notifications = data || []
  const [showDialog, setShowDialog] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const unreadCount  = notifications.filter((n: any) => !n.read).length
  const hasAny       = notifications.length > 0

  const readAllNotifications = async () => {
    const ids = notifications.filter((n: any) => !n.read).map((n: any) => n.id)
    try {
      await readNotifications({ ids }).unwrap()
      setShowDialog(false)
    } catch (error) {
      console.log(error)
    }
  }

  type ActionItem = {
    icon: any
    label: string
    disabled: boolean
    onPress: () => void
    destructive?: boolean
  }

  const actions: ActionItem[] = [
    {
      icon: MailOpen,
      label: 'Mark All as Read',
      disabled: unreadCount === 0,
      onPress: readAllNotifications,
    },
    {
      icon: Trash,
      label: 'Delete All',
      disabled: !hasAny,
      destructive: true,
      onPress: () => { setShowDelete(true); setShowDialog(false) },
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <DeleteNotifications
        setVisible={setShowDelete}
        visible={showDelete}
        type="multiple"
        ids={notifications.map((n: any) => n.id)}
      />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 56, paddingHorizontal: 15, paddingBottom: 8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 26, fontFamily: 'PoppinsBold', color: '#18181b' }}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={{
              backgroundColor: '#155183', borderRadius: 999,
              minWidth: 20, height: 20,
              alignItems: 'center', justifyContent: 'center',
              paddingHorizontal: 6,
            }}>
              <Text style={{ fontSize: 10, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        {/* menu trigger */}
        <Pressable
          onPress={() => setShowDialog(prev => !prev)}
          style={{
            width: 34, height: 34, borderRadius: 10,
            backgroundColor: showDialog ? '#f4f4f5' : 'transparent',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <SlidersHorizontal size={16} color="#71717a" />
        </Pressable>
      </View>

      {/* dropdown menu */}
      {showDialog && (
        <>
          {/* backdrop dismiss */}
          <Pressable
            onPress={() => setShowDialog(false)}
            style={{ position: 'absolute', inset: 0, zIndex: 40 }}
          />
          <View style={{
            position: 'absolute', top: 100, right: 24,
            zIndex: 50, width: 190,
            backgroundColor: '#ffffff',
            borderRadius: 14, borderWidth: 0.5, borderColor: '#e4e4e7',
            overflow: 'hidden',
            shadowColor: '#000', shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
            elevation: 6,
          }}>
            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#a1a1aa', letterSpacing: 0.8,
              textTransform: 'uppercase',
              paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8,
            }}>
              Actions
            </Text>
            {actions.map((action, i) => (
              <Pressable
                key={i}
                disabled={action.disabled}
                onPress={action.onPress}
                android_ripple={{ color: '#f4f4f5', borderless: false }}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10,
                  paddingHorizontal: 14, paddingVertical: 11,
                  borderTopWidth: 0.5, borderTopColor: '#f4f4f5',
                  opacity: action.disabled ? 0.35 : 1,
                }}>
                <action.icon
                  size={14}
                  color={action.destructive ? '#dc2626' : '#52525b'}
                />
                <Text style={{
                  fontSize: 13, fontFamily: 'PoppinsMedium',
                  color: action.destructive ? '#dc2626' : '#18181b',
                }}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
            <View style={{ height: 4 }} />
          </View>
        </>
      )}

      <Notifications notifications={notifications} isLoading={isLoading} refetch={refetch} />
    </View>
  )
}

export default Notification