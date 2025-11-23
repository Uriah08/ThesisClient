// import { View, Text, Pressable, ScrollView, TextInput, RefreshControl } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useGetFarmSessionsQuery } from '@/store/sessionApi'
// import SkeletonShimmer from '../../SkeletonPlaceholder'
// import Session from './session-tabs/Session'
// import { FarmSession } from '@/utils/types'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { router } from 'expo-router'
// import { FilterIcon, MapPlus, Search, TriangleAlert } from 'lucide-react-native'
// import CreateSession from '../../dialogs/CreateSession'
// import SessionStatus from './session-tabs/SessionStatus'

// type Props = { farmId: number }

// type SessionCardProps = {
//   item: FarmSession
//   onSelect: (session: FarmSession) => void
// }

// const SessionCard = (
  // { item, onSelect }: SessionCardProps
// ) => {
  // const createdAt = new Date(item.created_at)
  // const now = new Date()
  // const diffInTime = now.getTime() - createdAt.getTime()
  // const diffInDays = diffInTime / (1000 * 3600 * 24)

  // const showTriangleAlert = diffInDays > 2

//   return (
//     <View style={{ overflow: 'hidden', borderRadius: 10, marginTop: 10 }}>
//       <Pressable
//         android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
//         style={{
//           borderRadius: 10,
//           borderWidth: 1,
//           padding: 10,
//           borderColor: '#d4d4d8',
//         }}
//         onPress={() => onSelect(item)}
//       >
//         <View className="flex flex-row justify-between items-center">
//           <View className="flex flex-row items-center gap-3">
//             <Text className="text-zinc-500" style={{ fontFamily: 'PoppinsSemiBold' }}>
//               {item.name}
//             </Text>
//             <SessionStatus sessionStatus={item.status} />
//           </View>

//           <Text
//             className="text-zinc-400"
//             style={{ fontFamily: 'PoppinsMedium', fontSize: 11 }}
//           >
//             {createdAt.toLocaleDateString('en-US', {
//               month: 'short',
//               day: 'numeric',
//               year: 'numeric',
//             })}
//           </Text>
//         </View>
//         <View className='flex-row gap-3'>
//           <Text
//             style={{ marginBottom: 5, fontFamily: 'PoppinsRegular', fontSize: 12 }}
//             className="text-zinc-500"
//           >
//             Trays: {item.trays_count}
//           </Text>
//           {(showTriangleAlert && item.status === 'active') && 
//           <View className='flex-row gap-2'>
//             <TriangleAlert size={15} color={'#ca8a04'} />
//             <Text className='text-zinc-500' style={{
//               marginBottom: 5, fontFamily: 'PoppinsRegular', fontSize: 12
//             }}>Harvest Now</Text>
//           </View>
//           }
//         </View>

//         <View className="gap-3 flex flex-row">
//           {['Start', 'End'].map((label) => (
//             <View key={label} className="flex flex-row gap-2">
//               <Text
//                 className="bg-primary text-white"
//                 style={{
//                   fontFamily: 'PoppinsRegular',
//                   fontSize: 10,
//                   paddingHorizontal: 5,
//                   borderRadius: 5,
//                 }}
//               >
//                 {label}
//               </Text>
//               <Text
//                 className="text-zinc-400"
//                 style={{ fontFamily: 'PoppinsMedium', fontSize: 10 }}
//               >
//                 {label === 'Start'
//                   ? item.start_time
//                     ? new Date(item.start_time).toLocaleString('en-US', {
//                         hour: 'numeric',
//                         minute: '2-digit',
//                         hour12: true,
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                       })
//                     : '-'
//                   : item.end_time
//                   ? new Date(item.end_time).toLocaleString('en-US', {
//                       hour: 'numeric',
//                       minute: '2-digit',
//                       hour12: true,
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric',
//                     })
//                   : '-'}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </Pressable>
//     </View>
//   )
// }

