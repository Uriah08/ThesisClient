import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { ChevronRight, Pen, Trash } from 'lucide-react-native';
import { useGetFarmTrayByIdQuery } from '@/store/farmTrayApi';
import DeleteClass from '@/components/containers/dialogs/Delete';
import RenameClass from '@/components/containers/dialogs/Rename';

const settingsMenu = [
  {
    icon: Pen,
    label: 'Rename Tray',
  },
  {
    icon: Trash,
    label: 'Delete',
  }
];

const Settings = () => {
  const { id } = useLocalSearchParams();
  const { data, refetch } = useGetFarmTrayByIdQuery(Number(id));
  const [refreshing, setRefreshing] = useState(false);
  const [showDelete, setShowDelete] = useState(false)
  const [showRename, setShowRename] = useState(false)

  const onRefresh = async () => {
    await refetch();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  return (
    <View className='flex-1 bg-white'>
      <DeleteClass setVisible={setShowDelete} visible={showDelete} trayId={data?.id} type={'farm-tray'}/>
      <RenameClass setVisible={setShowRename} visible={showRename} type={'farm-tray'} defaultValue={data?.name} trayId={data?.id}/>
        <View className='flex-row justify-between items-center mt-10 p-5'>
            <Text className='text-3xl' style={{
                fontFamily: 'PoppinsBold'
            }}>Settings</Text>
        </View>
        <ScrollView
                refreshControl={
                  <RefreshControl
                    colors={['#155183']}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View style={{ paddingHorizontal: 20 }}>
                  <Text
                    className="text-zinc-800 text-lg text-center self-center bg-zinc-200"
                    style={{ marginVertical: 10, fontFamily: 'PoppinsSemiBold', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20 }}
                  >
                    {data?.name}
                  </Text>
        
                  <Text
                    className="text-zinc-500 text-sm"
                    style={{ marginVertical: 20, fontFamily: 'PoppinsMedium' }}
                  >
                    Tray Settings
                  </Text>
        
                  {settingsMenu.map((item, i) => (
                    <Pressable
                      key={i}
                      onPress={item.label === 'Delete' ? () => setShowDelete(true): () => setShowRename(true)}
                      className="flex flex-row items-center"
                      android_ripple={{ color: '#d3d3d3', borderless: false }}
                      style={{
                        justifyContent: 'space-between',
                        borderTopWidth: 1,
                        borderBottomWidth: item.label === 'Delete' ? 1 : 0,
                        borderColor: '#e8e8e8',
                        paddingVertical: 20,
                        paddingLeft: 10
                      }}
                    >
                      <View className="flex flex-row items-center gap-5">
                        <item.icon size={20} color={'#a1a1aa'} />
                        <Text
                          className="text-lg"
                          style={{ fontFamily: 'PoppinsMedium' }}
                        >
                          {item.label}
                        </Text>
                      </View>
                      <ChevronRight size={18} />
                    </Pressable>
                  ))}
      
                </View>
              </ScrollView>
    </View>
  )
}

export default Settings