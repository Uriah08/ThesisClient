import { View, Text, ActivityIndicator, Pressable } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from "expo-router";
import { useGetTrayByIdQuery, useGetTrayProgressQuery } from '@/store/trayApi';
import { ChevronLeft, CircleCheck} from 'lucide-react-native';
import ProgressSteps from '@/components/containers/farm/tray/ProgressSteps';
import AddProgress from '@/components/containers/dialogs/AddProgress';

const Tray = () => {
    const { id } = useLocalSearchParams();
    const { data, isLoading } = useGetTrayByIdQuery(Number(id))
    const { data: progress, isLoading: progressLoading, refetch } = useGetTrayProgressQuery(Number(id))
    const [visible, setVisible] = React.useState(false);
    const [focus, setFocus] = useState<'custom' | 'harvest' | string>('')

    const [refreshing, setRefreshing] = useState(false);
      const onRefresh = async () => {
        await refetch();
        setRefreshing(true);
    
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      };

    if (isLoading) return (
        <View className='flex-1 items-center justify-center bg-white'>
          <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        </View>
    );
      
  return (
    <View className='flex-1 bg-white'>
      <AddProgress visible={visible} setVisible={setVisible} focus={focus} setFocus={setFocus} trayId={data?.id || Number(id)}/>
        <View className='flex-row gap-5 p-5 mt-10 items-center justify-between'>
          <View className='gap-5 flex-row items-center'>
            <ChevronLeft color={"#27272a"} size={28} onPress={() => router.back()}/>
            <Text className='text-2xl text-zinc-800' style={{ fontFamily: "PoppinsBold" }}>{data?.tray_name}</Text>
          </View>
          {data?.finished_at ? (
            <View className='flex-row items-center' style={{ gap: 4}}>
              <CircleCheck size={14} color={'#a1a1aa'}/>
              <Text className='text-zinc-400' style={{ fontSize: 12, fontFamily: 'PoppinsMedium', marginTop: 2}}>Harvested</Text>
            </View>
          ) : (
            <View
          className="rounded-full"
          style={{ overflow: "hidden", zIndex: 999 }}
        >
          <Pressable
            onPress={() => {setVisible(true); setFocus('')}}
            android_ripple={{ color: "#ffffff50", borderless: false }}
            className={`flex flex-row items-center gap-3 px-3 bg-primary rounded-full`}
            style={{ paddingVertical: 7 }}
          >
            <Text
              className="text-white"
              style={{ fontFamily: "PoppinsRegular", fontSize: 12 }}
            >
              Add Progress
            </Text>
          </Pressable>
        </View>
          )}
        </View>
        <ProgressSteps refreshing={refreshing} onRefresh={onRefresh} loading={progressLoading} created_at={data?.created_at} finished_at={data?.finished_at} owner={data?.created_by_username} owner_pfp={data?.created_by_profile_picture} progress={progress}/>
    </View>
  )
}

export default Tray