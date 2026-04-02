import { View, Text, Pressable, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CircleCheck, FilterIcon, PanelsLeftRightIcon, Play, Plus, Search } from 'lucide-react-native'
import CreateTray from '../../dialogs/CreateTray'
import { useGetFarmTraysQuery } from '@/store/farmTrayApi'
import SkeletonShimmer from '../../SkeletonPlaceholder'
import { router } from 'expo-router'
import ActivateSession from '../../dialogs/ActivateSession'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PRIMARY = '#155183'
const PRIMARY_LIGHT = '#E6F1FB'

type Props = {
  farmId: number
  owner: boolean
}

// ── Filter dropdown ────────────────────────────────────────────────────────────
type FilterProps = {
  statusFilter: 'all' | 'active' | 'inactive'
  setStatusFilter: (v: 'all' | 'active' | 'inactive') => void
  sortFilter: 'newest' | 'latest'
  setSortFilter: (v: 'newest' | 'latest') => void
  olderThan2Days: boolean
  setOlderThan2Days: (v: boolean) => void
}

const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 99,
      backgroundColor: active ? PRIMARY : '#f4f4f5',
      borderWidth: active ? 0 : 0.5,
      borderColor: '#e4e4e7',
    }}
  >
    <Text style={{
      fontSize: 11, fontFamily: active ? 'PoppinsMedium' : 'PoppinsRegular',
      color: active ? '#ffffff' : '#71717a',
    }}>
      {label}
    </Text>
  </Pressable>
)

const FilterPanel = ({
  statusFilter, setStatusFilter,
  sortFilter, setSortFilter,
  olderThan2Days, setOlderThan2Days,
}: FilterProps) => (
  <View style={{
    position: 'absolute', top: 100, right: 20, zIndex: 50,
    backgroundColor: '#ffffff',
    borderRadius: 16, borderWidth: 0.5, borderColor: '#f4f4f5',
    padding: 16, gap: 12, width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  }}>
    {/* Status */}
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 10, fontFamily: 'PoppinsMedium', color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase' }}>
        Status
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <FilterChip label="All"      active={statusFilter === 'all'}      onPress={() => setStatusFilter('all')} />
        <FilterChip label="Active"   active={statusFilter === 'active'}   onPress={() => setStatusFilter('active')} />
        <FilterChip label="Inactive" active={statusFilter === 'inactive'} onPress={() => setStatusFilter('inactive')} />
      </View>
    </View>

    <View style={{ height: 0.5, backgroundColor: '#f4f4f5' }} />

    {/* Sort */}
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 10, fontFamily: 'PoppinsMedium', color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase' }}>
        Sort
      </Text>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <FilterChip label="Newest" active={sortFilter === 'newest'} onPress={() => setSortFilter('newest')} />
        <FilterChip label="Oldest" active={sortFilter === 'latest'} onPress={() => setSortFilter('latest')} />
      </View>
    </View>

    <View style={{ height: 0.5, backgroundColor: '#f4f4f5' }} />

    {/* Toggle */}
    <Pressable
      onPress={() => setOlderThan2Days(!olderThan2Days)}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#3f3f46' }}>Older than 2 days</Text>
      <View style={{
        width: 36, height: 20, borderRadius: 99,
        backgroundColor: olderThan2Days ? PRIMARY : '#e4e4e7',
        justifyContent: 'center',
        paddingHorizontal: 3,
        alignItems: olderThan2Days ? 'flex-end' : 'flex-start',
      }}>
        <View style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: '#ffffff' }} />
      </View>
    </Pressable>
  </View>
)

// ── Tray card ──────────────────────────────────────────────────────────────────
type TrayCardProps = {
  tray: any
  onActivate: () => void
}

