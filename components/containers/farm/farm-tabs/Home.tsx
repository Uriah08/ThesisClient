import { View, Text, ActivityIndicator, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetFarmDashboardQuery, useGetFarmQuery } from '@/store/farmApi'
import { Boxes, ChevronRight, Megaphone, PanelsLeftRight, Users } from 'lucide-react-native'
import FarmDashboardBarChart from '../../charts/FarmDashboardBarChart'
import { router } from 'expo-router'
// import PieChart2 from '../../charts/PieChart2'

type Props = {
  farmId: number
}

const Home = ({ farmId }: Props) => {
  const { data, isLoading } = useGetFarmQuery(farmId);
  const { data: dashboard, isLoading: dashboardLoading, refetch } = useGetFarmDashboardQuery(farmId);
   const [chartKey, setChartKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = async () => {
      await refetch();
      setRefreshing(true);
      setChartKey(prev => prev + 1);
  
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    };

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading || dashboardLoading) return (
    <View className='flex-1 items-center justify-center bg-white'>
      <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    </View>
  );
  
  console.log('DASHBOARD', dashboard);
  

  // const detected = dashboard?.detected_and_reject_by_day.map((item) => item.detected).reduce((prev, curr) => prev + curr, 0);
  // const rejected = dashboard?.detected_and_reject_by_day.map((item) => item.rejects).reduce((prev, curr) => prev + curr, 0);
  
  return (
    <View className='flex-1 flex flex-col'>
        <View className='flex-row items-center justify-between mt-3 px-5' style={{ marginBottom: 5 }}>
          <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>Home</Text>
          <View className='flex flex-row gap-2' style={{ borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 12, paddingTop: 5, paddingHorizontal: 8, paddingBottom: 3}}>
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 11}}>This week</Text>
          </View>
        </View>
      <ScrollView showsVerticalScrollIndicator={false} 
      refreshControl={
        <RefreshControl style={{ zIndex: -1}} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {dashboard?.announcement_count && dashboard.announcement_count > 0 ? (
        <View style={{ overflow: 'hidden', borderRadius: 12 }}>
          <Pressable 
            className='flex flex-col mt-3'
            style={{ 
              borderWidth: 1, 
              borderColor: '#d4d4d8', 
              borderRadius: 12, 
              padding: 13, 
              marginHorizontal: 17,
              overflow: 'hidden'
            }}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
            onPress={() => router.push({ pathname: '/farm-settings/announcement/[id]', params: { id: farmId.toString() }})}
          >
            <View className='flex-row justify-between items-center'>
              <View className='flex-row gap-3 items-center'>
                <View className='bg-primary p-2' style={{ borderRadius: 999 }}>
                  <Megaphone color={'#ffffff'} size={20}/>
                </View>

                <Text 
                  className='text-zinc-600'
                  style={{ fontFamily: 'PoppinsBold', fontSize: 15 }}
                >
                  Announcements
                </Text>

                <View
                  className='flex justify-center items-center'
                  style={{
                    backgroundColor: '#991b1b',
                    borderRadius: 999,
                    height: 20,
                    width: 20
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'PoppinsRegular',
                      fontSize: 12,
                      color: '#ffffff',
                      marginTop: 1
                    }}
                  >
                    {dashboard.announcement_count}
                  </Text>
                </View>

              </View>

              <ChevronRight size={20} color={'#52525b'} />
            </View>
          </Pressable>
        </View>
      ) : null}
      <View className='px-5'>
        <View className='gap-5' style={{ flexDirection: 'row', marginTop: 20 }}>
        <View className='px-3 bg-primary rounded-xl flex' style={{ paddingTop: 15, width: '47%'}}>
          <View className='flex-row gap-3 items-center'>
            <View className='bg-white p-1 rounded-lg'>
              <PanelsLeftRight color={'#155183'} size={18}/>
            </View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 14, color: '#ffffff' }}>Trays</Text>
          </View>
          <Text style={{ fontFamily: 'PoppinsBold', fontSize: 25, color: '#ffffff', marginTop: 10 }}>{dashboard?.tray_count}</Text>
        </View>
        <View className='px-3 bg-primary rounded-xl flex' style={{ paddingTop: 15, width: '47%'}}>
          <View className='flex-row gap-3 items-center'>
            <View className='bg-white p-1 rounded-lg'>
              <Users color={'#155183'} size={18}/>
            </View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 14, color: '#ffffff' }}>Members</Text>
          </View>
          <Text style={{ fontFamily: 'PoppinsBold', fontSize: 25, color: '#ffffff', marginTop: 10 }}>{data?.members.length}</Text>
        </View>
        </View>
        <View className='px-3 bg-primary rounded-xl flex mt-5' style={{ paddingTop: 15}}>
          <View className='flex-row gap-3 items-center'>
            <View className='bg-white p-1 rounded-lg'>
              <Boxes color={'#155183'} size={18}/>
            </View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 14, color: '#ffffff' }}>Harvested Trays</Text>
          </View>
          <Text style={{ fontFamily: 'PoppinsBold', fontSize: 25, color: '#ffffff', marginTop: 10 }}>{dashboard?.session_trays_count_by_day ? dashboard.session_trays_count_by_day.reduce((total, item) => total + item.count, 0) : 0}</Text>
        </View>
      </View>
      <View style={{ paddingTop: 18, paddingBottom: 10, paddingRight: 18, paddingLeft: 10}}>
        <FarmDashboardBarChart data={dashboard?.detected_and_reject_by_day || []} chartKey={chartKey}/>
      </View>
      {/* <View style={{ paddingTop: 18, paddingBottom: 10, paddingLeft: 10}}>
        <PieChart2 v1={detected} v2={rejected}/>
      </View> */}
      <Text className="text-lg px-5 mt-5" style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15 }}>
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
                  <Text className='text-zinc-600' style={{ fontFamily: 'PoppinsBold', fontSize: 13}}>{tray.tray_name}</Text>
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
      <View className='mt-5'/>
      </ScrollView>
    </View>
  )
}

export default Home