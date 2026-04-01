import {
  View, Text, Pressable, Image, ScrollView,
  TextInput, ActivityIndicator, RefreshControl,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Filter, MapPlus, Plus, Search, Users } from 'lucide-react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
} from 'react-native-reanimated'
import CreateFarm from '@/components/containers/dialogs/CreateFarm'
import JoinFarm from '@/components/containers/dialogs/JoinFarm'
import GetFarm from '@/components/containers/farm/GetFarm'
import { useGetFarmsQuery } from '@/store/farmApi'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import { Farm as FarmType } from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ChosenFarm from '@/components/containers/farm/ChosenFarm'
import Lesson from '@/components/containers/lessons/Lesson'

// ─── filter option ─────────────────────────────────────────────────────────────
type FilterOptionProps = {
  label: string
  active: boolean
  onPress: () => void
}
const FilterOption = ({ label, active, onPress }: FilterOptionProps) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: '#f4f4f5', borderless: false }}
    style={{
      paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: active ? '#EBF2F9' : 'transparent',
    }}>
    <Text style={{
      fontSize: 13, fontFamily: active ? 'PoppinsMedium' : 'PoppinsRegular',
      color: active ? '#155183' : '#52525b',
    }}>
      {label}
    </Text>
  </Pressable>
)

// ─── main screen ───────────────────────────────────────────────────────────────
const Farm = () => {
  const { user } = useAuthRedirect()
  const { data, refetch, isLoading, isFetching } = useGetFarmsQuery()
  const farms = data ?? []

  const [active, setActive]                   = useState(false)
  const [filterActive, setFilterActive]       = useState('newest')
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'owned' | 'not_owned'>('all')
  const [search, setSearch]                   = useState('')
  const [showFilter, setShowFilter]           = useState(false)
  const [selectedFarm, setSelectedFarm]       = useState<FarmType | null>(null)
  const [loading, setLoading]                 = useState(false)
  const [refreshing, setRefreshing]           = useState(false)
  const [createVisible, setCreateVisible]     = useState(false)
  const [joinVisible, setJoinVisible]         = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 1000)
  }

  // ── FAB animations ──────────────────────────────────────────────────────────
  const opacity1     = useSharedValue(0)
  const translateY1  = useSharedValue(16)
  const opacity2     = useSharedValue(0)
  const translateY2  = useSharedValue(16)
  const rotation     = useSharedValue(0)

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }],
  }))
  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: translateY2.value }],
  }))
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const toggleButtons = () => {
    const opening = !active
    setActive(opening)
    rotation.value = withTiming(opening ? -45 : 0)
    if (opening) {
      opacity1.value    = withTiming(1)
      translateY1.value = withTiming(0)
      opacity2.value    = withTiming(1, { duration: 200 })
      translateY2.value = withTiming(0, { duration: 300 })
    } else {
      opacity1.value    = withTiming(0)
      translateY1.value = withTiming(16)
      opacity2.value    = withTiming(0, { duration: 200 })
      translateY2.value = withTiming(16, { duration: 300 })
    }
  }

  useEffect(() => {
    const loadFarm = async () => {
      setLoading(true)
      try {
        const storedFarm = await AsyncStorage.getItem('farm')
        if (storedFarm) {
          const parsed = JSON.parse(storedFarm)
          setSelectedFarm(parsed.farm)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    loadFarm()
    refetch()
  }, [refetch])

  const filteredFarms = farms
    .filter(farm => farm.name.toLowerCase().includes(search.toLowerCase()))
    .filter(farm => {
      if (ownershipFilter === 'owned')     return farm.owner === Number(user?.id)
      if (ownershipFilter === 'not_owned') return farm.owner !== Number(user?.id)
      return true
    })
    .sort((a, b) => {
      if (filterActive === 'az')     return a.name.localeCompare(b.name)
      if (filterActive === 'za')     return b.name.localeCompare(a.name)
      if (filterActive === 'newest') return new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
      if (filterActive === 'latest') return new Date(a.create_at).getTime() - new Date(b.create_at).getTime()
      return 0
    })

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={28} color="#155183" />
    </View>
  )

  if (selectedFarm) return (
    <ChosenFarm
      onBack={() => setSelectedFarm(null)}
      selectedFarm={selectedFarm}
      setSelectedFarm={setSelectedFarm}
    />
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        paddingTop: 56, paddingHorizontal: 15, paddingBottom: 12, gap: 14,
      }}>
        <Text style={{ fontSize: 26, fontFamily: 'PoppinsBold', color: '#18181b' }}>
          Drying Areas
        </Text>

        {/* search + filter row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, position: 'relative' }}>
            <TextInput
              style={{
                borderRadius: 10, borderWidth: 0.5, borderColor: '#e4e4e7',
                backgroundColor: '#fafafa',
                paddingLeft: 38, paddingRight: 14, paddingVertical: 10,
                fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b',
              }}
              placeholder="Search drying areas…"
              placeholderTextColor="#d4d4d8"
              onChangeText={setSearch}
              value={search}
            />
            <Search
              size={14} color="#d4d4d8"
              style={{ position: 'absolute', left: 13, top: 12 }}
            />
          </View>
          <Pressable
            onPress={() => setShowFilter(prev => !prev)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              backgroundColor: showFilter ? '#EBF2F9' : '#fafafa',
              borderWidth: 0.5,
              borderColor: showFilter ? '#155183' : '#e4e4e7',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <Filter size={15} color={showFilter ? '#155183' : '#71717a'} />
          </Pressable>
        </View>
      </View>

      {/* filter dropdown */}
      {showFilter && (
        <>
          <Pressable
            onPress={() => setShowFilter(false)}
            style={{ position: 'absolute', inset: 0, zIndex: 40 }}
          />
          <View style={{
            position: 'absolute', top: 148, right: 24,
            zIndex: 50, width: 180,
            backgroundColor: '#ffffff',
            borderRadius: 14, borderWidth: 0.5, borderColor: '#e4e4e7',
            padding: 8,
            shadowColor: '#000', shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
            elevation: 6,
          }}>
            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase',
              paddingHorizontal: 4, paddingBottom: 6,
            }}>
              Ownership
            </Text>
            <FilterOption label="All Areas" active={ownershipFilter === 'all'}     onPress={() => setOwnershipFilter('all')} />
            <FilterOption label="Owned"     active={ownershipFilter === 'owned'}   onPress={() => setOwnershipFilter('owned')} />
            <FilterOption label="Not Owned" active={ownershipFilter === 'not_owned'} onPress={() => setOwnershipFilter('not_owned')} />

            <View style={{ height: 0.5, backgroundColor: '#f4f4f5', marginVertical: 6 }} />

            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase',
              paddingHorizontal: 4, paddingBottom: 6,
            }}>
              Sort
            </Text>
            <FilterOption label="Newest"   active={filterActive === 'newest'} onPress={() => setFilterActive('newest')} />
            <FilterOption label="Oldest"   active={filterActive === 'latest'} onPress={() => setFilterActive('latest')} />
            <FilterOption label="A → Z"    active={filterActive === 'az'}     onPress={() => setFilterActive('az')} />
            <FilterOption label="Z → A"    active={filterActive === 'za'}     onPress={() => setFilterActive('za')} />
          </View>
        </>
      )}

      <ScrollView
        style={{ marginTop: 4 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={['#155183']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Lesson />
        <GetFarm
          data={filteredFarms}
          isLoading={isLoading}
          onSelect={(farm) => setSelectedFarm(farm)}
          isFetching={isFetching}
        />
        {/* bottom padding so FAB doesn't cover last item */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <CreateFarm visible={createVisible} setVisible={setCreateVisible} onSelect={(farm) => setSelectedFarm(farm)} />
      <JoinFarm visible={joinVisible} setVisible={setJoinVisible} />

      {/* FAB stack */}
      <View style={{
        position: 'absolute', bottom: 24, right: 24,
        alignItems: 'flex-end', gap: 10,
      }}>
        {/* Create Area */}
        <Animated.View style={animatedStyle2}>
          <Pressable
            onPress={() => { setCreateVisible(true); toggleButtons() }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: '#155183',
              paddingHorizontal: 18, paddingVertical: 12,
              borderRadius: 999,
              shadowColor: '#155183', shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 4 }, shadowRadius: 10,
              elevation: 6,
            }}>
            <MapPlus size={16} color="#ffffff" />
            <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
              Create Area
            </Text>
          </Pressable>
        </Animated.View>

        {/* Join Area */}
        <Animated.View style={animatedStyle1}>
          <Pressable
            onPress={() => { setJoinVisible(true); toggleButtons() }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: '#ffffff',
              borderWidth: 0.5, borderColor: '#e4e4e7',
              paddingHorizontal: 18, paddingVertical: 12,
              borderRadius: 999,
              shadowColor: '#000', shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 4 }, shadowRadius: 10,
              elevation: 4,
            }}>
            <Users size={16} color="#155183" />
            <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#155183' }}>
              Join Area
            </Text>
          </Pressable>
        </Animated.View>

        {/* FAB trigger */}
        <Pressable
          onPress={toggleButtons}
          style={{
            width: 48, height: 48, borderRadius: 24,
            backgroundColor: '#155183',
            alignItems: 'center', justifyContent: 'center',
            shadowColor: '#155183', shadowOpacity: 0.35,
            shadowOffset: { width: 0, height: 4 }, shadowRadius: 10,
            elevation: 6,
          }}>
          <Animated.View style={animatedIconStyle}>
            <Plus size={20} color="#ffffff" />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  )
}

export default Farm