import { View, Text } from 'react-native'
import React from 'react'
import { FarmSession } from '@/utils/types'
import { ChevronLeft } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'

const Session = ({ session, onBack }: { session : FarmSession, onBack: () => void }) => {

  const handleBack = async () => {
            try {
                await AsyncStorage.removeItem('session')
                onBack();
            } catch (error) {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: "Error Selecting Session",
                });
            }
        }
  
  return (
    <View className='flex-1 flex flex-col'>
      <View className='flex flex-row gap-5 items-center mt-3 px-5'>
        <ChevronLeft color={"#155183"} size={20} onPress={handleBack}/>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>{session.name}</Text>
      </View>
    </View>
  )
}

export default Session