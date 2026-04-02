import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CircleCheck, Play, ChevronLeft } from 'lucide-react-native'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetFarmTrayByIdQuery } from '@/store/farmTrayApi'
import TimelinePage from '@/components/containers/farm/timeline/Timeline'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PRIMARY = '#155183'

const Timeline = () => {
  const TRAY_CACHE_KEY = (id: number) => `tray_cache_${id}`
  const [show, setShow] = useState(false)
  const { id } = useLocalSearchParams()
  const { data: freshData } = useGetFarmTrayByIdQuery(Number(id))
  const [cachedData, setCachedData] = useState<typeof freshData | null>(null)
  const data = freshData ?? cachedData

  useEffect(() => {
    AsyncStorage.getItem(TRAY_CACHE_KEY(Number(id)))
      .then(raw => { if (raw) setCachedData(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [id])

  useEffect(() => {
    if (!freshData) return
    AsyncStorage.setItem(TRAY_CACHE_KEY(Number(id)), JSON.stringify(freshData))
      .catch(e => console.log('Cache save error:', e))
  }, [freshData, id])

  if (!data) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color={PRIMARY} />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ActivateSession
        visible={show} setVisible={setShow}
        trayId={data?.id || Number(id)}
        active={data?.status === 'active'}
      />

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
              Timeline
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <View style={{
                width: 7, height: 7, borderRadius: 99,
                backgroundColor: data?.status === 'active' ? '#4ade80' : '#d4d4d8',
              }} />
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>
                {data?.name && data.name.length > 16
                  ? `${data.name.slice(0, 16)}…`
                  : data?.name
                } · {data?.status === 'active' ? 'Currently drying' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action pill */}
        <Pressable
          onPress={() => setShow(true)}
          android_ripple={{ color: '#ffffff30', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: PRIMARY,
            paddingVertical: 7, paddingHorizontal: 14,
            borderRadius: 999,
          }}>
          {data?.status === 'active'
            ? <CircleCheck size={13} color="#fff" />
            : <Play size={13} color="#fff" />
          }
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#fff' }}>
            {data?.status === 'active' ? 'Finish Drying' : 'Start Drying'}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {data?.status === 'active' ? (
        <TimelinePage trayId={data?.id} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 64, height: 64, borderRadius: 20,
            backgroundColor: '#E6F1FB',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 4,
          }}>
            <Play size={26} color={PRIMARY} />
          </View>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#18181b' }}>
            Tray is not active
          </Text>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>
            Press Start Drying to begin a session
          </Text>
        </View>
      )}
    </View>
  )
}

export default Timeline