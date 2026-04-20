import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useMemo } from 'react'
import Notifications from '@/components/containers/notifications/Notifications'
import { useGetNotificationsQuery, useReadNotificationsMutation } from '@/store/notificationApi'
import { MailOpen, Trash, SlidersHorizontal } from 'lucide-react-native'
import DeleteNotifications from '@/components/containers/dialogs/DeleteNotifications'

// ── Time group helper ────────────────────────────────────────────────────────
function getTimeGroup(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(todayStart.getDate() - 1)
  const thisWeekStart = new Date(todayStart)
  thisWeekStart.setDate(todayStart.getDate() - 6)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  if (date >= todayStart) return 'New'
  if (date >= yesterdayStart) return 'Yesterday'
  if (date >= thisWeekStart) return 'This Week'
  if (date >= thisMonthStart) return 'This Month'
  return 'Earlier'
}

const GROUP_ORDER = ['New', 'Yesterday', 'This Week', 'This Month', 'Earlier']

type Tab = 'All' | 'Unread'

const Notification = () => {
  const { data, isLoading, refetch } = useGetNotificationsQuery()
  const [readNotifications] = useReadNotificationsMutation()
  const notifications = useMemo(() => data || [], [data])
  const [showDialog, setShowDialog] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [refreshing, setRefreshing] = useState(false)

  const unreadCount = notifications.filter((n: any) => !n.read).length
  const hasAny = notifications.length > 0

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const filtered = useMemo(() => {
    if (activeTab === 'Unread') return notifications.filter((n: any) => !n.read)
    return notifications
  }, [notifications, activeTab])

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const n of filtered) {
      const group = getTimeGroup(n.created_at ?? new Date().toISOString())
      if (!map[group]) map[group] = []
      map[group].push(n)
    }
    return GROUP_ORDER
      .filter(g => map[g]?.length > 0)
      .map(g => ({ title: g, items: map[g] }))
  }, [filtered])

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
      <View style={{ paddingTop: 56, paddingHorizontal: 15, paddingBottom: 0 }}>
        {/* Title row */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', paddingBottom: 10,
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

        {/* Tabs */}
        <View style={{ flexDirection: 'row', gap: 6, paddingBottom: 8 }}>
          {(['All', 'Unread'] as Tab[]).map(tab => {
            const isActive = activeTab === tab
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: isActive ? '#155183' : '#f4f4f5',
                  flexDirection: 'row', alignItems: 'center', gap: 5,
                }}
              >
                <Text style={{
                  fontSize: 13, fontFamily: 'PoppinsMedium',
                  color: isActive ? '#ffffff' : '#71717a',
                }}>
                  {tab}
                </Text>
                {tab === 'Unread' && unreadCount > 0 && (
                  <View style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#155183',
                    borderRadius: 999, minWidth: 16, height: 16,
                    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
                  }}>
                    <Text style={{ fontSize: 9, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      </View>

      {/* Dropdown menu */}
      {showDialog && (
        <>
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
                <action.icon size={14} color={action.destructive ? '#dc2626' : '#52525b'} />
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

      {/* Content */}
      {isLoading ? (
        <Notifications notifications={[]} isLoading={true} refetch={refetch} />
      ) : filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, fontFamily: 'PoppinsMedium', color: '#a1a1aa' }}>
            {activeTab === 'Unread' ? 'No unread notifications' : 'No notifications yet'}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 6, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl tintColor="#185FA5" refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {grouped.map((group, groupIndex) => (
            <View key={group.title}>
              {/* Section label */}
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 15,
                paddingTop: groupIndex === 0 ? 6 : 12,
                paddingBottom: 6,
                gap: 8,
              }}>
                <Text style={{
                  fontSize: 11, fontFamily: 'PoppinsSemiBold',
                  color: '#a1a1aa', letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}>
                  {group.title}
                </Text>
                <View style={{ flex: 1, height: 0.5, backgroundColor: '#e4e4e7' }} />
              </View>

              {/* Items — grouped prop removes internal ScrollView + padding */}
              <Notifications
                notifications={group.items}
                isLoading={false}
                refetch={refetch}
                grouped
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

export default Notification