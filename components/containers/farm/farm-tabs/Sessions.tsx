import { View, Text, Pressable, ScrollView, TextInput, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetFarmSessionsQuery } from '@/store/sessionApi'
import SkeletonShimmer from '../../SkeletonPlaceholder'
import Session from './session-tabs/Session'
import { FarmSession } from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { MapPlus, Search } from 'lucide-react-native'
import CreateSession from '../../dialogs/CreateSession'
import SessionStatus from './session-tabs/SessionStatus'

type Props = {
  farmId: number
}
const Sessions = ({ farmId }: Props) => {
  const { data: sessions = [], isLoading, refetch } = useGetFarmSessionsQuery(farmId);
  const [chosenSession, setChosenSession] = React.useState<FarmSession | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [createVisible, setCreateVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    await refetch();
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const activeSessions = sortedSessions.filter((session) => session.status === 'active');
  const inactiveSessions = sortedSessions.filter((session) => session.status === 'inactive' || session.status === 'finished');

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true)
      try {
        const storedSession = await AsyncStorage.getItem('session');
        console.log('SESSION:',storedSession);

        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          setChosenSession(parsed.session);
        }

        if (!storedSession) {
          router.replace('/(tabs)/farm')
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }

    loadSession();
  },[])

  const pickSession = async (session: FarmSession) => {
    try {
      await AsyncStorage.setItem('session', JSON.stringify({ session }));
      setChosenSession(session)
    } catch (error) {
      console.log(error);
    }
  }

  if(chosenSession) {
    return (
      <Session farmId={farmId} session={chosenSession} onBack={() => setChosenSession(null)}/>
    )
  }
  
  return (
    <View className='flex-1 flex flex-col'>
      <View
        className="absolute bottom-5 right-5 rounded-full"
        style={{ overflow: "hidden", zIndex: 999 }}
      >
        <Pressable
        onPress={() => setCreateVisible(true)}
          android_ripple={{ color: "#ffffff50", borderless: false }}
          className="flex flex-row items-center gap-3 px-5 bg-primary rounded-full"
          style={{ paddingVertical: 10 }}
        >
          <Text
            className="text-white"
            style={{ fontFamily: "PoppinsSemiBold" }}
          >
            Create
          </Text>
          <MapPlus color={"#ffffff"} />
        </Pressable>
      </View>
      <CreateSession visible={createVisible} setVisible={setCreateVisible} farmId={farmId}/>
      <View className='flex flex-row justify-between items-center mt-3 px-5'>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>Sessions</Text>
        <View className='flex flex-row items-center gap-3'>
          <View className='flex flex-row items-center' style={{ gap: 4}}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#16a34a'}}/>
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Active</Text>
          </View>
          <View className='flex flex-row items-center' style={{ gap: 4}}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#2563eb'}}/>
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Finished</Text>
          </View>
          <View className='flex flex-row items-center text-zinc-600' style={{ gap: 4}}>
            <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#52525b'}}/>
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Inactive</Text>
          </View>
        </View>
      </View>
      <View className='relative p-5'>
          <TextInput
          style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
            className='rounded-full pl-12 text-base text-black border'
            placeholder='Search session...'
          />
          <Search
            style={{ position: 'absolute', top: 25, left: 28 }}
            color={'#d4d4d8'}
          />
        </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'
      refreshControl={
        <RefreshControl style={{ zIndex: -1}} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <Text className='text-zinc-400 mt-3' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12}}>Active</Text>
      <View className='flex gap-3 flex-col'>
        {isLoading || loading ? (
          <>
          <SkeletonShimmer width={'100%'} height={70} style={{ marginTop: 10 }}/>
          <SkeletonShimmer width={'100%'} height={70}/>
          </>
        ) : (
          activeSessions.length === 0 ? (
            <View className='flex flex-col justify-center items-center'>
              <Text className='mt-5' style={{ fontFamily: 'PoppinsExtraBold', fontSize: 15, color: '#d4d4d8'}}>NO ACTIVE SESSIONS</Text>
            </View>
          ) : (
            activeSessions.map((item, i) => (
              <View key={item.id} style={{ overflow: 'hidden', borderRadius: 10, marginTop: i === 0 ? 10 : 0,}}>
                <Pressable
                android_ripple={{
                  color: 'rgba(0,0,0,0.1)',
                  borderless: false,
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  padding: 10,
                }}
                className="flex flex-col border-zinc-300"
                onPress={() => pickSession(item)}
              >
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-row items-center gap-3">
                    <Text
                      className="text-zinc-500"
                      style={{ fontFamily: 'PoppinsSemiBold' }}
                    >
                      {item.name}
                    </Text>
                    <SessionStatus sessionStatus={item.status}/>
                  </View>
                  <Text
                    className="text-zinc-400"
                    style={{ fontFamily: 'PoppinsMedium', fontSize: 11 }}
                  >
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>

                <View className="gap-3 flex flex-row">
                  <View className="flex flex-row gap-2">
                    <Text
                      className="bg-primary text-white"
                      style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: 10,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}
                    >
                      Start
                    </Text>
                    <Text
                      className="text-zinc-400"
                      style={{ fontFamily: 'PoppinsMedium', fontSize: 10 }}
                    >
                      {item.start_time
                        ? new Date(item.start_time).toLocaleString('en-US', {
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

                  <View className="flex flex-row gap-2">
                    <Text
                      className="bg-primary text-white"
                      style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: 10,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}
                    >
                      End
                    </Text>
                    <Text
                      className="text-zinc-400"
                      style={{ fontFamily: 'PoppinsMedium', fontSize: 10 }}
                    >
                      {item.end_time
                        ? new Date(item.end_time).toLocaleString('en-US', {
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
                </View>
              </Pressable>
              </View>
            ))
          )
        )}
      </View>
      <Text className='text-zinc-400 mt-3' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12}}>Others</Text>
      <View className='flex gap-3 flex-col'>
        {isLoading ? (
          <>
          <SkeletonShimmer width={'100%'} height={70} style={{ marginTop: 10 }}/>
          <SkeletonShimmer width={'100%'} height={70}/>
          <SkeletonShimmer width={'100%'} height={70}/>
          </>
        ) : (
          inactiveSessions.length === 0 ? (
            <View className='flex flex-col justify-center items-center'>
              <Text className='mt-5' style={{ fontFamily: 'PoppinsExtraBold', fontSize: 15, color: '#d4d4d8'}}>NO SESSIONS</Text>
            </View>
          ) : (
            inactiveSessions.map((item, i) => (
              <View key={item.id} style={{ overflow: 'hidden', borderRadius: 10, marginTop: i === 0 ? 10 : 0, marginBottom: inactiveSessions.length - 1 === i ? 20 : 0}}>
                <Pressable
                android_ripple={{
                  color: 'rgba(0,0,0,0.1)',
                  borderless: false,
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  padding: 10,
                }}
                className="flex flex-col border-zinc-300"
                onPress={() => pickSession(item)}
              >
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-row items-center gap-3">
                    <Text
                      className="text-zinc-500"
                      style={{ fontFamily: 'PoppinsSemiBold' }}
                    >
                      {item.name}
                    </Text>
                    <SessionStatus sessionStatus={item.status}/>
                  </View>
                  <Text
                    className="text-zinc-400"
                    style={{ fontFamily: 'PoppinsMedium', fontSize: 11 }}
                  >
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>

                <View className="gap-3 flex flex-row">
                  <View className="flex flex-row gap-2">
                    <Text
                      className="bg-primary text-white"
                      style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: 10,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}
                    >
                      Start
                    </Text>
                    <Text
                      className="text-zinc-400"
                      style={{ fontFamily: 'PoppinsMedium', fontSize: 10 }}
                    >
                      {item.start_time
                        ? new Date(item.start_time).toLocaleString('en-US', {
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

                  <View className="flex flex-row gap-2">
                    <Text
                      className="bg-primary text-white"
                      style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: 10,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}
                    >
                      End
                    </Text>
                    <Text
                      className="text-zinc-400"
                      style={{ fontFamily: 'PoppinsMedium', fontSize: 10 }}
                    >
                      {item.end_time
                        ? new Date(item.end_time).toLocaleString('en-US', {
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
                </View>
              </Pressable>
              </View>
            ))
          )
        )}
      </View>
      </ScrollView>
    </View>
  )
}

export default Sessions