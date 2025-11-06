import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { Smartphone } from 'lucide-react-native'

type Props = {
  farmId: number}
const Settings = ({ farmId }: Props) => {
  return (
    <View className='flex-1 flex flex-col'>
      <View className='flex flex-row justify-between items-center mt-3 px-5'>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>Settings</Text>
        <View className='flex flex-row items-center bg-zinc-200 px-2' style={{ paddingVertical: 1, borderRadius: 5, gap: 3}}>
          <Smartphone size={12} color={'#71717a'}/>
          <Text style={{ fontSize: 10, fontFamily: 'PoppinsRegular'}}>Farm ID: <Text style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>{farmId}</Text></Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'>
        <Text className='text-zinc-400 mt-3' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12}}>General</Text>
        <Text className='mt-3' style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: '#b91c1c'}}>Danger Zone</Text>
        <View className='mt-3' style={{ overflow: 'hidden', borderRadius: 7}}>
          <Pressable android_ripple={{ color: '#7f1d1d' }} style={{ paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#b91c1c', borderRadius: 7 }}>
            <Text className='text-center text-white' style={{ fontFamily: 'PoppinsMedium' }}>Leave Farm</Text>
          </Pressable>
        </View>
        {/* <View
          className="flex flex-row items-start gap-3 mt-2 p-3 rounded-lg"
          style={{
            backgroundColor: '#fee2e2',
            borderWidth: 1,
            borderColor: '#fca5a5',
          }}
        >
          <TriangleAlert size={18} color={'#b91c1c'} />
          <View className="flex-1">
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: 13,
                color: '#7f1d1d',
                marginBottom: 2,
              }}
            >
              You’re about to leave this farm
            </Text>
            <Text
              style={{
                fontFamily: 'PoppinsRegular',
                fontSize: 12,
                color: '#7f1d1d',
              }}
            >
              Leaving this farm will permanently remove all your related data, including your tray information, session history, and any changes you’ve made. 
              This action cannot be undone — please confirm before proceeding.
            </Text>
          </View>
        </View> */}
      </ScrollView>
    </View>
  )
}

export default Settings