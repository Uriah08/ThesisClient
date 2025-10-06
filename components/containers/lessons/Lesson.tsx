import { View, Text, Image } from 'react-native'
import React from 'react'
import { modules } from '@/constants/Colors'
import { Pressable, ScrollView } from 'react-native-gesture-handler'
import { CircleCheck } from 'lucide-react-native'

const Lesson = () => {
  return (
    <View className='mt-5 mb-5'>
      <Text className="text-lg px-5" style={{ fontFamily: 'PoppinsSemiBold' }}>
        Drying Education
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-3'>
        {modules.map((item, i) => (
          <View key={i} className={`p-5 ml-5 flex flex-col gap-2 ${i === modules.length - 1 ? 'mr-5' : ''}`} style={{ borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 10, maxWidth: 240 }}>
            <Image source={item.image} style={{ width: 200, height: 150, borderRadius: 10}} resizeMode="cover"/>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15}}>{item.title}</Text>
            <Pressable>
                <View className='flex-row justify-between items-center'>
                    <Text className='bg-[#bddae9]' style={{ color: '#1b7fb4',backgroundColor: '#bddae9',borderWidth: 1, borderColor: '#1b7fb4', fontSize: 12, fontFamily: 'Poppins', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 9999}}>Read More...</Text>
                    <CircleCheck color={'#d4d4d8'}/>
                </View>
            </Pressable>
        </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default Lesson