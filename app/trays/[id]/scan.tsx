import { View, Text, Pressable, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setScanTabPressed } from '@/store';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Images, RotateCcw } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import Scanned from '@/components/containers/scan/Scanned';
import { Photo } from '@/utils/types';
import { useLocalSearchParams } from 'expo-router';
import { useGetTrayByIdQuery } from '@/store/trayApi';

const ScanPage = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetTrayByIdQuery(Number(id))
  const dispatch = useDispatch();
  const scanTabPressed = useSelector((state: any) => state.global.scanTabPressed);

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [torch, setTorch] = useState(false)
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isActive, setIsActive] = useState(true);

  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
  const [latestPhotoUri, setLatestPhotoUri] = useState<string | null>(null); 

  useEffect(() => {
    (async () => {
      if (!galleryPermission) return;
      if (!galleryPermission.granted) {
        await requestGalleryPermission();
      } else {
        const album = await MediaLibrary.getAssetsAsync({
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          first: 1,
          mediaType: [MediaLibrary.MediaType.photo],
        });
        if (album.assets.length > 0) {
          setLatestPhotoUri(album.assets[0].uri);
        }
      }
    })();
  }, [galleryPermission, requestGalleryPermission]);

  useFocusEffect(
    React.useCallback(() => {
      setIsActive(true);
      
      return () => {
        setIsActive(false);
        setTorch(false);
        setIsCameraReady(false);
      };
    }, [])
  );

  const pickImage = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Permission is required to access media library');
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const base64 = result.assets[0].base64;
        setPhoto({
          uri,
          base64: base64 ?? undefined,
        });
      }
    };

  const handleSubmit = React.useCallback(async () => {
    if (!cameraRef.current || !isCameraReady) return;
    setTorch(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const capturedPhoto = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: false,
      });
      setPhoto({
        uri: capturedPhoto.uri,
        base64: capturedPhoto.base64 ?? undefined,
      });

      console.log('Captured photo:', capturedPhoto.uri);
    } catch (error) {
      console.error('Failed to capture photo:', error);
    } finally {
    }
  }, [isCameraReady]);

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  useEffect(() => {
    if (scanTabPressed && isActive) {
      handleSubmit();
      dispatch(setScanTabPressed(false));
    }
  }, [scanTabPressed, dispatch, handleSubmit, isActive]);

  const toggleCameraFacing = async () => {
    setIsCameraReady(false);
    setIsActive(false);

    await new Promise(resolve => setTimeout(resolve, 100));

    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));

    await new Promise(resolve => setTimeout(resolve, 100));

    setIsActive(true);
  };


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-center text-lg font-semibold text-gray-700 mb-4">
          We need your permission to show the camera
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-base font-medium">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  if(photo) {
    return(
      <Scanned photo={photo} setPhoto={setPhoto} type={'tray'} finished={data?.finished_at} isLoading={isLoading}/>
    )
  }

  return (
    <View className='flex-1 bg-black'>
      {isActive && (
        <CameraView 
          ref={cameraRef} 
          facing={facing} 
          style={{ flex: 1}} 
          enableTorch={torch} 
          onCameraReady={handleCameraReady}
        />
      )}
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, top: 50, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, top: 50, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, top: 50, right: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, top: 50, right: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, bottom: 30, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, bottom: 30, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, bottom: 30, right: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, bottom: 30, right: 20}}/>
      <TouchableOpacity style={{ bottom: 45, opacity: 0.5 }} onPress={toggleCameraFacing} className='absolute left-10 z-10 h-[50px] w-[50px] rounded-full bg-white flex items-center justify-center'>
        <RotateCcw/>
      </TouchableOpacity>
      <TouchableOpacity
      style={{ borderWidth: 2, borderColor: '#ffffff', borderRadius: 9999, bottom: 45, opacity: 0.5 }}
        className='absolute right-10 z-10 h-[50px] w-[50px] rounded-full bg-white flex items-center justify-center overflow-hidden'
        onPress={pickImage}
      >
        {latestPhotoUri ? (
          <Image
            source={{ uri: latestPhotoUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <Images color="black" />
        )}
      </TouchableOpacity>
    </View>
  )
}

export default ScanPage