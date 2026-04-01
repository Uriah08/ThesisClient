import React, { useState } from 'react'
import {
  View, Text, ScrollView,
  Image, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native'
import ImageViewing from 'react-native-image-viewing'
import { CheckCircle, Circle } from 'lucide-react-native'
import { TrayProgress } from '@/utils/types'

const PRIMARY = '#155183'

type Props = {
  created_at?: string
  finished_at?: string | null
  owner?: string
  owner_pfp?: string | null
  progress?: TrayProgress[]
  loading: boolean
  refreshing?: boolean
  onRefresh?: () => void
}

const formatDateTime = (isoDate: string | undefined): string => {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function ProgressSteps({
  created_at, finished_at, owner, owner_pfp,
  progress, loading, refreshing, onRefresh,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [imageUri, setImageUri] = useState<string | null>(null)

  const finishedStep = finished_at ? {
    title: 'Harvested',
    description: 'Tray has been harvested.',
    datetime: formatDateTime(finished_at),
    created_by_username: owner || 'N/A',
    created_by_profile_picture: owner_pfp || null,
    image: null,
  } : null

  const startingStep = created_at ? {
    title: 'Started',
    description: 'Drying on this tray has started.',
    datetime: formatDateTime(created_at),
    created_by_username: owner || 'N/A',
    created_by_profile_picture: owner_pfp || null,
    image: null,
  } : null

  const formattedProgress = progress?.map(item => ({
    title: item.title,
    description: item.description,
    datetime: formatDateTime(item.datetime),
    created_by_username: item.created_by_username,
    created_by_profile_picture: item.created_by_profile_picture,
    image: item.image || null,
  })) || []

  const combinedSteps = startingStep
    ? [startingStep, ...formattedProgress, finishedStep].filter(Boolean)
    : formattedProgress

  const shownSteps = [...combinedSteps].reverse()

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color={PRIMARY} />
    </View>
  )

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          colors={[PRIMARY]}
          refreshing={refreshing || false}
          onRefresh={onRefresh}
        />
      }
    >
      {shownSteps.map((step, index) => {
        const isBottom        = index === shownSteps.length - 1
        const isHarvestedStep = step?.title === 'Harvested'

        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              gap: 16,
              // minHeight ensures even short steps have enough room for the line
              minHeight: 60,
            }}
          >
            {/* Left column — dot + line, stretches to full row height via alignSelf stretch */}
            <View style={{ alignItems: 'center', width: 20 }}>
              {/* Dot */}
              <View style={{
                width: 20, height: 20, borderRadius: 999,
                backgroundColor: isHarvestedStep ? '#E1F5EE' : '#E6F1FB',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {isHarvestedStep
                  ? <CheckCircle size={14} color="#0F6E56" />
                  : <Circle size={14} color={PRIMARY} />
                }
              </View>

              {/* Line — flex:1 fills remaining height of the row naturally, no onLayout needed */}
              {!isBottom && (
                <View style={{
                  flex: 1,
                  width: 1.5,
                  backgroundColor: '#e4e4e7',
                  marginTop: 4,
                  marginBottom: -4,
                }} />
              )}
            </View>

            {/* Right column — content */}
            <View style={{ flex: 1, paddingBottom: isBottom ? 0 : 24 }}>

              {/* Title + author */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <Text style={{
                  fontFamily: 'PoppinsSemiBold', fontSize: 14,
                  color: isHarvestedStep ? '#0F6E56' : PRIMARY,
                }}>
                  {step?.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Image
                    source={
                      step?.created_by_profile_picture
                        ? { uri: step.created_by_profile_picture }
                        : require('@/assets/images/default-profile.png')
                    }
                    style={{ width: 14, height: 14, borderRadius: 999 }}
                    resizeMode="cover"
                  />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#71717a' }}>
                    {step?.created_by_username
                      ? step.created_by_username[0].toUpperCase() + step.created_by_username.slice(1)
                      : 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Datetime */}
              {step?.datetime && (
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa', marginBottom: 6 }}>
                  {step.datetime}
                </Text>
              )}

              {/* Description */}
              {step?.description && (
                <View style={{
                  backgroundColor: '#fafafa',
                  borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
                  padding: 12,
                }}>
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#52525b', lineHeight: 20 }}>
                    {step.description}
                  </Text>
                </View>
              )}

              {/* Image */}
              {step?.image && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => { setImageUri(step.image!); setVisible(true) }}
                  style={{ marginTop: 8 }}
                >
                  <Image
                    source={{ uri: step.image }}
                    style={{ width: '100%', height: 160, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )
      })}

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
  )
}