import { View, Text, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Plus, MapPin, Package, TrendingUp, FilterIcon, Search, List, LayoutDashboard } from 'lucide-react-native'
import AddRecord from '../../dialogs/AddRecord'
import { useGetProductionsQuery } from '@/store/productionApi'
import { FarmProduction } from '@/utils/types'
import { router } from 'expo-router'

const PRIMARY = '#155183'
const PRIMARY_LIGHT = '#E6F1FB'

type ProductionProps = {
  owner: boolean
  farmId: number
}

const EMOJIS = ['😞', '😐', '🙂', '😊', '😁']

// ── Filter chip ────────────────────────────────────────────────────────────────
const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
      backgroundColor: active ? PRIMARY : '#f4f4f5',
      borderWidth: active ? 0 : 0.5, borderColor: '#e4e4e7',
    }}
  >
    <Text style={{
      fontSize: 11,
      fontFamily: active ? 'PoppinsMedium' : 'PoppinsRegular',
      color: active ? '#ffffff' : '#71717a',
    }}>
      {label}
    </Text>
  </Pressable>
)

// ── Filter panel ───────────────────────────────────────────────────────────────
const FilterPanel = ({
  sortFilter, setSortFilter,
}: {
  sortFilter: 'newest' | 'latest'
  setSortFilter: (v: 'newest' | 'latest') => void
}) => (
  <View style={{
    position: 'absolute', top: 100, right: 20, zIndex: 50,
    backgroundColor: '#ffffff',
    borderRadius: 16, borderWidth: 0.5, borderColor: '#f4f4f5',
    padding: 16, gap: 10, width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 6,
  }}>
    <Text style={{
      fontSize: 10, fontFamily: 'PoppinsMedium',
      color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase',
    }}>
      Sort by
    </Text>
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <FilterChip label="Newest" active={sortFilter === 'newest'} onPress={() => setSortFilter('newest')} />
      <FilterChip label="Oldest" active={sortFilter === 'latest'} onPress={() => setSortFilter('latest')} />
    </View>
  </View>
)

// ── Production card (grid view) ────────────────────────────────────────────────
const ProductionCard = ({ item }: { item: FarmProduction }) => {
  const date = new Date(item.created_at).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/production/[id]/production', params: { id: item.id.toString() } })}
      android_ripple={{ color: '#00000008', borderless: false }}
      style={{
        backgroundColor: '#fafafa',
        borderRadius: 16, borderWidth: 0.5, borderColor: '#f4f4f5',
        padding: 16, marginBottom: 10,
      }}
    >
      {/* Title row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <Text numberOfLines={1} style={{
          fontFamily: 'PoppinsSemiBold', fontSize: 14,
          color: '#18181b', flex: 1, marginRight: 8,
        }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 18 }}>{EMOJIS[(item.satisfaction ?? 3) - 1]}</Text>
      </View>

      {/* Meta pills */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 5,
          backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 10,
          paddingVertical: 4, borderRadius: 99,
        }}>
          <Package size={12} color={PRIMARY} />
          <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 11, color: PRIMARY }}>
            {item.quantity} kg
          </Text>
        </View>
        {item.landing && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: '#f4f4f5', paddingHorizontal: 10,
            paddingVertical: 4, borderRadius: 99,
          }}>
            <MapPin size={12} color="#71717a" />
            <Text numberOfLines={1} style={{
              fontFamily: 'PoppinsRegular', fontSize: 11,
              color: '#3f3f46', maxWidth: 120,
            }}>
              {item.landing}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{
          backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 8,
          paddingVertical: 3, borderRadius: 99,
        }}>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: PRIMARY }}>
            #{item.id}
          </Text>
        </View>
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>
          {date}
        </Text>
      </View>
    </Pressable>
  )
}

