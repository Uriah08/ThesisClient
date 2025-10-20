import { View, Text, ScrollView, Image, TextInput } from 'react-native'
import React from 'react'
import { useGetMembersQuery } from '@/store/farmApi'
import SkeletonShimmer from '../../SkeletonPlaceholder'
import { Search } from 'lucide-react-native'

type Props = {
  farmId: number
  ownerId: number
}
const Members = ({ farmId, ownerId }: Props) => {
  const { data, isLoading } = useGetMembersQuery(farmId) 

  const admin = data?.find((member) => member.id === ownerId);
  const members = data?.filter((member) => member.id !== ownerId);
  
  return (
    <View className='flex-1 flex flex-col'>
      <Text className='text-xl text-zinc-700 mt-3 px-5' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>Members</Text>
      <View className='relative p-5'>
        <TextInput
        style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
          className='rounded-full pl-12 text-base text-black border'
          placeholder='Search user...'
        />
        <Search
          style={{ position: 'absolute', top: 25, left: 28 }}
          color={'#d4d4d8'}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'>
        <Text className='text-zinc-400' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12}}>Admin</Text>
        {isLoading ? (
          <View className='flex flex-row items-center gap-3 mt-3'>
            <SkeletonShimmer style={{ width: 50, height: 50, borderRadius: 999 }}/>
            <View className='flex flex-col'>
              <SkeletonShimmer style={{ width: 100, height: 15, borderRadius: 4 }}/>
              <SkeletonShimmer style={{ width: 150, height: 15, borderRadius: 4, marginTop: 8 }}/>
            </View>
          </View>
        ) : (
          <View className='flex flex-row items-center gap-3 mt-3'>
            <Image
              source={
              admin?.profile_picture
                  ? { uri: admin?.profile_picture }
                  : require('@/assets/images/default-profile.png')
              }
              style={{ width: 50, height: 50, borderRadius: 999 }}
              resizeMode="cover"
            />
            <View className="flex flex-col">
              <Text 
              className='text-zinc-600' 
              style={{ 
                fontFamily: 'PoppinsSemiBold', 
                fontSize: 13 
              }}>
                {admin?.first_name && admin?.first_name[0].toUpperCase() + admin?.first_name.slice(1)} {admin?.last_name && admin?.last_name[0].toUpperCase() + admin?.last_name.slice(1)}</Text>
              <Text className='text-zinc-400' style={{ fontSize: 12, fontFamily: 'PoppinsRegular' }}>{admin?.email}</Text>
            </View>
          </View>
        )}
        <Text className='text-zinc-400 mt-3' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12}}>Members</Text>
        {isLoading ? (
          <>
          <View className='flex flex-row items-center gap-3 mt-3'>
            <SkeletonShimmer style={{ width: 50, height: 50, borderRadius: 999 }}/>
            <View className='flex flex-col'>
              <SkeletonShimmer style={{ width: 100, height: 15, borderRadius: 4 }}/>
              <SkeletonShimmer style={{ width: 150, height: 15, borderRadius: 4, marginTop: 8 }}/>
            </View>
          </View>
          <View className='flex flex-row items-center gap-3 mt-3'>
            <SkeletonShimmer style={{ width: 50, height: 50, borderRadius: 999 }}/>
            <View className='flex flex-col'>
              <SkeletonShimmer style={{ width: 100, height: 15, borderRadius: 4 }}/>
              <SkeletonShimmer style={{ width: 150, height: 15, borderRadius: 4, marginTop: 8 }}/>
            </View>
          </View>
          </>
        ) : (
          members?.map((member) => (
            <View key={member.id} className='flex flex-row items-center gap-3 mt-3'>
              <Image
                source={
                member?.profile_picture
                    ? { uri: member?.profile_picture }
                    : require('@/assets/images/default-profile.png')
                }
                style={{ width: 50, height: 50, borderRadius: 999 }}
                resizeMode="cover"
              />
              <View className="flex flex-col">
                <Text 
                className='text-zinc-600' 
                style={{ 
                  fontFamily: 'PoppinsSemiBold', 
                  fontSize: 13 
                }}>
                  {member?.first_name && member?.first_name[0].toUpperCase() + member?.first_name.slice(1)} {member?.last_name && member?.last_name[0].toUpperCase() + member?.last_name.slice(1)}</Text>
                <Text className='text-zinc-400' style={{ fontSize: 12, fontFamily: 'PoppinsRegular' }}>{member?.email}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Members