import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ChevronRight, Megaphone, Pen, RotateCcwKey, Smartphone, Trash } from 'lucide-react-native'
import { router } from 'expo-router'
import DeleteFarm from '../../dialogs/DeleteFarm'
import { Farm } from '@/utils/types'

type Menu = {
  icon: any,
  label: string
  route?: "/farm-settings/edit/[id]" | "/farm-settings/announcement/[id]" | "/farm-settings/change/[id]" | "/farm-settings/block/[id]"
}

type Props = {
  farmId: number
  owner: boolean
  setSelectedFarm: (farm: Farm | null) => void
  onBack: () => void
}

const Settings = ({ farmId, owner, setSelectedFarm, onBack }: Props) => {

  const settingsMenu: Menu[] = [
    {
      icon: Megaphone,
      label: 'Announcements',
      route: '/farm-settings/announcement/[id]'
    },
    {
      icon: Pen,
      label: 'Edit',
      route: '/farm-settings/edit/[id]'
    },
    {
      icon: RotateCcwKey,
      label: 'Change Password',
      route: '/farm-settings/change/[id]'
    },
  ];

  const dangerMenu: Menu[] = [
    {
      icon: Trash,
      label: owner ? 'Delete' : 'Leave',
    }
  ]

  const [showDelete, setShowDelete] = useState(false)
  return (
    <View className='flex-1 flex flex-col'>
      <DeleteFarm visible={showDelete} setVisible={setShowDelete} farmId={farmId} type={owner ? 'delete' : 'leave'} setSelectedFarm={setSelectedFarm} onBack={onBack}/>
      <View className='flex flex-row justify-between items-center mt-3 px-5'>
        <Text className='text-xl text-zinc-700' style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>Settings</Text>
        <View className='flex flex-row items-center bg-zinc-200 px-2' style={{ paddingVertical: 1, borderRadius: 5, gap: 3}}>
          <Smartphone size={12} color={'#71717a'}/>
          <Text style={{ fontSize: 10, fontFamily: 'PoppinsRegular'}}>Farm ID: <Text style={{ fontFamily: 'PoppinsBold', color: '#3f3f46'}}>{farmId}</Text></Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5'>
        <Text className='text-zinc-400 mt-3' style={{ fontFamily: 'PoppinsMedium', color: '#a1a1aa', fontSize: 12}}>General</Text>
        <View className='mt-3'/>
        {settingsMenu.map((item, i) => (
          <Pressable
            key={i}
            onPress={() =>
              item.route &&
              router.push({
                pathname: item.route,
                params: { id: farmId.toString() },
              })
            }
            className="flex flex-row items-center"
            android_ripple={{ color: '#d3d3d3', borderless: false }}
            style={{
              justifyContent: 'space-between',
              borderTopWidth: 1,
              borderBottomWidth: item.label === 'Change Password' ? 1 : 0,
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
        <Text className='mt-5' style={{ fontFamily: 'PoppinsMedium', fontSize: 12, color: '#b91c1c'}}>Danger Zone</Text>
        <View className='mt-3'/>
        {dangerMenu.map((item, i) => (
          <Pressable
            key={i}
            onPress={() =>
              {item.route &&
              router.push({
                pathname: item.route,
                params: { id: farmId.toString() },
              })
              if(item.label === 'Delete' || item.label === 'Leave') setShowDelete(true)}
            }
            className="flex flex-row items-center"
            android_ripple={{ color: '#d3d3d3', borderless: false }}
            style={{
              justifyContent: 'space-between',
              borderTopWidth: 1,
              borderBottomWidth: item.label === 'Delete' || item.label === 'Leave' ? 1 : 0,
              borderColor: '#e8e8e8',
              paddingVertical: 20,
              paddingLeft: 10
            }}
          >
            <View className="flex flex-row items-center gap-5">
              <item.icon size={20} color={'#b91c1c'}/>
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
      </ScrollView>
    </View>
  )
}

export default Settings