const Sessions = (
  // { farmId }: Props

) => {
//   const { data: sessions = [], isLoading, refetch } = useGetFarmSessionsQuery(farmId)
//   const [chosenSession, setChosenSession] = useState<FarmSession | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [createVisible, setCreateVisible] = useState(false)
//   const [refreshing, setRefreshing] = useState(false)

//   const onRefresh = async () => {
//     await refetch()
//     setRefreshing(true)
//     setTimeout(() => setRefreshing(false), 1000)
//   }

//   const sortedSessions = [...sessions].sort(
//     (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//   )

//   const activeSessions = sortedSessions.filter((s) => s.status === 'active')
//   const inactiveSessions = sortedSessions.filter(
//     (s) => s.status === 'inactive' || s.status === 'finished'
//   )

//   useEffect(() => {
//     const loadSession = async () => {
//       setLoading(true)
//       try {
//         const storedSession = await AsyncStorage.getItem('session')
//         if (storedSession) setChosenSession(JSON.parse(storedSession).session)
//         else router.replace('/(tabs)/farm')
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadSession()
//   }, [])

//   const pickSession = async (session: FarmSession) => {
//     await AsyncStorage.setItem('session', JSON.stringify({ session }))
//     setChosenSession(session)
//   }

//   if (chosenSession) {
//     return <Session farmId={farmId} session={chosenSession} onBack={() => setChosenSession(null)} />
//   }

//   const renderSection = (title: string, items: FarmSession[], emptyText: string) => (
//     <>
//       <Text
//         className="text-zinc-400 mt-3"
//         style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12 }}
//       >
//         {title}
//       </Text>
//       <View className="flex flex-col">
//         {isLoading || loading ? (
//           <View className='flex gap-3'>
//             <SkeletonShimmer width={'100%'} height={80} style={{ marginTop: 10 }} />
//             <SkeletonShimmer width={'100%'} height={80} />
//           </View>
//         ) : items.length === 0 ? (
//           <View className="flex flex-col justify-center items-center">
//             <Text
//               className="mt-5"
//               style={{
//                 fontFamily: 'PoppinsExtraBold',
//                 fontSize: 15,
//                 color: '#d4d4d8',
//               }}
//             >
//               {emptyText}
//             </Text>
//           </View>
//         ) : (
//           items.map((item) => <SessionCard key={item.id} item={item} onSelect={pickSession} />)
//         )}
//       </View>
//     </>
//   )

  return (
    // <View className="flex-1">
    //   <Pressable
    //     onPress={() => setCreateVisible(true)}
    //     android_ripple={{ color: '#ffffff50' }}
    //     className="absolute bottom-5 right-5 flex-row items-center gap-3 px-5 bg-primary rounded-full"
    //     style={{ paddingVertical: 10, zIndex: 999 }}
    //   >
    //     <Text className="text-white" style={{ fontFamily: 'PoppinsSemiBold' }}>
    //       Create
    //     </Text>
    //     <MapPlus color="#fff" />
    //   </Pressable>

    //   <CreateSession visible={createVisible} setVisible={setCreateVisible} farmId={farmId} />

    //   {/* Header */}
    //   <View className="flex-row justify-between items-center mt-3 px-5">
    //     <Text
    //       className="text-xl text-zinc-700"
    //       style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}
    //     >
    //       Sessions
    //     </Text>
    //     <View className='flex flex-row items-center gap-3 justify-end'>
    //       <View className='flex flex-row items-center' style={{ gap: 4}}>
    //         <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#16a34a'}}/>
    //         <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Active</Text>
    //       </View>
    //       <View className='flex flex-row items-center' style={{ gap: 4}}>
    //         <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#52525b'}}/>
    //         <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Inactive</Text>
    //       </View>
    //       <View className='flex flex-row items-center text-zinc-600 bg-red-700' style={{ gap: 4}}>
    //         <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, backgroundColor: '#2563eb'}}/>
    //         <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}>Finished</Text>
    //       </View>
    //     </View>
    //   </View>

    //   {/* Search */}
    //   <View className='flex-row gap-3 w-full p-5'>
    //       <View className='relative flex-1'>
    //         <TextInput
    //         style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
    //           className='rounded-full pl-12 text-base text-black border'
    //           placeholder='Search session...'
    //         />
    //         <Search
    //           style={{ position: 'absolute', top: 8, left: 14 }}
    //           color={'#d4d4d8'}
    //         />
    //       </View>
    //       <View className='flex items-center justify-center' style={{ backgroundColor: '#155183', borderRadius: 10, padding: 8 }}>
    //         <FilterIcon color={'#ffffff'} size={20}/>
    //       </View>
    //     </View>

    //   <ScrollView
    //     className="flex-1 px-5"
    //     showsVerticalScrollIndicator={false}
    //     refreshControl={
    //       <RefreshControl colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
    //     }
    //   >
    //     {renderSection('Active', activeSessions, 'NO ACTIVE SESSIONS')}
    //     {renderSection('Others', inactiveSessions, 'NO SESSIONS')}
    //     <View className='mt-5'></View>
    //   </ScrollView>
    // </View>
    <></>
  )
}

export default Sessions
