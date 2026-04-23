import { View, Text, Image, ScrollView, Pressable, Platform } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronLeft, ArrowRight } from 'lucide-react-native'
import { router } from 'expo-router'
import { useLessonContent } from '@/components/hooks/useLessonContent'

const Lesson2 = () => {
  const { lesson2Content } = useLessonContent()
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-white">
      
      {/* ── Header Area ────────────────────────────────────────────────────── */}
      <View style={{ 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40, 
        paddingBottom: 20,
        backgroundColor: '#fff',
        zIndex: 10 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable 
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                height: 40, width: 40, 
                backgroundColor: "#f4f4f5", 
                borderRadius: 12, 
                justifyContent: 'center',
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              }
            ]}
          >
            <ChevronLeft color={"#155183"} size={22} strokeWidth={2.5} />
          </Pressable>
          
          <View style={{ 
            paddingHorizontal: 12, paddingVertical: 4, 
            backgroundColor: '#eef2ff', borderRadius: 99 
          }}>
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: '#155183' }}>
              MODULE 1: LESSON 2
            </Text>
          </View>
        </View>

        <Text 
          style={{ 
            fontSize: 26, 
            fontFamily: 'PoppinsBold', 
            color: '#18181b', 
            marginTop: 20,
            lineHeight: 34 
          }}
        >
          Checking Drying Stage
        </Text>
      </View>

      {/* ── Pinned Hero Image ────────────────────────────────────────────────── */}
      <View className='px-5 mb-8'>
        <View style={{
          borderRadius: 24,
          overflow: 'hidden',
          height: 200,
          backgroundColor: '#f4f4f5',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}>
          <Image 
            source={require("@/assets/images/module-wallpaper2.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['#00000060', 'transparent']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0.5 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          />
          <Text style={{ 
            position: 'absolute', bottom: 20, left: 20, 
            color: '#fff', fontSize: 12, fontFamily: 'PoppinsMedium' 
          }}>
            10 min read
          </Text>
        </View>
      </View>

      {/* ── Content Section ─────────────────────────────────────────────────── */}
      <View className='px-6'>
        {lesson2Content.map((item, index) => (
          <View key={index} style={{
            marginBottom: 32,
            paddingBottom: 32,
            borderBottomWidth: index === lesson2Content.length - 1 ? 0 : 1,
            borderBottomColor: '#f4f4f5'
          }}>
            <Text style={{ fontSize: 40, fontFamily: 'PoppinsBold', color: '#f4f4f5', marginBottom: -15, marginLeft: -5 }}>
              0{index + 1}
            </Text>
            
            <Text style={{ fontSize: 19, fontFamily: 'PoppinsSemiBold', color: '#18181b', zIndex: 10 }}>
              {item.title}
            </Text>
            
            <Text className="mt-3 mb-5" style={{ fontSize: 14, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 22 }}>
              {item.text}
            </Text>

            <Image
              source={item.image}
              style={{ width: "100%", height: 190, borderRadius: 16 }}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>

      {/* ── Next Lesson Section (Perfected Layout) ────────────────────────── */}
      <View style={{ backgroundColor: '#fafafa', borderTopWidth: 1, borderTopColor: '#f4f4f5', padding: 24, paddingBottom: 40 }}>
        <Text style={{ fontSize: 12, fontFamily: 'PoppinsMedium', color: '#a1a1aa', letterSpacing: 1, marginBottom: 16 }}>
          UP NEXT
        </Text>
        
        <Pressable 
          onPress={() => router.push('/lessons/lesson3')}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#f4f4f5',
            opacity: pressed ? 0.8 : 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          })}
        >
          {/* Leading Image */}
          <Image
            source={require("@/assets/images/module-wallpaper3.png")}
            style={{ width: 60, height: 60, borderRadius: 12 }}
            resizeMode="cover"
          />

          {/* Center Text Wrapper */}
          <View className='flex-1 flex-row justify-between items-center mt-3'>
            <View className='flex-1'>
              <Text style={{ fontSize: 16, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
                Post-Drying & Storage
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#71717a' }}>
                Module 1: Lesson 3
              </Text>
            </View>
            
            {/* Trailing Icon */}
            <ArrowRight color={"#d4d4d8"} size={20} />
          </View>
        </Pressable>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

export default Lesson2;