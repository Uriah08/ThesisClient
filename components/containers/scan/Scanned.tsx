import { View, Text, Image, Animated, Easing, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Download, GitCommitVertical, ImageUp, ScanSearch, Share } from 'lucide-react-native';
import { useScanMutation } from '@/store/scanApi';
import Toast from 'react-native-toast-message';
import { Detections, Photo } from '@/utils/types';
import ImageViewing from "react-native-image-viewing";
import BarChartComponent from '../charts/BarChart';

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AddCameraProgress from '../dialogs/AddCameraProgress';
import { useLocalSearchParams } from 'expo-router';

type Props = {
  photo: { uri: string; base64?: string } | null;
  setPhoto: React.Dispatch<React.SetStateAction<{ uri: string; base64?: string } | null>>;
  type?: 'tray' | null;
  finished?: string | null | undefined
  isLoading?: boolean
};

const Scanned = ({ photo, setPhoto, type, finished, isLoading: loading }: Props) => {
  const { id } = useLocalSearchParams();
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [scan, { isLoading }] = useScanMutation();
  const [annotatedPhoto, setAnnotatedPhoto] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detections | null>(null)
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false)

  const imageUri = annotatedPhoto || image?.uri || photo?.uri;

  const labelCounts = detections?.detections.reduce((acc: Record<string, number>, item) => {
    acc[item.label] = (acc[item.label] || 0) + 1;
    return acc;
  }, {});

  const statuses = [
  { color: '#155183', label: 'Wet' },
  { color: '#c47f00', label: 'Partially Dry' },
  { color: '#bab32f', label: 'Almost Dry' },
  { color: '#127312', label: 'Fully Dry' },
  { color: '#961515', label: 'Reject' },
];


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

  // Compute dryness percentages and make it descriptive
    const totalCount = labelCounts
      ? Object.values(labelCounts).reduce((sum, val) => sum + val, 0)
      : 0;

    let drynessDescription = 'No detections available';

    if (totalCount > 0) {
      // Compute and sort percentages (highest first)
      const sorted = Object.entries(labelCounts!)
        .map(([label, count]) => ({
          label: label
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          percentage: ((count / totalCount) * 100).toFixed(1),
        }))
        .sort((a, b) => Number(b.percentage) - Number(a.percentage));

      // Build readable summary
      const mainLabel = sorted[0];
      const others = sorted.slice(1);

      if (others.length === 0) {
        drynessDescription = `The scanned image shows that all detected fish are ${mainLabel.label} (${mainLabel.percentage}%).`;
      } else {
        const otherParts = others
          .map((o) => `${o.label.toLowerCase()} (${o.percentage}%)`)
          .join(', ');

        drynessDescription = `The scanned image shows that most fish are ${mainLabel.label} (${mainLabel.percentage}%), while some are ${otherParts}.`;
      }
    }

  return (
    <View className='flex-1 bg-white'>
      <AddCameraProgress setVisible={setShow} visible={show} trayId={Number(id)} image={imageUri}
      defaultDescription={drynessDescription}
      />
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
                    <Text className='text-white' style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>
                    {saved ? 'Saved' : saving ? 'Saving...' : 'Save on Device'}
                    </Text>
                </Pressable>
                </View>

                <View style={{ borderRadius: 5, overflow: 'hidden', width: '48%' }}>
                <Pressable
                    onPress={saveAnnotatedImageInDevice}
                    disabled={saved || saving}
                    android_ripple={{ color: '#0c3b62' }}
                    className='flex-row gap-3 bg-primary'
                    style={{ borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}
                >
                    <Share color={'#ffffff'} />
                    <Text className='text-white' style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>
                    Share
                    </Text>
                </Pressable>
                </View>
            </View>
            {(type === 'tray' && !finished && !loading) && (
              <View style={{ borderRadius: 5, overflow: 'hidden', paddingHorizontal: 18, paddingBottom: 18 }}>
                <Pressable
                    onPress={() => setShow(true)}
                    disabled={saved || saving}
                    android_ripple={{ color: '#0c3b62' }}
                    className='flex-row gap-3 bg-primary'
                    style={{ borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}
                >
                    <GitCommitVertical color={'#ffffff'} />
                    <Text className='text-white' style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>
                     Save as Progress
                    </Text>
                </Pressable>
                </View>
            )}
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
      <View
      className='justify-between mt-2'
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: 2,
          columnGap: 10,
          paddingHorizontal: 17,
        }}
      >
        {statuses.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <View
              style={{
                borderRadius: 99,
                backgroundColor: item.color,
                height: 8,
                width: 8,
              }}
            />
            <Text
              className="text-zinc-500"
              style={{ fontFamily: 'PoppinsRegular', fontSize: 10 }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      {(detections || annotatedPhoto) && (
        <View style={{ paddingVertical: 20 }}>
          <View>
            <BarChartComponent data={labelCounts}/>
          </View>
        </View>
      )}
      </ScrollView>
    </View>
  );
};

export default Scanned;