import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useGetFarmTrayHistoryQuery, useLazyGetTrayProgressQuery } from '@/store/trayApi';
import { FilterIcon } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder';
import BottomDrawer, { BottomDrawerRef } from '@/components/containers/BottomDrawer';
import ProgressSteps from '@/components/containers/farm/tray/ProgressSteps';
import { Tray } from '@/utils/types';


const History = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetFarmTrayHistoryQuery(Number(id));
  const [ trigger, { data: progress, isFetching: progressLoading }] = useLazyGetTrayProgressQuery()

  const finishedTrays = (data?.filter((item) => item.finished_at !== null).slice().reverse()) ?? [];
  
  const [selectedItem, setSelectedItem] = useState<Tray | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<BottomDrawerRef>(null);
  
  const handlePress = async (item: Tray) => {
    if (isDrawerOpen) {
      setSelectedItem(null);
      drawerRef.current?.close();
    } else {
      setSelectedItem(null);
      drawerRef.current?.open();
    }
    setSelectedItem(item);
    await trigger(Number(item.id)).unwrap()
  }
  
  return (
    <View className='flex-1 bg-white'>
        <View className='flex-row justify-between items-center mt-10 p-5'>
            <Text className='text-3xl' style={{
                fontFamily: 'PoppinsBold'
            }}>History</Text>
            <View className='flex items-center justify-center' style={{ backgroundColor: '#155183', borderRadius: 10, padding: 8 }}>
            <FilterIcon color={'#ffffff'} size={20}/>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className='px-5' style={{ gap: 12}}>
          {isLoading ? (
            <View>
              <SkeletonShimmer style={{ height: 60, borderRadius: 7 }}/>
              <SkeletonShimmer style={{ height: 60, borderRadius: 7, marginTop: 12 }}/>
              <SkeletonShimmer style={{ height: 60, borderRadius: 7, marginTop: 12 }}/>
            </View>
          ) : (
            finishedTrays?.map((tray, index) => (
              <View key={tray.id} style={{ overflow: 'hidden', borderRadius: 7, marginTop: 10 }}>
                <Pressable onPress={() => handlePress(tray)} android_ripple={{ color: 'rgba(0,0,0,0.1)' }} className='p-3 flex' style={{ borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 7, marginTop: index === 0 ? 0 : 3}}>
                  <View className='flex-row justify-between items-center'>
                     <Text className="text-zinc-500" style={{ fontFamily: 'PoppinsSemiBold' }}>{tray.tray_name}</Text>
                    <View className="flex-row items-center" style={{ gap: 5 }}>
                      <Image
                        source={
                          tray?.created_by_profile_picture
                            ? { uri: tray?.created_by_profile_picture }
                            : require("@/assets/images/default-profile.png")
                        }
                        style={{ width: 15, height: 15, borderRadius: 999 }}
                        resizeMode="cover"
                      />
                      <Text
                        className="text-zinc-500"
                        style={{
                          fontFamily: "PoppinsRegular",
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        {tray.created_by_username
                          ? tray.created_by_username[0].toUpperCase() +
                            tray.created_by_username.slice(1)
                          : "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View className="gap-3 flex flex-row">
                    {['Start', 'End'].map((label) => (
                      <View key={label} className="flex flex-row gap-2">
                        <Text
                          className="bg-primary text-white"
                          style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: 10,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                          }}
                        >
                          {label}
                        </Text>
                        <Text
                          className="text-zinc-400"
                          style={{ fontFamily: 'PoppinsMedium', fontSize: 10 }}
                        >
                          {label === 'Start'
                            ? tray.created_at
                              ? new Date(tray.created_at).toLocaleString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true,
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : '-'
                            : tray?.finished_at
                            ? new Date(tray?.finished_at).toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '-'}
            
                        </Text>
                      </View>
                    ))}
                  </View>
                </Pressable>
              </View>
          ))
          )}
          <View className='mt-5'></View>
        </ScrollView>
        <BottomDrawer ref={drawerRef} onChange={(open) => setIsDrawerOpen(open)} type='full'>
          {progressLoading ? (
            <View className='flex-1 items-center justify-center bg-white'>
              <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 100 }} />
            </View>
          ) : (
            <ScrollView className='flex-1 w-full' contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
              <ProgressSteps loading={progressLoading} created_at={selectedItem?.created_at} finished_at={selectedItem?.finished_at} owner={selectedItem?.created_by_username} owner_pfp={selectedItem?.created_by_profile_picture} progress={progress}/>
            </ScrollView>
          )}
        </BottomDrawer>
    </View>
  )
}

export default History