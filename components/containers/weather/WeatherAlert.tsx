import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { X } from 'lucide-react-native'

type WeatherData = {
  rain?: number
  wind?: number
  cloud?: number
}

type AlertConfig = {
  label: string
  color: string
  bg: string
  border: string
  message: string
}

const getAlertConfig = (rainPercent: number, cloud: number): AlertConfig => {
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

  if (rainPercent === 0 && cloud < 50)  return { label: 'Excellent', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', message: `Ideal conditions for drying fish: ${cd}, and ${rd}.` }
  if (rainPercent === 0)                return { label: 'Good',      color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', message: `Good weather for drying fish with ${cd}, and ${rd}.` }
  if (rainPercent <= 80)                return { label: 'Caution',   color: '#ca8a04', bg: '#fefce8', border: '#fef08a', message: `Be cautious: ${cd}, and ${rd}. Drying may be slow or risky.` }
  if (rainPercent < 99)                 return { label: 'Warning',   color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', message: `Drying fish is not recommended due to ${cd}, and ${rd}.` }
  return                                       { label: 'Danger',    color: '#dc2626', bg: '#fef2f2', border: '#fecaca', message: `Avoid drying fish. Extreme conditions: ${cd}, and ${rd}.` }
}

const WeatherAlert = ({ rain = 0, cloud = 0 }: WeatherData) => {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const rainPercent = Math.round(rain * 100)
  const { label, color, bg, border, message } = getAlertConfig(rainPercent, cloud)

  return (
    <View style={{ paddingHorizontal: 15, marginTop: 16 }}>
      <View style={{
        backgroundColor: bg,
        borderRadius: 14, borderWidth: 0.5, borderColor: border,
        padding: 14,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* label pill */}
          <View style={{
            paddingHorizontal: 10, paddingVertical: 3,
            backgroundColor: color + '18',
            borderRadius: 999,
            alignSelf: 'flex-start',
          }}>
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsSemiBold', color, letterSpacing: 0.4 }}>
              {label}
            </Text>
          </View>

          {/* close */}
          <Pressable
            onPress={() => setVisible(false)}
            hitSlop={8}
            style={{
              width: 22, height: 22, borderRadius: 11,
              backgroundColor: color + '18',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <X size={11} color={color} />
          </Pressable>
        </View>

        <Text style={{
          fontSize: 12, fontFamily: 'PoppinsRegular',
          color: '#52525b', lineHeight: 20, marginTop: 8,
        }}>
          {message}
        </Text>
      </View>
    </View>
  )
}

export default WeatherAlert