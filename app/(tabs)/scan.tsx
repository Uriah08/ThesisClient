import { View, Text, Pressable, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setScanTabPressed } from '@/store';
import { CameraView, CameraType, useCameraPermissions, FlashMode, CameraCapturedPicture } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Flashlight, FlashlightOff, Images, RotateCcw, X } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import Scanned from '@/components/containers/scan/Scanned';

const ScanPage = () => {
  const dispatch = useDispatch();
  const scanTabPressed = useSelector((state: any) => state.global.scanTabPressed);

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off')
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [torch, setTorch] = useState(false)
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [isActive, setIsActive] = useState(true);

  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
  const [latestPhotoUri, setLatestPhotoUri] = useState<string | null>(null); 
  
  const [image, setImage] = useState<string | null>(null);

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
        setImage(result.assets[0].uri);
      }
    };

  const handleSubmit = React.useCallback(async () => {
    if (!cameraRef.current || !isCameraReady) return;
    setTorch(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: false,
      });
      setPhoto(photo);

      console.log('Captured photo:', photo.uri);
    } catch (error) {
      if(flash === 'on') {
        setTorch(true)
      }
      console.error('Failed to capture photo:', error);
    } finally {
      setTorch(flash === 'on' ? true : false)
    }
  }, [isCameraReady, flash]);

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  useEffect(() => {
    if (scanTabPressed && isActive) {
      handleSubmit();
      dispatch(setScanTabPressed(false));
    }
  }, [scanTabPressed, dispatch, handleSubmit, isActive]);

  const toggleCameraFacing = () => {
    setIsCameraReady(false);
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // const toggleFlash = () => {
  //   setFlash((prev) => (prev === 'off' ? 'on' : 'off'))
  //   setTorch((prev) => (!prev ? true : false))
  // }

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
      <Scanned photo={photo} setPhoto={setPhoto}/>
    )
  }

  return (
    <View className='flex-1 bg-white'>
      {isActive && (
        <CameraView 
          key={`${facing}-${isActive}`}
          ref={cameraRef} 
          facing={facing} 
          style={{ flex: 1}} 
          flash={flash} 
          enableTorch={torch} 
          onCameraReady={handleCameraReady}
        />
      )}
      {/* {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={{ width: '100%', height: 400, position: 'absolute' }}
        />
      )} */}
      {/* {image && (
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: 400, position: 'absolute' }}
        />
      )} */}
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, top: 50, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, top: 50, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, top: 50, right: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, top: 50, right: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, bottom: 120, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, bottom: 120, left: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 2, backgroundColor: '#ffffff', width: 100, bottom: 120, right: 20}}/>
      <View className='absolute' style={{ opacity: 0.5, height: 100, backgroundColor: '#ffffff', width: 2, bottom: 120, right: 20}}/>
      <TouchableOpacity onPress={toggleCameraFacing} className='absolute bottom-10 left-10 z-10 h-[50px] w-[50px] rounded-full bg-white flex items-center justify-center'>
        <RotateCcw/>
      </TouchableOpacity>
      <TouchableOpacity
      style={{ borderWidth: 2, borderColor: '#ffffff', borderRadius: 9999 }}
        className='absolute bottom-10 right-10 z-10 h-[50px] w-[50px] rounded-full bg-white flex items-center justify-center overflow-hidden'
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
      {/* <TouchableOpacity onPress={toggleFlash} className='absolute bottom-10 right-10 z-10 h-[50px] w-[50px] rounded-full bg-white flex items-center justify-center'>
        {flash === 'off' ? <Flashlight/> : <FlashlightOff/>}
      </TouchableOpacity> */}
      <LinearGradient
        colors={['transparent', '#ffffff40', '#ffffff95',  'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 150,
          zIndex: 1
         }}
      />
    </View>
  )
}

export default ScanPage