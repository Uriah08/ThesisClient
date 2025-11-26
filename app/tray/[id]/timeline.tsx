import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { CircleCheck, Play } from 'lucide-react-native'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import { useLocalSearchParams } from 'expo-router'
import { useGetFarmTrayByIdQuery } from '@/store/farmTrayApi'
import TimelinePage from '@/components/containers/farm/timeline/Timeline'

const Timeline = () => {
    const [show, setShow] = useState(false);
    const { id } = useLocalSearchParams();
    
    const { data, isLoading } = useGetFarmTrayByIdQuery(Number(id));
    

    if (isLoading) return (
        <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        </View>
    );
    
    
  return (
    <View className='flex-1 bg-white'>
        <ActivateSession visible={show} setVisible={setShow} trayId={data?.id || Number(id)} active={data?.status === 'active'}/>
        <View className='flex-row justify-between items-center mt-10 p-5'>
            <Text className='text-3xl' style={{
                fontFamily: 'PoppinsBold'
            }}>Timeline</Text>
            <Pressable 
            onPress={() => setShow(true)}
            android_ripple={{ color: "#ffffff50", borderless: false }} 
            className='gap-2 flex-row items-center' 
            style={{ 
              backgroundColor: '#155183', 
              paddingVertical: 6, 
              paddingHorizontal: 12, 
              borderRadius: 9999 
              }}>
                {data?.status === 'active' ? (
                    <CircleCheck size={14} color={'#ffffff'}/>
                ) : (
                    <Play size={14} color={'#ffffff'}/>
                )}
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#ffffff' }}>{data?.status === 'active' ? 'Finish Drying' : 'Start Drying'}</Text>
            </Pressable>
        </View>
        {data?.status === 'active' ? (
            <TimelinePage trayId={data?.id}/>
        ) : (
            <View className='flex-1 justify-center items-center flex-col gap-3'>
                <Image
                    source={require('@/assets/images/hero-image.png')}
                    style={{ width: 200, height: 200, opacity: 0.5}}
                    resizeMode={'contain'}
                />
                <Text style={{
                    fontSize: 20,
                    fontFamily: 'PoppinsExtraBold',
                    color: '#15518330'
                }}>TRAY IS NOT ACTIVE</Text>
            </View>
        )}
    </View>
  )
}

export default Timeline