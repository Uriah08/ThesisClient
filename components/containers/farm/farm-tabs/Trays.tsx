import { View, Text, Pressable, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { FilterIcon, PanelsLeftRightIcon, Search } from 'lucide-react-native'
import CreateTray from '../../dialogs/CreateTray'
import { useGetFarmTraysQuery } from '@/store/farmTrayApi'
import SkeletonShimmer from '../../SkeletonPlaceholder'
import { router } from 'expo-router'

type Props = {
  farmId: number
  owner: boolean
}

const Trays = ({ farmId, owner }: Props) => {
  const { data, isLoading, refetch } = useGetFarmTraysQuery(farmId)
  const [visible, setVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortFilter, setSortFilter] = useState<'newest' | 'latest'>('newest');
  const [olderThan2Days, setOlderThan2Days] = useState(false);
  const [search, setSearch] = useState('');

  const onRefresh = async () => {
    await refetch();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  console.log("WOW:", data);

  const filteredTrays = (data ?? [])
    .filter(tray => tray.name?.toLowerCase().includes(search.toLowerCase()))
    .filter(tray => {
      if (statusFilter === 'active') return tray.status === 'active';
      if (statusFilter === 'inactive') return tray.status === 'inactive';
      return true;
    })
    .filter(tray => {
      if (!olderThan2Days) return true;
      if (!tray.latest_session_datetime) return false;
      const daysDiff = (new Date().getTime() - new Date(tray.latest_session_datetime).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff >= 2;
    })
    .sort((a, b) => {
      if (sortFilter === 'newest') return new Date(b.latest_session_datetime ?? 0).getTime() - new Date(a.latest_session_datetime ?? 0).getTime();
      if (sortFilter === 'latest') return new Date(a.latest_session_datetime ?? 0).getTime() - new Date(b.latest_session_datetime ?? 0).getTime();
      return 0;
    });

  return (
    <View className='flex-1 flex flex-col'>
      <CreateTray visible={visible} setVisible={setVisible} farmId={farmId} />
      <View className='mt-3 flex-row justify-between' style={{ paddingHorizontal: 18 }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}>Trays</Text>
        <View className='flex flex-row items-center gap-3 justify-end'>
          <View className='flex flex-row items-center' style={{ gap: 4 }}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#16a34a' }} />
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Active</Text>
          </View>
          <View className='flex flex-row items-center' style={{ gap: 4 }}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#155183' }} />
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Inactive</Text>
          </View>
        </View>
      </View>

      {owner && (
        <View
          className="absolute bottom-5 right-5 rounded-full"
          style={{ overflow: "hidden", zIndex: 999 }}
        >
          <Pressable
            onPress={() => setVisible(true)}
            android_ripple={{ color: "#ffffff50", borderless: false }}
            className={`flex flex-row items-center gap-3 px-5 bg-primary rounded-full`}
            style={{ paddingVertical: 10 }}
          >
            <Text
              className="text-white"
              style={{ fontFamily: "PoppinsSemiBold" }}
            >
              Create Tray
            </Text>
            <PanelsLeftRightIcon color={"#ffffff"} />
          </Pressable>
        </View>
      )}

      <View className='flex-row gap-3 w-full p-5'>
        <View className='relative flex-1'>
          <TextInput
            style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
            className='rounded-full pl-12 text-base text-black border'
            placeholder='Search tray...'
            onChangeText={setSearch}
            value={search}
          />
          <Search
            style={{ position: 'absolute', top: 8, left: 14 }}
            color={'#d4d4d8'}
          />
        </View>
        <Pressable
          onPress={() => setShowFilter(prev => !prev)}
          className='flex items-center justify-center'
          style={{ backgroundColor: '#155183', borderRadius: 10, padding: 8 }}
        >
          <FilterIcon color={'#ffffff'} size={20} />
        </Pressable>
      </View>

      {showFilter && (
        <View style={{ top: 90 }} className="absolute right-5 z-50 bg-white border border-zinc-300 rounded-xl shadow-lg p-3 w-44">
          <Text className='text-zinc-800' style={{ fontFamily: 'PoppinsMedium' }}>Filter</Text>

          {/* Status filter */}
          <Pressable
            className={`w-full p-2 rounded-lg ${statusFilter === 'all' && 'bg-zinc-100'}`}
            onPress={() => setStatusFilter('all')}
          >
            <Text className="text-black text-base">All Trays</Text>
          </Pressable>
          <Pressable
            className={`w-full p-2 rounded-lg ${statusFilter === 'active' && 'bg-zinc-100'}`}
            onPress={() => setStatusFilter('active')}
          >
            <Text className="text-black text-base">Active</Text>
          </Pressable>
          <Pressable
            className={`w-full p-2 rounded-lg ${statusFilter === 'inactive' && 'bg-zinc-100'}`}
            onPress={() => setStatusFilter('inactive')}
          >
            <Text className="text-black text-base">Inactive</Text>
          </Pressable>

          <View className='bg-zinc-300 my-2' style={{ width: '100%', height: 1 }} />

          {/* Sort filters */}
          <Pressable
            className={`w-full p-2 rounded-lg ${sortFilter === 'newest' && 'bg-zinc-100'}`}
            onPress={() => setSortFilter('newest')}
          >
            <Text className="text-black text-base">Newest</Text>
          </Pressable>
          <Pressable
            className={`w-full p-2 rounded-lg ${sortFilter === 'latest' && 'bg-zinc-100'}`}
            onPress={() => setSortFilter('latest')}
          >
            <Text className="text-black text-base">Latest</Text>
          </Pressable>

          <View className='bg-zinc-300 my-2' style={{ width: '100%', height: 1 }} />

          {/* Older than 2 days toggle */}
          <Pressable
            className={`w-full p-2 rounded-lg ${olderThan2Days && 'bg-zinc-100'}`}
            onPress={() => setOlderThan2Days(prev => !prev)}
          >
            <Text className="text-black text-base">Older than 2 days</Text>
          </Pressable>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5' refreshControl={
        <RefreshControl style={{ zIndex: -1 }} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {isLoading ? (
          <View className='flex gap-2'>
            <SkeletonShimmer style={{ height: 40, marginBottom: 10 }} />
            <SkeletonShimmer style={{ height: 40, marginBottom: 10 }} />
            <SkeletonShimmer style={{ height: 40, marginBottom: 10 }} />
          </View>
        ) : (
          filteredTrays.map((tray) => (
            <View
              key={tray.id}
              className="rounded-lg mb-4"
              style={{
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#e4e4e7",
              }}
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/tray/[id]/dashboard",
                    params: { id: tray.id.toString() },
                  })
                }
                android_ripple={{ color: "#00000010", borderless: false }}
                className="bg-white shadow-sm flex gap-2"
                style={{ paddingVertical: 10, paddingHorizontal: 10 }}
              >
                <View className="flex-row justify-between">
                  <View className="flex-row gap-2">
                    <View
                      style={{
                        backgroundColor: tray.status === 'active' ? '#16a34a' : tray.status === 'inactive' ? '#155183' : "#b91c1c",
                        borderRadius: 999,
                        padding: 5,
                      }}
                    >
                      <PanelsLeftRightIcon color={"#ffffff"} size={14} />
                    </View>
                    <Text
                      className="text-zinc-800"
                      style={{
                        fontFamily: "PoppinsSemiBold",
                        color: "#3f3f46",
                        fontSize: 14,
                      }}
                    >
                      {tray.name?.length > 10
                        ? `${tray.name.slice(0, 10)}...`
                        : tray.name}
                    </Text>
                  </View>
                  <Text
                    className='text-gray-500 mt-1'
                    style={{ fontFamily: 'PoppinsMedium', fontSize: 11 }}
                  >
                    {tray.latest_session_datetime
                      ? (new Date().getTime() - new Date(tray.latest_session_datetime).getTime()) / (1000 * 60 * 60 * 24) >= 2
                        ? 'Tray reached 2 days'
                        : ''
                      : ''}
                  </Text>
                </View>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Trays