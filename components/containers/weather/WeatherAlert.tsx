import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

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

const WeatherAlert = ({ rain = 0, cloud = 0 }: WeatherData) => {
  const [visible, setVisible] = useState(true)
  const { t } = useTranslation()

  if (!visible) return null

  const rainPercent = Math.round(rain * 100)

  const getRainDesc = (r: number) =>
    r === 0   ? t('alert_rain_none')
    : r < 50  ? t('alert_rain_moderate',  { percent: r })
    : r < 90  ? t('alert_rain_high',      { percent: r })
    :           t('alert_rain_very_high', { percent: r })

  const getCloudDesc = (c: number) =>
    c < 30  ? t('alert_cloud_clear')
    : c < 50  ? t('alert_cloud_partly')
    : c < 100 ? t('alert_cloud_noticeable')
    :           t('alert_cloud_overcast')

  const getAlertConfig = (r: number, c: number): AlertConfig => {
    const rd = getRainDesc(r)
    const cd = getCloudDesc(c)

    if (r === 0 && c < 50) return { label: t('alert_label_excellent'), color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', message: t('alert_msg_excellent', { cloud: cd, rain: rd }) }
    if (r === 0)           return { label: t('alert_label_good'),      color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', message: t('alert_msg_good',      { cloud: cd, rain: rd }) }
    if (r <= 80)           return { label: t('alert_label_caution'),   color: '#ca8a04', bg: '#fefce8', border: '#fef08a', message: t('alert_msg_caution',   { cloud: cd, rain: rd }) }
    if (r < 99)            return { label: t('alert_label_warning'),   color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', message: t('alert_msg_warning',   { cloud: cd, rain: rd }) }
    return                        { label: t('alert_label_danger'),    color: '#dc2626', bg: '#fef2f2', border: '#fecaca', message: t('alert_msg_danger',    { cloud: cd, rain: rd }) }
  }

  const { label, color, bg, border, message } = getAlertConfig(rainPercent, cloud)

  return (
    <View style={{ paddingHorizontal: 15, marginTop: 16 }}>
      <View style={{
        backgroundColor: bg,
        borderRadius: 14, borderWidth: 0.5, borderColor: border,
        padding: 14,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{
            paddingHorizontal: 10, paddingVertical: 3,
            backgroundColor: color + '18',
            borderRadius: 999, alignSelf: 'flex-start',
          }}>
            <Text style={{ fontSize: 11, fontFamily: 'PoppinsSemiBold', color, letterSpacing: 0.4 }}>
              {label}
            </Text>
          </View>

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