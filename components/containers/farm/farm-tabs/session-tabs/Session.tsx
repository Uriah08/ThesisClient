import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { FarmSession } from '@/utils/types'
import { Check, CheckCircle, ChevronLeft, PanelsLeftRightIcon, Play, Search } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import ActivateSession from '@/components/containers/dialogs/ActivateSession'
import SessionStatus from './SessionStatus'
import { useGetSessionByIdQuery } from '@/store/sessionApi'

const Session = ({ session, onBack }: { session : FarmSession, onBack: () => void }) => {
  const [activateVisible, setActivateVisible] = useState(false)
  const { data } = useGetSessionByIdQuery(session.id);

  const currentStatus = data?.status || session.status;

  const handleBack = async () => {
            try {
                await AsyncStorage.removeItem('session')
                onBack();
            } catch (error) {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text1: "Error Selecting Session",
                });
            }
        }
  
  return (
    <View className='flex-1 flex flex-col'>
      <ActivateSession setVisible={setActivateVisible} visible={activateVisible} sessionId={session.id} sessionStatus={session.status}/>
      <View
        className="absolute bottom-5 right-5 rounded-full"
        style={{ overflow: "hidden", zIndex: 999 }}
      >
        <Pressable
          android_ripple={{ color: "#ffffff50", borderless: false }}
          className="flex flex-row items-center gap-3 px-5 bg-primary rounded-full"
          style={{ paddingVertical: 10 }}
        >
          <Text
            className="text-white"
            style={{ fontFamily: "PoppinsSemiBold" }}
          >
            Add Tray
          </Text>
          <PanelsLeftRightIcon color={"#ffffff"} />
        </Pressable>
      </View>
      <View className='flex-row justify-between items-center mt-3 px-5'>
        <View className='flex flex-row gap-5 items-center'>
          <ChevronLeft color={"#155183"} size={20} onPress={handleBack}/>
          <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>{data?.name || session.name}</Text>
          <SessionStatus sessionStatus={data?.status || session.status}/>
        </View>
        <View>
          {currentStatus === 'finished' ? (
            <View className='gap-2 items-center flex-row'>
              <Check size={14} color={'#a1a1aa'}/>
              <Text className='text-zinc-400' style={{ fontFamily: 'PoppinsRegular', fontSize: 12}}>Finished</Text>
            </View>) : (
            <Pressable onPress={() => setActivateVisible(true)} android_ripple={{ color: "#ffffff50", borderless: false }} className='gap-2 flex-row items-center' style={{ backgroundColor: '#155183', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999 }}>
              {currentStatus === 'inactive' ? (<Play size={14} color={'#ffffff'}/>): (<CheckCircle size={14} color={'#ffffff'}/>)}
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#ffffff' }}>{currentStatus === 'active' ? 'Finish' : 'Activate'}</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View className='relative p-5'>
        <TextInput
        style={{ backgroundColor: "#ffffff60", height: 40, width: "100%", borderColor: '#d4d4d8' }}
          className='rounded-full pl-12 text-base text-black border'
          placeholder='Search tray...'
        />
        <Search
          style={{ position: 'absolute', top: 25, left: 28 }}
          color={'#d4d4d8'}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'>
        
      </ScrollView>
    </View>
  )
}

export default Session