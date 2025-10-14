import { Image, TextInput, View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, MapPlus, Search } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { useGetFarmQuery } from '@/store/farmApi'
import { Farm } from '@/utils/types'
import { LinearGradient } from 'expo-linear-gradient'
import CreateSession from '../dialogs/CreateSession'
import { farmMenu } from '@/constants/Colors'
import Sessions from './farm-tabs/Sessions'
import Home from './farm-tabs/Home'
import Members from './farm-tabs/Members'
import Settings from './farm-tabs/Settings'

type ChosenFarmProps = {
  onBack: () => void;
  selectedFarm: Farm,
  setSelectedFarm: (farm: Farm | null) => void;
};

const ChosenFarm = ({ onBack, selectedFarm, setSelectedFarm }: ChosenFarmProps) => {
  
  const { data } = useGetFarmQuery(selectedFarm.id);

  const [createVisible, setCreateVisible] = useState(false)
  const [active, setActive] = useState('Home')
  
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
      <View className='flex-1 w-full'>
        <CreateSession visible={createVisible} setVisible={setCreateVisible} farmId={data?.id || selectedFarm.id}/>
        <View className='flex-row justify-between items-center px-5 pt-5 gap-3' style={{ marginTop: 30 }}>
            <View className='flex justify-center items-center' style={{ height: 40, width: 40, backgroundColor: "#ffffff80", borderRadius: 999}}>
            <ChevronLeft color={"#155183"} onPress={() => handleBack()}/>
          </View> 
          <View className='flex-1 relative'>
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

        <Text className='text-3xl mt-5 truncattext-zinc-700 px-5' style={{ color: '#3f3f46',fontFamily: 'PoppinsBold'}}>
          {data?.name || selectedFarm.name}
        </Text>
        <View className='flex-row gap-3 justify-between mt-5 px-5'>
          {farmMenu.map((item) => (
            <Pressable onPress={() => setActive(item.title)} key={item.title} className='flex-col' style={{ gap: 3}}>
              <LinearGradient
                colors={active === item.title ? ['#155183', '#5295cc'] : ['#f4f4f5', '#f4f4f5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 8,
                  marginTop: 20,
                  borderRadius: 999,
                  paddingHorizontal: 20,
                  overflow: 'hidden',
                }}
              >
                <item.icon color={active === item.title ? '#ffffff' : '#52525b'} size={17}/>
              </LinearGradient>
              <View className='flex-col items-center'>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12}} className={`${active === item.title ? 'text-primary' : 'text-zinc-600'} text-center`}>{item.title}</Text>
                <LinearGradient 
                  colors={active === item.title ? ['#155183', '#5295cc'] : ['#ffffff', '#ffffff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className={`h-1 ${active === item.title ? 'bg-primary' : ''}`} 
                  style={{ height: 2, width: 35, borderRadius: 2, marginTop: 4}}/>
              </View>
            </Pressable>
          ))}
        </View>
        {active === 'Home' && <Home/>}
        {active === 'Sessions' && <Sessions farmId={data?.id || selectedFarm.id}/>}
        {active === 'Members' && <Members farmId={data?.id || selectedFarm.id} ownerId={data?.owner || selectedFarm.owner}/>}
        {active === 'Settings' && <Settings farmId={data?.id || selectedFarm.id}/>}
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