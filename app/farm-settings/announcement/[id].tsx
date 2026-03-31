import { View, Text, ActivityIndicator, Pressable, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { ChevronLeft, MegaphoneIcon, Trash2 } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetAnnouncementQuery } from '@/store/farmApi'
import DeleteClass from '@/components/containers/dialogs/Delete'
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder'

const Announcement = () => {
  const { id } = useLocalSearchParams()
  const { data, isLoading } = useGetAnnouncementQuery(Number(id))
  const [showDelete, setShowDelete] = useState(false)
  const [announcementId, setAnnouncementId] = useState<number>()

  if (isLoading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <DeleteClass
        visible={showDelete}
        setVisible={setShowDelete}
        announcementId={announcementId}
        type="announcement"
      />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          Announcements
        </Text>
      </View>

      {/* Subtitle chip */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#FAEEDA',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <MegaphoneIcon size={13} color="#854F0B" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Active announcements for your farm
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, gap: 12 }}
      >
        {isLoading ? (
          <>
            <SkeletonShimmer style={{ width: '100%', height: 140, borderRadius: 12 }} />
            <SkeletonShimmer style={{ width: '100%', height: 140, borderRadius: 12 }} />
          </>
        ) : data?.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
            <View style={{
              width: 52, height: 52, borderRadius: 16,
              backgroundColor: '#FAEEDA',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <MegaphoneIcon size={22} color="#854F0B" />
            </View>
            <Text style={{
              fontSize: 14, fontFamily: 'PoppinsMedium',
              color: '#d4d4d8', marginTop: 4,
            }}>
              No announcements yet
            </Text>
          </View>
        ) : (
          data?.map((item, i) => (
            <View key={i} style={{
              borderRadius: 16, borderWidth: 0.5,
              borderColor: '#f4f4f5', backgroundColor: '#fafafa',
              padding: 16,
            }}>

              {/* Card header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={{
                    width: 34, height: 34, borderRadius: 10,
                    backgroundColor: '#FAEEDA',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MegaphoneIcon size={15} color="#854F0B" />
                  </View>
                  <Text style={{
                    flex: 1, fontSize: 14, fontFamily: 'PoppinsMedium',
                    color: '#18181b',
                  }} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <Pressable
                  onPress={() => { setShowDelete(true); setAnnouncementId(Number(item.id)) }}
                  hitSlop={8}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    backgroundColor: '#FCEBEB',
                    alignItems: 'center', justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <Trash2 size={13} color="#A32D2D" />
                </Pressable>
              </View>

              {/* Divider */}
              <View style={{ height: 0.5, backgroundColor: '#f4f4f5', marginVertical: 12 }} />

              {/* Content */}
              <Text style={{
                fontSize: 13, fontFamily: 'PoppinsRegular',
                color: '#52525b', lineHeight: 20,
              }}>
                {item.content}
              </Text>

              {/* Footer */}
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', marginTop: 14,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Image
                    source={
                      item?.created_by_profile_picture
                        ? { uri: item.created_by_profile_picture }
                        : require('@/assets/images/default-profile.png')
                    }
                    style={{ width: 18, height: 18, borderRadius: 999 }}
                    resizeMode="cover"
                  />
                  <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#71717a' }}>
                    {item?.created_by_username
                      ? item.created_by_username[0].toUpperCase() + item.created_by_username.slice(1)
                      : 'N/A'}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
                  {new Date(item.created_at).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true,
                  }).replace(',', '')}
                </Text>
              </View>

            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Announcement