// ── Production row (list view) ─────────────────────────────────────────────────
const ProductionRow = ({ item, isLast }: { item: FarmProduction; isLast: boolean }) => {
  const date = new Date(item.created_at).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric',
  })

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/production/[id]/production', params: { id: item.id.toString() } })}
      android_ripple={{ color: '#00000008', borderless: false }}
      style={{
        flexDirection: 'row', alignItems: 'center',
        gap: 12, padding: 14, paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: '#f4f4f5',
      }}
    >
      <Text style={{ fontSize: 16, width: 22, textAlign: 'center' }}>
        {EMOJIS[(item.satisfaction ?? 3) - 1]}
      </Text>
      <Text numberOfLines={1} style={{
        fontFamily: 'PoppinsSemiBold', fontSize: 13,
        color: '#18181b', flex: 1,
      }}>
        {item.title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Package size={11} color={PRIMARY} />
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#3f3f46' }}>
          {item.quantity} kg
        </Text>
      </View>
      <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa', width: 58, textAlign: 'right' }}>
        {date}
      </Text>
    </Pressable>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
const Production = ({ owner, farmId }: ProductionProps) => {
  const [visible, setVisible] = useState(false)
  const [format, setFormat] = useState(true)
  const { data, isLoading } = useGetProductionsQuery(farmId)
  const [showFilter, setShowFilter] = useState(false)
  const [sortFilter, setSortFilter] = useState<'newest' | 'latest'>('newest')
  const [search, setSearch] = useState('')

  const filteredData = [...(data ?? [])]
    .filter(item => item.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortFilter === 'newest'
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

  const totalKg = data?.reduce((sum: number, p: FarmProduction) => sum + Number(p.quantity), 0) ?? 0

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <AddRecord visible={visible} setVisible={setVisible} farmId={farmId} />

      {/* Header */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 10, paddingHorizontal: 15, paddingBottom: 8,
      }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}>Production</Text>
        {totalKg > 0 && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: PRIMARY_LIGHT, paddingHorizontal: 10,
            paddingVertical: 4, borderRadius: 20,
          }}>
            <TrendingUp size={11} color={PRIMARY} />
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: PRIMARY }}>
              {totalKg} kg total
            </Text>
          </View>
        )}
      </View>

      {/* Search + controls */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 15, paddingBottom: 14 }}>
        <View style={{
          flex: 1, flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fafafa', borderRadius: 12,
          borderWidth: 0.5, borderColor: '#f4f4f5',
          paddingHorizontal: 14, gap: 10, height: 42,
        }}>
          <Search size={15} color="#d4d4d8" />
          <TextInput
            style={{ flex: 1, fontFamily: 'PoppinsRegular', fontSize: 13, color: '#18181b' }}
            placeholder="Search production..."
            placeholderTextColor="#d4d4d8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter button */}
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

        {/* View toggle */}
        <Pressable
          onPress={() => setFormat(f => !f)}
          style={{
            width: 42, height: 42, borderRadius: 12,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {format
            ? <List size={17} color="#71717a" />
            : <LayoutDashboard size={17} color="#71717a" />
          }
        </Pressable>
      </View>

      {/* Filter panel */}
      {showFilter && (
        <FilterPanel sortFilter={sortFilter} setSortFilter={setSortFilter} />
      )}

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={PRIMARY} />
        </View>
      ) : !filteredData || filteredData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, gap: 8 }}>
          <View style={{
            width: 52, height: 52, borderRadius: 14,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 4,
          }}>
            <Package size={24} color="#d4d4d8" />
          </View>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#3f3f46', textAlign: 'center' }}>
            No records yet
          </Text>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa', textAlign: 'center' }}>
            {owner ? 'Tap "Add Record" to log your first production.' : 'No production records have been added.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100 }}
        >
          {/* List view header */}
          {!format && (
            <>
              <View style={{
                backgroundColor: '#fafafa', borderRadius: 16,
                borderWidth: 0.5, borderColor: '#f4f4f5',
                overflow: 'hidden',
              }}>
                {/* Column headers */}
                <View style={{
                  flexDirection: 'row', paddingHorizontal: 16,
                  paddingVertical: 10, borderBottomWidth: 0.5,
                  borderBottomColor: '#f4f4f5',
                }}>
                  <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#a1a1aa', flex: 1, marginLeft: 34, letterSpacing: 0.6 }}>
                    TITLE
                  </Text>
                  <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#a1a1aa', width: 55, letterSpacing: 0.6 }}>
                    QTY
                  </Text>
                  <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#a1a1aa', width: 58, textAlign: 'right', letterSpacing: 0.6 }}>
                    DATE
                  </Text>
                </View>

                {filteredData.map((item: FarmProduction, i) => (
                  <ProductionRow key={item.id} item={item} isLast={i === filteredData.length - 1} />
                ))}
              </View>
            </>
          )}

          {/* Card view */}
          {format && filteredData.map((item: FarmProduction) => (
            <ProductionCard key={item.id} item={item} />
          ))}
        </ScrollView>
      )}

      {/* FAB */}
      {owner && (
        <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 999 }}>
          <Pressable
            onPress={() => setVisible(true)}
            android_ripple={{ color: '#ffffff30', borderless: false }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: PRIMARY, paddingVertical: 12,
              paddingHorizontal: 20, borderRadius: 99,
              shadowColor: PRIMARY,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
            }}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={{ color: '#fff', fontFamily: 'PoppinsSemiBold', fontSize: 13 }}>
              Add Record
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default Production