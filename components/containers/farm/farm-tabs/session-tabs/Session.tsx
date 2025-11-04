import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { FarmSession } from '@/utils/types'
import { Check, CheckCircle, ChevronLeft, FilterIcon, PanelsLeftRightIcon, Play, Search } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import SessionStatus from './SessionStatus'
import { useGetSessionByIdQuery } from '@/store/sessionApi'
import { useCreateTrayMutation, useGetSessionTrayQuery } from '@/store/trayApi'
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder'
import { router } from 'expo-router'

const Session = ({ session, onBack, farmId }: { session : FarmSession, onBack: () => void, farmId: number }) => {
  const [activateVisible, setActivateVisible] = useState(false)
  const { data } = useGetSessionByIdQuery(session.id);
  const [createTray, {isLoading}] = useCreateTrayMutation();
  const { data: trays, isLoading: isLoadingTray, refetch } = useGetSessionTrayQuery(session.id);

  const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
      await refetch();
      setRefreshing(true);
  
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    };

  const currentStatus = data?.status || session.status;

  const handleCreateTray = async () => {
    try {
      await createTray({ farm: farmId, session: session.id }).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Tray Created Successfully',
      })
    } catch (error: any) {
      console.log(error);   
      if (error?.data?.detail) {
        Toast.show({
          type: 'error',
          text1: error.data.detail,
        });
      }
    }
  }

  const handleBack = async () => {
    try {
        await AsyncStorage.removeItem('session')
        onBack();
    } catch (error) {
        console.log(error)
        Toast.show({
            type: 'error',
            text1: "Error Selecting Session",
        });
      }
    }
  
  return (
    <View className='flex-1 flex flex-col'>
      <ActivateSession setVisible={setActivateVisible} visible={activateVisible} sessionId={session.id} sessionStatus={session.status}/>
      {currentStatus !== 'finished' && (
        <View
          className="absolute bottom-5 right-5 rounded-full"
          style={{ overflow: "hidden", zIndex: 999 }}
        >
          <Pressable
            onPress={handleCreateTray}
            android_ripple={{ color: "#ffffff50", borderless: false }}
            className={`flex flex-row items-center gap-3 px-5 bg-primary rounded-full`}
            disabled={currentStatus === 'finished' || currentStatus === 'inactive'}
            style={{ paddingVertical: 10, opacity: currentStatus === 'finished' || currentStatus === 'inactive' ? 0.5 : 1 }}
          >
            <Text
              className="text-white"
              style={{ fontFamily: "PoppinsSemiBold" }}
            >
              Add Tray
            </Text>
            {isLoading ? (
              <ActivityIndicator size={16} color="#ffffff" />
            ) : (
              <PanelsLeftRightIcon color={"#ffffff"} />
            )}
          </Pressable>
        </View>
      )}
      <View className='flex-row justify-between items-center mt-3 px-5'>
        <View className='flex flex-row gap-5 items-center'>
          <ChevronLeft color={"#155183"} size={20} onPress={handleBack}/>
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>{data?.name || session.name}</Text>
            <SessionStatus sessionStatus={data?.status || session.status}/>
          </View>
        </View>
        <View>
          {currentStatus === 'finished' ? (
            <View className='gap-2 items-center flex-row'>
              <Check size={14} color={'#a1a1aa'}/>
              <Text className='text-zinc-400' style={{ fontFamily: 'PoppinsRegular', fontSize: 12}}>Finished</Text>
            </View>) : (
            <Pressable onPress={() => setActivateVisible(true)} android_ripple={{ color: "#ffffff50", borderless: false }} className='gap-2 flex-row items-center' style={{ backgroundColor: '#155183', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999 }}>
              {currentStatus === 'inactive' ? (<Play size={14} color={'#ffffff'}/>): (<CheckCircle size={14} color={'#ffffff'}/>)}
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#ffffff' }}>{currentStatus === 'active' ? 'Finish' : 'Activate'}</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View className='flex-row gap-3 p-5 w-full'>
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
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'
      refreshControl={
        <RefreshControl style={{ zIndex: -1}} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {isLoadingTray ? (
          <View className='flex gap-2'>
          <SkeletonShimmer style={{ height: 75, marginBottom: 13 }}/>
          <SkeletonShimmer style={{ height: 75, marginBottom: 13 }}/>
          <SkeletonShimmer style={{ height: 75, marginBottom: 13 }}/>
          </View>
        ) : (
          trays?.length === 0 ? (
            <View className='flex-1 items-center justify-center mt-20'>
              <Text style={{ fontFamily: 'PoppinsExtraBold', fontSize: 20, color: '#d4d4d8' }}>No Trays Found.</Text>
            </View>
          ) : (
            trays?.map((tray) => (
              <View className='rounded-lg mb-4' key={tray.id} style={{ overflow: 'hidden', borderWidth: 1, borderColor: '#e4e4e7', }}>
              <Pressable 
              onPress={() =>
                router.push({
                  pathname: "/trays/[id]/progress",
                  params: { id: tray.id.toString() },
                })
              }
              android_ripple={{ color: "#00000010", borderless: false }}
              className='bg-white shadow-sm flex gap-2'
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                <View className='flex-row justify-between'>
                  <View className='flex-row gap-2'>
                    <View style={{ backgroundColor: '#155183', borderRadius: 9999, padding: 5 }}>
                      <PanelsLeftRightIcon color={'#ffffff'} size={14}/>
                    </View>
                    <Text className='text-zinc-800' style={{ fontFamily: 'PoppinsSemiBold', color: '#3f3f46', fontSize: 14 }}>{tray.name}</Text>
                  </View>
                  <Text
                    className="text-zinc-400"
                    style={{ fontFamily: 'PoppinsMedium', fontSize: 11 }}
                  >
                    {new Date(tray.created_at).toLocaleDateString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View className='flex-row items-center' style={{ gap: 5 }}>
                  <Image
                      source={
                      tray?.created_by_profile_picture
                          ? { uri: tray?.created_by_profile_picture }
                          : require('@/assets/images/default-profile.png')
                      }
                      style={{ width: 15, height: 15, borderRadius: 999 }}
                      resizeMode="cover"
                  />
                  <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 12, marginTop: 3}}>{tray.created_by_username ? tray.created_by_username[0].toUpperCase() + tray.created_by_username.slice(1) : 'N/A'}</Text>
                </View>
              </Pressable>
              </View>
            ))
          )
        )}
      </ScrollView>
    </View>
  )
}

export default Session