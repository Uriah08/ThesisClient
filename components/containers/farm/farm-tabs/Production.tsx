import { View, Text, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Plus, MapPin, Package, TrendingUp, FilterIcon, Search, List, LayoutDashboard } from 'lucide-react-native'
import AddRecord from '../../dialogs/AddRecord'
import { useGetProductionsQuery } from '@/store/productionApi'
import { FarmProduction } from '@/utils/types'
import { router } from 'expo-router'

type ProductionProps = {
    owner: boolean
    farmId: number
}

const EMOJIS = ['😞', '😐', '🙂', '😊', '😁']

const ProductionCard = ({ item }: { item: FarmProduction }) => {
  const date = new Date(item.created_at).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <Pressable
      onPress={() => 
        router.push({
          pathname: "/production/[id]/production",
          params: { id: item.id.toString() },
        })
      }
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text numberOfLines={1} style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#18181b', flex: 1, marginRight: 8 }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 18 }}>{EMOJIS[(item.satisfaction ?? 3) - 1]}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Package size={13} color="#155183" />
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#3f3f46' }}>
            {item.quantity} kg
          </Text>
        </View>
        {item.landing && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} color="#155183" />
            <Text numberOfLines={1} style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#3f3f46', maxWidth: 120 }}>
              {item.landing}
            </Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#155183' }}>#{item.id}</Text>
        </View>
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>{date}</Text>
      </View>
    </Pressable>
  )
}

const ProductionRow = ({ item }: { item: FarmProduction }) => {
  const date = new Date(item.created_at).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric',
  })

  return (
    <Pressable
      onPress={() => 
        router.push({
          pathname: "/production/[id]/production",
          params: { id: item.id.toString() },
        })
      }
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 16, width: 22, textAlign: 'center' }}>
        {EMOJIS[(item.satisfaction ?? 3) - 1]}
      </Text>

      <Text numberOfLines={1} style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b', flex: 1 }}>
        {item.title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <Package size={11} color="#155183" />
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

const Production = ({ owner, farmId }: ProductionProps) => {
  const [visible, setVisible] = useState(false)
  const [format, setFormat] = useState(true)
  const { data, isLoading } = useGetProductionsQuery(farmId)
  const [showFilter, setShowFilter] = useState(false)
  const [sortFilter, setSortFilter] = useState<'newest' | 'latest'>('newest')
  const [search, setSearch] = useState('')

  const filteredData = [...(data ?? [])]
  .filter(item => item.title?.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => {
    if (sortFilter === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  return (
    <View style={{ flex: 1 }}>
      <AddRecord visible={visible} setVisible={setVisible} farmId={farmId} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: 'PoppinsBold', fontSize: 20, color: '#3f3f46' }}>Production</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TrendingUp size={16} color="#155183" />
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#155183' }}>
            {data?.reduce((sum: number, p: FarmProduction) => sum + Number(p.quantity), 0) ?? 0} kg total
          </Text>
        </View>
      </View>

      {showFilter && (
        <View style={{ top: 90 }} className="absolute right-5 z-50 bg-white border border-zinc-300 rounded-xl shadow-lg p-3 w-44">
          <Text className='text-zinc-800' style={{ fontFamily: 'PoppinsMedium' }}>Sort</Text>

          <Pressable
            className={`w-full p-2 rounded-lg ${sortFilter === 'newest' && 'bg-zinc-100'}`}
            onPress={() => { setSortFilter('newest'); setShowFilter(false) }}
          >
            <Text className="text-black text-base">Newest</Text>
          </Pressable>
          <Pressable
            className={`w-full p-2 rounded-lg ${sortFilter === 'latest' && 'bg-zinc-100'}`}
            onPress={() => { setSortFilter('latest'); setShowFilter(false) }}
          >
            <Text className="text-black text-base">Latest</Text>
          </Pressable>
        </View>
      )}

      <View className='flex-row gap-3 w-full px-5' style={{ marginBottom: 15, marginTop: 10 }}>
        <View className='relative flex-1'>
          <TextInput
            style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
            className='rounded-full pl-12 text-base text-black border'
            placeholder='Search production...'
            value={search}
            onChangeText={setSearch}
          />
          <Search style={{ position: 'absolute', top: 8, left: 14 }} color={'#d4d4d8'} />
        </View>
        <Pressable
          onPress={() => setShowFilter(prev => !prev)}
          className='flex items-center justify-center'
          style={{ backgroundColor: '#155183', borderRadius: 10, padding: 8 }}
        >
          <FilterIcon color={'#ffffff'} size={20} />
        </Pressable>
        <Pressable
          onPress={() => setFormat(f => !f)}
          className='flex items-center justify-center'
          style={{ backgroundColor: '#155183', borderRadius: 10, padding: 8 }}
        >
          {format ? <List color={'#ffffff'} size={20} /> : <LayoutDashboard color={'#ffffff'} size={20} />}
        </Pressable>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#155183" />
        </View>
      ) : !filteredData || filteredData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>📦</Text>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#3f3f46', textAlign: 'center' }}>
            No records yet
          </Text>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa', textAlign: 'center', marginTop: 4 }}>
            {owner ? 'Tap "Add Record" to log your first production.' : 'No production records have been added.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        >
          {!format && (
            <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 4 }}>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#a1a1aa', flex: 1, marginLeft: 32 }}>TITLE</Text>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#a1a1aa', width: 55 }}>QTY</Text>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#a1a1aa', width: 58, textAlign: 'right' }}>DATE</Text>
            </View>
          )}

          {filteredData.map((item: FarmProduction) =>
            format
              ? <ProductionCard key={item.id} item={item} />
              : <ProductionRow key={item.id} item={item} />
          )}
        </ScrollView>
      )}

      {/* FAB */}
      {owner && (
        <View style={{ position: 'absolute', bottom: 20, right: 20, borderRadius: 999, overflow: 'hidden', zIndex: 999 }}>
          <Pressable
            onPress={() => setVisible(true)}
            android_ripple={{ color: '#ffffff50', borderless: false }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#155183', borderRadius: 999 }}
          >
            <Text style={{ color: '#fff', fontFamily: 'PoppinsSemiBold' }}>Add Record</Text>
            <Plus color="#fff" size={18} />
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default Production