import { CloudRain, Cloudy } from 'lucide-react-native'
import React from 'react'
import { View, Text } from 'react-native'

type WeatherData = {
  pop?: number
  wind_speed?: number
  clouds?: number
}

type StatBoxProps = {
  icon: any
  label: string
  value: string | number
  unit: string
  iconBg: string
  iconColor: string
}

const StatBox = ({ icon: Icon, label, value, unit, iconBg, iconColor }: StatBoxProps) => (
  <View style={{
    flex: 1, padding: 14,
    backgroundColor: '#fafafa',
    borderRadius: 14, borderWidth: 0.5, borderColor: '#f4f4f5',
    gap: 10,
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{
        width: 30, height: 30, borderRadius: 8,
        backgroundColor: iconBg,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color={iconColor} />
      </View>
      <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
        {label}
      </Text>
    </View>
    <Text style={{ fontSize: 22, fontFamily: 'PoppinsBold', color: '#18181b' }}>
      {value}
      <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
        {unit}
      </Text>
    </Text>
  </View>
)

const WeatherDashboardBoxes = ({ pop, wind_speed, clouds }: WeatherData) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 15, marginTop: 14 }}>
      <StatBox
        icon={CloudRain}
        label="Rain"
        value={pop !== undefined ? Math.round(pop * 100) : 0}
        unit="%"
        iconBg="#E6F1FB"
        iconColor="#185FA5"
      />
      <StatBox
        icon={Cloudy}
        label="Cloud Cover"
        value={clouds ?? 0}
        unit="%"
        iconBg="#EEEDFE"
        iconColor="#534AB7"
      />
    </View>
  )
}

export default WeatherDashboardBoxes