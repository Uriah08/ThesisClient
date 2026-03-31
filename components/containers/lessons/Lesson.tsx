import React, { useState } from 'react'
import { View, Text, ImageBackground, Dimensions, Pressable } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { modules } from '@/constants/Colors'
import { ArrowRight } from 'lucide-react-native'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')

const Lesson = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <View style={{ marginBottom: 8, paddingHorizontal: 24 }}>

      {/* label + dots */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 10,
      }}>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
          How to dry fish?
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {modules.map((_, i) => (
            <View key={i} style={{
              width: i === currentIndex ? 16 : 5,
              height: 5, borderRadius: 99,
              backgroundColor: i === currentIndex ? '#155183' : '#e4e4e7',
            }} />
          ))}
        </View>
      </View>

      <Carousel
        loop
        autoPlay
        autoPlayInterval={10000}
        width={width - 48}
        height={124}
        data={modules}
        scrollAnimationDuration={800}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => (
          <View style={{ borderRadius: 14, overflow: 'hidden', backgroundColor: '#000' }}>
            <ImageBackground
              source={item.image}
              style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
              imageStyle={{ borderRadius: 14 }}
              resizeMode="cover"
            >
              {/* overlay */}
              <View style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.38)',
              }} />

              <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 8 }}>
                <Text style={{
                  color: '#ffffff', fontFamily: 'PoppinsSemiBold',
                  fontSize: 15, maxWidth: '80%',
                }}>
                  {item.title}
                </Text>
                <View style={{ overflow: 'hidden', borderRadius: 999, alignSelf: 'flex-start' }}>
                  <Pressable
                    android_ripple={{ color: '#ffffff30', borderless: false }}
                    onPress={() => router.push({ pathname: item.link as any, params: { id: item.link } })}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.35)',
                      paddingHorizontal: 12, paddingVertical: 6,
                      borderRadius: 999,
                    }}>
                    <Text style={{ color: '#ffffff', fontFamily: 'PoppinsMedium', fontSize: 12 }}>
                      Read More
                    </Text>
                    <ArrowRight color="#ffffff" size={12} />
                  </Pressable>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  )
}

export default Lesson