const TrayCard = ({ tray, onActivate }: TrayCardProps) => {
  const isActive = tray.status === 'active'
  const daysDiff = tray.latest_session_datetime
    ? (new Date().getTime() - new Date(tray.latest_session_datetime).getTime()) / (1000 * 60 * 60 * 24)
    : null
  const reached2Days = isActive && daysDiff !== null && daysDiff >= 2

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/tray/[id]/dashboard', params: { id: tray.id.toString() } })}
      android_ripple={{ color: '#00000008', borderless: false }}
      style={{
        backgroundColor: '#fafafa',
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: '#f4f4f5',
        padding: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Status icon */}
      <View style={{
        width: 38, height: 38, borderRadius: 11,
        backgroundColor: isActive ? '#dcfce7' : PRIMARY_LIGHT,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <PanelsLeftRightIcon size={16} color={isActive ? '#16a34a' : PRIMARY} />
      </View>

      {/* Name + badge */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }} numberOfLines={1}>
          {tray.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Status pill */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: isActive ? '#dcfce7' : '#f4f4f5',
            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99,
          }}>
            <View style={{
              width: 5, height: 5, borderRadius: 99,
              backgroundColor: isActive ? '#16a34a' : '#a1a1aa',
            }} />
            <Text style={{
              fontSize: 10, fontFamily: 'PoppinsMedium',
              color: isActive ? '#16a34a' : '#a1a1aa',
            }}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>

          {/* 2-day warning */}
          {reached2Days && (
            <View style={{
              backgroundColor: '#fef9c3',
              paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99,
            }}>
              <Text style={{ fontSize: 10, fontFamily: 'PoppinsMedium', color: '#854d0e' }}>
                2 days reached
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Start / Finish button */}
      <Pressable
        onPress={(e) => { e.stopPropagation(); onActivate() }}
        android_ripple={{ color: '#ffffff30', borderless: false }}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 5,
          backgroundColor: isActive ? '#155183' : PRIMARY,
          paddingHorizontal: 12, paddingVertical: 7,
          borderRadius: 99,
          shadowColor: isActive ? '#000' : PRIMARY,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        {isActive
          ? <CircleCheck size={13} color="#ffffff" />
          : <Play size={13} color="#ffffff" />
        }
        <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: '#ffffff' }}>
          {isActive ? 'Finish' : 'Start'}
        </Text>
      </Pressable>
    </Pressable>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
const Trays = ({ farmId, owner }: Props) => {
  const TRAYS_CACHE_KEY = (farmId: number) => `trays_cache_${farmId}`

  const { data: freshData, refetch } = useGetFarmTraysQuery(farmId)
  const [cachedData, setCachedData] = useState<typeof freshData | null>(null)
  const data = freshData ?? cachedData

  const [visible, setVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortFilter, setSortFilter] = useState<'newest' | 'latest'>('newest')
  const [olderThan2Days, setOlderThan2Days] = useState(false)
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [ID, setID] = useState<number | null>(null)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const filteredTrays = (data ?? [])
    .filter(t => t.name?.toLowerCase().includes(search.toLowerCase()))
    .filter(t => statusFilter === 'all' ? true : t.status === statusFilter)
    .filter(t => {
      if (!olderThan2Days) return true
      if (!t.latest_session_datetime) return false
      return (new Date().getTime() - new Date(t.latest_session_datetime).getTime()) / (1000 * 60 * 60 * 24) >= 2
    })
    .sort((a, b) => {
      const aTime = new Date(a.latest_session_datetime ?? 0).getTime()
      const bTime = new Date(b.latest_session_datetime ?? 0).getTime()
      return sortFilter === 'newest' ? bTime - aTime : aTime - bTime
    })

  const activeCount = (data ?? []).filter(t => t.status === 'active').length
  const totalCount = data?.length ?? 0

  useEffect(() => {
    AsyncStorage.getItem(TRAYS_CACHE_KEY(farmId))
      .then(raw => { if (raw) setCachedData(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [farmId])

  useEffect(() => {
    if (!freshData) return
    AsyncStorage.setItem(TRAYS_CACHE_KEY(farmId), JSON.stringify(freshData))
      .catch(e => console.log('Cache save error:', e))
  }, [freshData, farmId])

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <CreateTray visible={visible} setVisible={setVisible} farmId={farmId} />
      <ActivateSession
        visible={show}
        setVisible={setShow}
        trayId={ID!}
        active={data?.find(t => t.id === ID)?.status === 'active'}
      />

      {/* Header */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 10, paddingHorizontal: 15, paddingBottom: 8,
      }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}>Trays</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Active count chip */}
          {totalCount > 0 && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 4,
              backgroundColor: '#f0fdf4', paddingHorizontal: 10,
              paddingVertical: 4, borderRadius: 20,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#16a34a' }} />
              <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a' }}>
                <Text style={{ fontFamily: 'PoppinsSemiBold', color: '#16a34a' }}>{activeCount}</Text>
                {' '}/ {totalCount} active
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Search + Filter row */}
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 15, paddingBottom: 14 }}>
        <View style={{
          flex: 1, flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fafafa', borderRadius: 12,
          borderWidth: 0.5, borderColor: '#f4f4f5',
          paddingHorizontal: 14, gap: 10, height: 42,
        }}>
          <Search size={15} color="#d4d4d8" />
          <TextInput
            style={{ flex: 1, fontFamily: 'PoppinsRegular', fontSize: 13, color: '#18181b' }}
            placeholder="Search trays..."
            placeholderTextColor="#d4d4d8"
            onChangeText={setSearch}
            value={search}
          />
        </View>
        <Pressable
          onPress={() => setShowFilter(prev => !prev)}
          style={{
            width: 42, height: 42, borderRadius: 12,
            backgroundColor: showFilter ? PRIMARY : '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <FilterIcon size={17} color={showFilter ? '#ffffff' : '#71717a'} />
        </Pressable>
      </View>

      {/* Filter panel */}
      {showFilter && (
        <FilterPanel
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          sortFilter={sortFilter} setSortFilter={setSortFilter}
          olderThan2Days={olderThan2Days} setOlderThan2Days={setOlderThan2Days}
        />
      )}

      {/* Tray list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100, gap: 10 }}
        refreshControl={
          <RefreshControl colors={[PRIMARY]} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!data ? (
          <>
            <SkeletonShimmer style={{ height: 72, borderRadius: 16 }} />
            <SkeletonShimmer style={{ height: 72, borderRadius: 16 }} />
            <SkeletonShimmer style={{ height: 72, borderRadius: 16 }} />
          </>
        ) : filteredTrays.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
            <View style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center',
            }}>
              <PanelsLeftRightIcon size={20} color="#d4d4d8" />
            </View>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>
              No trays found
            </Text>
          </View>
        ) : (
          filteredTrays.map((tray) => (
            <TrayCard
              key={tray.id}
              tray={tray}
              onActivate={() => { setShow(true); setID(tray.id) }}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      {owner && (
        <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 999 }}>
          <Pressable
            onPress={() => setVisible(true)}
            android_ripple={{ color: '#ffffff30', borderless: false }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: PRIMARY,
              paddingVertical: 12, paddingHorizontal: 20,
              borderRadius: 99,
              shadowColor: PRIMARY,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#ffffff' }}>
              Create Tray
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default Trays