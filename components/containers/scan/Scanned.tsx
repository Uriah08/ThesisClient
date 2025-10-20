import { View, Text, Image, Animated, Easing, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Download, ImageUp, ScanSearch, Share } from 'lucide-react-native';
import { useScanMutation } from '@/store/scanApi';
import Toast from 'react-native-toast-message';
import { Detections, Photo } from '@/utils/types';
import ImageViewing from "react-native-image-viewing";
import BarChartComponent from '../charts/BarChart';
import PieChartComponent from '../charts/PieChart';

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

type Props = {
  photo: { uri: string; base64?: string } | null;
  setPhoto: React.Dispatch<React.SetStateAction<{ uri: string; base64?: string } | null>>;
};

const Scanned = ({ photo, setPhoto }: Props) => {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [scan, { isLoading }] = useScanMutation();
  const [annotatedPhoto, setAnnotatedPhoto] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detections | null>(null)
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const confidenceAvg = (detections && detections?.detections.reduce((sum, item) => sum + item.confidence, 0) / detections?.detections.length || 0).toFixed(2);

  const imageUri = annotatedPhoto || image?.uri || photo?.uri;

  const labelCounts = detections?.detections.reduce((acc: Record<string, number>, item) => {
    acc[item.label] = (acc[item.label] || 0) + 1;
    return acc;
  }, {});


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
          setImage({
            uri,
            base64: base64 ?? undefined,
          });
        }
      };

  const saveAnnotatedImageInDevice = async () => {
    setSaving(true);
    if (!annotatedPhoto) {
      Toast.show({
        type: 'error',
        text1: 'No annotated image to save.',
      });
      setSaving(false);
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission to access gallery was denied.',
        });
        return;
      }

      const fileUri = FileSystem.documentDirectory + 'annotated_scan.jpg';
      const { uri } = await FileSystem.downloadAsync(annotatedPhoto, fileUri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);

      Toast.show({
        type: 'success',
        text1: 'Image saved successfully!',
      });

      setSaving(false);
      setSaved(true);
    } catch (error) {
      console.error('Error saving image:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to save image.',
      });
      setSaving(false);
    }
  }

  const handleScan = async () => {
    const sourceUri = image?.uri || photo?.uri;
    if (!sourceUri) return;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: sourceUri,
        name: 'scan.jpg',
        type: 'image/jpeg',
      } as any);

      const result = await scan(formData).unwrap();
      console.log('✅ Scan result:', result);

      if (result.image_url) {
        setAnnotatedPhoto(result.image_url);
        setDetections(result)
      }
    } catch (error: any) {
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
      <View className="w-full items-center" style={{ marginTop: 50, marginBottom: 20 }}>
        <Text className="text-lg text-zinc-800" style={{ fontFamily: 'PoppinsSemiBold' }}>
          Photo <Text className='text-primary'>Preview</Text>
        </Text>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false}>

        {annotatedPhoto ? (
            <>
            <View className='p-5 flex-row justify-between gap-3'>
                <View style={{ borderRadius: 5, overflow: 'hidden', width: '48%' }}>
                <Pressable
                    onPress={saveAnnotatedImageInDevice}
                    disabled={saved || saving}
                    android_ripple={{ color: '#0c3b62' }}
                    className='flex-row gap-3 bg-primary'
                    style={{ borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}
                >
                    <Download color={'#ffffff'} />
                    <Text className='text-white' style={{ fontFamily: 'PoppinsRegular' }}>
                    {saved ? 'Saved' : saving ? 'Saving...' : 'Save'}
                    </Text>
                </Pressable>
                </View>

                <View style={{ borderRadius: 5, overflow: 'hidden', width: '48%' }}>
                <Pressable android_ripple={{ color: '#969696' }} className='flex-row gap-3' style={{ borderWidth: 1, borderColor: '#a1a1aa', borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}>
                    <Share color={'#a1a1aa'} />
                    <Text style={{ fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>Share</Text>
                </Pressable>
                </View>
            </View>
            </>
        ) : (
            <>
            <View className='p-5 flex-row justify-between gap-3'>
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
                <Pressable onPress={pickImage} android_ripple={{ color: '#969696' }} className='flex-row gap-3' style={{ borderWidth: 1, borderColor: '#a1a1aa', borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}>
                    <ImageUp color={'#a1a1aa'} />
                    <Text style={{ fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>Gallery</Text>
                </Pressable>
                </View>
            </View>
            </>
        )}

      {(photo || image) && (
        <View className="items-center justify-center">
            <Pressable
            disabled={isLoading}
            style={{ 
              width: '90%',
              height: 400 }}
            onPress={() => setVisible(true)}
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%', opacity: isLoading ? 0.5 : 1 }}
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
          </Pressable>
        </View>
      )}
      <ImageViewing
      backgroundColor='#ffffff'
        images={[{ uri: imageUri }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        presentationStyle="overFullScreen"
      />
      {(detections || annotatedPhoto) && (
        <View className='flex mt-5' style={{ paddingVertical: 20 }}>
          <Text className='text-center text-lg' style={{ fontFamily: 'PoppinsSemiBold'}}>System <Text className='text-primary'>Analysis</Text></Text>
          <View className='flex-row gap-3 items-center mt-5' style={{ paddingHorizontal: 20 }}>
            <PieChartComponent value={Number(confidenceAvg) * 100}/>
            <View className='flex-1 flex-col gap-2'>
              <Text className='text-2xl' style={{ fontFamily: 'PoppinsExtraBold' }}>
                Confidence <Text className='text-primary'>Level</Text>
              </Text>
              <Text
                className='text-sm'
                style={{
                  fontFamily: 'PoppinsRegular',
                }}
              >
                The model is <Text className='text-green-600'>{(Number(confidenceAvg) * 100)}%</Text> confident about the result.
              </Text>
            </View>
          </View>
          <View className='mt-5'>
            <BarChartComponent data={labelCounts}/>
          </View>
        </View>
      )}
      </ScrollView>
    </View>
  );
};

export default Scanned;