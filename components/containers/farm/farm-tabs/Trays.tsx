import { View, Text, Pressable, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { FilterIcon, PanelsLeftRightIcon, Search } from 'lucide-react-native'
import CreateTray from '../../dialogs/CreateTray'
import { useGetFarmTraysQuery } from '@/store/farmTrayApi'
import SkeletonShimmer from '../../SkeletonPlaceholder'

type Props = {
  farmId: number}
const Trays = ({ farmId }: Props) => {
  const { data, isLoading, refetch } = useGetFarmTraysQuery(farmId) 
  const [visible, setVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
      await refetch();
      setRefreshing(true);
  
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    };
  return (
    <View className='flex-1 flex flex-col'>
      <CreateTray visible={visible} setVisible={setVisible} farmId={farmId}/>
      <View className='mt-3 flex-row justify-between' style={{ paddingHorizontal: 18 }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>Trays</Text>
        <View className='flex flex-row items-center gap-3 justify-end'>
          <View className='flex flex-row items-center' style={{ gap: 4}}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#16a34a'}}/>
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Active</Text>
          </View>
          <View className='flex flex-row items-center' style={{ gap: 4}}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#155183'}}/>
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Inactive</Text>
          </View>
          <View className='flex flex-row items-center text-zinc-600 bg-red-700' style={{ gap: 4}}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#b91c1c'}}/>
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Maintenance</Text>
          </View>
        </View>
      </View>
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
      <View className='flex-row gap-3 w-full p-5'>
          <View className='relative flex-1'>
            <TextInput
            style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
              className='rounded-full pl-12 text-base text-black border'
              placeholder='Search tray...'
            />
            <Search
              style={{ position: 'absolute', top: 8, left: 14 }}
              color={'#d4d4d8'}
            />
          </View>
          <View className='flex items-center justify-center' style={{ backgroundColor: '#155183', borderRadius: 10, padding: 8 }}>
            <FilterIcon color={'#ffffff'} size={20}/>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5' refreshControl={
          <RefreshControl style={{ zIndex: -1}} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
        }>
          {isLoading ? (
            <View className='flex gap-2'>
            <SkeletonShimmer style={{ height: 40, marginBottom: 10 }}/>
            <SkeletonShimmer style={{ height: 40, marginBottom: 10 }}/>
            <SkeletonShimmer style={{ height: 40, marginBottom: 10 }}/>
            </View>
          ) : (
            data?.map((tray) => (
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
                  // onPress={() =>
                  //   router.push({
                  //     pathname: "/trays/[id]/progress",
                  //     params: { id: tray.id.toString() },
                  //   })
                  // }
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
                      className="text-zinc-400"
                      style={{ fontFamily: "PoppinsMedium", fontSize: 11 }}
                    >
                      {new Date(tray.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                </Pressable>
            </View>
          )
            )
          )}
        </ScrollView>
    </View>
  )
}

export default Trays