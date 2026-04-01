import { Image, View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { useGetFarmQuery } from '@/store/farmApi'
import { Farm } from '@/utils/types'
import { LinearGradient } from 'expo-linear-gradient'
import CreateSession from '../dialogs/CreateSession'
import { farmMenu } from '@/constants/Colors'
import Home from './farm-tabs/Home'
import Members from './farm-tabs/Members'
import Settings from './farm-tabs/Settings'
import Trays from './farm-tabs/Trays'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import Production from './farm-tabs/Production'

const PRIMARY = '#155183'

type ChosenFarmProps = {
  onBack: () => void;
  selectedFarm: Farm;
  setSelectedFarm: (farm: Farm | null) => void;
};

const ChosenFarm = ({ onBack, selectedFarm, setSelectedFarm }: ChosenFarmProps) => {
  const { user } = useAuthRedirect()
  const { data } = useGetFarmQuery(selectedFarm.id)
  const isOwner = user?.id === data?.owner

  const [createVisible, setCreateVisible] = useState(false)
  const [active, setActive] = useState('Home')

  useEffect(() => {
    if (data) {
      (async () => {
        try {
          await AsyncStorage.setItem('farm', JSON.stringify({ farm: data }))
          setSelectedFarm(data)
        } catch (error) {
          Toast.show({ type: 'error', text1: 'Error saving farm data' })
        }
      })()
    }
  }, [data, setSelectedFarm, onBack])

  const handleBack = async () => {
    try {
      await AsyncStorage.removeItem('farm')
      await AsyncStorage.removeItem('session')
      onBack()
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error Selecting Farm' })
    }
  }

  const farmImage = data?.image_url
    ? { uri: data.image_url }
    : selectedFarm.image_url
    ? { uri: selectedFarm.image_url }
    : require('@/assets/images/create-farm.png')

  const farmName = data?.name || selectedFarm.name

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <CreateSession
        visible={createVisible}
        setVisible={setCreateVisible}
        farmId={data?.id || selectedFarm.id}
      />

      {/* ── Hero image + gradient spans the ENTIRE header+tabs area ── */}
      <View style={{ width: '100%', height: 230, position: 'absolute', top: 0 }}>
        <Image
          source={farmImage}
          style={{ width: '100%', height: 230 }}
          resizeMode="cover"
        />
        {/* Long gradient that bleeds all the way down through the tabs */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.92)', '#ffffff']}
          locations={[0, 0.45, 0.75, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      </View>

      {/* ── Header + tabs sit on top of the image ── */}
      <View style={{ zIndex: 10 }}>

        {/* Back + Farm name row */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          paddingTop: 52,
          paddingHorizontal: 20,
          paddingBottom: 10,
          gap: 12,
        }}>
          <Pressable
            onPress={handleBack}
            style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: '#ffffff70',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 0.5, borderColor: '#e4e4e760',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={17} color={PRIMARY} />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 20, fontFamily: 'PoppinsBold',
              color: '#18181b', lineHeight: 26,
            }} numberOfLines={1}>
              {farmName}
            </Text>
            <View style={{
              marginTop: 3, width: 28, height: 2,
              backgroundColor: PRIMARY, borderRadius: 99, opacity: 0.5,
            }} />
          </View>
        </View>

        {/* ── Tab bar — no background so image shows through ── */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingBottom: 14,
          gap: 6,
          // NO backgroundColor here — lets the gradient bleed through
        }}>
          {farmMenu.map((item) => {
            const isActive = active === item.title
            return (
              <Pressable
                key={item.title}
                onPress={() => setActive(item.title)}
                style={{ alignItems: 'center', gap: 4, flex: 1 }}
              >
                <View style={{
                  width: '100%',
                  paddingVertical: 9,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? PRIMARY : 'rgba(244,244,245,0.75)',
                  ...(isActive && {
                    shadowColor: PRIMARY,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.22,
                    shadowRadius: 8,
                    elevation: 4,
                  }),
                }}>
                  <item.icon size={16} color={isActive ? '#ffffff' : '#71717a'} />
                </View>
                <Text style={{
                  fontSize: 10,
                  fontFamily: isActive ? 'PoppinsMedium' : 'PoppinsRegular',
                  color: isActive ? PRIMARY : '#a1a1aa',
                }}>
                  {item.title}
                </Text>
                <View style={{
                  width: 10, height: 1, borderRadius: 999,
                  backgroundColor: isActive ? PRIMARY : 'transparent',
                }} />
              </Pressable>
            )
          })}
        </View>

        {/* Subtle divider at the very bottom of the header */}
        <View style={{ height: 0.5, backgroundColor: '#e4e4e7', marginHorizontal: 20 }} />
      </View>

      {/* ── Content fills ALL remaining space ── */}
      <View style={{ flex: 1 }}>
        {active === 'Home'       && <Home       farmId={data?.id || selectedFarm.id} />}
        {active === 'Trays'      && <Trays      farmId={data?.id || selectedFarm.id} owner={isOwner} />}
        {active === 'Production' && <Production farmId={data?.id || selectedFarm.id} owner={isOwner} />}
        {active === 'Members'    && <Members    farmId={data?.id || selectedFarm.id} ownerId={data?.owner || selectedFarm.owner} />}
        {active === 'Settings'   && <Settings   farmId={data?.id || selectedFarm.id} owner={isOwner} setSelectedFarm={setSelectedFarm} onBack={onBack} />}
      </View>
    </View>
  )
}

export default ChosenFarm