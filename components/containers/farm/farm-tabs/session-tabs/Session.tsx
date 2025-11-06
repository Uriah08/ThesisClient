import { View, Text, TextInput, Pressable, ScrollView, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { FarmSession } from '@/utils/types'
import { Check, CheckCircle, CheckCircle2, ChevronLeft, CircleCheckBig, FilterIcon, PanelsLeftRightIcon, Play, Search, Settings, Trash2 } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import SessionStatus from './SessionStatus'
import { useGetSessionByIdQuery } from '@/store/sessionApi'
import { useGetSessionTrayQuery } from '@/store/trayApi'
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder'
import { router } from 'expo-router'
import { Swipeable } from 'react-native-gesture-handler'
import SessionSettings from './SessionSettings'
import InactiveTrays from '@/components/containers/dialogs/GetInactiveTrays'

const Session = ({ session, onBack, farmId }: { session : FarmSession, onBack: () => void, farmId: number }) => {
  const [activateVisible, setActivateVisible] = useState(false)
  const { data } = useGetSessionByIdQuery(session.id);
  const { data: trays, isLoading: isLoadingTray, refetch } = useGetSessionTrayQuery(session.id);
  const [active, setActive] = useState('Session')
  const [visible, setVisible] = useState(false)

  const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
      await refetch();
      setRefreshing(true);
  
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    };

  const currentStatus = data?.status || session.status;

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

    const renderRightActions = (trayId: number) => (
    <Pressable
      className="flex justify-center items-center"
      style={{
        width: 80,
        backgroundColor: "#dc2626",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      }}
      android_ripple={{ color: "#00000020", borderless: false }}
    >
      <Trash2 size={22} color="#fff" />
      <Text
        style={{
          color: "#fff",
          fontFamily: "PoppinsMedium",
          fontSize: 12,
          marginTop: 2,
        }}
      >
        Delete
      </Text>
    </Pressable>
  );
  
  return (
    <View className='flex-1 flex flex-col'>
      <InactiveTrays setVisible={setVisible} visible={visible} farmId={farmId} sessionId={data?.id}/>
      <ActivateSession setVisible={setActivateVisible} visible={activateVisible} sessionId={data?.id || session.id} sessionStatus={data?.status || session.status}/>
      {currentStatus !== 'finished' && (
        <View
          className="absolute bottom-5 right-5 rounded-full"
          style={{ overflow: "hidden", zIndex: 999 }}
        >
          <Pressable
            onPress={() => setVisible(true)}
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
              <PanelsLeftRightIcon color={"#ffffff"} />
          </Pressable>
        </View>
      )}
      <View className='flex-row justify-between items-center mt-3 px-5'>
        <View className='flex flex-row gap-5 items-center'>
          <ChevronLeft color={"#155183"} size={20} onPress={handleBack}/>
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Text
            onPress={() => setActive('Session')}
              className="text-xl text-zinc-700"
              style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}
            >
              {(data?.name || session.name)?.length > 10
                ? `${(data?.name || session.name).slice(0, 10)}...`
                : data?.name || session.name}
            </Text>
            <SessionStatus sessionStatus={data?.status || session.status}/>
          </View>
        </View>
        <View>
          <View className='flex-row gap-3 items-center'>
            <Pressable
              onPress={() => setActive(active === 'Settings' ? 'Session' : 'Settings')}
              style={{
                backgroundColor: active === 'Settings' ? '#155183' : '#ffffff',
                padding: 6,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings
                size={20}
                color={active === 'Settings' ? '#ffffff' : '#71717a'}
              />
            </Pressable>   
          {currentStatus === 'finished' ? (
            <View className='gap-2 items-center flex-row'>
              <Check size={14} color={'#a1a1aa'}/>
              <Text className='text-zinc-400' style={{ fontFamily: 'PoppinsRegular', fontSize: 12}}>Finished</Text>
            </View>) : (
            <Pressable onPress={() => setActivateVisible(true)} android_ripple={{ color: "#ffffff50", borderless: false }} className='gap-2 flex-row items-center' style={{ backgroundColor: '#155183', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999 }}>
              {currentStatus === 'inactive' ? (<Play size={14} color={'#ffffff'}/>): (<CheckCircle size={14} color={'#ffffff'}/>)}
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#ffffff' }}>{currentStatus === 'active' ? 'Finish' : 'Start'}</Text>
            </Pressable>
          )}
          </View>
        </View>
      </View>
      {active === 'Session' ? (
        <>
          <View className='flex-row gap-3 w-full' style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8 }}>
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
        <View
          className='flex-row items-center bg-zinc-100'
          style={{
            alignSelf: 'flex-start',
            marginBottom: 8,
            marginLeft: 18,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 999,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
          }}
        >
          <CheckCircle2 size={14} color="#16a34a" style={{ marginRight: 6 }} />
          <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>
            Tray Harvested:{' '}
            <Text
              style={{ fontFamily: 'PoppinsSemiBold', color: '#155183' }}
            >
              {trays?.reduce((acc, tray) => acc + (tray.finished_at ? 1 : 0), 0)} / {trays?.length || 0}
            </Text>
          </Text>
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
            trays?.map((tray) => (
            <View
              key={tray.id}
              className="rounded-lg mb-4"
              style={{
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#e4e4e7",
              }}
            >
              <Swipeable
                renderRightActions={() => renderRightActions(tray.id)}
                overshootRight={false}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/trays/[id]/progress",
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
                          backgroundColor: "#155183",
                          borderRadius: 9999,
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
                        {tray.tray_name?.length > 10
                          ? `${tray.tray_name.slice(0, 10)}...`
                          : tray.tray_name}
                      </Text>
                    </View>
                    <Text
                      className="text-zinc-400"
                      style={{ fontFamily: "PoppinsMedium", fontSize: 11 }}
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

                  <View className="flex-row justify-between items-center">
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

                    {tray.finished_at && (
                      <CircleCheckBig size={16} color={"#15803d"} />
                    )}
                  </View>
                </Pressable>
              </Swipeable>
            </View>
          )
            )
          )}
        </ScrollView>
        </>
      ): (
        <SessionSettings sessionId={data?.id} onBack={onBack}/>
      )}
    </View>
  )
}

export default Session