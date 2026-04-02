import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { useGetFarmTrayHistoryQuery, useLazyGetTrayProgressQuery } from '@/store/trayApi'
import { ChevronLeft, CircleCheck, SlidersHorizontal } from 'lucide-react-native'
import { ScrollView } from 'react-native-gesture-handler'
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder'
import BottomDrawer, { BottomDrawerRef } from '@/components/containers/BottomDrawer'
import ProgressSteps from '@/components/containers/farm/tray/ProgressSteps'
import { Tray } from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PRIMARY = '#155183'

const History = () => {
  const { id } = useLocalSearchParams()

  const HISTORY_CACHE_KEY = (id: number) => `tray_history_cache_${id}`

  const { data: freshData } = useGetFarmTrayHistoryQuery(Number(id))
  const [cachedData, setCachedData] = useState<typeof freshData | null>(null)
  const data = freshData ?? cachedData
  const [trigger, { data: progress, isFetching: progressLoading }] = useLazyGetTrayProgressQuery()

  const [selectedItem, setSelectedItem]   = useState<Tray | null>(null)
  const [isDrawerOpen, setIsDrawerOpen]   = useState(false)
  const [showFilter, setShowFilter]       = useState(false)
  const [sortFilter, setSortFilter]       = useState<'newest' | 'oldest'>('newest')
  const drawerRef = useRef<BottomDrawerRef>(null)

  const finishedTrays = (data?.filter(item => item.finished_at !== null) ?? [])
    .slice()
    .sort((a, b) => {
      if (sortFilter === 'oldest')
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const handlePress = async (item: Tray) => {
    if (isDrawerOpen) {
      setSelectedItem(null)
      drawerRef.current?.close()
    } else {
      setSelectedItem(null)
      drawerRef.current?.open()
    }
    setSelectedItem(item)
    await trigger(Number(item.id)).unwrap()
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })

    useEffect(() => {
      AsyncStorage.getItem(HISTORY_CACHE_KEY(Number(id)))
        .then(raw => { if (raw) setCachedData(JSON.parse(raw)) })
        .catch(e => console.log('Cache load error:', e))
    }, [id])

    useEffect(() => {
      if (!freshData) return
      AsyncStorage.setItem(HISTORY_CACHE_KEY(Number(id)), JSON.stringify(freshData))
        .catch(e => console.log('Cache save error:', e))
    }, [freshData, id])

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        paddingTop: 56, paddingBottom: 16, paddingHorizontal: 24,
        borderBottomWidth: 0.5, borderBottomColor: '#f4f4f5',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: '#f4f4f5',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <ChevronLeft size={18} color="#18181b" />
          </Pressable>
          <View>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 17, color: '#18181b' }}>
              History
            </Text>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa', marginTop: 1 }}>
              {finishedTrays.length} completed session{finishedTrays.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Filter */}
        <View>
          <Pressable
            onPress={() => setShowFilter(prev => !prev)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: '#fafafa',
              borderWidth: 0.5, borderColor: '#f4f4f5',
              borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10,
            }}>
            <SlidersHorizontal size={13} color={PRIMARY} />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#52525b' }}>
              {sortFilter === 'newest' ? 'Newest' : 'Oldest'}
            </Text>
          </Pressable>

          {showFilter && (
            <View style={{
              position: 'absolute', top: 42, right: 0, zIndex: 50,
              backgroundColor: '#ffffff',
              borderWidth: 0.5, borderColor: '#f4f4f5',
              borderRadius: 14, padding: 8, width: 150,
            }}>
              <Text style={{
                fontFamily: 'PoppinsMedium', fontSize: 11,
                color: '#a1a1aa', letterSpacing: 0.6,
                textTransform: 'uppercase', marginBottom: 4,
                paddingHorizontal: 8,
              }}>
                Sort by
              </Text>
              {(['newest', 'oldest'] as const).map(opt => (
                <Pressable
                  key={opt}
                  onPress={() => { setSortFilter(opt); setShowFilter(false) }}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    padding: 8, borderRadius: 8,
                    backgroundColor: sortFilter === opt ? '#E6F1FB' : 'transparent',
                  }}>
                  <Text style={{
                    fontFamily: sortFilter === opt ? 'PoppinsSemiBold' : 'PoppinsRegular',
                    fontSize: 13,
                    color: sortFilter === opt ? PRIMARY : '#52525b',
                  }}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Text>
                  {sortFilter === opt && (
                    <CircleCheck size={13} color={PRIMARY} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 10 }}
      >
        {!data ? (
          <>
            <SkeletonShimmer style={{ height: 90, borderRadius: 16 }} />
            <SkeletonShimmer style={{ height: 90, borderRadius: 16 }} />
            <SkeletonShimmer style={{ height: 90, borderRadius: 16 }} />
          </>
        ) : finishedTrays.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
            <View style={{
              width: 52, height: 52, borderRadius: 16,
              backgroundColor: '#E6F1FB',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <CircleCheck size={22} color={PRIMARY} />
            </View>
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 14, color: '#d4d4d8', marginTop: 4 }}>
              No completed sessions yet
            </Text>
          </View>
        ) : (
          finishedTrays.map(tray => (
            <Pressable
              key={tray.id}
              onPress={() => handlePress(tray)}
              android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
              style={{
                backgroundColor: '#fafafa',
                borderWidth: 0.5, borderColor: '#f4f4f5',
                borderRadius: 16, padding: 14,
              }}
            >
              {/* Top row — tray name + author */}
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{
                    width: 30, height: 30, borderRadius: 8,
                    backgroundColor: '#E6F1FB',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CircleCheck size={14} color={PRIMARY} />
                  </View>
                  <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#18181b' }}>
                    {tray.tray_name}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Image
                    source={
                      tray?.created_by_profile_picture
                        ? { uri: tray.created_by_profile_picture }
                        : require('@/assets/images/default-profile.png')
                    }
                    style={{ width: 18, height: 18, borderRadius: 999 }}
                    resizeMode="cover"
                  />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#71717a' }}>
                    {tray.created_by_username
                      ? tray.created_by_username[0].toUpperCase() + tray.created_by_username.slice(1)
                      : 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 0.5, backgroundColor: '#f4f4f5', marginBottom: 10 }} />

              {/* Date rows */}
              <View style={{ gap: 6 }}>
                {(['Start', 'End'] as const).map(label => (
                  <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                      paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
                      backgroundColor: label === 'Start' ? '#E6F1FB' : '#E1F5EE',
                    }}>
                      <Text style={{
                        fontFamily: 'PoppinsSemiBold', fontSize: 9,
                        color: label === 'Start' ? PRIMARY : '#0F6E56',
                        letterSpacing: 0.4,
                      }}>
                        {label.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#71717a' }}>
                      {label === 'Start'
                        ? tray.created_at ? formatDate(tray.created_at) : '—'
                        : tray.finished_at ? formatDate(tray.finished_at) : '—'}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Bottom drawer — timeline */}
      <BottomDrawer ref={drawerRef} onChange={open => setIsDrawerOpen(open)} type="full">
        {progressLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={30} color={PRIMARY} />
          </View>
        ) : (
          <>
            {/* Drawer handle label */}
            <View style={{
              paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8,
              borderBottomWidth: 0.5, borderBottomColor: '#f4f4f5',
            }}>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#18181b' }}>
                {selectedItem?.tray_name}
              </Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa', marginTop: 2 }}>
                Session timeline
              </Text>
            </View>
            <ScrollView
              style={{ flex: 1, width: '100%' }}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            >
              <ProgressSteps
                loading={progressLoading}
                created_at={selectedItem?.created_at}
                finished_at={selectedItem?.finished_at}
                owner={selectedItem?.created_by_username}
                owner_pfp={selectedItem?.created_by_profile_picture}
                progress={progress}
              />
            </ScrollView>
          </>
        )}
      </BottomDrawer>
    </View>
  )
}

export default History