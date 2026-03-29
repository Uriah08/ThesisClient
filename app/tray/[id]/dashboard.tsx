import { View, Pressable, ActivityIndicator, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, PanelsLeftRight, CircleCheck, Play, CalendarDays, Fish, AlertTriangle, CheckCircle } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetFarmTrayByIdQuery, useTrayDashboardQuery } from '@/store/farmTrayApi'
import { useGetTrayByIdQuery } from '@/store/trayApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import FarmDashboardBarChart from '@/components/containers/charts/FarmDashboardBarChart'
import DateRangePicker from '@/components/ui/DateRangeFilter'

const displayDate = (str: string) =>
  new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const Dashboard = () => {
  const { id } = useLocalSearchParams()
  const [show, setShow] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [chartKey, setChartKey] = useState(0)

  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)

  const { data, isLoading } = useGetFarmTrayByIdQuery(Number(id))
  const { data: sessionTray, isLoading: sessionTrayLoading } = useGetTrayByIdQuery(data?.id, { skip: !data?.id })
  const { data: dashboard, isLoading: dashboardLoading, refetch } = useTrayDashboardQuery({
    id: Number(id),
    from: from ?? undefined,
    to: to ?? undefined,
  })

  useEffect(() => {
    const storeActiveTrayId = async () => {
      await AsyncStorage.setItem('active_tray_id', sessionTray?.active_session_tray?.id?.toString() || '')
    }
    storeActiveTrayId()
  }, [sessionTray?.active_session_tray?.id])

  useEffect(() => { refetch() }, [refetch])

  const onRefresh = async () => {
    await refetch()
    setRefreshing(true)
    setChartKey(prev => prev + 1)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const harvestTrays = dashboard?.session_tray_count.reduce((total, item) => total + item.count, 0) ?? 0
  const summary = dashboard?.detection_summary
  const rejectRate = summary?.reject_rate ?? 0
  const isHighReject = rejectRate > 15

  if (isLoading || sessionTrayLoading || dashboardLoading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{ backgroundColor: '#155183', paddingTop: 48, paddingBottom: 20, paddingHorizontal: 20 }}>
        <ActivateSession visible={show} setVisible={setShow} trayId={data?.id || Number(id)} active={data?.status === 'active'} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable onPress={() => router.back()} android_ripple={{ color: '#ffffff30', borderless: true }}>
              <ArrowLeft color="#fff" size={24} />
            </Pressable>
            <View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 18, color: '#fff' }}>
                {data?.name && data.name.length > 14 ? `${data.name.slice(0, 14)}...` : data?.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <View style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: data?.status === 'active' ? '#4ade80' : '#94a3b8' }} />
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ffffffaa', marginTop: 2 }}>
                  {data?.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>

          {/* Date filter */}
          <Pressable
            onPress={() => setShowCalendar(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ffffff20', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 8 }}
          >
            <CalendarDays size={12} color="#fff" />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#fff' }}>
              {from && to ? `${displayDate(from)} – ${displayDate(to)}` : 'All time'}
            </Text>
          </Pressable>
        </View>

        {/* Reject rate warning banner */}
        {isHighReject && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#7f1d1d50', borderRadius: 10, padding: 10, marginTop: 14 }}>
            <AlertTriangle size={14} color="#fca5a5" />
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: '#fca5a5', flex: 1 }}>
              High reject rate detected — {rejectRate}% of fish were rejected
            </Text>
          </View>
        )}
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
        refreshControl={<RefreshControl colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Stat cards */}
        <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 10 }}>

          {/* Row 1 — Harvested + Reject rate */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: '#155183', borderRadius: 14, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ backgroundColor: '#ffffff20', borderRadius: 8, padding: 5 }}>
                  <PanelsLeftRight color="#fff" size={14} />
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#ffffffcc' }}>Harvested</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 28, color: '#fff' }}>{harvestTrays}</Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#ffffff80', marginTop: 2 }}>sessions finished</Text>
            </View>

            <View style={{ flex: 1, backgroundColor: isHighReject ? '#7f1d1d' : '#155183', borderRadius: 14, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ backgroundColor: '#ffffff20', borderRadius: 8, padding: 5 }}>
                  {isHighReject
                    ? <AlertTriangle color="#fca5a5" size={14} />
                    : <CheckCircle color="#fff" size={14} />
                  }
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#ffffffcc' }}>Reject Rate</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 28, color: isHighReject ? '#fca5a5' : '#fff' }}>
                {rejectRate}%
              </Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#ffffff80', marginTop: 2 }}>
                {isHighReject ? 'Above 15% threshold' : 'Within normal range'}
              </Text>
            </View>
          </View>

          {/* Row 2 — Detected + Rejects */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: '#eff6ff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#bfdbfe' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Fish size={13} color="#155183" />
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: '#155183' }}>Total Detected</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 26, color: '#155183' }}>{summary?.total_detected ?? 0}</Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#93c5fd', marginTop: 2 }}>fish counted</Text>
            </View>

            <View style={{ flex: 1, backgroundColor: '#fff1f2', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#fecdd3' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Fish size={13} color="#e05252" />
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: '#e05252' }}>Total Rejects</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 26, color: '#e05252' }}>{summary?.total_rejects ?? 0}</Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#fda4af', marginTop: 2 }}>fish rejected</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={{ paddingTop: 18, paddingBottom: 10, paddingRight: 18, paddingLeft: 10 }}>
          <FarmDashboardBarChart data={dashboard?.detected_and_reject_by_day || []} chartKey={chartKey} />
        </View>
      </ScrollView>

      {/* FAB */}
      <View style={{ position: 'absolute', bottom: 24, right: 20, borderRadius: 999, overflow: 'hidden' }}>
        <Pressable
          onPress={() => setShow(true)}
          android_ripple={{ color: '#ffffff50', borderless: false }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#155183', borderRadius: 999 }}
        >
          {data?.status === 'active'
            ? <CircleCheck size={14} color="#fff" />
            : <Play size={14} color="#fff" />
          }
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#fff' }}>
            {data?.status === 'active' ? 'Finish Drying' : 'Start Drying'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Dashboard