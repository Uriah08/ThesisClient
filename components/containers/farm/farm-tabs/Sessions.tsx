import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { useGetFarmSessionsQuery } from '@/store/sessionApi'
import SkeletonShimmer from '../../SkeletonPlaceholder'

type Props = {
  farmId: number
}
const Sessions = ({ farmId }: Props) => {
  const { data: sessions = [], isLoading } = useGetFarmSessionsQuery(farmId);

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const activeSessions = sortedSessions.filter((session) => session.status === 'active');
  const inactiveSessions = sortedSessions.filter((session) => session.status === 'inactive' || session.status === 'finished');
  
  return (
    <View className='flex-1 flex flex-col'>
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
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'>
        <Text className='text-zinc-400 mt-3' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12}}>Active</Text>
      <View className='flex gap-3 flex-col'>
        {isLoading ? (
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
                onPress={() => console.log('Pressed:', item.name)}
              >
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-row items-center gap-3">
                    <Text
                      className="text-zinc-500"
                      style={{ fontFamily: 'PoppinsSemiBold' }}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        height: 8,
                        width: 8,
                        borderRadius: 99,
                        marginBottom: 3,
                        backgroundColor: '#52525b',
                      }}
                    />
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
                onPress={() => console.log('Pressed:', item.name)}
              >
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-row items-center gap-3">
                    <Text
                      className="text-zinc-500"
                      style={{ fontFamily: 'PoppinsSemiBold' }}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        height: 8,
                        width: 8,
                        borderRadius: 99,
                        marginBottom: 3,
                        backgroundColor: '#52525b',
                      }}
                    />
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