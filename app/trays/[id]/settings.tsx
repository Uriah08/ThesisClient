import { 
  View, 
  Text, 
  Image, 
  ActivityIndicator, 
  Pressable, 
  Dimensions, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity 
} from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useGetTrayByIdQuery, useGetTrayProgressQuery } from '@/store/trayApi';
import { ChevronRight, Pen, Trash } from 'lucide-react-native';
import ImageViewing from 'react-native-image-viewing';
import DeleteClass from '@/components/containers/dialogs/Delete';

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

const SettingsPage = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetTrayByIdQuery(Number(id));
  const { data: progress, isLoading: progressLoading, refetch } = useGetTrayProgressQuery(Number(id));

  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDelete, setShowDelete] = useState(false)

  const onRefresh = async () => {
    await refetch();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (isLoading || progressLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={30} color="#155183" />
      </View>
    );
  }

  const images = progress?.filter(p => p.image).map(p => ({ uri: p.image })) || [];

  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - 40 - 16) / 3;

  return (
    <View className="bg-white flex-1">
      <DeleteClass setVisible={setShowDelete} visible={showDelete} trayId={data?.id} type={'tray'}/>
      <Text
        className="mt-10 text-3xl p-5"
        style={{ fontFamily: 'PoppinsBold' }}
      >
        Settings
      </Text>

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
            {data?.tray_name}
          </Text>
          <Text
            className="text-zinc-500 text-sm"
            style={{ marginVertical: 10, fontFamily: 'PoppinsMedium' }}
          >
            Created by
          </Text>

          <View className="flex flex-row gap-5 items-center mb-4">
            <Image
              source={
                data?.created_by_profile_picture
                  ? { uri: data?.created_by_profile_picture }
                  : require('@/assets/images/default-profile.png')
              }
              style={{ width: 50, height: 50, borderRadius: 999 }}
              resizeMode="cover"
            />
            <Text
              className="text-lg text-zinc-600"
              style={{ fontFamily: 'PoppinsMedium' }}
            >
              {data?.created_by_username
                ? data?.created_by_username.charAt(0).toUpperCase() +
                  data?.created_by_username.slice(1)
                : ''}
            </Text>
          </View>

          <Text
            className="text-zinc-500 text-sm"
            style={{ marginVertical: 20, fontFamily: 'PoppinsMedium' }}
          >
            Tray Settings
          </Text>

          {settingsMenu.map((item, i) => (
            <Pressable
              key={i}
              onPress={() => setShowDelete(true)}
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
              {item.label !== 'Delete' && <ChevronRight size={18} />}
            </Pressable>
          ))}

          <Text
            className="text-zinc-500 text-sm"
            style={{ marginVertical: 20, fontFamily: 'PoppinsMedium' }}
          >
            Gallery
          </Text>

          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {images.length === 0 ? (
              <Text className='text-center w-full text-zinc-300' style={{ fontFamily: 'PoppinsBold', marginTop: 12}}>NO IMAGES FOUND</Text>
            ) : (
              images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCurrentIndex(index);
                  setVisible(true);
                }}
              >
                <Image
                  source={{ uri: img.uri }}
                  style={{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: 12,
                    marginBottom: 8
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))
            )}
          </View>
        </View>
      </ScrollView>

      <ImageViewing
        images={images}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        presentationStyle="overFullScreen"
        backgroundColor="#000"
      />
    </View>
  );
};

export default SettingsPage;
