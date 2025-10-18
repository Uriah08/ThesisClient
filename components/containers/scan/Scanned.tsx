import { View, Text, Image, Animated, Easing, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { CameraCapturedPicture } from 'expo-camera';
import { ChevronLeft, ImageUp, ScanSearch } from 'lucide-react-native';
import { useScanMutation } from '@/store/scanApi';
import Toast from 'react-native-toast-message';
import { Detections } from '@/utils/types';

type Props = {
  photo: CameraCapturedPicture | null;
  setPhoto: React.Dispatch<React.SetStateAction<CameraCapturedPicture | null>>;
};

const Scanned = ({ photo, setPhoto }: Props) => {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [scan, { isLoading }] = useScanMutation();
  const [annotatedPhoto, setAnnotatedPhoto] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detections | null>(null)

  const handleScan = async () => {
    if (!photo) return;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        name: 'scan.jpg',
        type: 'image/jpeg',
      } as any);

      const result = await scan(formData).unwrap();
      console.log('✅ Scan result:', result);

      if (result.image_url) {
        setAnnotatedPhoto(result.image_url);
        setDetections(result.detections)
      }
    } catch (error: any) {
      console.error('❌ Scan error:', error);
      Toast.show({
        type: 'error',
        text1: error?.data?.detail || 'Failed to scan image.',
      });
    }
  };

  useEffect(() => {
    if (photo) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [photo, scanAnim]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <View className='flex-1 bg-white'>
      <ChevronLeft onPress={() => setPhoto(null)} style={{ top: 51, left: 20, position: 'absolute' }} />
      <View className="w-full items-center" style={{ marginTop: 50 }}>
        <Text className="text-lg text-zinc-800" style={{ fontFamily: 'PoppinsSemiBold' }}>
          Photo <Text className='text-primary'>Preview</Text>
        </Text>
      </View>

      <View className='p-5 flex-row justify-between gap-3 mt-5'>
        <View style={{ borderRadius: 5, overflow: 'hidden', width: '48%' }}>
          <Pressable
            onPress={handleScan}
            disabled={isLoading}
            android_ripple={{ color: '#0c3b62' }}
            className='flex-row gap-3 bg-primary'
            style={{ borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}
          >
            <ScanSearch color={'#ffffff'} />
            <Text className='text-white' style={{ fontFamily: 'PoppinsRegular' }}>
              {isLoading ? 'Scanning...' : 'Scan'}
            </Text>
          </Pressable>
        </View>

        <View style={{ borderRadius: 5, overflow: 'hidden', width: '48%' }}>
          <Pressable android_ripple={{ color: '#969696' }} className='flex-row gap-3' style={{ borderWidth: 1, borderColor: '#a1a1aa', borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}>
            <ImageUp color={'#a1a1aa'} />
            <Text style={{ fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>Upload</Text>
          </Pressable>
        </View>
      </View>

      {photo && (
        <View className="items-center justify-center">
          <View style={{ width: '90%', height: 400, overflow: 'hidden', borderRadius: 12 }}>
            <Image
              source={{ uri: annotatedPhoto || photo.uri }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              resizeMode="cover"
            />
            {isLoading && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  backgroundColor: '#155183',
                  transform: [{ translateY: scanTranslateY }],
                  shadowColor: '#155183',
                  shadowOpacity: 0.9,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Scanned;
