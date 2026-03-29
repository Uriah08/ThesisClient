import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight, Pen, Trash } from 'lucide-react-native';
import { useGetFarmTrayByIdQuery } from '@/store/farmTrayApi';
import DeleteClass from '@/components/containers/dialogs/Delete';
import RenameClass from '@/components/containers/dialogs/Rename';
import useAuthRedirect from '@/components/hooks/useAuthRedirect';

const Settings = () => {
  const { user } = useAuthRedirect();
  const { id } = useLocalSearchParams();
  const { data, refetch } = useGetFarmTrayByIdQuery(Number(id));
  const [refreshing, setRefreshing] = useState(false);
  const [showDelete, setShowDelete] = useState(false)
  const [showRename, setShowRename] = useState(false)

  const isOwner = data?.farm_owner === user?.id;

  const settingsMenu = [
    { icon: Pen, label: 'Rename Tray' },
    ...(isOwner ? [{ icon: Trash, label: 'Delete' }] : [])
  ];

  const onRefresh = async () => {
    await refetch();
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <DeleteClass setVisible={setShowDelete} visible={showDelete} trayId={data?.id} type={'farm-tray'} />
      <RenameClass setVisible={setShowRename} visible={showRename} type={'farm-tray'} defaultValue={data?.name} trayId={data?.id} />

      {/* Header */}
      <View style={{ backgroundColor: '#155183', paddingTop: 48, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()} android_ripple={{ color: '#ffffff30', borderless: true }}>
            <ArrowLeft color="#fff" size={24} />
          </Pressable>
          <View>
            <Text style={{ fontFamily: 'PoppinsBold', fontSize: 18, color: '#fff' }}>Settings</Text>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ffffffaa', marginTop: 2 }}>
              {data?.name}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Tray name badge */}
        <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 8 }}>
          <View style={{ backgroundColor: '#eff6ff', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 24, borderWidth: 1, borderColor: '#bfdbfe' }}>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#155183' }}>
              {data?.name}
            </Text>
          </View>
        </View>

        {/* Settings section */}
        <View style={{ marginHorizontal: 16, marginTop: 20 }}>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: '#a1a1aa', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
            Tray Settings
          </Text>

          <View style={{ backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: '#e4e4e7', overflow: 'hidden' }}>
            {settingsMenu.map((item, i) => (
              <Pressable
                key={i}
                onPress={item.label === 'Delete' ? () => setShowDelete(true) : () => setShowRename(true)}
                android_ripple={{ color: '#00000008', borderless: false }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderBottomWidth: i < settingsMenu.length - 1 ? 1 : 0,
                  borderBottomColor: '#f4f4f5',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: item.label === 'Delete' ? '#fff1f2' : '#eff6ff',
                  }}>
                    <item.icon size={16} color={item.label === 'Delete' ? '#e05252' : '#155183'} />
                  </View>
                  <Text style={{
                    fontFamily: 'PoppinsMedium',
                    fontSize: 14,
                    color: item.label === 'Delete' ? '#e05252' : '#18181b',
                  }}>
                    {item.label}
                  </Text>
                </View>
                <ChevronRight size={16} color="#a1a1aa" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Settings