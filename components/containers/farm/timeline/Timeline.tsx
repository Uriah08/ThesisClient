import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useGetTrayByIdQuery, useGetTrayProgressQuery } from '@/store/trayApi';
import AddProgress from '../../dialogs/AddProgress';
import { ClockPlus } from 'lucide-react-native';
import ProgressSteps from '../tray/ProgressSteps';

type Props = {
    trayId: number;
}

const TimelinePage = ({ trayId }: Props) => {
    const [showTimeline, setShowTimeline] = useState(false);
    const [focus, setFocus] = useState<'custom' | string>('')
    const { data, isLoading } = useGetTrayByIdQuery(trayId)

    const traySessionId = data?.active_session_tray?.id;

    const { data: progress, isLoading: progressLoading, refetch } = useGetTrayProgressQuery(traySessionId, {
    skip: !traySessionId
    });


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
    <View className='flex-1'>
        <AddProgress visible={showTimeline} setVisible={setShowTimeline} trayId={trayId} activetrayId={data?.active_session_tray?.id} focus={focus} setFocus={setFocus}/>
        <View
            className="absolute bottom-5 right-5 rounded-full"
            style={{ overflow: "hidden", zIndex: 999 }}
            >
            <Pressable
                onPress={() => setShowTimeline(true)}
                android_ripple={{ color: "#ffffff50", borderless: false }}
                className={`flex flex-row items-center gap-3 px-5 bg-primary rounded-full`}
                style={{ paddingVertical: 10 }}
            >
                <Text
                className="text-white"
                style={{ fontFamily: "PoppinsSemiBold", marginTop: 2 }}
                >
                Add Timeline
                </Text>
                <ClockPlus color={"#ffffff"} />
            </Pressable>
        </View>
      <ProgressSteps 
      refreshing={refreshing} 
      onRefresh={onRefresh} 
      loading={progressLoading} 
      created_at={data?.active_session_tray?.created_at} 
      finished_at={data?.active_session_tray?.finished_at} 
      owner={data?.active_session_tray?.created_by.username} 
      owner_pfp={data?.active_session_tray?.created_by.profile_picture} 
      progress={progress}/>
    </View>
  )
}

export default TimelinePage