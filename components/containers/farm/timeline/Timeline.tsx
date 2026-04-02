import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetTrayByIdQuery, useGetTrayProgressQuery } from '@/store/trayApi'
import AddProgress from '../../dialogs/AddProgress'
import { ClockPlus } from 'lucide-react-native'
import ProgressSteps from '../tray/ProgressSteps'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {
  trayId: number
}

const TimelinePage = ({ trayId }: Props) => {
  const TRAY_CACHE_KEY     = (id: number) => `tray_cache_${id}`
  const PROGRESS_CACHE_KEY = (id: number) => `tray_progress_cache_${id}`

  const [showTimeline, setShowTimeline] = useState(false)
  const [focus, setFocus] = useState<'custom' | string>('')
  
  const { data: freshData } = useGetTrayByIdQuery(trayId)
  const [cachedData, setCachedData] = useState<typeof freshData | null>(null)
  const data = freshData ?? cachedData

  const traySessionId = data?.active_session_tray?.id

  const { data: freshProgress, isLoading: progressLoading, refetch } = useGetTrayProgressQuery(
    traySessionId, { skip: !traySessionId }
  )
  const [cachedProgress, setCachedProgress] = useState<typeof freshProgress>(undefined)
  const progress = freshProgress ?? cachedProgress

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = async () => {
    await refetch()
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  useEffect(() => {
    AsyncStorage.getItem(TRAY_CACHE_KEY(trayId))
      .then(raw => { if (raw) setCachedData(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [trayId])

  useEffect(() => {
    if (!freshData) return
    AsyncStorage.setItem(TRAY_CACHE_KEY(trayId), JSON.stringify(freshData))
      .catch(e => console.log('Cache save error:', e))
  }, [freshData, trayId])

  useEffect(() => {
    if (!traySessionId) return
    AsyncStorage.getItem(PROGRESS_CACHE_KEY(traySessionId))
      .then(raw => { if (raw) setCachedProgress(JSON.parse(raw)) })
      .catch(e => console.log('Cache load error:', e))
  }, [traySessionId])

  useEffect(() => {
    if (!freshProgress || !traySessionId) return
    AsyncStorage.setItem(PROGRESS_CACHE_KEY(traySessionId), JSON.stringify(freshProgress))
      .catch(e => console.log('Cache save error:', e))
  }, [freshProgress, traySessionId])

  if (!data) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={30} color="#155183" />
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      <AddProgress
        visible={showTimeline} setVisible={setShowTimeline}
        trayId={trayId} activetrayId={data?.active_session_tray?.id}
        focus={focus} setFocus={setFocus}
      />

      <ProgressSteps
        refreshing={refreshing}
        onRefresh={onRefresh}
        loading={progressLoading}
        created_at={data?.active_session_tray?.created_at}
        finished_at={data?.active_session_tray?.finished_at}
        owner={data?.active_session_tray?.created_by.username}
        owner_pfp={data?.active_session_tray?.created_by.profile_picture}
        progress={progress}
      />

      {/* FAB */}
      <View style={{ position: 'absolute', bottom: 24, right: 20 }}>
        <Pressable
          onPress={() => setShowTimeline(true)}
          android_ripple={{ color: '#ffffff50', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            paddingHorizontal: 20, paddingVertical: 12,
            backgroundColor: '#155183', borderRadius: 999,
          }}>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#fff' }}>
            Add Timeline
          </Text>
          <ClockPlus size={15} color="#fff" />
        </Pressable>
      </View>
    </View>
  )
}

export default TimelinePage