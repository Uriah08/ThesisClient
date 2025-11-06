import React, { useState } from 'react'
import { View, Text, ImageBackground, Dimensions, Pressable } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { modules } from '@/constants/Colors'
import { ArrowRight } from 'lucide-react-native'

const { width } = Dimensions.get('window')

const Lesson = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <View className="mb-5">
      {/* Top Row: Label + Dots */}
      <View className="flex-row items-center justify-between px-5 mb-2">
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16 }}>Modules</Text>

        <View className="flex-row items-center">
          {modules.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === currentIndex ? 10 : 6,
                height: 6,
                borderRadius: 99,
                marginHorizontal: 3,
                backgroundColor: i === currentIndex ? '#1b7fb4' : '#d4d4d8',
              }}
            />
          ))}
        </View>
      </View>

      <Carousel
        loop
        autoPlay
        autoPlayInterval={10000}
        width={width * 0.90}
        height={130}
        data={modules}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setCurrentIndex(index)}
        style={{ alignSelf: 'center', padding: 18, gap: 5 }}
        renderItem={({ item }) => (
          <View
            style={{
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
          >
            <ImageBackground
              source={item.image}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'flex-end',
              }}
              imageStyle={{ borderRadius: 12 }}
              resizeMode="cover"
            >
              {/* dark overlay to improve contrast */}
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.32)',
                }}
              />

              {/* content inside image */}
              <View style={{ paddingHorizontal: 18, paddingVertical: 14 }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'PoppinsSemiBold',
                    fontSize: 18,
                    marginBottom: 6,
                    maxWidth: '92%',
                  }}
                >
                  {item.title}
                </Text>

                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(27,127,180,0.95)',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 9999,
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                  onPress={() => {
                    /* handle read more action: navigate or open modal */
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'PoppinsSemiBold',
                      fontSize: 13,
                      marginRight: 6,
                    }}
                  >
                    Read More
                  </Text>
                  <ArrowRight color="#fff" size={14} />
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  )
}

export default Lesson
