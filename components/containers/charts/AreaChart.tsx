import { LinearGradient } from 'expo-linear-gradient'
import { View, Text, useWindowDimensions, Platform } from 'react-native'
import { LineChart } from "react-native-gifted-charts"

type ChartProps = {
  title: string
  description?: string
  sideLabel?: boolean
  data?: { value: number }[]
  data2?: { value: number }[]
  chartKey: number
  labels?: string[]
}

const AreaChartComponent = ({ title, description, sideLabel, data, data2, chartKey, labels }: ChartProps) => {
  const lineData = (data || [{ value: 0 }]).map((d, i) => ({
    ...d,
    label: labels?.[i] ?? '',
    labelTextStyle: {
      color: '#a1a1aa',
      fontSize: 8,
      fontFamily: 'PoppinsMedium',
      width: 28,
      textAlign: 'center' as const,
    },
  }))

  const lineData2 = (data2 || [{ value: 0 }]).map(d => ({ ...d }))

  const { width } = useWindowDimensions()
  // Adjusted to match the Home.tsx padding (24px horizontal)
  const HORIZONTAL_PADDING = 48 
  
  return (
    <View style={{ width: '100%' }}>
      {/* Header Section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 13, fontFamily: 'PoppinsSemiBold', color: '#18181b', marginLeft: 4 }}>
            {title}
          </Text>
          <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa', marginLeft: 4 }}>
            {description}
          </Text>
        </View>

        {/* Legend */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#155183' }} />
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#71717a' }}>Rain</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#e4e4e7' }} />
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 10, color: '#71717a' }}>Cloud</Text>
          </View>
        </View>
      </View>

      {/* Chart Container */}
      <View style={{ 
        backgroundColor: '#fafafa', 
        borderRadius: 18, 
        paddingTop: 20, 
        borderWidth: 0.5,
        borderColor: '#f4f4f5',
        overflow: 'hidden'
      }}>
        <LineChart
          key={chartKey}
          areaChart
          curved
          data={lineData}   // 👈 Rain (foreground, has labels)
          data2={lineData2} // 👈 Cloud (background)
          height={120}
          width={width - HORIZONTAL_PADDING - 40}
          initialSpacing={10}
          spacing={width / 8}
          hideDataPoints
          thickness={2.5}
          isAnimated

          color1="#155183"
          startFillColor1="#155183"
          endFillColor1="#155183"
          startOpacity={0.15}
          endOpacity={0.01}

          color2="#e4e4e7"
          startFillColor2="#f4f4f5"
          endFillColor2="#ffffff"
          startOpacity2={0.9}
          endOpacity2={0.2}

          rulesType="solid"
          rulesColor="#f4f4f5"
          yAxisColor="transparent"
          xAxisColor="transparent"
          hideRules={false}
          noOfSections={2}
          maxValue={100}

          yAxisTextStyle={{ color: '#a1a1aa', fontSize: 9, fontFamily: 'PoppinsMedium' }}
          yAxisLabelTexts={['0', '50', '100%']}
          yAxisLabelWidth={30}
          xAxisLabelsHeight={20}
          xAxisLabelTextStyle={{ color: '#a1a1aa', fontSize: 8, fontFamily: 'PoppinsMedium' }}
        />

        {/* Subtle Fade-in Gradients for edges */}
        <LinearGradient
          colors={['#fafafa', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: 20, zIndex: 10 }}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['transparent', '#fafafa']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 20, zIndex: 10 }}
          pointerEvents="none"
        />
      </View>
    </View>
  )
}

export default AreaChartComponent