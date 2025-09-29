import { Image, View } from 'react-native'
import React, { useEffect } from 'react'
import { ChevronLeft } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { useGetFarmQuery } from '@/store/api'
import { Farm } from '@/utils/types'
import { LinearGradient } from 'expo-linear-gradient'

type ChosenFarmProps = {
  onBack: () => void;
  selectedFarm: Farm,
  setSelectedFarm: (farm: Farm | null) => void;
};

const ChosenFarm = ({ onBack, selectedFarm, setSelectedFarm }: ChosenFarmProps) => {
  
  const { data } = useGetFarmQuery(selectedFarm.id);
  
  useEffect(() => {
    if (data) {
      (async () => {
        try {
          await AsyncStorage.setItem('farm', JSON.stringify({farm: data}));
          setSelectedFarm(data);
        } catch (error) {
          console.log(error);
          Toast.show({
            type: 'error',
            text1: "Error saving farm data",
          });
        }
      })();
    }
  }, [data, setSelectedFarm]);
    
    const handleBack = async () => {
        try {
            await AsyncStorage.removeItem('farm')
            onBack();
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: "Error Selecting Farm",
            });
        }
    }
  
  return (
    <View className='flex-1 bg-white'>
      <View style={{
        width: "100%",
        height: 250,
        position: "absolute"
      }}>
        <Image 
        source={
          data?.image_url
            ? { uri: data.image_url }
            : selectedFarm.image_url
            ? { uri: selectedFarm.image_url }
            : require('@/assets/images/create-farm.png')
        }
        style={{
          width: "100%",
          height: 250,
        }}
        resizeMode="cover"/>
        <LinearGradient
          colors={['#ffffff10', 'white']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View className='flex-1 w-full p-5'>
        <View className='flex justify-center items-center' style={{ height: 40, width: 40, backgroundColor: "#ffffff80", marginTop: 40, marginLeft: 5, borderRadius: 999}}>
          <ChevronLeft color={"#155183"} onPress={() => handleBack()}/>
        </View>
      </View>
    </View>
  )
}

export default ChosenFarm