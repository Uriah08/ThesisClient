import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { ArrowLeft, Fish, PanelsLeftRight } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetFarmTrayByIdQuery, useTrayDashboardQuery } from '@/store/farmTrayApi'

const Dashboard = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading} = useGetFarmTrayByIdQuery(Number(id));
  const { data: dashboard, isLoading: dashboardLoading, refetch } = useTrayDashboardQuery(Number(id))
  
  useEffect(() => {
    refetch();
  }, [refetch]);

  const harvestTrays = dashboard?.session_tray_count.map((item) => item.count).reduce((prev, curr) => prev + curr, 0);

  const detected = dashboard?.detected_and_reject_by_day.map((item) => item.detected).reduce((prev, curr) => prev + curr, 0) || 0;
  const rejected = dashboard?.detected_and_reject_by_day.map((item) => item.rejects).reduce((prev, curr) => prev + curr, 0) || 0; 

  const percentage = (detected / (detected + rejected)) * 100 
  const rejectPercentage = Math.abs((Number(percentage.toFixed(0)) - 100))

  if (isLoading || dashboardLoading) return (
    <View className='flex-1 items-center justify-center bg-white'>
      <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    </View>
  );

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-row justify-between items-center mt-10 p-5'>
        <View className='flex-row gap-5 items-center'>
          <View style={{ borderRadius: 999, overflow: 'hidden' }}>
              <Pressable
              android_ripple={{
                  color: '#d4d4d8',
                  borderless: false,
                  radius: 9999, 
              }}
              style={{
                  borderRadius: 99,
                  padding: 3,
                  overflow: 'hidden',
              }}
              onPress={() => router.back()}
              >
              <ArrowLeft color="#000" size={26} />
              </Pressable>
          </View>
          
          <View className='flex-row items-center gap-3'>
              <Text
                className='text-3xl'
                style={{
                  fontFamily: 'PoppinsBold',
                }}
              >
                {data?.name.length === 15 ? `${data.name.slice(0, 15)}...` : data?.name}
              </Text>
              <View style={{ backgroundColor: '#155183', paddingHorizontal: 12, paddingVertical: 3, borderRadius: 999}}>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 12, color: '#ffffff', marginTop: 2 }}>{data?.status}</Text>
              </View>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <View className='flex flex-col p-5'>
        <View className='px-5 pt-5 bg-primary rounded-xl flex'>
          <View className='flex-row gap-3 items-center'>
            <View className='bg-white p-1 rounded-lg'>
              <PanelsLeftRight color={'#155183'}/>
            </View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 17, color: '#ffffff' }}>Harvested Trays</Text>
          </View>
          <Text style={{ fontFamily: 'PoppinsBold', fontSize: 30, color: '#ffffff', marginTop: 10 }}>{harvestTrays}</Text>
        </View>
        <View className='gap-5' style={{ flexDirection: 'row', marginTop: 20 }}>
          <View
          className='px-3 pt-2 flex'
            style={{
              width: '47%',
              borderWidth: 1,
              borderColor: '#155183',
              borderRadius: 14,
              backgroundColor: '#155183'
            }}
          >
            <View className='flex-row gap-3 items-center'>
              <View className='p-1 rounded-lg' style={{ backgroundColor: '#ffffff', borderRadius: 8}}>
                <Fish color={'#155183'} size={18}/>
              </View>
              <Text className='flex-1' style={{ fontFamily: 'PoppinsBold', fontSize: 13, color: '#ffffff' }}>Fish {'\n'}Detected</Text>
            </View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 30, color: '#ffffff', marginTop: 10, marginLeft: 10 }}>{detected}</Text>
          </View>
          <View
          className='px-3 pt-2 flex'
            style={{
              width: '47%',
              borderWidth: 1,
              borderColor: '#155183',
              borderRadius: 14,
              backgroundColor: '#155183'
            }}
          >
            <View className='flex-row gap-3 items-center'>
              <View className='p-1 rounded-lg' style={{ backgroundColor: '#ffffff', borderRadius: 8}}>
                <Fish color={'#155183'} size={18}/>
              </View>
              <Text className='flex-1' style={{ fontFamily: 'PoppinsBold', fontSize: 13, color: '#ffffff' }}>Reject {'\n'}Percentage</Text>
            </View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 30, color: '#ffffff', marginTop: 10, marginLeft: 10 }}>{rejectPercentage}%</Text>
          </View>
        </View>
      </View>
      <Text className="text-lg px-5" style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15 }}>
        Recent Harvested Trays
      </Text>
      <View className='flex flex-col'>
        {dashboard?.recent_harvested_trays.map((tray, i) => (
          <View key={i} className='flex flex-col mt-3' style={{ borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginHorizontal: 17}}>
            <View className='flex flex-row justify-between items-center'>
              <View className='flex-row gap-3 items-center'>
                <View className='bg-primary p-2' style={{ borderRadius: 999 }}>
                  <PanelsLeftRight color={'#ffffff'} size={20}/>
                </View>
                <View className='flex flex-col'>
                  <Text className='text-zinc-600' style={{ fontFamily: 'PoppinsBold', fontSize: 13}}>{tray.session_name}</Text>
                </View>
              </View>
              <Text
                className="text-zinc-400"
                style={{ fontFamily: "PoppinsMedium", fontSize: 10 }}
              >
                {new Date(tray.created_at).toLocaleDateString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        ))}
      </View>
      </ScrollView>
    </View>
  )
}

export default Dashboard
