import { View, Text, ActivityIndicator, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetFarmDashboardQuery, useGetFarmQuery } from '@/store/farmApi'
import { Boxes, CalendarDays, ChevronRight, Megaphone, PanelsLeftRight, TrendingUp, Users } from 'lucide-react-native'
import FarmDashboardBarChart from '../../charts/FarmDashboardBarChart'
import FarmProductionChart from '../../charts/FarmProductionChart'
import { router } from 'expo-router'
import DateRangePicker from '@/components/ui/DateRangeFilter'

const PRIMARY = '#155183'
const PRIMARY_LIGHT = '#E6F1FB'

type Props = { farmId: number }

const displayDate = (str: string) =>
  new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ── Reusable stat box — matches WeatherDashboardBoxes StatBox ──────────────────
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

// ── Main ──────────────────────────────────────────────────────────────────────
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
    setRefreshing(true)
    await refetch()
    setChartKey(prev => prev + 1)
    setTimeout(() => setRefreshing(false), 1000)
  }

  useEffect(() => { refetch() }, [refetch])

  if (dashboardLoading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color={PRIMARY} />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 10, paddingHorizontal: 15, marginBottom: 4,
      }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}>Home</Text>
        <Pressable
          onPress={() => setShowCalendar(true)}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: '#fafafa',
            borderWidth: 0.5, borderColor: '#f4f4f5',
            borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10,
          }}
        >
          <CalendarDays size={13} color={PRIMARY} />
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
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40, gap: 10 }}
        refreshControl={
          <RefreshControl colors={[PRIMARY]} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Announcement banner */}
        {dashboard?.announcement_count && dashboard.announcement_count > 0 ? (
          <Pressable
            onPress={() => router.push({ pathname: '/farm-settings/announcement/[id]', params: { id: farmId.toString() } })}
            android_ripple={{ color: 'rgba(0,0,0,0.04)', borderless: false }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 12,
              backgroundColor: '#fafafa',
              borderRadius: 14, borderWidth: 0.5, borderColor: '#f4f4f5',
              padding: 14, marginTop: 10,
            }}
          >
            <View style={{
              width: 34, height: 34, borderRadius: 10,
              backgroundColor: '#FAEEDA',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Megaphone size={16} color="#854F0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
                Announcements
              </Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>
                {dashboard.announcement_count} new {dashboard.announcement_count === 1 ? 'announcement' : 'announcements'}
              </Text>
            </View>
            <View style={{
              width: 20, height: 20, borderRadius: 99,
              backgroundColor: '#991b1b',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ffffff' }}>
                {dashboard.announcement_count}
              </Text>
            </View>
            <ChevronRight size={16} color="#d4d4d8" />
          </Pressable>
        ) : null}

        {/* Stat grid — row 1 */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          <StatBox
            icon={PanelsLeftRight}
            label="Trays"
            value={dashboard?.tray_count ?? 0}
            unit="total"
            iconBg={PRIMARY_LIGHT}
            iconColor={PRIMARY}
          />
          <StatBox
            icon={Users}
            label="Members"
            value={data?.members.length ?? 0}
            unit="people"
            iconBg="#E1F5EE"
            iconColor="#0F6E56"
          />
        </View>

        {/* Stat grid — row 2 */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatBox
            icon={TrendingUp}
            label="Total KG"
            value={dashboard?.production_summary?.total_quantity?.toFixed(1) ?? '0.0'}
            unit="kg"
            iconBg="#FAEEDA"
            iconColor="#854F0B"
          />
          <StatBox
            icon={TrendingUp}
            label="Total Sales"
            value={`₱${(dashboard?.production_summary?.total_sales ?? 0).toLocaleString()}`}
            iconBg="#F3F0FE"
            iconColor="#534AB7"
          />
        </View>

        {/* Stat grid — row 3 full width */}
        <StatBox
          icon={Boxes}
          label="Harvested Trays"
          value={dashboard?.session_trays_count_by_day?.reduce((total, item) => total + item.count, 0) ?? 0}
          unit="sessions finished"
          iconBg="#FEF0F0"
          iconColor="#A32D2D"
          fullWidth
        />

        {/* Fish detected chart */}
        <FarmDashboardBarChart data={dashboard?.detected_and_reject_by_day || []} chartKey={chartKey} />

        {/* Production chart */}
        <FarmProductionChart data={dashboard?.production_by_day || []} chartKey={chartKey} />

        {/* Recent harvested trays */}
        {(dashboard?.recent_harvested_trays?.length ?? 0) > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase',
            }}>
              Recent Harvested Trays
            </Text>
            <View style={{
              backgroundColor: '#fafafa', borderRadius: 16,
              borderWidth: 0.5, borderColor: '#f4f4f5', overflow: 'hidden',
            }}>
              {dashboard?.recent_harvested_trays.map((tray, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    padding: 14, paddingHorizontal: 16,
                    borderBottomWidth: i < (dashboard.recent_harvested_trays.length - 1) ? 0.5 : 0,
                    borderBottomColor: '#f4f4f5',
                  }}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: 10,
                    backgroundColor: PRIMARY_LIGHT,
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <PanelsLeftRight size={15} color={PRIMARY} />
                  </View>
                  <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b', flex: 1 }}>
                    {tray.tray_name}
                  </Text>
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>
                    {new Date(tray.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  )
}

export default Home