import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { ChevronRight, Megaphone, Pen, RotateCcwKey, Smartphone, Trash, UserLock } from 'lucide-react-native'
import { router } from 'expo-router'

type Menu = {
  icon: any,
  label: string
  route?: "/farm-settings/edit/[id]" | "/farm-settings/announcement/[id]" | "/farm-settings/change/[id]" | "/farm-settings/block/[id]"
}

const settingsMenu: Menu[] = [
  {
    icon: Pen,
    label: 'Edit Farm',
    route: '/farm-settings/edit/[id]'
  },
  {
    icon: Megaphone,
    label: 'Announcements',
    route: '/farm-settings/announcement/[id]'
  },
  {
    icon: RotateCcwKey,
    label: 'Change Password',
    route: '/farm-settings/change/[id]'
  },
];

const dangerMenu: Menu[] = [
    {
    icon: UserLock,
    label: 'Blocklist',
    route: '/farm-settings/block/[id]'
  },
  {
    icon: Trash,
    label: 'Delete',
  }
]

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
              borderBottomWidth: item.label === 'Delete' ? 1 : 0,
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
        {/* <View className='mt-3' style={{ overflow: 'hidden', borderRadius: 7}}>
          <Pressable android_ripple={{ color: '#7f1d1d' }} style={{ paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#b91c1c', borderRadius: 7 }}>
            <Text className='text-center text-white' style={{ fontFamily: 'PoppinsMedium' }}>Leave Farm</Text>
          </Pressable>
        </View> */}
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