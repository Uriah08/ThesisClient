import { View, Text, ActivityIndicator, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetFarmDashboardQuery, useGetFarmQuery } from '@/store/farmApi'
import { Boxes, CalendarDays, ChevronRight, Megaphone, PanelsLeftRight, Users } from 'lucide-react-native'
import FarmDashboardBarChart from '../../charts/FarmDashboardBarChart'
import FarmProductionChart from '../../charts/FarmProductionChart'
import { router } from 'expo-router'
import DateRangePicker from '@/components/ui/DateRangeFilter'

type Props = { farmId: number }

const displayDate = (str: string) =>
  new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const Home = ({ farmId }: Props) => {

  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)
  const [chartKey, setChartKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const [showCalendar, setShowCalendar] = useState(false)

  const { data } = useGetFarmQuery(farmId)
  const { data: dashboard, isLoading: dashboardLoading, refetch } = useGetFarmDashboardQuery({
    id: farmId,
    from: from ?? undefined,
    to: to ?? undefined,
  })

  const onRefresh = async () => {
    await refetch()
    setRefreshing(true)
    setChartKey(prev => prev + 1)
    setTimeout(() => setRefreshing(false), 1000)
  }

  useEffect(() => { refetch() }, [refetch])

  if (dashboardLoading) return (
    <View className='flex-1 items-center justify-center bg-white'>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  return (
    <View className='flex-1 flex flex-col'>
      {/* Header */}
      <View className='flex-row items-center justify-between mt-3 px-5' style={{ marginBottom: 5 }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}>Home</Text>

        <Pressable
          onPress={() => setShowCalendar(true)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 12, paddingVertical: 5, paddingHorizontal: 8 }}
        >
          <CalendarDays size={13} color="#155183" />
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#52525b' }}>
            {from && to ? `${displayDate(from)} – ${displayDate(to)}` : 'All time'}
          </Text>
        </Pressable>
      </View>

      <DateRangePicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        initialFrom={from}
        initialTo={to}
        onApply={(newFrom, newTo) => {
          setFrom(newFrom)
          setTo(newTo)
          setChartKey(prev => prev + 1)
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl style={{ zIndex: -1 }} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Announcement */}
        {dashboard?.announcement_count && dashboard.announcement_count > 0 ? (
          <View style={{ overflow: 'hidden', borderRadius: 12 }}>
            <Pressable
              className='flex flex-col mt-3'
              style={{ borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 12, padding: 13, marginHorizontal: 17, overflow: 'hidden' }}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
              onPress={() => router.push({ pathname: '/farm-settings/announcement/[id]', params: { id: farmId.toString() } })}
            >
              <View className='flex-row justify-between items-center'>
                <View className='flex-row gap-3 items-center'>
                  <View className='bg-primary p-2' style={{ borderRadius: 999 }}>
                    <Megaphone color={'#ffffff'} size={20} />
                  </View>
                  <Text style={{ fontFamily: 'PoppinsBold', fontSize: 15, color: '#52525b' }}>Announcements</Text>
                  <View style={{ backgroundColor: '#991b1b', borderRadius: 999, height: 20, width: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#ffffff', marginTop: 1 }}>{dashboard.announcement_count}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={'#52525b'} />
              </View>
            </Pressable>
          </View>
        ) : null}

        {/* Stat cards */}
        <View style={{ paddingHorizontal: 16 }}>
          {/* Row 1 — Trays + Members */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <View style={{ flex: 1, backgroundColor: '#155183', borderRadius: 14, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ backgroundColor: '#ffffff20', borderRadius: 8, padding: 5 }}>
                  <PanelsLeftRight color="#fff" size={14} />
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#ffffffcc' }}>Trays</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 28, color: '#fff' }}>{dashboard?.tray_count ?? 0}</Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#ffffff80', marginTop: 2 }}>total trays</Text>
            </View>

            <View style={{ flex: 1, backgroundColor: '#155183', borderRadius: 14, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ backgroundColor: '#ffffff20', borderRadius: 8, padding: 5 }}>
                  <Users color="#fff" size={14} />
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#ffffffcc' }}>Members</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 28, color: '#fff' }}>{data?.members.length ?? 0}</Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#ffffff80', marginTop: 2 }}>farm members</Text>
            </View>
          </View>

          {/* Row 2 — Total KG + Total Sales */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1, backgroundColor: '#155183', borderRadius: 14, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ backgroundColor: '#ffffff20', borderRadius: 8, padding: 5 }}>
                  <PanelsLeftRight color="#fff" size={14} />
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#ffffffcc' }}>Total KG</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 28, color: '#fff' }}>
                {dashboard?.production_summary?.total_quantity?.toFixed(1) ?? '0.0'}
              </Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#ffffff80', marginTop: 2 }}>kg produced</Text>
            </View>

            <View style={{ flex: 1, backgroundColor: '#155183', borderRadius: 14, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ backgroundColor: '#ffffff20', borderRadius: 8, padding: 5 }}>
                  <Users color="#fff" size={14} />
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#ffffffcc' }}>Total Sales</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 24, color: '#fff' }} numberOfLines={1}>
                ₱{dashboard?.production_summary?.total_sales?.toLocaleString() ?? '0'}
              </Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#ffffff80', marginTop: 2 }}>revenue earned</Text>
            </View>
          </View>

          {/* Row 3 — Harvested Trays (full width) */}
          <View style={{ backgroundColor: '#155183', borderRadius: 14, padding: 14, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <View style={{ backgroundColor: '#ffffff20', borderRadius: 8, padding: 5 }}>
                <Boxes color="#fff" size={14} />
              </View>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#ffffffcc' }}>Harvested Trays</Text>
            </View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 28, color: '#fff' }}>
              {dashboard?.session_trays_count_by_day?.reduce((total, item) => total + item.count, 0) ?? 0}
            </Text>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#ffffff80', marginTop: 2 }}>sessions finished</Text>
          </View>
        </View>

        {/* Fish detected chart */}
        <View style={{ paddingTop: 18, paddingBottom: 10, paddingRight: 18, paddingLeft: 10 }}>
          <FarmDashboardBarChart data={dashboard?.detected_and_reject_by_day || []} chartKey={chartKey} />
        </View>

        {/* Production chart */}
        <View style={{ paddingRight: 18, paddingLeft: 10, paddingBottom: 10 }}>
          <FarmProductionChart data={dashboard?.production_by_day || []} chartKey={chartKey} />
        </View>

        {/* Recent harvested trays */}
        <Text className="text-lg px-5 mt-5" style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15 }}>Recent Harvested Trays</Text>
        <View className='flex flex-col'>
          {dashboard?.recent_harvested_trays.map((tray, i) => (
            <View key={i} className='flex flex-col mt-3' style={{ borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginHorizontal: 17 }}>
              <View className='flex flex-row justify-between items-center'>
                <View className='flex-row gap-3 items-center'>
                  <View className='bg-primary p-2' style={{ borderRadius: 999 }}>
                    <PanelsLeftRight color={'#ffffff'} size={20} />
                  </View>
                  <Text className='text-zinc-600' style={{ fontFamily: 'PoppinsBold', fontSize: 13 }}>{tray.tray_name}</Text>
                </View>
                <Text className="text-zinc-400" style={{ fontFamily: "PoppinsMedium", fontSize: 10 }}>
                  {new Date(tray.created_at).toLocaleDateString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, month: "short", day: "numeric", year: "numeric" })}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View className='mt-5' />
      </ScrollView>
    </View>
  )
}

export default Home