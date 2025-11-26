import { Image, View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { useGetFarmQuery } from '@/store/farmApi'
import { Farm } from '@/utils/types'
import { LinearGradient } from 'expo-linear-gradient'
import CreateSession from '../dialogs/CreateSession'
import { farmMenu } from '@/constants/Colors'
// import Sessions from './farm-tabs/Sessions'
import Home from './farm-tabs/Home'
import Members from './farm-tabs/Members'
import Settings from './farm-tabs/Settings'
import Trays from './farm-tabs/Trays'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'

type ChosenFarmProps = {
  onBack: () => void;
  selectedFarm: Farm,
  setSelectedFarm: (farm: Farm | null) => void;
};

const ChosenFarm = ({ onBack, selectedFarm, setSelectedFarm }: ChosenFarmProps) => {
  const { user } = useAuthRedirect();
  const { data } = useGetFarmQuery(selectedFarm.id);

  const isOwner = user?.id === data?.owner

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
  }, [data, setSelectedFarm, onBack]);
    
    const handleBack = async () => {
        try {
            await AsyncStorage.removeItem('farm')
            await AsyncStorage.removeItem('session')
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
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10}} className={`${active === item.title ? 'text-primary' : 'text-zinc-600'} text-center`}>{item.title}</Text>
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
        {active === 'Home' && <Home farmId={data?.id || selectedFarm.id}/>}
        {active === 'Trays' && <Trays farmId={data?.id || selectedFarm.id} owner={isOwner}/>}
        {/* {active === 'Sessions' && <Sessions farmId={data?.id || selectedFarm.id}/>} */}
        {active === 'Members' && <Members farmId={data?.id || selectedFarm.id} ownerId={data?.owner || selectedFarm.owner}/>}
        {active === 'Settings' && <Settings farmId={data?.id || selectedFarm.id} owner={isOwner} setSelectedFarm={setSelectedFarm} onBack={onBack}/>}
      </View>
    </View>
  )
}

export default ChosenFarm