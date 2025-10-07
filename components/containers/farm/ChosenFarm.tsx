import { Image, TextInput, View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, MapPlus, Search } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { useGetFarmQuery } from '@/store/farmApi'
import { Farm } from '@/utils/types'
import { LinearGradient } from 'expo-linear-gradient'
import CreateSession from '../dialogs/CreateSession'
import PieChartComponent from '../charts/PieChart'

type ChosenFarmProps = {
  onBack: () => void;
  selectedFarm: Farm,
  setSelectedFarm: (farm: Farm | null) => void;
};

const ChosenFarm = ({ onBack, selectedFarm, setSelectedFarm }: ChosenFarmProps) => {
  
  const { data } = useGetFarmQuery(selectedFarm.id);

  const [createVisible, setCreateVisible] = useState(false)
  
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
        height: 200,
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
      <View className='flex-1 w-full p-5'>
        <CreateSession visible={createVisible} setVisible={setCreateVisible} farmId={data?.id || selectedFarm.id}/>
        <View className='flex-row justify-between items-center' style={{ marginTop: 30, marginLeft: 5 }}>
            <View className='flex justify-center items-center' style={{ height: 40, width: 40, backgroundColor: "#ffffff80", borderRadius: 999}}>
            <ChevronLeft color={"#155183"} onPress={() => handleBack()}/>
          </View> 
          <View className='flex-1 relative' style={{ margin: 8}}>
            <TextInput
            style={{ backgroundColor: "#ffffff90", height: 40, width: "100%", borderColor: '#a1a1aa' }}
              className='rounded-full pl-12 text-base text-black border'
              placeholder='Search session...'
            />
            <Search
              style={{ position: 'absolute', top: 8, left: 12 }}
              color={'#71717a'}
            />
          </View>
        </View>

        <Text className='text-3xl mt-5 truncattext-zinc-700' style={{ color: '#3f3f46',fontFamily: 'PoppinsBold'}}>
          {data?.name || selectedFarm.name}
        </Text>
        <Text className='text-zinc-700 mt-2' style={{ paddingBottom: 10,color: '#3f3f46',fontFamily: 'PoppinsRegular'}}>Created by {(data?.owner_name || selectedFarm.owner_name)[0].toUpperCase() + (data?.owner_name || selectedFarm.owner_name).slice(1)}!</Text>
        <View className='flex flex-row justify-between p-5'>
          <PieChartComponent/>
          <PieChartComponent/>
          <PieChartComponent/>
        </View>
        <View
          className="absolute bottom-5 right-5 rounded-full"
          style={{ overflow: "hidden" }}
        >
          <Pressable
          onPress={() => setCreateVisible(true)}
            android_ripple={{ color: "#ffffff50", borderless: false }}
            className="flex flex-row items-center gap-3 px-5 bg-primary rounded-full"
            style={{ paddingVertical: 10 }}
          >
            <Text
              className="text-white"
              style={{ fontFamily: "PoppinsSemiBold" }}
            >
              Create
            </Text>
            <MapPlus color={"#ffffff"} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default ChosenFarm