import { View, Pressable, ActivityIndicator, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  ArrowLeft, PanelsLeftRight, CircleCheck, Play,
  CalendarDays, Fish, AlertTriangle, CheckCircle
} from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetFarmTrayByIdQuery, useTrayDashboardQuery } from '@/store/farmTrayApi'
import { useGetTrayByIdQuery } from '@/store/trayApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import FarmDashboardBarChart from '@/components/containers/charts/FarmDashboardBarChart'
import DateRangePicker from '@/components/ui/DateRangeFilter'

const PRIMARY = '#155183'

const displayDate = (str: string) =>
  new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ── StatBox — same as FarmDashboard ──────────────────────────────────────────
type StatBoxProps = {
  icon: any
  label: string
  value: string | number
  unit?: string
  iconBg: string
  iconColor: string
  fullWidth?: boolean
}

const StatBox = ({ icon: Icon, label, value, unit, iconBg, iconColor, fullWidth }: StatBoxProps) => (
  <View style={{
    flex: fullWidth ? undefined : 1,
    width: fullWidth ? '100%' : undefined,
    padding: 14,
    backgroundColor: '#fafafa',
    borderRadius: 14, borderWidth: 0.5, borderColor: '#f4f4f5',
    gap: 10,
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{
        width: 30, height: 30, borderRadius: 8,
        backgroundColor: iconBg,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color={iconColor} />
      </View>
      <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
        {label}
      </Text>
    </View>
    <Text style={{ fontSize: 26, fontFamily: 'PoppinsBold', color: '#18181b' }}>
      {value}
      {unit && (
        <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          {' '}{unit}
        </Text>
      )}
    </Text>
  </View>
)

// ── Main ─────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { id } = useLocalSearchParams()

  const TRAY_CACHE_KEY        = (id: number) => `tray_cache_${id}`
  const SESSION_CACHE_KEY     = (id: number) => `session_tray_cache_${id}`
  const DASHBOARD_CACHE_KEY   = (id: number, from: string | null, to: string | null) => 
    `tray_dashboard_cache_${id}_${from ?? 'null'}_${to ?? 'null'}`
  const [show, setShow]               = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [refreshing, setRefreshing]   = useState(false)
  const [chartKey, setChartKey]       = useState(0)
  const [from, setFrom]               = useState<string | null>(null)
  const [to, setTo]                   = useState<string | null>(null)

  const { data: freshData }                                          = useGetFarmTrayByIdQuery(Number(id))
  const { data: freshSessionTray }                                   = useGetTrayByIdQuery(freshData?.id, { skip: !freshData?.id })
  const { data: freshDashboard, refetch }                            = useTrayDashboardQuery({
    id: Number(id),
    from: from ?? undefined,
    to: to ?? undefined,
  })

  const [cachedData, setCachedData]               = useState<typeof freshData | null>(null)
  const [cachedSessionTray, setCachedSessionTray] = useState<typeof freshSessionTray | null>(null)
  const [cachedDashboard, setCachedDashboard]     = useState<typeof freshDashboard | null>(null)

  const data        = freshData        ?? cachedData
  const sessionTray = freshSessionTray ?? cachedSessionTray
  const dashboard   = freshDashboard   ?? cachedDashboard

  useEffect(() => {
    AsyncStorage.getItem(TRAY_CACHE_KEY(Number(id)))
      .then(raw => { if (raw) setCachedData(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [id])

  useEffect(() => {
    if (!freshData) return
    AsyncStorage.setItem(TRAY_CACHE_KEY(Number(id)), JSON.stringify(freshData))
      .catch(e => console.log('Cache save error:', e))
  }, [freshData, id])

  useEffect(() => {
    if (!freshData?.id) return
    AsyncStorage.getItem(SESSION_CACHE_KEY(freshData.id))
      .then(raw => { if (raw) setCachedSessionTray(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [freshData?.id])

  useEffect(() => {
    if (!freshSessionTray || !freshData?.id) return
    AsyncStorage.setItem(SESSION_CACHE_KEY(freshData.id), JSON.stringify(freshSessionTray))
      .catch(e => console.log('Cache save error:', e))
  }, [freshSessionTray, freshData?.id])

  useEffect(() => {
    AsyncStorage.getItem(DASHBOARD_CACHE_KEY(Number(id), from, to))
      .then(raw => { if (raw) setCachedDashboard(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [id, from, to])

  useEffect(() => {
    if (!freshDashboard) return
    AsyncStorage.setItem(DASHBOARD_CACHE_KEY(Number(id), from, to), JSON.stringify(freshDashboard))
      .catch(e => console.log('Cache save error:', e))
  }, [freshDashboard, id, from, to])

  useEffect(() => {
    const store = async () => {
      await AsyncStorage.setItem('active_tray_id', sessionTray?.active_session_tray?.id?.toString() || '')
    }
    store()
  }, [sessionTray?.active_session_tray?.id])

  useEffect(() => { refetch() }, [refetch])

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setChartKey(prev => prev + 1)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const harvestTrays  = dashboard?.session_tray_count.reduce((t, i) => t + i.count, 0) ?? 0
  const summary       = dashboard?.detection_summary
  const rejectRate    = summary?.reject_rate ?? 0
  const isHighReject  = rejectRate > 15

  if (!data || !dashboard) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color={PRIMARY} />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        paddingTop: 56, paddingBottom: 16, paddingHorizontal: 24,
        borderBottomWidth: 0.5, borderBottomColor: '#f4f4f5',
      }}>
        <ActivateSession
          visible={show} setVisible={setShow}
          trayId={data?.id || Number(id)}
          active={data?.status === 'active'}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: '#f4f4f5',
                alignItems: 'center', justifyContent: 'center',
              }}>
              <ArrowLeft size={18} color="#18181b" />
            </Pressable>
            <View>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 17, color: '#18181b' }}>
                {data?.name && data.name.length > 16 ? `${data.name.slice(0, 16)}…` : data?.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <View style={{
                  width: 7, height: 7, borderRadius: 99,
                  backgroundColor: data?.status === 'active' ? '#4ade80' : '#d4d4d8',
                }} />
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>
                  {data?.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>

          {/* Date filter */}
          <Pressable
            onPress={() => setShowCalendar(true)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: '#fafafa',
              borderWidth: 0.5, borderColor: '#f4f4f5',
              borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10,
            }}>
            <CalendarDays size={13} color={PRIMARY} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#52525b' }}>
              {from && to ? `${displayDate(from)} – ${displayDate(to)}` : 'All time'}
            </Text>
          </Pressable>
        </View>

        {/* High reject warning */}
        {isHighReject && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: '#FCEBEB',
            borderRadius: 12, padding: 12, marginTop: 14,
            borderWidth: 0.5, borderColor: '#fecaca',
          }}>
            <View style={{
              width: 28, height: 28, borderRadius: 8,
              backgroundColor: '#fee2e2',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={13} color="#A32D2D" />
            </View>
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: '#A32D2D', flex: 1 }}>
              High reject rate — {rejectRate}% of fish were rejected
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl colors={[PRIMARY]} refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, gap: 10, paddingTop: 16 }}
      >
        {/* Dry / Undried Progress Card */}
        {(dashboard?.dry !== undefined && dashboard?.undried !== undefined) && (() => {
          const dry     = dashboard.dry ?? 0
          const undried = dashboard.undried ?? 0
          const total   = dry + undried
          const dryPct  = total > 0 ? Math.round((dry / total) * 100) : 0
          const undriedPct = total > 0 ? 100 - dryPct : 0

          return (
            <View style={{
              width: '100%',
              padding: 14,
              backgroundColor: '#fafafa',
              borderRadius: 14, borderWidth: 0.5, borderColor: '#f4f4f5',
              gap: 12,
            }}>
              {/* Header row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{
                  width: 30, height: 30, borderRadius: 8,
                  backgroundColor: '#E6F1FB',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Fish size={15} color={PRIMARY} />
                </View>
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
                  Current Batch Quality
                </Text>
              </View>

              {/* Two values */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 22, fontFamily: 'PoppinsBold', color: '#18181b' }}>
                    {dry}
                    <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}> dry</Text>
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: PRIMARY }} />
                    <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
                      {dryPct}% of batch
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 2 }}>
                  <Text style={{ fontSize: 22, fontFamily: 'PoppinsBold', color: '#18181b' }}>
                    {undried}
                    <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}> undried</Text>
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: '#d4d4d8' }} />
                    <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
                      {undriedPct}% of batch
                    </Text>
                  </View>
                </View>
              </View>

              {/* Split progress bar */}
              <View style={{ height: 8, borderRadius: 99, backgroundColor: '#f4f4f5', flexDirection: 'row', overflow: 'hidden' }}>
                {dryPct > 0 && (
                  <View style={{ width: `${dryPct}%`, backgroundColor: PRIMARY, borderRadius: 99 }} />
                )}
              </View>

              {/* Total */}
              {total > 0 && (
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa', textAlign: 'center' }}>
                  {total} fish total detected in the latest timeline
                </Text>
              )}
            </View>
          )
        })()}

        {/* Row 1 — Harvested + Reject rate */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatBox
            icon={PanelsLeftRight}
            label="Harvested"
            value={harvestTrays}
            unit="sessions"
            iconBg="#E6F1FB"
            iconColor={PRIMARY}
          />
          <StatBox
            icon={isHighReject ? AlertTriangle : CheckCircle}
            label="Reject Rate"
            value={`${rejectRate}%`}
            iconBg={isHighReject ? '#FCEBEB' : '#E1F5EE'}
            iconColor={isHighReject ? '#A32D2D' : '#0F6E56'}
          />
        </View>

        {/* Row 2 — Detected + Rejects */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatBox
            icon={Fish}
            label="Total Detected"
            value={summary?.total_detected ?? 0}
            unit="fish"
            iconBg="#E6F1FB"
            iconColor={PRIMARY}
          />
          <StatBox
            icon={Fish}
            label="Total Rejects"
            value={summary?.total_rejects ?? 0}
            unit="fish"
            iconBg="#FCEBEB"
            iconColor="#A32D2D"
          />
        </View>

        {/* Chart */}
        <FarmDashboardBarChart
          data={dashboard?.detected_and_reject_by_day || []}
          chartKey={chartKey}
        />

      </ScrollView>

      {/* FAB */}
      <View style={{ position: 'absolute', bottom: 24, right: 20 }}>
        <Pressable
          onPress={() => setShow(true)}
          android_ripple={{ color: '#ffffff50', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            paddingHorizontal: 20, paddingVertical: 12,
            backgroundColor: PRIMARY, borderRadius: 999,
          }}>
          {data?.status === 'active'
            ? <CircleCheck size={14} color="#fff" />
            : <Play size={14} color="#fff" />
          }
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#fff' }}>
            {data?.status === 'active' ? 'Finish Drying' : 'Start Drying'}
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

    </View>
  )
}

export default Dashboard