import {
  BackHandler, View, Text, ActivityIndicator,
  ScrollView, Pressable, RefreshControl, Image,
} from 'react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useGetWeatherForecastQuery } from '@/store/weatherApi'
import { useRegisterDeviceTokenMutation } from '@/store/notificationApi'
import WeatherIcon from '@/components/containers/weather/WeatherIcon'
import { MapPinIcon } from 'lucide-react-native'
import WeatherDashboardBoxes from '@/components/containers/weather/WeatherDashboardBoxes'
import WeatherAlert from '@/components/containers/weather/WeatherAlert'
import BottomDrawer, { BottomDrawerRef } from '@/components/containers/BottomDrawer'
import { ForecastItem } from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import AreaChartComponent from '@/components/containers/charts/AreaChart'

const Home = () => {
  const { data, isLoading, refetch }       = useGetWeatherForecastQuery()
  const drawerRef                          = useRef<BottomDrawerRef>(null)
  const [isDrawerOpen, setIsDrawerOpen]   = useState(false)
  const [selectedItem, setSelectedItem]   = useState<ForecastItem | null>(null)
  const [chartKey, setChartKey]           = useState(0)
  const [registerDeviceToken]             = useRegisterDeviceTokenMutation()
  const [refreshing, setRefreshing]       = useState(false)
  const { user }                          = useAuthRedirect()

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setChartKey(prev => prev + 1)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const rainData  = data?.future_forecast.map((item: any) => ({ value: item.pop * 100 }))
  const cloudData = data?.future_forecast.map((item: any) => ({ value: Math.min(item.clouds, 100) }))

  useEffect(() => {
    const registerToken = async () => {
      const expoToken = await AsyncStorage.getItem('expoPushToken')
      try {
        if (expoToken) await registerDeviceToken({ token: expoToken }).unwrap()
      } catch (error) {
        console.log('Error registering device token:', error)
      }
    }
    registerToken()
  }, [registerDeviceToken])

  const handlePress = (item: ForecastItem) => {
    setSelectedItem(item)
    if (isDrawerOpen) drawerRef.current?.close()
    else              drawerRef.current?.open()
  }

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()
    }, [])
  )

  const formatToPHT = (utcDateString: string) => {
    const date = new Date(utcDateString)
    return new Intl.DateTimeFormat('en-PH', {
      hour: 'numeric', hour12: true, timeZone: 'Asia/Manila',
    }).format(date)
  }

  // ── drawer alert logic ──────────────────────────────────────────────────────
  const rainPercent = (selectedItem?.pop ?? 0) * 100
  const cloud       = selectedItem?.clouds ?? 0

  const getRainDesc  = (r: number) =>
    r === 0 ? 'no expected rain'
    : r < 50 ? `a moderate ${r}% chance of rain`
    : r < 90 ? `a high ${r}% chance of rain`
    : `a very high ${r}% chance of rain`

  const getCloudDesc = (c: number) =>
    c < 30  ? 'mostly clear skies'
    : c < 50  ? 'partly cloudy skies'
    : c < 100 ? 'noticeable cloud cover'
    : 'overcast skies'

  const rd = getRainDesc(rainPercent)
  const cd = getCloudDesc(cloud)

  let alertLabel = 'Excellent', alertColor = '#16a34a', message = ''
  if      (rainPercent === 0 && cloud < 50)  { alertLabel = 'Excellent'; alertColor = '#16a34a'; message = `Ideal conditions for drying fish: ${cd}, and ${rd}.` }
  else if (rainPercent === 0)                { alertLabel = 'Good';      alertColor = '#2563eb'; message = `Good weather for drying fish with ${cd}, and ${rd}.` }
  else if (rainPercent <= 80)                { alertLabel = 'Caution';   alertColor = '#ca8a04'; message = `Be cautious: ${cd}, and ${rd}. Drying may be slow or risky.` }
  else if (rainPercent < 99)                 { alertLabel = 'Warning';   alertColor = '#ea580c'; message = `Drying fish is not recommended due to ${cd}, and ${rd}.` }
  else                                       { alertLabel = 'Danger';    alertColor = '#dc2626'; message = `Avoid drying fish. Extreme conditions: ${cd}, and ${rd}.` }

  if (isLoading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size={28} color="#155183" />
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* ── top bar ───────────────────────────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 56, paddingHorizontal: 15, paddingBottom: 8,
      }}>
        <Image
          source={require('@/assets/images/main-logo.png')}
          style={{ width: 110, height: 56 }}
          resizeMode="contain"
        />

        {/* current weather pill */}
        <Pressable
          onPress={() => data?.first_item && handlePress(data.first_item)}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingHorizontal: 12, paddingVertical: 6,
            backgroundColor: '#fafafa',
            borderRadius: 999, borderWidth: 0.5, borderColor: '#e4e4e7',
          }}>
          <WeatherIcon iconCode={data?.first_item.icon} style={{ width: 22, height: 22 }} />
          <Text style={{ fontSize: 14, fontFamily: 'PoppinsSemiBold', color: '#155183' }}>
            {Math.round(data?.first_item.temperature ?? 0)}
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>°C</Text>
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl colors={['#155183']} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WeatherAlert rain={data?.first_item.pop} wind={data?.first_item.wind_speed} cloud={data?.first_item.clouds} />

        {/* ── greeting ────────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 15, paddingTop: 20, gap: 2 }}>
          <Text style={{ fontSize: 22, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
            Hello{' '}
            <Text style={{ color: '#155183' }}>
              {user?.username
                ? user.username[0].toUpperCase() + user.username.slice(1)
                : ''}!
            </Text>
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
            Let&apos;s make your SunDried Fish Farm thrive!
          </Text>
        </View>

        <WeatherDashboardBoxes
          pop={data?.first_item.pop}
          wind_speed={data?.first_item.wind_speed}
          clouds={data?.first_item.clouds}
        />

        {/* location row */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 4,
          paddingHorizontal: 15, marginTop: 10,
        }}>
          <MapPinIcon size={12} color="#a1a1aa" />
          <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
            {data?.city.name}, {data?.city.country}
          </Text>
        </View>

        {/* ── chart ───────────────────────────────────────────────────────────── */}
        <View style={{ paddingTop: 20, paddingBottom: 10, paddingHorizontal: 20 }}>
          <AreaChartComponent
            chartKey={chartKey}
            title="Rain Forecast"
            description="Next 48 Hours"
            sideLabel
            data={rainData}
            data2={cloudData}
          />
        </View>

        {/* ── forecast strip ──────────────────────────────────────────────────── */}
        <View style={{ marginBottom: 10, gap: 10 }}>
          <Text style={{
            fontSize: 13, fontFamily: 'PoppinsSemiBold',
            color: '#18181b', paddingHorizontal: 15,
          }}>
            Weather Forecast
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 15 }}>
              {/* current item */}
              {data?.first_item && (
                <ForecastCard
                  item={data.first_item}
                  onPress={() => handlePress(data.first_item)}
                  formatToPHT={formatToPHT}
                />
              )}
              {/* future items */}
              {data?.future_forecast.map((item: ForecastItem, index: number) => (
                <ForecastCard
                  key={index}
                  item={item}
                  onPress={() => handlePress(item)}
                  formatToPHT={formatToPHT}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── bottom drawer ────────────────────────────────────────────────────── */}
      <BottomDrawer ref={drawerRef} onChange={(open) => setIsDrawerOpen(open)} type="none">
        {selectedItem ? (
          <View style={{ alignItems: 'center', padding: 20, paddingBottom: 32, gap: 4 }}>
            <Text style={{ fontSize: 15, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
              {new Date(selectedItem.datetime).toLocaleDateString('en-US', { weekday: 'long' })}
            </Text>
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
              {formatToPHT(selectedItem.datetime)}
            </Text>
            <WeatherIcon iconCode={selectedItem.icon} style={{ width: 48, height: 48, marginVertical: 12 }} />

            {/* alert card inside drawer */}
            <View style={{
              width: '100%', padding: 14,
              backgroundColor: alertColor + '10',
              borderRadius: 14, borderWidth: 0.5, borderColor: alertColor + '30',
              gap: 6,
            }}>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 3,
                backgroundColor: alertColor + '18',
                borderRadius: 999, alignSelf: 'center',
              }}>
                <Text style={{ fontSize: 12, fontFamily: 'PoppinsSemiBold', color: alertColor }}>
                  {alertLabel}
                </Text>
              </View>
              <Text style={{
                fontSize: 12, fontFamily: 'PoppinsRegular',
                color: '#52525b', lineHeight: 20, textAlign: 'center',
              }}>
                {message}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ padding: 20, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
            No selection
          </Text>
        )}
      </BottomDrawer>
    </View>
  )
}

