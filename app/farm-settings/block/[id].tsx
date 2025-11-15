import { View, Text, Pressable, ActivityIndicator, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ArrowLeft, Unlock, UserLock } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import BlockUser from '@/components/containers/dialogs/BlockUser'
import { useGetBlockedUsersQuery, useGetFarmQuery } from '@/store/farmApi'
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder'
import UnblockUser from '@/components/containers/dialogs/UnblockUser'

const BlockList = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetFarmQuery(Number(id));
  const { data: blockedUsers, isLoading: blockedUsersLoading } = useGetBlockedUsersQuery(Number(id))
  const [showBlock, setShowBlock] = useState(false);
  const [showUnblock, setShowUnblock] = useState(false)
  const [unblockId, setUnblockId] = useState<number>();


  if (isLoading) return (
        <View className='flex-1 items-center justify-center bg-white'>
          <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        </View>
      );
      
  return (
    <View className='flex-1 bg-white'>
      <UnblockUser visible={showUnblock} setVisible={setShowUnblock} userId={unblockId} farmId={Number(id) || data?.id}></UnblockUser>
      <BlockUser visible={showBlock} setVisible={setShowBlock} farmId={data?.id || Number(id)} ownerId={data?.owner}/>
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

          <Text
            className='text-3xl'
            style={{
              fontFamily: 'PoppinsBold',
            }}
          >
            Blocklist
          </Text>
        </View>
        <Pressable 
          onPress={() => setShowBlock(true)}
          android_ripple={{ color: "#ffffff50", borderless: false }} 
          className='gap-2 flex-row items-center' 
          style={{ 
            backgroundColor: '#155183', 
            paddingVertical: 6, 
            paddingHorizontal: 12, 
            borderRadius: 9999 
            }}>
            <UserLock size={14} color={'#ffffff'}/>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#ffffff' }}>Block</Text>
          </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'>
      <Text className='text-zinc-400 mt-3' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12 }}>Blocked</Text>
      
      {blockedUsersLoading ? (
        <>
          <View className='flex flex-row items-center gap-3 mt-3'>
            <SkeletonShimmer style={{ width: 50, height: 50, borderRadius: 999 }} />
            <View className='flex flex-col'>
              <SkeletonShimmer style={{ width: 100, height: 15, borderRadius: 4 }} />
              <SkeletonShimmer style={{ width: 150, height: 15, borderRadius: 4, marginTop: 8 }} />
            </View>
          </View>
          <View className='flex flex-row items-center gap-3 mt-3'>
            <SkeletonShimmer style={{ width: 50, height: 50, borderRadius: 999 }} />
            <View className='flex flex-col'>
              <SkeletonShimmer style={{ width: 100, height: 15, borderRadius: 4 }} />
              <SkeletonShimmer style={{ width: 150, height: 15, borderRadius: 4, marginTop: 8 }} />
            </View>
          </View>
        </>
      ) : blockedUsers && blockedUsers.length !== 0 ? (
        blockedUsers.map((member) => (
          <View key={member.id} className='flex flex-row items-center justify-between gap-3 mt-3'>
            <View className='flex-row items-center gap-3'>
              <Image
                source={member?.profile_picture ? { uri: member?.profile_picture } : require('@/assets/images/default-profile.png')}
                style={{ width: 50, height: 50, borderRadius: 999 }}
                resizeMode="cover"
              />
              <View className="flex flex-col">
                <Text className='text-zinc-600' style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13 }}>
                  {member?.first_name && member?.first_name[0].toUpperCase() + member?.first_name.slice(1)} {member?.last_name && member?.last_name[0].toUpperCase() + member?.last_name.slice(1)}
                </Text>
                <Text className='text-zinc-400' style={{ fontSize: 12, fontFamily: 'PoppinsRegular' }}>{member?.email}</Text>
              </View>
            </View>
            <View className='bg-primary rounded-full'>
              <Pressable
                onPress={() => {setUnblockId(member.id); setShowUnblock(true)}}
                android_ripple={{ color: '#e5e7eb', borderless: true }}
                style={{ padding: 8, borderRadius: 9999 }}
              >
                <Unlock color="#ffffff" size={20} />
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <View className='flex-1 items-center justify-center mt-20'>
          <Text className='text-zinc-300' style={{ fontFamily: 'PoppinsBold', fontSize: 18 }}>
            NO BLOCKED USERS
          </Text>
        </View>
      )}
    </ScrollView>
    </View>
  )
}

export default BlockList