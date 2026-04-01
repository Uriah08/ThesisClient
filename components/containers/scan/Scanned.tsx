import { View, Text, Image, Animated, Easing, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, CircleAlert, CircleCheck, ClockPlus, Download, ImageUp, ScanSearch, TriangleAlert } from 'lucide-react-native';
import { useScanMutation } from '@/store/scanApi';
import Toast from 'react-native-toast-message';
import { Detections, Photo } from '@/utils/types';
import ImageViewing from "react-native-image-viewing";
import BarChartComponent from '../charts/BarChart';
import { remarkMessages } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AddCameraProgress from '../dialogs/AddCameraProgress';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY = '#155183'
const PRIMARY_DARK = '#0c3b62'

type Props = {
  photo: { uri: string; base64?: string } | null;
  setPhoto: React.Dispatch<React.SetStateAction<{ uri: string; base64?: string } | null>>;
  type?: 'tray' | null;
};

const Scanned = ({ photo, setPhoto, type }: Props) => {
  const [activeTrayId, setActiveTrayId] = useState<number | null>(null);
  useEffect(() => {
    const fetchActiveTrayId = async () => {
      const active = await AsyncStorage.getItem('active_tray_id')
      if (active) setActiveTrayId(Number(active));
    }
    fetchActiveTrayId();
  }, [])

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
  const [fishCount, setFishCount] = useState(0);
  const [rejectCount, setRejectCount] = useState(0);
  const [reject, setReject] = useState(0)
  const [dry, setDry] = useState(0)
  const [undried, setUndried] = useState(0)

  const imageUri = annotatedPhoto || image?.uri || photo?.uri;

  const labelCounts = detections?.detections.reduce((acc: Record<string, number>, item) => {
    acc[item.label] = (acc[item.label] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    if (labelCounts) {
      setReject(labelCounts['REJECT'] || 0);
      setDry(labelCounts['DRY'] || 0);
      setUndried(labelCounts['UNDRIED'] || 0);
    }
  }, [labelCounts])

  const statuses = [
    { color: '#961515', label: 'Reject' },
    { color: '#c47f00', label: 'Undried' },
    { color: '#127312', label: 'Dry' },
  ];

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { alert('Permission is required to access media library'); return; }
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri, base64: result.assets[0].base64 ?? undefined });
    }
  };

  const saveAnnotatedImageInDevice = async () => {
    setSaving(true);
    if (!annotatedPhoto) {
      Toast.show({ type: 'error', text1: 'No annotated image to save.' });
      setSaving(false); return;
    }
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission to access gallery was denied.' });
        return;
      }
      const fileUri = FileSystem.documentDirectory + 'annotated_scan.jpg';
      const { uri } = await FileSystem.downloadAsync(annotatedPhoto, fileUri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
      Toast.show({ type: 'success', text1: 'Image saved successfully!' });
      setSaving(false); setSaved(true);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to save image.' });
      setSaving(false);
    }
  };

  const handleScan = async () => {
    const sourceUri = image?.uri || photo?.uri;
    if (!sourceUri) return;
    try {
      const formData = new FormData();
      formData.append('image', { uri: sourceUri, name: 'scan.jpg', type: 'image/jpeg' } as any);
      const result = await scan(formData).unwrap();
      if (result.image_url) {
        setAnnotatedPhoto(result.image_url);
        setDetections(result);
        setFishCount(result.detections.filter((d: any) => d.class === 'fish').length);
        setRejectCount(result.detections.filter((d: any) => d.class === 'reject').length);
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error?.data?.detail || 'Failed to scan image.' });
    }
  };

  useEffect(() => {
    if (photo) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [photo, scanAnim]);

  const scanTranslateY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 400] });

  const totalCount = labelCounts
    ? Object.values(labelCounts).reduce((sum, val) => sum + val, 0)
    : 0;

  let drynessDescription = 'No detections available';
  if (totalCount > 0) {
    const sorted = Object.entries(labelCounts!)
      .map(([label, count]) => ({
        label: label.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
        percentage: ((count / totalCount) * 100).toFixed(1),
      }))
      .sort((a, b) => Number(b.percentage) - Number(a.percentage));
    const mainLabel = sorted[0];
    const others = sorted.slice(1);
    if (others.length === 0) {
      drynessDescription = `The scanned image shows that all detected fish are ${mainLabel.label} (${mainLabel.percentage}%).`;
    } else {
      const otherParts = others.map((o) => `${o.label.toLowerCase()} (${o.percentage}%)`).join(', ');
      drynessDescription = `The scanned image shows that most fish are ${mainLabel.label} (${mainLabel.percentage}%), while some are ${otherParts}.`;
    }
  }

  let drynessRemark = remarkMessages.noFish;
  if (totalCount > 0) {
    if (dry > 0 && undried === 0) drynessRemark = remarkMessages.dry;
    else if (undried > 0 && dry === 0) drynessRemark = remarkMessages.undried;
    else if (undried > dry && dry > 0) drynessRemark = remarkMessages.mostlyUndried;
    else if (dry > undried && undried > 0) drynessRemark = remarkMessages.mostlyDry;
    if (reject > 0) drynessRemark = `${drynessRemark} (${remarkMessages.reject})`;
  }

  // ── Status icon for dryness result ────────────────────────────────────────
  const StatusIcon = () => {
    if (reject > 0) return <CircleAlert color="#b91c1c" size={18} />
    if (totalCount === 0 || undried > dry || undried === dry) return <TriangleAlert color="#ca8a04" size={18} />
    return <CircleCheck color="#15803d" size={18} />
  }

  const statusBg = reject > 0
    ? 'rgba(185,28,28,0.06)'
    : (totalCount === 0 || undried >= dry)
      ? 'rgba(202,138,4,0.06)'
      : 'rgba(21,128,61,0.06)'

  const statusBorder = reject > 0
    ? 'rgba(185,28,28,0.15)'
    : (totalCount === 0 || undried >= dry)
      ? 'rgba(202,138,4,0.15)'
      : 'rgba(21,128,61,0.15)'

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <AddCameraProgress
        setVisible={setShow} visible={show}
        trayId={Number(id)} image={imageUri}
        defaultDescription={drynessDescription}
        rejects={rejectCount} detected={fishCount}
        activetrayId={activeTrayId!}
      />

      {/* ── Header ── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 52,
        paddingBottom: 14,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
      }}>
        <TouchableOpacity
          onPress={() => setPhoto(null)}
          style={{
            width: 36, height: 36,
            borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronLeft color="#18181b" size={20} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16, color: '#18181b', marginLeft: 12 }}>
          Photo <Text style={{ color: PRIMARY }}>Preview</Text>
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Action buttons ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
          {annotatedPhoto ? (
            <>
              {/* Save to device */}
              <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                <Pressable
                  onPress={saveAnnotatedImageInDevice}
                  disabled={saved || saving}
                  android_ripple={{ color: PRIMARY_DARK }}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, backgroundColor: PRIMARY,
                    paddingVertical: 13, borderRadius: 10,
                    opacity: saved || saving ? 0.6 : 1,
                  }}
                >
                  <Download color="#fff" size={16} />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>
                    {saved ? 'Saved' : saving ? 'Saving...' : 'Save to Device'}
                  </Text>
                </Pressable>
              </View>

              {/* Save as timeline */}
              {type === 'tray' && (
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <Pressable
                    onPress={() => setShow(true)}
                    disabled={saving}
                    android_ripple={{ color: PRIMARY_DARK }}
                    style={{
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                      gap: 8, backgroundColor: '#ffffff',
                      borderWidth: 1, borderColor: PRIMARY,
                      paddingVertical: 13, borderRadius: 10,
                      opacity: saved || saving ? 0.6 : 1,
                    }}
                  >
                    <ClockPlus color={PRIMARY} size={16} />
                    <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: PRIMARY }}>
                      Save as Timeline
                    </Text>
                  </Pressable>
                </View>
              )}
            </>
          ) : (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Scan */}
              <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}>
                <Pressable
                  onPress={handleScan}
                  disabled={isLoading}
                  android_ripple={{ color: PRIMARY_DARK }}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, backgroundColor: PRIMARY,
                    paddingVertical: 13, borderRadius: 10,
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  <ScanSearch color="#fff" size={16} />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>
                    {isLoading ? 'Scanning...' : 'Scan'}
                  </Text>
                </Pressable>
              </View>

              {/* Gallery */}
              <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}>
                <Pressable
                  onPress={pickImage}
                  android_ripple={{ color: '#e4e4e7' }}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, backgroundColor: '#ffffff',
                    borderWidth: 1, borderColor: '#e4e4e7',
                    paddingVertical: 13, borderRadius: 10,
                  }}
                >
                  <ImageUp color="#71717a" size={16} />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Gallery</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* ── Image preview ── */}
        {(photo || image) && (
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <Pressable
              disabled={isLoading}
              onPress={() => setVisible(true)}
              style={{ borderRadius: 12, overflow: 'hidden', height: 380 }}
            >
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: '100%', opacity: isLoading ? 0.5 : 1 }}
                resizeMode="cover"
              />
              {isLoading && (
                <Animated.View
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 3,
                    backgroundColor: PRIMARY,
                    transform: [{ translateY: scanTranslateY }],
                    shadowColor: PRIMARY,
                    shadowOpacity: 0.9,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                />
              )}
            </Pressable>

            {/* Legend */}
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 10, paddingHorizontal: 2 }}>
              {statuses.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#71717a' }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <ImageViewing
          backgroundColor="#ffffff"
          images={[{ uri: imageUri }]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setVisible(false)}
          swipeToCloseEnabled
          doubleTapToZoomEnabled
          presentationStyle="overFullScreen"
        />

        {/* ── Dryness result card ── */}
        {(detections || annotatedPhoto) && (
          <View style={{ paddingHorizontal: 15, marginTop: 20, gap: 16 }}>
            <View style={{
              backgroundColor: statusBg,
              borderWidth: 1,
              borderColor: statusBorder,
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 16,
              gap: 8,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StatusIcon />
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
                  Dryness Result
                </Text>
              </View>
              <Text style={{
                fontFamily: 'PoppinsRegular',
                fontSize: 12,
                color: '#52525b',
                lineHeight: 19,
              }}>
                {drynessRemark}
              </Text>
            </View>

            <BarChartComponent data={labelCounts} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Scanned;