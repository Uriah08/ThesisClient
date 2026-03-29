import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { CircleCheck, Play, ArrowLeft } from 'lucide-react-native'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetFarmTrayByIdQuery } from '@/store/farmTrayApi'
import TimelinePage from '@/components/containers/farm/timeline/Timeline'

const Timeline = () => {
  const [show, setShow] = useState(false)
  const { id } = useLocalSearchParams()
  const { data, isLoading } = useGetFarmTrayByIdQuery(Number(id))

  if (isLoading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ActivateSession visible={show} setVisible={setShow} trayId={data?.id || Number(id)} active={data?.status === 'active'} />

      {/* Header */}
      <View style={{ backgroundColor: '#155183', paddingTop: 48, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable onPress={() => router.back()} android_ripple={{ color: '#ffffff30', borderless: true }}>
              <ArrowLeft color="#fff" size={24} />
            </Pressable>
            <View>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: 18, color: '#fff' }}>
                Timeline
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <View style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: data?.status === 'active' ? '#4ade80' : '#94a3b8' }} />
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ffffffaa' }}>
                  {data?.name && data.name.length > 14 ? `${data.name.slice(0, 14)}...` : data?.name} · {data?.status === 'active' ? 'Currently drying' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => setShow(true)}
            android_ripple={{ color: '#ffffff30', borderless: false }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff20', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999 }}
          >
            {data?.status === 'active'
              ? <CircleCheck size={13} color="#fff" />
              : <Play size={13} color="#fff" />
            }
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#fff' }}>
              {data?.status === 'active' ? 'Finish Drying' : 'Start Drying'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {data?.status === 'active' ? (
        <TimelinePage trayId={data?.id} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <Image
            source={require('@/assets/images/hero-image.png')}
            style={{ width: 200, height: 200, opacity: 0.4 }}
            resizeMode="contain"
          />
          <Text style={{ fontFamily: 'PoppinsExtraBold', fontSize: 16, color: '#15518350', letterSpacing: 1 }}>
            TRAY IS NOT ACTIVE
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