// ─── forecast card ─────────────────────────────────────────────────────────────
type ForecastCardProps = {
  item: ForecastItem
  onPress: () => void
  formatToPHT: (s: string) => string
}
const ForecastCard = ({ item, onPress, formatToPHT }: ForecastCardProps) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: '#f4f4f5', borderless: false }}
    style={{ borderRadius: 14, overflow: 'hidden' }}
  >
    <View style={{
      width: 72, borderRadius: 14,
      borderWidth: 0.5, borderColor: '#f4f4f5',
      backgroundColor: '#fafafa',
      padding: 10, alignItems: 'center', gap: 2,
    }}>
      <Text style={{ fontSize: 9, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
        {new Date(item.datetime).toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>
      <Text style={{ fontSize: 10, fontFamily: 'PoppinsMedium', color: '#71717a' }}>
        {formatToPHT(item.datetime)}
      </Text>
      <WeatherIcon iconCode={item.icon} style={{ width: 32, height: 32, marginTop: 4 }} />
      <Text style={{ fontSize: 14, fontFamily: 'PoppinsSemiBold', color: '#155183', marginTop: 4 }}>
        {Math.round(item.temperature ?? 0)}
        <Text style={{ fontSize: 10, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>°C</Text>
      </Text>
    </View>
  </Pressable>
)

export default Home