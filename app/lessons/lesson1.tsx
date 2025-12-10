import { View, Text, Image, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronLeft } from 'lucide-react-native'
import { router } from 'expo-router'
import { lesson1Content } from '@/constants/Colors'

const Lesson1 = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className='flex-1 bg-white'>
      <View style={{
            width: "100%",
            height: 200,
            position: "absolute"
        }}>
            <Image 
            source={require("@/assets/images/module-wallpaper1.png")}
            style={{
            width: "100%",
            height: 200,
            }}
            resizeMode="cover"/>
            <LinearGradient
            colors={['#ffffff40', 'white']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
            }}
            />
        </View>
        <View className='flex-row justify-between items-center px-5 pt-5 gap-3' style={{ marginTop: 30 }}>
            <View className='flex justify-center items-center' style={{ height: 40, width: 40, backgroundColor: "#ffffff80", borderRadius: 999}}>
                <ChevronLeft color={"#155183"} onPress={() => router.back()}/>
            </View> 
        </View>
        <Text className='text-3xl mt-5 truncate text-zinc-600 px-5' style={{ fontFamily: 'PoppinsSemiBold'}}>
            Processing & Pre-Drying Preparation
        </Text>
        <View className='mt-10'/>
              {lesson1Content.map((item, index) => (
                <View key={index} className="mt-5">
                  <Image
                    source={item.image}
                    style={{
                      width: "90%",
                      height: 200,
                      alignSelf: "center",
                      borderRadius: 15,
                      marginTop: 10
                    }}
                    resizeMode="cover"
                  />
        
                  <Text className="text-xl mt-5 text-zinc-600 px-5" style={{ fontFamily: 'PoppinsMedium' }}>
                    {item.title}
                  </Text>
        
                  <Text className="text-sm mt-3 text-zinc-600 px-5" style={{ fontFamily: 'PoppinsRegular' }}>
                    {item.text}
                  </Text>
                </View>
              ))}
              <View className='mx-5' style={{ borderWidth: 1, borderColor: '#e2e8f0', marginTop: 20, borderRadius: 15, overflow: 'hidden' }} >
                <Pressable onPress={() => router.push('/lessons/lesson2')} className='flex-row justify-between'>
                    <Text className="p-3 text-2xl text-zinc-600 flex" style={{ fontFamily: 'PoppinsBold', zIndex: 10 }}>
                        Next: Checking Drying Stage
                    </Text>
                    <View style={{ width: "70%", height: 100, position: "absolute", right: 0 }}>
                        <Image
                        source={require("@/assets/images/module-wallpaper3.png")}
                        style={{ width: "100%", height: 100 }}
                        resizeMode="cover"
                        />
                        <LinearGradient
                        colors={['#ffffff40', 'white']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                        }}
                        />
                    </View>
                </Pressable>
              </View>
        <View className='mt-20'/>
    </ScrollView>
  )
}

export default Lesson1