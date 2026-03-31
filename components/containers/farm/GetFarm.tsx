import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import SkeletonShimmer from '../SkeletonPlaceholder'
import { Farm } from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { Users } from 'lucide-react-native'

type FarmProps = {
  data: Farm[]
  isLoading: boolean
  onSelect: (farm: Farm) => void
  isFetching: boolean
}

const GetFarm = ({ data, isLoading, onSelect, isFetching }: FarmProps) => {

  const handleClick = async (farm: Farm) => {
    try {
      await AsyncStorage.setItem('farm', JSON.stringify({ farm }))
      onSelect(farm)
    } catch (error: any) {
      console.log(error)
      Toast.show({ type: 'error', text1: 'Error selecting drying area' })
    }
  }

  if (isLoading || isFetching) return (
    <View style={{ paddingHorizontal: 24, gap: 10 }}>
      <SkeletonShimmer height={88} borderRadius={14} />
      <SkeletonShimmer height={88} borderRadius={14} />
      <SkeletonShimmer height={88} borderRadius={14} />
    </View>
  )

  if (data?.length === 0) return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 320, gap: 8 }}>
      <Image
        source={require('@/assets/images/hero-image.png')}
        style={{ width: 160, height: 160, opacity: 0.25 }}
        resizeMode="contain"
      />
      <Text style={{
        fontSize: 13, fontFamily: 'PoppinsMedium',
        color: '#d4d4d8', letterSpacing: 0.8, textTransform: 'uppercase',
      }}>
        No drying areas found
      </Text>
    </View>
  )

  return (
    <View style={{ paddingHorizontal: 24, gap: 10 }}>
      {data?.map((farm, index) => (
        <Pressable
          key={index}
          onPress={() => handleClick(farm)}
          android_ripple={{ color: '#f4f4f5', borderless: false }}
          style={{ borderRadius: 14, overflow: 'hidden' }}
        >
          <View style={{
            height: 88, borderRadius: 14,
            borderWidth: 0.5, borderColor: '#f4f4f5',
            backgroundColor: '#fafafa',
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: 16, overflow: 'hidden',
          }}>

            {/* text content */}
            <View style={{ flex: 1, gap: 4, zIndex: 2 }}>
              <Text style={{
                fontSize: 15, fontFamily: 'PoppinsSemiBold',
                color: '#18181b',
              }} numberOfLines={1}>
                {farm.name.charAt(0).toUpperCase() + farm.name.slice(1)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{
                  width: 18, height: 18, borderRadius: 5,
                  backgroundColor: '#E6F1FB',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Users size={10} color="#185FA5" />
                </View>
                <Text style={{
                  fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa',
                }}>
                  {farm.members.length} {farm.members.length === 1 ? 'member' : 'members'}
                </Text>
              </View>
            </View>

            {/* faded image on the right */}
            <View style={{
              position: 'absolute', top: 0, right: 0,
              width: 130, height: 88,
              overflow: 'hidden', zIndex: 1,
            }}>
              <Image
                source={
                  farm?.image_url
                    ? { uri: farm.image_url }
                    : require('@/assets/images/create-farm.png')
                }
                style={{ width: 130, height: 88 }}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(250,250,250,0)', 'rgba(250,250,250,1)']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              />
            </View>

          </View>
        </Pressable>
      ))}
    </View>
  )
}

export default GetFarm