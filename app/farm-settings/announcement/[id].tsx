import { View, Text, ActivityIndicator, Pressable, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { ArrowLeft, Megaphone, Trash } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetAnnouncementQuery } from '@/store/farmApi'
import DeleteClass from '@/components/containers/dialogs/Delete'
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder'

const Announcement = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetAnnouncementQuery(Number(id));
  const [showDelete, setShowDelete] = useState(false);
  const [announcementId, setAnnouncementId] = useState<number>()
  
  if (isLoading) return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </View>
    );
  
  return (
    <View className='flex-1 bg-white'>
      <DeleteClass visible={showDelete} setVisible={setShowDelete} announcementId={announcementId} type='announcement'/>
      <View className='flex-row gap-5 items-center mt-10 p-5'>
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
          Announcements
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='p-5'>
        <Text className='text-zinc-600' style={{ fontFamily: 'PoppinsMedium'}}>Active</Text>
        {isLoading ? (
          <View>
            <SkeletonShimmer style={{ width: '100%', height: 140, borderRadius: 12, marginTop: 12 }}/>
            <SkeletonShimmer style={{ width: '100%', height: 140, borderRadius: 12, marginTop: 12 }}/>
          </View>
        ) : (
          data?.length === 0 ? (
            <View className='p-5'>
              <Text className='text-zinc-300 text-center mt-10' style={{ fontFamily: 'PoppinsBold', fontSize: 20}}>NO ANNOUNCEMENTS</Text>
            </View>
          ) : (
            data?.map((item, i) => (
              <View key={i} className='flex flex-col mt-3' style={{ borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 12, padding: 13}}>
                <View className='flex-row justify-between items-center'>
                  <View className='flex-row gap-3 items-center'>
                    <View className='bg-primary p-2' style={{ borderRadius: 999 }}>
                      <Megaphone color={'#ffffff'} size={20}/>
                    </View>
                    <Text className='text-zinc-600' style={{ fontFamily: 'PoppinsMedium', fontSize: 15}}>{item.title}</Text>
                  </View>
                  <Trash color={'#52525b'} size={16} onPress={() => {setShowDelete(true); setAnnouncementId(Number(item.id))}}/>
                </View>
                <Text className='mt-3 text-zinc-600 text-justify' style={{ fontFamily: 'PoppinsRegular', fontSize: 13}}>{'     '}{item.content}</Text>
                <Text className='mt-3 self-end text-zinc-400' style={{ fontFamily: 'PoppinsRegular', fontSize: 11}}>{'     '}Posted on {new Date(item.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', '')}</Text>
                <View className='flex-row gap-2 items-center self-end'>
                  <Image
                    source={
                      item?.created_by_profile_picture
                        ? { uri: item?.created_by_profile_picture }
                        : require('@/assets/images/default-profile.png')
                    }
                    style={{ width: 15, height: 15, borderRadius: 999 }}
                    resizeMode="cover"
                  />
                  <Text
                    className="text-zinc-500"
                    style={{
                      fontFamily: 'PoppinsRegular',
                      fontSize: 12,
                      marginTop: 3,
                    }}
                  >
                    {item?.created_by_username
                      ? item.created_by_username[0].toUpperCase() +
                        item.created_by_username.slice(1)
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            ))
          ))}
        </ScrollView>
    </View>
  )
}

export default Announcement