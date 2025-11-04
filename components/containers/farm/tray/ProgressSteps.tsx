import React, { useState } from 'react';
import { View, Text, LayoutChangeEvent, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import { TrayProgress } from '@/utils/types';

type Props = {
  created_at?: string;
  owner?: string;
  owner_pfp?: string | null;
  progress?: TrayProgress[];
  loading: boolean
  refreshing: boolean
  onRefresh: () => void
};

export default function BottomToTopProgress({ created_at, owner, owner_pfp, progress, loading, refreshing, onRefresh }: Props) {
  const [heights, setHeights] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleLayout = (index: number, event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHeights(prev => {
      const updated = [...prev];
      updated[index] = height;
      return updated;
    });
  };

  // 🕒 Format date nicely
  const formatDateTime = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Starting step (drying started)
  const startingStep = created_at
    ? {
        title: 'Started',
        description: 'This marks the beginning of the drying process.',
        datetime: formatDateTime(created_at),
        created_by_username: owner || 'N/A',
        created_by_profile_picture: owner_pfp || null,
        image: null,
      }
    : null;

  // Combine and reverse (bottom to top)
  const formattedProgress =
    progress?.map(item => ({
      title: item.title,
      description: item.description,
      datetime: formatDateTime(item.datetime),
      created_by_username: item.created_by_username,
      created_by_profile_picture: item.created_by_profile_picture,
      image: item.image || null,
    })) || [];

  const combinedSteps = startingStep ? [startingStep, ...formattedProgress] : formattedProgress;
  const shownSteps = combinedSteps.slice(0).reverse();

  if (loading) return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 20 }} refreshControl={
                <RefreshControl style={{ zIndex: -1}} colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
              }>
      <View className="flex-col p-5 bg-white rounded-3xl">
        {shownSteps.map((step, index) => {
          const isTop = index === 0;
          const isBottom = index === shownSteps.length - 1;

          return (
            <View key={index} className="flex-row gap-3 mt-10">
              {/* Left timeline indicator */}
              <View className="relative items-center" style={{ width: 80 }}>
                <View
                  className="flex items-center justify-center"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    backgroundColor: '#155183',
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                    }}
                  />
                </View>

                {/* Line to next step */}
                {!isBottom && (
                  <View
                    style={{
                      width: 2,
                      height: heights[index] ? heights[index] + 30 : 0,
                      position: 'absolute',
                      top: 30,
                      backgroundColor: '#155183',
                    }}
                  />
                )}

                {/* Gradient top connector */}
                {isTop && (
                  <LinearGradient
                    colors={['transparent', '#155183']}
                    style={{
                      position: 'absolute',
                      top: -70,
                      width: 2,
                      height: 70,
                      borderRadius: 999,
                    }}
                  />
                )}
              </View>

              {/* Step details */}
              <View className="flex gap-2 flex-1" onLayout={event => handleLayout(index, event)}>
                <View>
                  <View className="flex-row gap-3 items-center">
                    <Text
                      className="text-lg text-primary"
                      style={{ fontFamily: 'PoppinsSemiBold', color: '#155183' }}
                    >
                      {step.title}
                    </Text>
                    <View className="flex-row items-center" style={{ gap: 5 }}>
                      <Image
                        source={
                          step.created_by_profile_picture
                            ? { uri: step.created_by_profile_picture }
                            : require('@/assets/images/default-profile.png')
                        }
                        style={{ width: 15, height: 15, borderRadius: 999 }}
                        resizeMode="cover"
                      />
                      <Text
                        className="text-zinc-500"
                        style={{
                          fontFamily: 'PoppinsRegular',
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        {step.created_by_username
                          ? step.created_by_username[0].toUpperCase() +
                            step.created_by_username.slice(1)
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {step.datetime && (
                    <Text
                      className="text-zinc-500"
                      style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}
                    >
                      {step.datetime}
                    </Text>
                  )}
                </View>

                {step.description && (
                  <Text
                    className="text-base text-gray-600"
                    style={{ fontFamily: 'PoppinsRegular' }}
                  >
                    {step.description}
                  </Text>
                )}

                {step.image && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setImageUri(step.image!);
                      setVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: step.image }}
                      style={{
                        width: '100%',
                        height: 160,
                        borderRadius: 12,
                        marginTop: 8,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <ImageViewing
        images={imageUri ? [{ uri: imageUri }] : []}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        presentationStyle="overFullScreen"
        backgroundColor="white"
      />
    </ScrollView>
  );
}
