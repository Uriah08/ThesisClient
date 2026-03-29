import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router';
import { useGetFarmTrayHistoryQuery, useLazyGetTrayProgressQuery } from '@/store/trayApi';
import { ArrowLeft, FilterIcon, CircleCheck } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder';
import BottomDrawer, { BottomDrawerRef } from '@/components/containers/BottomDrawer';
import ProgressSteps from '@/components/containers/farm/tray/ProgressSteps';
import { Tray } from '@/utils/types';

const History = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetFarmTrayHistoryQuery(Number(id));
  const [trigger, { data: progress, isFetching: progressLoading }] = useLazyGetTrayProgressQuery()

  const [selectedItem, setSelectedItem] = useState<Tray | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest'>('newest');
  const drawerRef = useRef<BottomDrawerRef>(null);

  const finishedTrays = (data?.filter((item) => item.finished_at !== null) ?? [])
    .slice()
    .sort((a, b) => {
      if (sortFilter === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const handlePress = async (item: Tray) => {
    if (isDrawerOpen) {
      setSelectedItem(null);
      drawerRef.current?.close();
    } else {
      setSelectedItem(null);
      drawerRef.current?.open();
    }
    setSelectedItem(item);
    await trigger(Number(item.id)).unwrap()
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{ backgroundColor: '#155183', paddingTop: 48, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable onPress={() => router.back()} android_ripple={{ color: '#ffffff30', borderless: true }}>
              <ArrowLeft color="#fff" size={24} />
            </Pressable>
            <View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 18, color: '#fff' }}>History</Text>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ffffffaa', marginTop: 2 }}>
                {finishedTrays.length} completed session{finishedTrays.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Filter button */}
          <View style={{ position: 'relative' }}>
            <Pressable
              onPress={() => setShowFilter(prev => !prev)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff20', borderRadius: 10, padding: 8 }}
            >
              <FilterIcon color="#fff" size={16} />
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#fff' }}>
                {sortFilter === 'newest' ? 'Newest' : 'Oldest'}
              </Text>
            </Pressable>

            {showFilter && (
              <View style={{
                position: 'absolute', top: 44, right: 0, zIndex: 50,
                backgroundColor: 'white', borderWidth: 1, borderColor: '#d4d4d8',
                borderRadius: 12, padding: 12, width: 160,
                shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
              }}>
                <Text style={{ fontFamily: 'PoppinsMedium', color: '#27272a', marginBottom: 4 }}>Sort</Text>
                <Pressable
                  onPress={() => { setSortFilter('newest'); setShowFilter(false) }}
                  style={{ padding: 8, borderRadius: 8, backgroundColor: sortFilter === 'newest' ? '#eff6ff' : 'transparent' }}
                >
                  <Text style={{ fontFamily: sortFilter === 'newest' ? 'PoppinsSemiBold' : 'PoppinsRegular', color: sortFilter === 'newest' ? '#155183' : '#000', fontSize: 14 }}>Newest</Text>
                </Pressable>
                <Pressable
                  onPress={() => { setSortFilter('oldest'); setShowFilter(false) }}
                  style={{ padding: 8, borderRadius: 8, backgroundColor: sortFilter === 'oldest' ? '#eff6ff' : 'transparent' }}
                >
                  <Text style={{ fontFamily: sortFilter === 'oldest' ? 'PoppinsSemiBold' : 'PoppinsRegular', color: sortFilter === 'oldest' ? '#155183' : '#000', fontSize: 14 }}>Oldest</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 16 }}>
        {isLoading ? (
          <View style={{ marginTop: 16, gap: 10 }}>
            <SkeletonShimmer style={{ height: 80, borderRadius: 12 }} />
            <SkeletonShimmer style={{ height: 80, borderRadius: 12 }} />
            <SkeletonShimmer style={{ height: 80, borderRadius: 12 }} />
          </View>
        ) : finishedTrays.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 }}>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>No completed sessions yet</Text>
          </View>
        ) : (
          <View style={{ marginTop: 16, gap: 10 }}>
            {finishedTrays.map((tray) => (
              <View key={tray.id} style={{ borderRadius: 12, overflow: 'hidden' }}>
                <Pressable
                  onPress={() => handlePress(tray)}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                  style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 14 }}
                >
                  {/* Top row */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ backgroundColor: '#eff6ff', borderRadius: 8, padding: 6 }}>
                        <CircleCheck size={14} color="#155183" />
                      </View>
                      <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#18181b' }}>
                        {tray.tray_name}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Image
                        source={
                          tray?.created_by_profile_picture
                            ? { uri: tray.created_by_profile_picture }
                            : require("@/assets/images/default-profile.png")
                        }
                        style={{ width: 20, height: 20, borderRadius: 999 }}
                        resizeMode="cover"
                      />
                      <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#71717a' }}>
                        {tray.created_by_username
                          ? tray.created_by_username[0].toUpperCase() + tray.created_by_username.slice(1)
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Date rows */}
                  <View style={{ gap: 4 }}>
                    {(['Start', 'End'] as const).map((label) => (
                      <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ backgroundColor: '#155183' , borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 }}>
                          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 9, color: '#fff' }}>
                            {label}
                          </Text>
                        </View>
                        <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 11, color: '#71717a' }}>
                          {label === 'Start'
                            ? tray.created_at
                              ? new Date(tray.created_at).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' })
                              : '—'
                            : tray.finished_at
                            ? new Date(tray.finished_at).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' })
                            : '—'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomDrawer ref={drawerRef} onChange={(open) => setIsDrawerOpen(open)} type='full'>
        {progressLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size={30} color="#155183" />
          </View>
        ) : (
          <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
            <ProgressSteps
              loading={progressLoading}
              created_at={selectedItem?.created_at}
              finished_at={selectedItem?.finished_at}
              owner={selectedItem?.created_by_username}
              owner_pfp={selectedItem?.created_by_profile_picture}
              progress={progress}
            />
          </ScrollView>
        )}
      </BottomDrawer>
    </View>
  )
}

export default History