import { View, Text, ScrollView, Image, TextInput, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetMembersQuery } from '@/store/farmApi'
import SkeletonShimmer from '../../SkeletonPlaceholder'
import { Search, ShieldCheck, Users } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PRIMARY = '#155183'
const PRIMARY_LIGHT = '#E6F1FB'

type Props = {
  farmId: number
  ownerId: number
}

type MemberRowProps = {
  username?: string
  email?: string
  profile_picture?: string
  isAdmin?: boolean
}

const MemberRow = ({ username, email, profile_picture, isAdmin }: MemberRowProps) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
  }}>
    {/* Avatar */}
    <View style={{
      padding: 2, borderRadius: 999,
      borderWidth: isAdmin ? 1.5 : 0,
      borderColor: isAdmin ? PRIMARY : 'transparent',
    }}>
      <Image
        source={
          profile_picture
            ? { uri: profile_picture }
            : require('@/assets/images/default-profile.png')
        }
        style={{ width: 42, height: 42, borderRadius: 999 }}
        resizeMode="cover"
      />
    </View>

    {/* Info */}
    <View style={{ flex: 1, gap: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
          {username && username[0].toUpperCase() + username.slice(1)}
        </Text>
        {isAdmin && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 3,
            backgroundColor: PRIMARY_LIGHT,
            paddingHorizontal: 7, paddingVertical: 2,
            borderRadius: 99,
          }}>
            <ShieldCheck size={10} color={PRIMARY} />
            <Text style={{ fontSize: 9, fontFamily: 'PoppinsMedium', color: PRIMARY }}>Admin</Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
        {email}
      </Text>
    </View>
  </View>
)

const MemberRowSkeleton = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16 }}>
    <SkeletonShimmer style={{ width: 46, height: 46, borderRadius: 999 }} />
    <View style={{ gap: 6 }}>
      <SkeletonShimmer style={{ width: 110, height: 12, borderRadius: 4 }} />
      <SkeletonShimmer style={{ width: 160, height: 11, borderRadius: 4 }} />
    </View>
  </View>
)

const Members = ({ farmId, ownerId }: Props) => {
  const MEMBERS_CACHE_KEY = (farmId: number) => `members_cache_${farmId}`

  const { data: freshData, refetch } = useGetMembersQuery(farmId)
  const [cachedData, setCachedData] = useState<typeof freshData | null>(null)
  const data = freshData ?? cachedData

  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const admin = data?.find((m) => m.id === ownerId)
  const members = data
    ?.filter((m) => m.id !== ownerId)
    ?.filter((m) =>
      m.username?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    )

  const adminMatch = !search ||
    admin?.username?.toLowerCase().includes(search.toLowerCase()) ||
    admin?.email?.toLowerCase().includes(search.toLowerCase())

  const totalCount = data?.length ?? 0

  useEffect(() => {
    AsyncStorage.getItem(MEMBERS_CACHE_KEY(farmId))
      .then(raw => { if (raw) setCachedData(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [farmId])

  useEffect(() => {
    if (!freshData) return
    AsyncStorage.setItem(MEMBERS_CACHE_KEY(farmId), JSON.stringify(freshData))
      .catch(e => console.log('Cache save error:', e))
  }, [freshData, farmId]);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 8,
      }}>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46' }}>Members</Text>
        {totalCount > 0 && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: '#f4f4f5',
            paddingHorizontal: 10, paddingVertical: 4,
            borderRadius: 20,
          }}>
            <Users size={11} color="#71717a" />
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a' }}>
              <Text style={{ fontFamily: 'PoppinsSemiBold', color: '#3f3f46' }}>{totalCount}</Text> total
            </Text>
          </View>
        )}
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 15, paddingBottom: 16 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fafafa',
          borderRadius: 12,
          borderWidth: 0.5, borderColor: '#f4f4f5',
          paddingHorizontal: 14, gap: 10,
          height: 42,
        }}>
          <Search size={15} color="#d4d4d8" />
          <TextInput
            style={{ flex: 1, fontFamily: 'PoppinsRegular', fontSize: 13, color: '#18181b' }}
            placeholder="Search members..."
            placeholderTextColor="#d4d4d8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 60, gap: 16 }}
        refreshControl={
          <RefreshControl colors={[PRIMARY]} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Admin section */}
        {adminMatch && (
          <View style={{ gap: 8 }}>
            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase',
            }}>
              Admin
            </Text>
            <View style={{
              borderRadius: 16, borderWidth: 0.5,
              borderColor: '#f4f4f5', overflow: 'hidden',
              backgroundColor: '#fafafa',
            }}>
              {!data
                ? <MemberRowSkeleton />
                : <MemberRow
                    username={admin?.username}
                    email={admin?.email}
                    profile_picture={admin?.profile_picture}
                    isAdmin
                  />
              }
            </View>
          </View>
        )}

        {/* Members section */}
        {(!data || (members?.length ?? 0) > 0) && (
          <View style={{ gap: 8 }}>
            <Text style={{
              fontSize: 11, fontFamily: 'PoppinsMedium',
              color: '#a1a1aa', letterSpacing: 0.8, textTransform: 'uppercase',
            }}>
              Members
            </Text>
            <View style={{
              borderRadius: 16, borderWidth: 0.5,
              borderColor: '#f4f4f5', overflow: 'hidden',
              backgroundColor: '#fafafa',
            }}>
              {!data ? (
                <>
                  <MemberRowSkeleton />
                  <View style={{ height: 0.5, backgroundColor: '#f4f4f5', marginHorizontal: 16 }} />
                  <MemberRowSkeleton />
                </>
              ) : (
                members?.map((member, i) => (
                  <View key={member.id}>
                    <MemberRow
                      username={member.username}
                      email={member.email}
                      profile_picture={member.profile_picture}
                    />
                    {i < (members.length - 1) && (
                      <View style={{ height: 0.5, backgroundColor: '#f4f4f5', marginHorizontal: 16 }} />
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* Empty state */}
        {!data && members?.length === 0 && search && (
          <View style={{ alignItems: 'center', paddingVertical: 32, gap: 8 }}>
            <View style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: '#f4f4f5',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={20} color="#d4d4d8" />
            </View>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>
              No members found
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  )
}

export default Members